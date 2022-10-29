import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Reaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  aliasId: Types.ObjectId; // Alias who proliferated
  contentId: Types.ObjectId; // Content that was proliferated
  emojiCode: string; // Number code of the emoji
};

const ReactionSchema = new Schema({
  aliasId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  emojiCode: {
    type: String,
    required: true
  }
});

const ReactionModel = model<Reaction>('Reaction', ReactionSchema);
export default ReactionModel;
