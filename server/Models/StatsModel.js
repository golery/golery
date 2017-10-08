import mongoose, {Schema} from 'mongoose';

const schema = new Schema({
    nodeCount: {
        type: Schema.Number,
    },

    date: {
        type: Date,
        required: true,
        index: true,
        default: Date.now
    },
});

export default mongoose.model('Stats', schema);

