import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction} from './model';
import ReactionModel from './model';

/**
 * This file contains a class with functionality to interact with Reactions stored in
 * MongoDB. Provides ability to add a reaction to MongoDB, multiple methods
 * for searching, and ability to delete.
 */
class ReactionCollection {
  // CREATION

  /**
   * Add a new reaction to database
   *
   * @param aliasId - The one who reacted
   * @param contentId - What they reacted to
   * @param emojiCode - Code of the emoji
   * @return {} Reaction object
   */
  static async addOne(aliasId: Types.ObjectId | string, contentId: string, emojiCode: string): Promise<HydratedDocument<Reaction>> {
    const reaction = new ReactionModel({aliasId, contentId, emojiCode});
    await reaction.save(); // Save Reaction to MongoDB
    return reaction;
  }

  // FINDING

  /**
   * Find the reaction based on the alias and content
   *
   * @param aliasId - The alisa who reacted
   * @param contentId - The content they reacted to
   */
  static async findOneByAliasIdAndContentId(aliasId: Types.ObjectId | string, contentId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({aliasId, contentId});
  }

  /**
   * Find all reactions on content by contentId
   *
   * @param contentId - The content which was reacted to
   */
  static async findAllByContentId(contentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Reaction>>> {
    return ReactionModel.find({contentId});
  }

  /**
   * Find all reactions the Alias did
   *
   * @param aliasId - The one who reacts
   */
  static async findAllByAliasId(aliasId: Types.ObjectId | string): Promise<Array<HydratedDocument<Reaction>>> {
    return ReactionModel.find({aliasId});
  }

  // UPDATING

  /**
   * Change the type of reaction the Alias did
   *
   * @param aliasId - The olias who changed their mind
   * @param contentId - The content about to be changed
   * @param emojiCode - What the new reaction shall be
   */
  static async updateOne(aliasId: Types.ObjectId | string, contentId: Types.ObjectId | string, emojiCode: string): Promise<HydratedDocument<Reaction>> {
    const reaction = await ReactionModel.findOne({aliasId, contentId});
    reaction.emojiCode = emojiCode;

    return reaction;
  }

  // DELETION

  /**
   * Delete the reaction the Alias did on a specific piece of content
   *
   * @param aliasId - The alias who would like to unreact
   * @param contentId - The content they would like to unreact
   */
  static async deleteOneByAliasIdAndContentId(aliasId: Types.ObjectId | string, contentId: Types.ObjectId | string): Promise<boolean> {
    const reaction = await ReactionModel.deleteOne({aliasId, contentId});
    return reaction !== null;
  }

  /**
   * Delete all reactions the Alias did
   *
   * @param aliasId - The alias to be purged of reactions
   */
  static async deleteManyByAliasId(aliasId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({aliasId});
  }

  /**
   * Delete all reactions on content
   *
   * @param contentId - the content to be purged of all reactions
   */
  static async deleteManyByContentId(contentId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({contentId});
  }
}

export default ReactionCollection;
