import type {Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as reactionValidator from './middleware';
import * as aliasValidator from '../alias/middleware';
import * as contentValidator from '../content/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a reaction entry in the database
 *
 * @name POST /api/reactions/:contentId
 *
 * @param {string} contendId - contentId of content
 * @return {ReactionResponse} - The created reaction
 *
 * TODO throws
 *
 */
router.post(
  '/:contentId?',
  [
    aliasValidator.isAliasLoggedIn,
    contentValidator.doesContentExist,
    reactionValidator.isValidEmojiCode,
    reactionValidator.hasAliasNotReactedToContent
    // TODO additional validators
  ],
  async (req: Request, res: Response) => {
    const aliasId = (req.session.aliasId as string) ?? '';
    const reaction = await ReactionCollection.addOne(aliasId, req.params.contentId, req.body.emojiCode);

    res.status(201).json({
      message: 'You have successfully reacted',
      reaction: util.constructReactionResponse(reaction)
    });
  }
);

/**
 * Change a reaction entry
 *
 * @name PUT /api/reactions/:contentId
 */
router.put(
  '/:contentId?',
  [
    aliasValidator.isAliasLoggedIn,
    contentValidator.doesContentExist,
    reactionValidator.isValidEmojiCode,
    reactionValidator.hasAliasReactedToContent
    // TODO handlers
  ],
  async (req: Request, res: Response) => {
    const aliasId = (req.session.aliasId as string) ?? '';
    const reaction = await ReactionCollection.updateOne(aliasId, req.params.contentId, req.body.emojiCode);

    res.status(200).json({
      message: 'Content successfully ',
      reaction: util.constructReactionResponse(reaction)
    });
  }
);

/**
 * Get all reactions on content
 *
 * @name GET /api/reactions/:contentId
 *
 * @param {string} contentId - contentId of content
 */
router.get(
  '/:contentId?',
  [
    // TODO handlers
    contentValidator.doesContentExist
  ],
  async (req: Request, res: Response) => {
    const reactions = await ReactionCollection.findAllByContentId(req.params.contentId);

    res.status(201).json({
      reactions: reactions.map(obj => util.constructReactionResponse(obj))
    });
  }
);

/**
 * Delete a reaction entry
 *
 * @name DELETE /api/reactions/:contentId
 */
router.delete(
  '/:contentId?',
  [
    aliasValidator.isAliasLoggedIn,
    contentValidator.doesContentExist,
    reactionValidator.isValidEmojiCode,
    reactionValidator.hasAliasReactedToContent
    // TODO handlers
  ],
  async (req: Request, res: Response) => {
    const aliasId = (req.session.aliasId as string) ?? '';
    await ReactionCollection.deleteOneByAliasIdAndContentId(aliasId, req.params.contentId);

    res.status(200).json({
      message: 'Content successfully unreacted'
    });
  }
);

export {router as reactionRouter};
