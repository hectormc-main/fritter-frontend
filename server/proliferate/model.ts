import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Proliferate = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  aliasId: Types.ObjectId; // Alias who proliferated
  contentId: Types.ObjectId; // Content that was proliferated
};

const ProliferateSchema = new Schema({
  aliasId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const ProliferateModel = model<Proliferate>('Proliferate', ProliferateSchema);
export default ProliferateModel;
