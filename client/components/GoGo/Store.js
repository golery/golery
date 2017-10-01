import {Dispatcher} from "flux";
import EventRest from "./EventRest";

class Store {
    constructor() {
        this.eventDispatcher = new Dispatcher();
        this.eventDispatcher.register((event) => {
            this.event = event;
        });
    }

    loadEvent(eventId) {
        EventRest.findEvent(eventId).then((event) => {
            this.eventDispatcher.dispatch(event);
        });
    }

    saveEvent() {
        EventRest.updateEvent(this.event).then((event) => {
            this.eventDispatcher.dispatch(this.event);
        });
    }

    objectId() {
        //return mongoose.Types.ObjectId();
        return "fixme"
    }
}

export default new Store();