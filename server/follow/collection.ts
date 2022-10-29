import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';

/**
 * This file contains a class with functionality to interact with Follows stored in
 * MongoDB. Provides ability to add a follow to MongoDB, multiple methods
 * for searching, and ability to delete.
 */
class FollowCollection {
  // CREATION

  /**
   * Add a new follow to database. followerId follows followedId
   *
   * @param {Types.ObjectId | string} followerId - The one who follows
   * @param {Types.ObjectId | string} followedId - Who they are to follow. It's also an followerId type
   * @return {Promise<HydratedDocument<Follow>>} - Follow object
   */
  static async addOne(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({followerId, followedId});
    await follow.save(); // Save Follow to MongoDB
    return follow;
  }

  // FINDING

  /**
   * Find object of followerId following followedId
   *
   * @param {Types.ObjectId | string} followerId - The one who follows
   * @param {Types.ObjectId | string} followedId - Who they follow
   * @return {Promise<HydratedDocument<Follow>>} - Follow object
   */
  static async findOneByFollowerIdAndFollowedId(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({followerId, followedId});
  }

  /**
   * Find all Follow objects in which followedId is the one followed.
   * Useful for finding all who follow followedId.
   *
   * @param {Types.ObjectId | string} followedId - The one who is followed
   * @return {Promise<Array<HydratedDocument<Follow>>>} - Array of Follow objects
   */
  static async findAllByFollowedId(followedId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({followedId});
  }

  /**
   * Find all Follow objects in which followerId is the one who follows.
   * Useful for finding all who followerId follows.
   *
   * @param {Types.ObjectId | string} followerId - The one who follows
   * @return {Promise<Array<HydratedDocument<Follow>>> } - Array of Follow objects
   */
  static async findAllByFollowerId(followerId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({followerId});
  }

  // DELETION

  /**
   * followerId no longer follows followedId
   *
   * @param {Types.ObjectId | string} followerId - The one who wants to unfollow
   * @param {Types.ObjectId | string} followedId - Who they are to unfollow
   */
  static async deleteOneByFollowerIdAndFollowedId(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): Promise<boolean> {
    const follow = await FollowModel.deleteOne({followerId, followedId});
    return follow !== null;
  }

  /**
   * Delete all Follow entries in which followerId is the follower
   *
   * @param {Types.ObjectId | string} FollowerId - The alias who is to follow no one
   */
  static async deleteManyByFollowerId(FollowerId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({FollowerId});
  }

  /**
   * Delete all Follow entries in which followedId is the one being followed
   *
   * @param followedId - the alias who is to be followed by no one
   */
  static async deleteManyByFollowedId(followedId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({followedId});
  }
}

export default FollowCollection;
