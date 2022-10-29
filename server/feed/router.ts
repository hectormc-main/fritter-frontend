import type {Request, Response} from 'express';
import express from 'express';
import ContentCollection from '../content/collection';
import ProliferateCollection from '../proliferate/collection';
import * as aliasValidator from '../alias/middleware';

const router = express.Router();

/**
 * Get all content from aliasId
 *
 * @name GET /api/feed
 *
 * @param req.session.aliasId - The alias to personalize feed to
 * TODO throws
 *
 */
router.get(
  '/',
  [
    aliasValidator.isAliasLoggedIn
  ],
  async (req: Request, res: Response) => {
    const all_content = await ContentCollection.findAll(); // This is a copy so we can write over it
    const prolifs = await Promise.all(all_content.map(async c => ProliferateCollection.findAllByContentId(c._id)));
    const prolif_count = prolifs.map(p => p.length);
    const combine = all_content.map((f, i) => [f, prolif_count[i]]);
    combine.sort((a, b) => ((a[1] < b[1]) ? 1 : ((a[1] === b[1]) ? 0 : -1)));

    res.status(201).json({
      combine
    });
  }
);

export {router as feedRouter};
