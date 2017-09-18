import React from "react";

import styles from "./ZoomAppView.css";
import ZoomImage from "./ZoomImage";

class Rect {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
}

class Snap {
    constructor(bound, imageId) {
        this.bound = bound;
        this.imageId = imageId;
    }
}

class Image {
    constructor(_id, src, snaps) {
        this._id = _id;
        this.src = src;
        this.snaps = snaps;
    }
}

export default class ZoomAppView extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';

        const image0 = new Image(0, "/images/Zoom/01.00.jpg",
            [new Snap(new Rect(0.26, 0.4, 0.12, 0.4), 1),
                new Snap(new Rect(0.42, 0.37, 0.19, 0.43), 2),
                new Snap(new Rect(0.09, 0.42, 0.07, 0.15), 5),
                new Snap(new Rect(0.42, 0.15, 0.19, 0.2), 4)]);
        const image1 = new Image(1, "/images/Zoom/01.02.jpg",
            [new Snap(new Rect(300, 600, 50, 50), 2)]);
        const image2 = new Image(2, "/images/Zoom/01.03.jpg",
            [new Snap(new Rect(0.33,0.33,0.20,0.23), 3)]);
        const image3 = new Image(3, "/images/Zoom/01.04.jpg",
            [new Snap(new Rect(300, 600, 50, 50), 3)]);
        const image4 = new Image(4, "/images/Zoom/01.05.jpg",
            [new Snap(new Rect(300, 600, 50, 50), 3)]);
        const image5 = new Image(5, "/images/Zoom/01.01.jpg",
            [new Snap(new Rect(300, 600, 50, 50), 3)]);

        this.state = {images: [image0, image1, image2, image3, image4, image5], currentImage: image0};
        this.history = [image0];
    }

    render() {
        let {images, currentImage} = this.state;
        return <div className={styles.component} onKeyDown={(e) => this._onKeyDown(e)} tabIndex="0"
                    ref={ref => (ref && ref.focus())}>
            <div className={styles.center}>
                <ZoomImage image={currentImage} openImageListener={imageId => this._onOpenImage(images, imageId, true)}/>
            </div>
        </div>;
    }

    _onOpenImage(images, imageId, pushHistory) {
        console.log("Open image", imageId);

        let filter = images.filter(i => i._id === imageId);
        if (!filter || filter.length === 0) return;
        let nextImage = filter[0];

        if (pushHistory) {
            this.history.push(nextImage);
        }
        this.setState({currentImage: nextImage});
    }

    _onKeyDown(e) {
        const key = e.key;
        if (key === 'ArrowLeft') {
            if (this.history.length > 1) {
                this.history.pop();
                let prevImage = this.history[this.history.length - 1];
                this._onOpenImage(this.state.images, prevImage._id, false);
            }
        }
    }
}

ZoomAppView.propTypes = {
    //options: PropTypes.array
};
