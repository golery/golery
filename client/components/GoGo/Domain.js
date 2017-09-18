export class Participant {
    constructor(_id, name) {
        this._id = _id;
        this.name = name;
        this.options = [];
    }
}

export class PollOption {
    constructor(_id, name) {
        this._id = _id;
        this.name = name;
    }
}

export class Poll {
    constructor(_id, pollOptions) {
        this._id = _id;
        this.pollOptions = pollOptions;
    }
}

/** Encapsute : name, list of poll, all kinds of sections
 * @param section - list of poll  */
export class Event {
    constructor(name, name2, description, sections) {
        this.name = name;
        this.name2 = name2;
        this.description = description;
        this.sections = sections;
    }
}
