import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follow} from './model';

type FollowResponse = {
  _id: string;
  followerId: string;
  followedId: string;
};

const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: Follow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...followCopy,
    _id: followCopy._id.toString(),
    followerId: followCopy.followerId.toString(),
    followedId: followCopy.followedId.toString()
  };
};

export {
  constructFollowResponse
};
