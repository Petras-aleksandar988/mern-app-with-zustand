import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
// @desc   Get all posts
// @route  GET /api/posts
export const getPosts  = async  (req, res, next) => {

  try {
    // Fetch all users from the database
    const posts = await Post.find({});
    
    // Send users in the response
    res.status(200).json(posts);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }

};

// @desc    Get single post
// @route   GET /api/posts/:id
export const getPost = async (req, res, next) => {


  try {
    // Retrieve user ID from the request parameters
    const id = req.params.id;

    // Find user by ID, excluding the password field
    const post = await Post.findById(id).select('-password');
    
    // If user not found, return an error response
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Send the user details in the response
    res.status(200).json(post);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }


};

// @desc    Create new post
// @route   POST /api/posts
export const createPost =  async (req, res, next) => {

  try {
    const { user_id,content,likes} = req.body;


   // Create new user
   const post = await Post.create({
    user_id,
    content,
    likes
   });

   // If post is created successfully
   if (post) {
     res.status(201).json({
       id: post._id,
       user_id : post.user_id,
       content: post.content,
       likes: post.likes
     });
   } else {
     res.status(400).json({ error: 'Invalid post data' });
   }
 } catch (error) {
   next(error); // Pass the error to the error handling middleware
 }

};

// @desc    Update post
// @route   PUT /api/posts/:id
export const updatePost = async (req, res, next) => {

  const id = req.params.id;
  const { likes} = req.body;
  

  try {
    // Find the user by ID
    const post = await Post.findById(id);
  
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update fields if they are provided
    if (likes) post.likes = likes;
 
    
 

    // Save the updated user
    const updatedPost = await post.save();

    // Respond with the updated user information excluding the password
    res.status(200).json({
      id: updatedPost._id,
      content: updatedPost._content,
      likes: updatedPost.likes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deletePost = async(req, res, next) => {

  try {
    const id = req.params.id;
    const postDeleted = await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post_id: id });
    if(postDeleted){
      res.status(200).json({message: 'post deleted' })
    }
  } catch (error) {
    next(error)
  }

 
};
