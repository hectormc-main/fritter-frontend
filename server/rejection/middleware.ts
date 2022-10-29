import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import RejectionCollection from './collection';

/**
 * Checks if the signed in alias has not already rejected the desired content
 */
const hasAliasNotRejectedContent = async (req: Request, res: Response, next: NextFunction) => {
  const aliasId = (req.session.aliasId as string) ?? '';
  const contentId = (req.params.contentId) ?? '';
  const rejection = await RejectionCollection.findOneByAliasIdAndContentId(aliasId, contentId);

  if (rejection) {
    // TODO pick better code number
    res.status(410).json({
      error: {
        aliasAlreadyRejected: 'Alias has already rejected content'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the signed in alias has already rejected the desired content
 */
const hasAliasRejectedContent = async (req: Request, res: Response, next: NextFunction) => {
  const aliasId = (req.session.aliasId as string) ?? '';
  const contentId = (req.params.contentId) ?? '';
  const rejection = await RejectionCollection.findOneByAliasIdAndContentId(aliasId, contentId);

  if (!rejection) {
    res.status(404).json({
      error: {
        rejectionDoesNotExist: 'Alias has not rejected content'
      }
    });
    return;
  }

  next();
};

export {
  hasAliasRejectedContent,
  hasAliasNotRejectedContent
};
