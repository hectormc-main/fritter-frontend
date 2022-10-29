import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Rejection} from './model';

type RejectionResponse = {
  _id: string;
  aliasId: string;
  contentId: string;
};

const constructRejectionResponse = (rejection: HydratedDocument<Rejection>): RejectionResponse => {
  const rejectionCopy: Rejection = {
    ...rejection.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...rejectionCopy,
    _id: rejectionCopy._id.toString(),
    aliasId: rejectionCopy.aliasId.toString(),
    contentId: rejectionCopy.contentId.toString()
  };
};

export {
  constructRejectionResponse
};
