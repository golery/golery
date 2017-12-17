/** This Plugin capture mouse events (up, down, move) to drag and drop events which are used by ReorderNodePlugin */
export default class DragDropPlugin {
    constructor(onStartDrag, onDrag, onEndDrag, onCancelDrag) {
        this._startDrag = onStartDrag;
        this._onDrag = onDrag;
        this._endDrag = onEndDrag;
        this._cancelDrag = onCancelDrag;

        this.MIN_DRAG_LIMIT = 5;
        this.isDragging = false;
        this._startX = null;
        this._startY = null;
    }

    setup(isMobile) {
        // setup event handlers
        if (isMobile) {
            this.MIN_DRAG_LIMIT = 50;  // less sensitive for mobile
        }
    }

    onMouseDown(e) {
        // only drag and drop with left mouse button
        if (e.button === 0) {
            this._startX = e.pageX;
            this._startY = e.pageY;
        }
    }

    onMouseMove(e) {
        if (this._startX === null || this._startY === null) {
            return;
        }

        let x = e.pageX;
        let y = e.pageY;

        // once start dragging, continue to drag even if distance to origin is small
        if (this.isDragging) {
            if (e.button === 0) {
                this._onDrag(e);
            } else {
                this._doCancelDrag();
            }
        } else if (x !== this._startX || y !== this._startY) {
            let dx = x - this._startX;
            let dy = y - this._startY;

            //console.log('Mouse move2', dx, dy);

            if (dx > this.MIN_DRAG_LIMIT || dy > this.MIN_DRAG_LIMIT) {
                this.isDragging = true;
                this._startDrag(e);
                this._onDrag(e);
            }
        }
    }


    onMouseUp(e) {
        this._startX = this._startY = null;
        if (!this.isDragging) {
            return;
        }

        this.isDragging = false;
        if (this._endDrag) {
            this._endDrag(e);
        }
    }

    onMouseLeave() {
        if (this.isDragging) {
            this._doCancelDrag();
        }
    }

    _doCancelDrag() {
        this._startX = this._startY = null;
        this.isDragging = false;

        console.log('Cancel drag');
        this._cancelDrag();
    }
}
