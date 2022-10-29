import type {NextFunction, Request, Response} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Check if req.params.contentId corresponds to valid emoji code
 */
const doesContentExist = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.contentId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.contentId) : '';

  // Add more checks as more types of content added
  if (freet) { // Check if freet exists
    next();
  } else {
    res.status(404).json({
      error: {
        contentDoesNotExist: `Content with contentId ${req.params.contentId} does not exist`
      }
    });
  }
};

export {
  doesContentExist
};
