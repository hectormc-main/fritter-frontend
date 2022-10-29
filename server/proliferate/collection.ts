import type {HydratedDocument, Types} from 'mongoose';
import type {Proliferate} from './model';
import ProliferateModel from './model';

/**
 * This file contains a class with functionality to interact with Proliferates stored in
 * MongoDB. Provides ability to add a proliferate to MongoDB, multiple methods
 * for searching, and ability to delete.
 */
class ProliferateCollection {
  // CREATION

  /**
   * Add a new proliferate to database
   *
   * @param aliasId - The one whe proliferates
   * @param contentId - What they proliferated
   * @return {} Proliferate objects
   */
  static async addOne(aliasId: Types.ObjectId | string, contentId: string): Promise<HydratedDocument<Proliferate>> {
    const proliferate = new ProliferateModel({aliasId, contentId});
    await proliferate.save(); // Save Proliferate to MongoDB
    return proliferate;
  }

  // FINDING

  /**
   * Find the proliferate the alias did on content
   *
   * @param aliasId - The alisa who proliferated
   * @param contentId - The content they proliferated
   */
  static async findOneByAliasIdAndContentId(aliasId: Types.ObjectId | string, contentId: Types.ObjectId | string): Promise<HydratedDocument<Proliferate>> {
    return ProliferateModel.findOne({aliasId, contentId});
  }

  /**
   * Find all proliferates on content by contentId
   *
   * @param contentId - The content which was proliferated
   */
  static async findAllByContentId(contentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Proliferate>>> {
    return ProliferateModel.find({contentId});
  }

  /**
   * Find all proliferates the Alias did
   *
   * @param aliasId - The on who proliferates
   */
  static async findAllByAliasId(aliasId: Types.ObjectId | string): Promise<Array<HydratedDocument<Proliferate>>> {
    return ProliferateModel.find({aliasId});
  }

  // DELETION

  /**
   * Delete the proliferate the Alias did on a specific piece of content
   *
   * @param aliasId - The alias who would like to unproliferate
   * @param contentId - The content they would like to unproliferate
   */
  static async deleteOneByAliasIdAndContentId(aliasId: Types.ObjectId | string, contentId: Types.ObjectId | string): Promise<boolean> {
    const proliferate = await ProliferateModel.deleteOne({aliasId, contentId});
    return proliferate !== null;
  }

  /**
   * Delete all proliferates the Alias did
   *
   * @param aliasId - The alias to be purged of proliferates
   */
  static async deleteManyByAliasId(aliasId: Types.ObjectId | string): Promise<void> {
    await ProliferateModel.deleteMany({aliasId});
  }

  /**
   * Delete all Proliferates on content
   *
   * @param contentId - the content to be purged of all proliferates
   */
  static async deleteManyByContentId(contentId: Types.ObjectId | string): Promise<void> {
    await ProliferateModel.deleteMany({contentId});
  }
}

export default ProliferateCollection;
