import React from "react";

import styles from "./ZoomImage.css";


export default class ZoomImage extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
        this.elmCanvas = null;
        this.elmImage = null;
        this.selectedRectIndex = null;
    }

    componentDidMount() {

    }

    render() {
        let {image} = this.props;
        console.log("Redraw ", image);
        return <div className={styles.component}>
            <img className={styles.image}
                 src={image.src}
                 onLoad={() => this._onLoadImage()}
                 ref={ref => this.elmImage = ref}/>
            <canvas className={styles.canvas} ref={ref => this.elmCanvas = ref}
                    onMouseMove={(e) => this._onMouseMove(e)} onClick={() => this._onClick()}/>
        </div>;
    }

    _redraw() {
        let {snaps} = this.props.image;

        let ctx = this.elmCanvas.getContext("2d");
        let w = this.elmCanvas.width;
        let h = this.elmCanvas.height;
        let selectedIndex = this.selectedRectIndex;
        snaps.forEach((snap, i) => {
            ctx.beginPath();
            if (i === selectedIndex) {
                ctx.strokeStyle = "white";
            } else {
                ctx.strokeStyle = "orange";
            }
            let r = snap.bound;
            ctx.rect(w * r.x, h * r.y, w * r.dx, h * r.dy);
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.stroke();
        });
    }

    _onLoadImage() {
        this.elmCanvas.width = this.elmImage.width;
        this.elmCanvas.height = this.elmImage.height;
        this._redraw();
    }

    _onClick() {
        if (this.selectedRectIndex == null) return;

        let {image, openImageListener} = this.props;
        openImageListener(image.snaps[this.selectedRectIndex].imageId);
    }

    _onMouseMove(e) {
        if (!this.elmCanvas) return;
        let {snaps} = this.props.image;

        let bound = this.elmCanvas.getBoundingClientRect();
        let w = this.elmCanvas.width;
        let h = this.elmCanvas.height;
        let x = e.clientX - bound.left;
        let y = e.clientY - bound.top;

        this.selectedRectIndex = null;
        snaps.forEach((snap, i) => {
            let r = snap.bound;
            if (w * r.x <= x && w * (r.x + r.dx) > x && h * r.y <= y && h * (r.y + r.dy) > y) {
                this.selectedRectIndex = i;
            }
        });
        this._redraw();
    }
}

ZoomImage.propTypes = {
    //options: PropTypes.array
};
