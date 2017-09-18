import File from '../Models/FileModel';
import Rest from './Rest';
import fs from 'fs';
import assert from 'assert';
import LruCache from 'lru-cache';

/** Cache Files db in memory using LRU strategy to avoid query database */
let fileMetaCache = LruCache({max: 5000, maxAge: 1000 * 60 * 60 * 24});

const UPLOAD_FOLDER = '/data/upload';
export const MAX_UPLOAD_FILE_SIZE = '1mb';

/** Api allows to store and get files (ex: image file).
 * The file are stored on hard disk. The size and extension are store in mongodb collection File
 * Note:
 * - This requires express.js to be configured with app.use(bodyParser.raw({limit: '3mb'}));
 * - This requires folder /data/upload on hard disk */
class ApiFile {
    setupRoute(route) {
        route.get('/file/:id', this._get.bind(this));
        route.post('/file', this._upload.bind(this));
    }

    _upload(req, res) {
        let buffer = req.body;
        let user = req.user;
        assert(user != null);

        let fileDb = new File();
        fileDb.userId = user.id;
        // buffer.length requires middleware app.use(bodyParser.raw({limit: '1mb'}));
        fileDb.size = buffer.length;
        fileDb.extension = 'jpg';

        console.log('****', fileDb);

        let promise = fileDb.save().then((file) => {
            let id = file._id;
            return new Promise((resolve, reject) => {
                let path = this._getPathToFileOnDisk(user.id, file);
                fs.writeFile(path, buffer, function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    let url = getBaseUrl(req) + '/api/secure/file/' + id;
                    console.log('UPLOAD. User:', user.id, '. File:', path, '.Size:' + fileDb.size);
                    resolve({url: url, size: fileDb.size});
                })
            });

            function getBaseUrl(req) {
                return req.protocol + "://" + req.headers.host;
            }
        });

        Rest.json(req, res, promise);
    }

    /** Currently, there is no authentication */
    _get(req, res) {
        let id = req.params.id;
        let promise = findFile(id).then((file) => {
            if (!file) {
                console.log('File ', id, ' is not found in db');
                throw 'File ' + id + ' is not found in db';
            }

            return new Promise((resolve, reject) => {
                let path = this._getPathToFileOnDisk(file.userId, file);
                fs.readFile(path, function (err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log('Done. Read from file:', path);
                    resolve(data);
                });
            });
        });
        return Rest.binary(req, res, promise, {
            'Content-Type': "image/jpeg",
            'Cache-Control': 'public, max-age=604800'
        });

        function findFile(id) {
            let file = fileMetaCache.get(id);
            if (file) {
                // console.log("Found in cache metadata for file", id);
                return Promise.resolve(file);
            }
            console.log("Query metadata for file (cache miss)", id);
            // id string must follow MongoID syntax. If not, there is error message
            // Cast to ObjectId failed for value .. at path _id
            return File.findById(id).then(function (file) {
                fileMetaCache.set(id, file);
                return file;
            });
        }
    }

    _getPathToFileOnDisk(userId, file) {
        let base = UPLOAD_FOLDER + '/';
        let fileName = userId + '_' + file._id + '.' + file.extension;
        return base + fileName;
    }

}

export default new ApiFile();
