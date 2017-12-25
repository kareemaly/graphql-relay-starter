const IoC = require('AppIoC');
const { Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { slugify } = require('@server/utils/helpers');

const postModel = (mongoose) => {
  /**
   * Post schema definition
   * @type {Schema}
   */
  const postSchema = new Schema({
    // Post name
    name: {type: String, required: true},
    // Post description
    description: {type: String},
    // Post slug (used in url)
    slug: {type: String, required: true, unique: true},
    // Post cover image src
    coverImage: {type: String},
    // Post logo image src
    logoImage: {type: String},
    // Post creator
    creator: {type: Schema.Types.ObjectId, ref: 'User', required:true},
  });

  /**
   * Get creator
   * @return {User}
   */
  postSchema.method('getCreator', async function() {
    await this.populate('creator').execPopulate();
    return this.creator;
  });

  /**
   * Generate slug if user didnt input it
   */
  postSchema.pre('validate', async function(next) {
    if(! this.slug) {
      this.slug = slugify(this.name);
    }
    next();
  });

  postSchema.plugin(uniqueValidator);

  return mongoose.model('Post', postSchema);
};

IoC.callable('blog.postModel', ['app.connection'], postModel);
