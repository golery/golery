#BUILD
1. In 
   - build/dev : contains file that are build for dev
   - build/release: contains file that are built for release.
     The docker/in-container/provision.sh copy all of those files to the docker images
2. Compile process
   - webpack with configure webpack.config.client.all.js, build
     + client/app.js to /build/?/client, output webpack.manifest.js to /work/www/server/Pages/ 
     + server/Pages/Components.js to /work/www/server/Pages/Components.generated.js
   - babel translate and copy all server code in ES6 to /build/?/server
2. RUN:
   - yarn run build - Build client (client-renderning + server render) + babel server code to build/release
   - yarn run server.watch - Babel server code to build/dev/server
   - yarn run server.nodemon - Run server code in build/dev/server
   - yarn run client.watch - Build client (client-renderning + server render) to build/dev
  
#AMAZON investigation and manual restart
1. ssh to EC2 instance
2. free -m : show memories
3. docker exec -it containerId bash
   pm2 kill
   cd /softwares/GS/www
   node server/server.js
   
#MONGO DB
1. mongolab.
2. Connection for admin
   cat /work/www.credentials/env.sh
   - ds045054.mlab.com:45054
   - user: backup
   - database: prod
   - password: ....
     auth mechanism: SCRAM-SHA-1
3. Preset users
   - 000000000000000000000000:  admin (password same as hly): sample data
   - 000000000000000000000001:  hly
   - 000000000000000000000002:  golery: publish article to attract traffics)
   - 000000000000000000000003:  test: user
   Create special userID:
   doc = db.users.findOne({_id: ObjectId("000000000000000000000001")})
   doc._id = ObjectId("000000000000000000000000");
   db.users.insert(doc);