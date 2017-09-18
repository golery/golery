/** Rotate refresh button when there is a sync with server */
export default class SyncTracker {
    constructor({startAnimation, stopAnimation}) {
        this.nextId = 0;
        this.activeIds = [];
        this.listeners = {startAnimation, stopAnimation};
    }

    startTask() {
        const id = this.nextId;
        ++this.nextId;

        if (this.activeIds.length === 0) {
            this.listeners.startAnimation();
        }
        this.activeIds.push(id);
        return id;
    }

    stopTask(id) {
        let index = this.activeIds.indexOf(id);
        if (index >= 0) {
            this.activeIds.splice(index, 1)
        }
        if (this.activeIds === 0) {
            this.listeners.stopAnimation();
        }
    }
}
