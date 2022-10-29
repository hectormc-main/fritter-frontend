import type {HydratedDocument, Types} from 'mongoose';
import type {Alias} from './model';
import AliasModel from './model';
import FreetCollection from '../freet/collection';
import ProliferateCollection from '../proliferate/collection';
import ReactionCollection from '../reaction/collection';
import RejectionCollection from '../rejection/collection';
import FollowCollection from '../follow/collection';

/**
 * This file contains a class with functionality to interact with Aliases stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class AliasCollection {
  /**
   * Add a new alias to a user
   *
   * @param {string} userId - userId of the user with which to add the alias to
   * @param {string} aliasname - The aliasname of the new Alias
   * @return {Promise<HydratedDocument<Alias>>} - The newly created Alias
   */
  static async addOne(userId: string, aliasname: string): Promise<HydratedDocument<Alias>> {
    const alias = new AliasModel({userId, aliasname});
    await alias.save(); // Saves alias to MongoDB
    return alias;
  }

  /**
   * Find an alias by id
   *
   * @param {string} aliasId - The aliasId of the alias to find
   * @return {Promise<HydratedDocument<Alias>> | Promise<null>} - The alias with the given aliasname, if any
   */
  static async findOneByAliasId(aliasId: string): Promise<HydratedDocument<Alias>> {
    return AliasModel.findOne({_id: aliasId});
  }

  /**
   * Find all aliases belonging to userId
   *
   * @param {string} userId - userId of alias owner
   * @return {Promise<Array<HydratedDocument<Alias>>> | Promise<null>} - The aliases belonging to userId
   */
  static async findAllByUserId(userId: string): Promise<Array<HydratedDocument<Alias>>> {
    return AliasModel.find({userId});
  }

  /**
   * Find an alias by aliasname (case insensitive).
   *
   * @param {string} aliasname - The aliasname of the alias to find
   * @return {Promise<HydratedDocument<Alias>> | Promise<null>} - The alias with the given aliasname, if any
   */
  static async findOneByAliasname(aliasname: string): Promise<HydratedDocument<Alias>> {
    return AliasModel.findOne({aliasname: new RegExp(`^${aliasname.trim()}$`, 'i')});
  }

  /**
   * Update alias's information
   *
   * @param {string} aliasId - The aliasID of the alias to update
   * @param {Object} aliasDetails - An object with the alias's updated credentials
   * @return {Promise<HydratedDocument<Alias>>} - The updated alias
   */
  static async updateOne(aliasId: Types.ObjectId | string, aliasDetails: any): Promise<HydratedDocument<Alias>> {
    const alias = await AliasModel.findOne({_id: aliasId});
    if (aliasDetails.aliasname) {
      alias.aliasname = aliasDetails.aliasname as string;
    }

    await alias.save();
    return alias;
  }

  /**
   * Delete an alias from the collection.
   *
   * @param {string} aliasId - The aliasId of alias to delete
   * @return {Promise<Boolean>} - true if the alias has been deleted, false otherwise
   */
  static async deleteOne(aliasId: Types.ObjectId | string): Promise<boolean> {
    const alias = await AliasModel.findOne({_id: aliasId});
    await FreetCollection.deleteMany(alias._id);
    await ProliferateCollection.deleteManyByAliasId(alias._id);
    await ReactionCollection.deleteManyByAliasId(alias._id);
    await RejectionCollection.deleteManyByAliasId(alias._id);
    await FollowCollection.deleteManyByFollowerId(alias._id);

    const del_alias = await AliasModel.deleteOne({_id: aliasId});
    return del_alias !== null;
  }
}

export default AliasCollection;

