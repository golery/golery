import React from 'react';
import Axios from "axios";

import styles from './UploadImageDialog.css';

import ClipboardUtils from './Utils/ClipboardUtils';

const MAX_IMAGE_WIDTH = 1000;
const MAX_IMAGE_HEIGHT = 800;

// Ref. https://www.lucidchart.com/techblog/2014/12/02/definitive-guide-copying-pasting-javascript/
export default class UploadImageDialog extends React.Component {
    constructor(props) {
        super(props);

        this._pasteListener = this._pasteListener.bind(this);
        this._onClickUploadGolery = this._onClickUploadGolery.bind(this);
        this._onClickUploadImgur = this._onClickUploadImgur.bind(this);

        this.image = new Image();
        this.state = {hasImage: false, spinner: false, resizePercent: 100};
    }

    componentDidMount() {
        // Listen to paste event for the whole window. I cannot find a way to get focus for only dialog
        document.addEventListener('paste', this._pasteListener);

        // When user past image directly to editor, we can draw it directly on canvas
        let {blobUrl} = this.props;
        if (blobUrl) {
            this._copyToCanvas(blobUrl);
        }
    }

    componentWillUnmount() {
        // Remove global listener
        document.removeEventListener('paste', this._pasteListener);
    }

    render() {
        let spinnerClassName = `fa fa-spinner fa-pulse ${styles.spinner}`;
        let elmInner;
        if (this.state.hasImage) {
            let canvassHolderStyle = {width: this.state.imageSize.width, height: this.state.imageSize.height};
            elmInner = <div>
                <div>
                    <div className={styles.button} onClick={this._onClickUploadImgur}><i
                        className="fa fa-cloud-upload"/>
                        &nbsp; Upload to Imugr.com**
                    </div>
                    <div className={styles.button} onClick={this._onClickUploadGolery}><i
                        className="fa fa-cloud-upload"/>
                        &nbsp; Upload to Golery.com
                    </div>
                    <div className={styles.igmurWarning}>**Imgur.com is free public image hosting. Even if your note content
                        is set to private access, image are still accessible from public.
                    </div>
                    <div>
                        <input className={styles.resizeSlider} type="range" value={this.state.resizePercent}
                               onChange={(e) => this._onResize(e)}/>
                    </div>
                </div>
                <div style={canvassHolderStyle}>
                    <canvas ref={(ref) => this.canvas = ref}/>
                </div>
            </div>;
        } else {
            elmInner = <div>
                <div className={styles.textControlV}>Ctrl + V</div>
                <div className={styles.textPasteFromClipboard}>
                    <span className={styles.textPaste}>Paste</span> from your clipboard.
                </div>
            </div>
        }
        let elmSpinner = this.state.spinner &&
            <div className={styles.spinnerHolder}><i className={spinnerClassName}/>
            </div>;
        return <div className={styles.component} onPaste={this._onPaste}>
            {elmInner}
            {elmSpinner}
        </div>;
    }

    _onResize(e) {
        let value = e.target.value;
        this.setState({resizePercent: parseFloat(value)});
        console.log(value);
        this._redrawCanvas();
    }

    _onClickUploadGolery() {
        let dataUrl = this.canvas.toDataURL('image/jpeg');
        let blob = dataURLtoBlob(dataUrl);
        this.setState({spinner: true});
        this._uploadGresw(blob).then((url) => {
            this.props.resolve(url);
        }).catch((e) => {
            this.props.reject(e);
        });

        // Reimplement toBlob since canvas.toBlob() is not supported on Safari
        function dataURLtoBlob(dataurl) {
            let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type: mime});
        }
    }

    _onClickUploadImgur() {
        let dataUrl = this.canvas.toDataURL('image/jpeg');
        this.setState({spinner: true});
        this._uploadImgur(dataUrl).then((url) => {
            this.props.resolve(url);
        }).catch((e) => {
            this.props.reject(e);
        });
    }


    _pasteListener(e) {
        e.stopPropagation();
        e.preventDefault();

        let blobUrl = ClipboardUtils.getFirstImageBlobUrl(e);
        if (!blobUrl) {
            return;
        }
        this._copyToCanvas(blobUrl);
    }

    // http://stackoverflow.com/questions/18377891/how-can-i-let-user-paste-image-data-from-the-clipboard-into-a-canvas-element-in
    _copyToCanvas(objectUrl) {
        let image = this.image;
        image.onload = () => {
            let size = this._adjustImageSize(image.width, image.height);
            this.setState({hasImage: true, imageSize: size});
            this.canvas.width = size.width;
            this.canvas.height = size.height;
            this._redrawCanvas();
        };
        image.src = objectUrl;
    };

    _redrawCanvas() {
        if (!this.state.hasImage) return;
        let image = this.image;
        let ratio = this.state.resizePercent / 100.0;
        let {width, height} = this.state.imageSize;
        let canvas = this.canvas;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    }

    _adjustImageSize(width, height) {
        let ratio = width / height;
        let w = width;
        let h = height;
        if (w >= MAX_IMAGE_WIDTH) {
            w = 1000;
            h = w / ratio;
        }
        if (h >= MAX_IMAGE_HEIGHT) {
            h = 800;
            w = h * ratio;
        }

        return {width: w, height: h};
    }

    _uploadImgur(imageSrc) {
        let imageBase64 = imageSrc.substring('data:image/png;base64,'.length);
        let url = "https://api.imgur.com/3/upload";

        let config = {
            headers: {
                'Authorization': "Client-ID 4b49385f955770a",
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
        };

        return Axios.post(url, imageBase64, config).then(function (response) {
            let data = response.data;
            let imgurUrl = data.data.link;
            console.log('Upladed to imgur. Url:', imgurUrl, 'Json:', data);
            return imgurUrl;
        });
    }

    /**
     * @return Promise(url) */
    _uploadGresw(blob) {
        let url = "api/secure/file";

        let config = {
            headers: {
                'Content-Type': 'application/octet-stream'
            },
        };
        return Axios.post(url, blob, config).then(function (response) {
            let data = response.data;
            console.log('Uploaded to gresw', data);
            return data.url;
        });
    }
}

