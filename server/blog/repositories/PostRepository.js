const IoC = require('AppIoC');
const ForbiddenError = require( '@server/errors/ForbiddenError');
const ModelNotFoundError = require( '@server/errors/ModelNotFoundError');

class PostRepository {
  constructor(postModel) {
    this.postModel = postModel;
  }

  /**
   * Query posts
   * @param  {User} viewer
   * @param  {Object} inputs
   * @return {Promise<Post[]>}
   */
  async query(viewer, inputs) {
    const query = this.postModel.find();

    if(inputs.slug) {
      query.where('slug', inputs.slug);
    }

    return query.exec();
  }

  /**
   * Find post by id
   * @param  {User} viewer
   * @param  {ObjectId} id
   * @return {Promise<Post>}
   */
  async findById(viewer, id) {
    return this.postModel.findById(id).exec();
  }

  /**
   * Create post
   * @param  {User} viewer
   * @param  {Object} data
   * @return {Promise<Post>}
   * @throws {ForbiddenError} If viewer is not an admin
   */
  async create(viewer, data) {
    if(viewer.isGuest()) {
      throw new ForbiddenError("You are not authorized to make this action.");
    }

    return this.postModel.create({
      ...data,
      creator: viewer._id,
    });
  }

  /**
   * Update post attributes
   * @param  {User} viewer
   * @param  {ObjectId} id
   * @param  {Object} data
   * @return {Promise<Post>}
   * @throws {ForbiddenError} If viewer is not an admin
   * @throws {ModelNotFoundError} If post doesnt exist
   */
  async update(viewer, id, data) {
    if(!viewer.isAdmin()) {
      throw new ForbiddenError("You are not authorized to make this action.");
    }

    const post = await this.postModel.findById(id);

    if(! post) {
      throw new ModelNotFoundError("The post you are requesting to update doesnt exist");
    }

    return post.set(data).save();
  }

  /**
   * Remove post by id
   * @param  {User} viewer
   * @param  {ObjectId} id
   * @return {Promise}
   * @throws {ForbiddenError} If viewer is not an admin
   * @throws {ModelNotFoundError} If post doesnt exist
   */
  async remove(viewer, id) {
    if(!viewer.isAdmin()) {
      throw new ForbiddenError("You are not authorized to make this action.");
    }

    const post = await this.postModel.findById(id);

    if(! post) {
      throw new ModelNotFoundError("The post you are requesting to remove doesnt exist");
    }

    return await post.remove();
  }
}

IoC.singleton('blog.postRepository', [
  'blog.postModel',
], PostRepository);
