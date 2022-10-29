import type {HydratedDocument, Types} from 'mongoose';
import type {Rejection} from './model';
import RejectionModel from './model';

/**
 * This file contains a class with functionality to interact with Rejections stored in
 * MongoDB. Provides ability to add a rejection to MongoDB, multiple methods
 * for searching, and ability to delete.
 */
class RejectionCollection {
  // CREATION

  /**
   * Add a new rejection to database
   *
   * @param aliasId - The one whe rejects
   * @param contentId - What they rejected
   * @return {} Rejection objects
   */
  static async addOne(aliasId: Types.ObjectId | string, contentId: string): Promise<HydratedDocument<Rejection>> {
    const rejection = new RejectionModel({aliasId, contentId});
    await rejection.save(); // Save Rejection to MongoDB
    return rejection;
  }

  // FINDING

  /**
   * Find the rejection the alias did on content
   *
   * @param aliasId - The alisa who rejected
   * @param contentId - The content they rejected
   */
  static async findOneByAliasIdAndContentId(aliasId: Types.ObjectId | string, contentId: Types.ObjectId | string): Promise<HydratedDocument<Rejection>> {
    return RejectionModel.findOne({aliasId, contentId});
  }

  // Don't think we need this one
  // /**
  //  * Find all rejects on content by contentId
  //  *
  //  * @param contentId - The content which was rejected
  //  */
  // static async findAllByContentId(contentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Rejection>>> {
  //   return RejectionModel.find({contentId});
  // }

  /**
   * Find all rejects the Alias did
   *
   * @param aliasId - The one who rejects
   */
  static async findAllByAliasId(aliasId: Types.ObjectId | string): Promise<Array<HydratedDocument<Rejection>>> {
    return RejectionModel.find({aliasId});
  }

  // DELETION

  /**
   * Delete the rejection the Alias did on a specific piece of content
   *
   * @param aliasId - The alias who would like to unreject
   * @param contentId - The content they would like to unreject
   */
  static async deleteOneByAliasIdAndContentId(aliasId: Types.ObjectId | string, contentId: Types.ObjectId | string): Promise<boolean> {
    const rejection = await RejectionModel.deleteOne({aliasId, contentId});
    return rejection !== null;
  }

  /**
   * Delete all rejections the Alias did
   *
   * @param aliasId - The alias to be purged of rejections
   */
  static async deleteManyByAliasId(aliasId: Types.ObjectId | string): Promise<void> {
    await RejectionModel.deleteMany({aliasId});
  }

  /**
   * Delete all Rejections on content
   *
   * @param contentId - the content to be purged of all rejections
   */
  static async deleteManyByContentId(contentId: Types.ObjectId | string): Promise<void> {
    await RejectionModel.deleteMany({contentId});
  }
}

export default RejectionCollection;
