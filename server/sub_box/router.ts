import type {Request, Response} from 'express';
import express from 'express';
import ContentCollection from '../content/collection';
import FollowCollection from '../follow/collection';
import * as aliasValidator from '../alias/middleware';

const router = express.Router();

/**
 * Get all content from aliasId
 *
 * @name GET /api/sub_box
 *
 * @param req.session.aliasId - The author of the content you are looking for
 * TODO throws
 *
 */
router.get(
  '/',
  [
    aliasValidator.isAliasLoggedIn
  ],
  async (req: Request, res: Response) => {
    const follow_objects = await FollowCollection.findAllByFollowerId(req.session.aliasId);
    const followed_ids = follow_objects.map(follow => follow.followedId);
    const p_content = followed_ids.map(async id => ContentCollection.findAllContentByAuthor(id));
    const content = await Promise.all(p_content);

    res.status(201).json({
      content
    });
  }
);

export {router as subBoxRouter};
