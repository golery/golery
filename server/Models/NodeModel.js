// Ref. https://github.com/KunalKapadia/express-mongoose-es6-rest-api/blob/develop/server/models/user.model.js
import mongoose, {Schema} from 'mongoose';

/** NODE */
const schema = new Schema({
    user: {
        type: Number,
        required: true,
        index: true
    },
    name: {
        type: String,
    },

    // all nodes have html description
    // node type specific data are stored in "value" field
    html: {
        type: String,
    },

    value: {
        type: String,
    },

    deleted: Boolean,

    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Node'
    }],

    // date in timeline (by default, it's the creation date)
    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    updateDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    // type of node data (default: html)
    type: {
        type: String,
        required: true,
        default: 'html'
    }
});

export default mongoose.model('Node', schema);

