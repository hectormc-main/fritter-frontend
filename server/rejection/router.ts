import type {Request, Response} from 'express';
import express from 'express';
import RejectionCollection from './collection';
import * as contentValidator from '../content/middleware';
import * as rejectionValidator from './middleware';
import * as aliasValidator from '../alias/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a rejection entry in the database
 *
 * @name POST /api/rejections/:id
 *
 * @param {string} contendId - contentId of content
 * @return {RejectionResponse} - The created rejection
 *
 * TODO throws
 *
 */
router.post(
  '/:contentId?',
  [
    aliasValidator.isAliasLoggedIn,
    contentValidator.doesContentExist,
    rejectionValidator.hasAliasNotRejectedContent
  ],
  async (req: Request, res: Response) => {
    const aliasId = (req.session.aliasId as string) ?? '';
    const rejection = await RejectionCollection.addOne(aliasId, req.params.contentId);

    res.status(201).json({
      message: 'You have successfully rejected',
      alias: util.constructRejectionResponse(rejection)
    });
  }
);

/**
 * Get all rejections alias has done
 *
 * @name GET /api/rejections
 *
 * TODO throws
 *
 */
router.get(
  '/',
  [
    aliasValidator.isAliasLoggedIn
  ],
  async (req: Request, res: Response) => {
    const rejections = await RejectionCollection.findAllByAliasId(req.session.aliasId);

    res.status(201).json({
      rejections
    });
  }
);

/**
 * Delete a rejection object
 *
 * @name DELETE /api/rejections/:id
 *
 */
router.delete(
  '/:contentId?',
  [
    aliasValidator.isAliasLoggedIn,
    contentValidator.doesContentExist,
    rejectionValidator.hasAliasRejectedContent
  ],
  async (req: Request, res: Response) => {
    const aliasId = (req.session.aliasId as string) ?? '';
    await RejectionCollection.deleteOneByAliasIdAndContentId(aliasId, req.params.contentId);

    res.status(200).json({
      message: 'Content successfully unrejected'
    });
  }
);

export {router as rejectionRouter};
