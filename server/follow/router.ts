import type {Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as followValidator from './middleware';
import * as aliasValidator from '../alias/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a follow entry in the database
 *
 * @name POST /api/follows/
 *
 * @param req.session.aliasId - The one initiating follow
 * @param req.body.aliasId - The one who is to be followed
 * @return {FollowResponse} - The created follow
 *
 * TODO throws
 *
 */
router.post(
  '/',
  [
    aliasValidator.isAliasLoggedIn,
    aliasValidator.doesAccountWithAliasIdExist,
    followValidator.doesAliasNotFollowOther
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.aliasId as string) ?? '';
    const followedId = (req.body.aliasId as string) ?? '';
    const follow = await FollowCollection.addOne(followerId, followedId);

    res.status(201).json({
      message: 'You have successfully followed',
      alias: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Get list of Follow objects such that aliasId is the one following
 *
 * @name GET /api/follows/:aliasId
 *
 * @param req.params.aliasId - The aliasId of alias who follows
 *
 * TODO throws
 *
 */
router.get(
  '/:aliasId?',
  [
    aliasValidator.doesAccountWithParamAliasIdExist
  ],
  async (req: Request, res: Response) => {
    const followerId = req.params.aliasId;
    const follows = await FollowCollection.findAllByFollowerId(followerId);

    res.status(200).json({
      num_following: follows.length,
      follows: follows.map(follow => util.constructFollowResponse(follow))
    });
  }
);

/**
 * Get all who follow aliasId
 *
 * @name GET /api/follows/followers:aliasId
 *
 * @param req.params.aliasId - The aliasId of alias who is followed
 *
 * TODO throws
 *
 */
router.get(
  '/followers/:aliasId',
  [
    aliasValidator.doesAccountWithParamAliasIdExist
  ],
  async (req: Request, res: Response) => {
    const followedId = req.params.aliasId;
    const followers = await FollowCollection.findAllByFollowedId(followedId);

    res.status(201).json({
      num_followers: followers.length,
      followers: followers.map(follow => util.constructFollowResponse(follow))
    });
  }
);

/**
 * Delete a follow object
 *
 * @name DELETE /api/follows/
 *
 * @param req.session.aliasId - The one who is about to unfollow
 * @param req.body.aliasId - The one who is about to be unfollowed
 *
 */
router.delete(
  '/',
  [
    aliasValidator.isAliasLoggedIn,
    aliasValidator.doesAccountWithAliasIdExist,
    followValidator.doesAliasFollowOther
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.aliasId as string) ?? '';
    const followedId = (req.body.aliasId as string) ?? '';
    await FollowCollection.deleteOneByFollowerIdAndFollowedId(followerId, followedId);

    res.status(200).json({
      message: 'Successfully unfollowed alias'
    });
  }
);

export {router as followRouter};
