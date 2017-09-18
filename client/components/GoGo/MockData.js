import {Event, Poll, PollOption} from "./Domain";


const options = [new PollOption(0, "aa")];
const poll = new Poll(0, options);
const event = new Event("Bang day", "none", "Go for it", [poll]);
export default {
    event
}