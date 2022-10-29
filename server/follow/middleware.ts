import type {Request, Response, NextFunction} from 'express';
import FollowCollection from './collection';

/**
 * Does req.session.aliasId *not* follow req.body.aliasId
 */
const doesAliasNotFollowOther = async (req: Request, res: Response, next: NextFunction) => {
  const followerId = (req.session.aliasId as string) ?? '';
  const followedId = (req.body.aliasId as string) ?? '';
  const follow = await FollowCollection.findOneByFollowerIdAndFollowedId(followerId, followedId);

  if (follow) {
    // TODO pick better code number
    res.status(410).json({
      error: {
        aliasAlreadyFollowed: 'Alias has already followed other'
      }
    });
    return;
  }

  next();
};

/**
 * Does req.session.aliasId follow req.body.followedId
 */
const doesAliasFollowOther = async (req: Request, res: Response, next: NextFunction) => {
  const followerId = (req.session.aliasId as string) ?? '';
  const followedId = (req.body.aliasId as string) ?? '';
  const follow = await FollowCollection.findOneByFollowerIdAndFollowedId(followerId, followedId);

  if (!follow) {
    res.status(404).json({
      error: {
        followedDoesNotExist: 'Alias has not followed other'
      }
    });
    return;
  }

  next();
};

export {
  doesAliasFollowOther,
  doesAliasNotFollowOther
};
