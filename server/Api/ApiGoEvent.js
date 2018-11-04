import Rest from "./Rest";
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

mongoose.Promise = Promise;
const TYPE_TEXT = 'TEXT';
const TYPE_POLL = 'POLL';

const UserSchema = mongoose.Schema({
    name: String,
    email: String
});
const PollParticipantSchema = mongoose.Schema({
    name: String,
    email: String,
    // Ref.PollOptionSchema._id
    pollOptions: [mongoose.Schema.ObjectId]
});
const PollOptionSchema = mongoose.Schema({
    name: String
});
const SectionSchema = mongoose.Schema({
    type: String,
    name: String,
    pollOptions: [PollOptionSchema],
    pollParticipants: [PollParticipantSchema]
});
const EventSchema = Schema({
    name: String,
    description: String,
    users: [PollParticipantSchema],
    sections: [{type: Schema.Types.ObjectId, ref: 'GoGoSection'}]
});

const PollOption = mongoose.model('PollOption', PollOptionSchema);
const Section = mongoose.model('GoGoSection', SectionSchema);
const Event = mongoose.model('GoGoEvents', EventSchema);

class ApiGoGo {
    setupRoute(route) {
        route.post('/gogo/event', this._createEvent.bind(this));
        route.get('/gogo/event', this._getEvents.bind(this));
        route.put('/gogo/event', this._updateEvent.bind(this));

        route.get('/gogo/event/:id', this._get.bind(this));
        route.post('/gogo/event/:eventId/user', this._insertOrSaveUser.bind(this));
        route.delete('/gogo/event/:eventId/user/:userId', this._deleteUser.bind(this));

        route.put('/gogo/event/:eventId/content', this._updateContent.bind(this));

        route.put('/gogo/section', this._updateSection.bind(this));

    }

    _createEvent(req, res) {
        const param = req.body;
        const option1 = new PollOption({name: "Lake"});
        const option2 = new PollOption({name: "Mountains"});
        const section = new Section({type: TYPE_POLL, name: "Place", polls: [option1, option2]});
        let promise = section.save().then(e => {
            const event = new Event({name: param.name, email: param.email, users: [], sections: [section._id]});
            return event.save();
        });
        Rest.json(req, res, promise);
    }

    _getEvents(req, res) {
        Rest.json(req, res, Event.find().populate('sections'));
    }

    _updateEvent(req, res) {
        const event = req.body;
        delete event.__v;

        const sections = event.sections;
        let promise = Promise.resolve();
        sections.forEach((section) => {
            promise = promise.then(() => {
                return Section.findOneAndUpdate({_id: section._id}, section, {upsert: true, new: true});
            });
        });
        promise = promise.then(() => {
            return Event.findOneAndUpdate({_id: event._id}, event, {upsert: true, new: true});
        });
        Rest.json(req, res, promise);
    }

    _updateSection(req, res) {
        const section = req.body;
        Rest.json(req, res, Section.findOneAndUpdate({_id: section._id}, section, {upsert: false, new: true}));
    }

    _updateContent(req, res) {
        let eventId = req.params.eventId;
        let sections = [{
            type: TYPE_POLL, name: 'Places', polls: [
                {name: 'Sunday', options: [{name: 'a'}, {name: 'B'}]}
            ]
        }, {name: 'Dates'}];
        console.log(req.body);
        Event.findOneAndUpdate({
            _id: eventId,
            sections
        }, {$set: {sections: sections}}, {new: true}).then(o => res.json(o));
    }

    _insertOrSaveUser(req, res) {
        let eventId = req.params.eventId;
        let user = req.body;
        if (user._id) {
            console.log("Update User", user);
            Event.findOneAndUpdate({_id: eventId, 'users._id': user._id}, {
                $set: {
                    'users.$': user
                }
            }, {new: true, fields: 'users'}).then(o => res.json(o.users.id(user._id)));
        } else {
            console.log("Create User", user);
            delete user._id;
            Event.findOneAndUpdate({_id: eventId}, {
                $push: {
                    users: user
                }
            }, {new: true, select: 'users'}).then(o => res.json(o.users[o.users.length - 1]));
        }
    }

    _deleteUser(req, res) {
        let eventId = req.params.eventId;
        let userId = req.params.userId;
        Event.findOneAndUpdate({_id: eventId}, {
            $pull: {
                users: {_id: userId}
            }
        }).then(o => res.json(o));
    }

    _get(req, res) {
        Event.findOne({_id: req.params.id}).populate('sections').then(o => res.json(o));
    }
}

export default new ApiGoGo();
