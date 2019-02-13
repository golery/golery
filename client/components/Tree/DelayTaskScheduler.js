/**
 * Schedule a task to be executed later. If the task was scheduled, the previous one is cancelled.
 * This scheduler is used for delay the save and update the node title. We dont' want to save for every edit */
export default class DelayTaskScheduler {
    constructor() {
        this.timeOut = null;
    }

    schedule(delayMs, task) {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(() => {
            task();
        }, delayMs);
    }
}
