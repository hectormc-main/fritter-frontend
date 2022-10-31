import type {Request, Response, NextFunction} from 'express';
import AliasCollection from '../alias/collection';

/**
 * Checks if the current session alias (if any) still exists in the database, for instance,
 * an alias may try to post a freet in some browser while the account has been deleted in another or
 * when a alias tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionAliasExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.aliasId) {
    const alias = await AliasCollection.findOneByAliasId(req.session.aliasId);

    if (!alias) {
      req.session.aliasId = undefined;
      res.status(500).json({
        error: 'Alias session was not recognized.'
      });
      return;
    }
  }

  next();
};

// Aliasname Validity

/**
 * Checks if req.body.aliasname is a valid aliasname
 */
const isValidAliasname = (req: Request, res: Response, next: NextFunction) => {
  const aliasnameRegex = /^\w+$/i;
  if (!aliasnameRegex.test(req.body.aliasname)) {
    res.status(400).json({
      error: 'Aliasname must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

// Existence

/**
 * Checks if alias with req.body.aliasname exists
 */
const doesAccountWithAliasnameExist = async (req: Request, res: Response, next: NextFunction) => {
  const aliasname = (req.body.aliasname as string) ?? '';

  if (!aliasname) {
    res.status(400).json({error: 'No aliasname provided'});
    return;
  }

  const alias = await AliasCollection.findOneByAliasname(aliasname);

  if (alias) {
    next();
  } else {
    res.status(404).json({error: `Account with aliasname: ${aliasname} does not exist`});
  }
};

/**
 * Checks if alias with req.body.aliasId exists
 */
const doesAccountWithAliasIdExist = async (req: Request, res: Response, next: NextFunction) => {
  const aliasId = (req.body.aliasId as string) ?? '';

  if (!aliasId) {
    res.status(400).json({error: 'aliasId not provided'});
    return;
  }

  const alias = await AliasCollection.findOneByAliasId(aliasId);

  if (alias) {
    next();
  } else {
    res.status(404).json({error: `Account with aliasId: ${aliasId} does not exist`});
  }
};

/**
 * Checks if account with req.params.aliasname exists
 */
const doesAccountWithParamAliasnameExist = async (req: Request, res: Response, next: NextFunction) => {
  const aliasname = (req.params.aliasname) ?? '';

  if (!aliasname) {
    res.status(400).json({error: 'aliasname not in params'});
    return;
  }

  const alias = await AliasCollection.findOneByAliasname(aliasname);

  if (alias) {
    next();
  } else {
    res.status(404).json({error: `Account with aliasname: ${aliasname} does not exist`});
  }
};

/**
 * Checks if account with req.params.aliasId exists
 */
const doesAccountWithParamAliasIdExist = async (req: Request, res: Response, next: NextFunction) => {
  const aliasId = (req.params.aliasId) ?? '';

  if (!aliasId) {
    res.status(400).json({error: 'aliasId not in params'});
    return;
  }

  const alias = await AliasCollection.findOneByAliasId(aliasId);

  if (alias) {
    next();
  } else {
    res.status(404).json({error: `Account with aliasId: ${aliasId} does not exist`});
  }
};

/**
 * Checks if an Alias with aliasId as author id in req.query exists
 */
const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.author) {
    res.status(400).json({
      error: 'Provided author aliasname must be nonempty.'
    });
    return;
  }

  const alias = await AliasCollection.findOneByAliasname(req.query.author as string);
  if (!alias) {
    res.status(404).json({
      error: `An alias with aliasname ${req.query.author as string} does not exist.`
    });
    return;
  }

  next();
};

// Belonging

/**
 * Checks if the req.body.aliasname belongs to req.session.userId
 */
const doesAliasBelongToUser = async (req: Request, res: Response, next: NextFunction) => {
  const alias = await AliasCollection.findOneByAliasname(req.body.aliasname);

  if (alias.userId.toString() !== req.session.userId) {
    res.status(403).json({
      error: `The Alias: ${alias.aliasname} does not belong to you.`
    });
    return;
  }

  next();
};

// Logged In/Out

/**
 * Checks if the alias is logged in, that is, whether the aliasId is set in session
 */
const isAliasLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.aliasId) {
    res.status(403).json({
      error: 'You must be logged in to an Alias complete this action.'
    });
    return;
  }

  next();
};

/**
 * Checks if the alias is signed out, that is, aliasId is undefined in session
 */
const isAliasLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.aliasId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

// Duplicate Check

/**
 * Checks if an alias with req.body.aliasname exists
 */
const isAliasnameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const aliasname = (req.body.aliasname as string) ?? '';
  const alias = await AliasCollection.findOneByAliasname(aliasname);

  // If the current session alias wants to change their aliasname to one which matches
  // the current one irrespective of the case, we should allow them to do so
  if (!alias || (alias?._id.toString() === req.session.aliasId)) {
    next();
    return;
  }

  res.status(409).json({
    error: `Account with aliasname: ${aliasname} already exists`
  });
};

export {
  isCurrentSessionAliasExists,
  isAliasnameNotAlreadyInUse,
  isAuthorExists,
  isValidAliasname,
  isAliasLoggedOut,
  isAliasLoggedIn,
  doesAccountWithAliasIdExist,
  doesAccountWithAliasnameExist,
  doesAliasBelongToUser,
  doesAccountWithParamAliasnameExist,
  doesAccountWithParamAliasIdExist
};
