import mongoose, {Schema} from 'mongoose';

/** APP params */
var PencilSchema = new Schema({
    _id: { // user id
        type: Schema.ObjectId,
        required: true
    },
    rootNode: {
        type: Schema.Types.ObjectId,
        ref: 'Node'
    }
});
export default mongoose.model('Pencil', PencilSchema);
