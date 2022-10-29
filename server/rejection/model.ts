import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Rejection = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  aliasId: Types.ObjectId; // Alias who rejected
  contentId: Types.ObjectId; // Content that was rejected
};

const RejectionSchema = new Schema({
  aliasId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const RejectionModel = model<Rejection>('Rejection', RejectionSchema);
export default RejectionModel;
