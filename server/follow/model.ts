import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Types.ObjectId; // Alias who follows
  followedId: Types.ObjectId; // Alias that was followed
};

const FollowSchema = new Schema({
  followerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  followedId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
