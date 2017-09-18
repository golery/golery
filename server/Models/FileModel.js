import mongoose, {Schema} from 'mongoose';

const schema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        index: true
    },
    extension: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    updateDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export default mongoose.model('File', schema);
