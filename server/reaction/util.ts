import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reaction} from './model';

type ReactionResponse = {
  _id: string;
  aliasId: string;
  contentId: string;
  emojiCode: string;
};

/**
 * Transform a raw Reaction object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reaction>} reaction - A reaction
 * @returns {ReactionResponse} - The reaction object formatted for the frontend
 */
const constructReactionResponse = (reaction: HydratedDocument<Reaction>): ReactionResponse => {
  const reactionCopy: Reaction = {
    ...reaction.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...reactionCopy,
    _id: reactionCopy._id.toString(),
    aliasId: reactionCopy.aliasId.toString(),
    contentId: reactionCopy.contentId.toString(),
    emojiCode: reactionCopy.emojiCode.toString()
  };
};

export {
  constructReactionResponse
};
