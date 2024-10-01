
import Comment from '../models/commentModel.js';

// @desc   Get all comments
// @route  GET /api/comments
export const  getCommnets = async  (req, res, next) => {

  try {
    // Fetch all users from the database
    const comment = await Comment.find({}).select('-_id');;
    
    // Send users in the response
    res.status(200).json(comment);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }


};

// @desc    Get single comment
// @route   GET /api/comments/:id
export const getCommnet = async (req, res, next) => {


  try {
    // Retrieve user ID from the request parameters
    const id = req.params.id;

    // Find user by ID, excluding the password field
    const comment = await Comment.findById(id).select('-password');
    
    // If user not found, return an error response
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Send the user details in the response
    res.status(200).json(comment);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }

};

// @desc    Create new comment
// @route   POST /api/comments
export const createCommnet =  async (req, res, next) => {

  try {
    const { user_id, post_id, content} = req.body;

   // Create new user
   const comment = await Comment.create({
    user_id,
    content,
    post_id
   });

   // If post is created successfully
   if (comment ) {
     res.status(201).json({
       _id: comment._id,
       content: comment.content,
     });
   } else {
     res.status(400).json({ error: 'Invalid post data' });
   }
 } catch (error) {
   next(error); // Pass the error to the error handling middleware
 }


};

// @desc    Update comment
// @route   PUT /api/comments/:id
export const updateCommnet = async (req, res, next) => {

};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
export const deleteCommnet = async(req, res, next) => {

 
};
