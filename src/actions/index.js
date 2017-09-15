import * as BlogAPI from '../utils/blog-api.js';
import _ from 'lodash';

/**
* @description - Carries all the dispatchable action names 
* @enum
*/
export const actionType = {
  GET_POSTS: 'GET_POSTS',
  VOTE_POST: 'VOTE_POST',
  EDIT_POSTS: 'EDIT_POSTS',
  DELETE_POST: 'DELETE_POST',
  UPDATE_POSTS: 'UPDATE_POSTS',
  RECEIVE_POSTS: 'RECEIVE_POSTS',

  GET_COMMENTS: 'GET_COMMENTS',
  EDIT_COMMENT: 'EDIT_COMMENT',
  VOTE_COMMENT: 'VOTE_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_COMMENTS: 'UPDATE_COMMENTS',
  RECEIVE_COMMENTS: 'RECEIVE_COMMENTS',

  RECEIVE_CATEGORIES: 'RECEIVE_CATEGORIES',
};

/**
* @description - Dispatches the action 'RECEIVE_CATEGORIES'
* @actionDispatcher
* @param {object} receiveCategories - List of categories recived from API
* @returns action-object 
*/
export const receiveCategories = categories => ({
  type: actionType.RECEIVE_CATEGORIES,
  categories: categories,
});

/**
* @description - Makes  API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @returns dispatchable action exececuter
*/
export const fetchCatogeries = () => dispatch =>
  BlogAPI.getAllCategories().then(resp =>
    dispatch(receiveCategories(_.orderBy(resp.categories, ['name'], ['asc'])))
  );

/**
* @description - Dispatches the action 'RECEIVE_POSTS'
* @actionDispatcher
* @param {object} receivePosts - List of posts recived from API
* @returns action-object 
*/
export const receivePosts = posts => ({
  type: actionType.RECEIVE_POSTS,
  posts,
});

/**
* @description - Makes getAllPosts API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @returns dispatchable action exececuter, receivePosts
*/
export const fetchPosts = () => dispatch =>
  BlogAPI.getAllPosts().then(posts => dispatch(receivePosts(posts)));

/**
* @description - Dispatches the action 'EDIT_POSTS'
* @actionDispatcher
* @param {object} updatedPost - post object which got updated
* @returns action-object 
*/
export const editPost = updatedPost => ({
  type: actionType.EDIT_POSTS,
  updatedPost,
});

/**
* @description - Makes  API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {string} postId - Id for post to be edited
* @param {object} body - body for API call
* @returns dispatchable action exececuter, editPost
*/
export const editPostApi = (postId, body) => dispatch =>
  BlogAPI.editPostApi(postId, body).then(updatedPost =>
    dispatch(editPost(updatedPost))
  );

/**
* @description - Dispatches the action 'UPDATE_POSTS' 
* @actionDispatcher
* @param {object} newPost - Add the "newPost" into state 
* @returns action-object 
*/
export const updatePosts = newPost => ({
  type: actionType.UPDATE_POSTS,
  newPost,
});

/**
* @description - Makes addPost API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {object} newPost - New post to be added in API
* @returns dispatchable action exececuter, updatePosts
*/
export const addPost = newPost => dispatch =>
  BlogAPI.addPost(newPost).then(newPost => dispatch(updatePosts(newPost)));

/**
* @description - Dispatches the action 'GET_POSTS'
* @actionDispatcher
* @param {object} post - List of all posts
* @returns action-object 
*/
export const getAllPosts = post => ({
  type: actionType.GET_POSTS,
  post,
});

/**
* @description - Makes deletePost API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {string} postId - Id for post to be deleted
* @returns dispatchable action exececuter, deletePost
*/
export const deletePostApi = postId => dispatch =>
  BlogAPI.deletePost(postId).then(resp => dispatch(deletePost(postId, resp)));

/**
* @description - Dispatches the action 'DELETE_POST'
* @actionDispatcher
* @param {string} postId - Id of the post that got deleted successfully
* @param {object} resp - Response object from API
* @returns action-object 
*/
export const deletePost = (postId, resp) => ({
  postId,
  type: actionType.DELETE_POST,
});

/**
* @description - Makes votePost API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {string} postId - Id of post whose vote score is getting updated
* @param {object} body - body for API call
* @returns dispatchable action exececuter, votePost
*/
export const votePostApi = (postId, body) => dispatch =>
  BlogAPI.votePost(postId, body).then(resp => dispatch(votePost(resp)));

/**
* @description - Dispatches the action 'VOTE_POST'
* @actionDispatcher
* @param {object} postWithUpdatedVote - Post object whose votes is updated successfully
* @returns action-object 
*/
export const votePost = postWithUpdatedVote => ({
  postWithUpdatedVote,
  type: actionType.VOTE_POST,
});

/**
* @description - Makes fetchComments API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {string} postId - Post id whose comments are requested from API
* @returns dispatchable action exececuter getCommentsForPost
*/
export const fetchComments = postId => dispatch =>
  BlogAPI.getAllComments(postId).then(resp =>
    dispatch(getCommentsForPost(postId, resp))
  );

/**
* @description - Dispatches the action 'GET_COMMENTS'
* @actionDispatcher
* @param {string} postId - id of post for which the comments are fetched from API
* @param {object} comments - List of comments from API
* @returns action-object 
*/
export const getCommentsForPost = (postId, comments) => ({
  type: actionType.GET_COMMENTS,
  comments,
  postId,
});

/**
* @description - Makes deleteComment API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {string} commentId - Id of comment getting deleted
* @returns dispatchable action exececuter, deleteComment
*/
export const deleteCommentAPI = commentId => dispatch =>
  BlogAPI.deleteComment(commentId).then(resp => dispatch(deleteComment(resp)));

/**
* @description - Dispatches the action 'DELETE_COMMENT'
* @actionDispatcher
* @param {object} resp - Response from API for the delete action on a comment
* @returns action-object 
*/
export const deleteComment = resp => ({
  comment: resp,
  type: actionType.DELETE_COMMENT,
});

/**
* @description - Dispatches the action 'UPDATE_COMMENTS'
* @actionDispatcher
* @param {object} newComment - New comment object to be added
* @returns action-object 
*/
export const updateComments = newComment => ({
  type: actionType.UPDATE_COMMENTS,
  newComment,
});

/**
* @description - Makes addComment API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {object} newComment - New comment object getting added
* @returns dispatchable action exececuter, updateComments
*/
export const addComment = newComment => dispatch =>
  BlogAPI.addComment(newComment).then(newComment =>
    dispatch(updateComments(newComment))
  );

/**
* @description - Dispatches the action 'EDIT_COMMENT'
* @actionDispatcher
* @param {object} updatedComment - Response from API for the update action on a comment
* @returns action-object 
*/
export const editComment = updatedComment => ({
  type: actionType.EDIT_COMMENT,
  updatedComment,
});

/**
* @description - Makes  API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {object} body - Body for API call
* @param {string} commentId - id of comment getting edited
* @returns dispatchable action exececuter, editComment
*/
export const editCommentApi = (commentId, body) => dispatch =>
  BlogAPI.editCommentApi(commentId, body).then(updatedComment =>
    dispatch(editComment(updatedComment))
  );

/**
* @description - Makes voteComment API call & returns a dispatchable action exec.
* @description - on success. Thunk
* @middleware
* @param {object} body - Body for API response
* @param {string} commentId - Id of comment getting votted 
* @returns dispatchable action exececuter, voteComment
*/
export const voteCommentApi = (commentId, body) => dispatch =>
  BlogAPI.voteComment(commentId, body).then(resp =>
    dispatch(voteComment(resp))
  );

/**
* @description - Dispatches the action 'VOTE_COMMENT
* @actionDispatcher
* @param {object} commentWithUpdatedVote - comment object with vote updated
* @returns action-object 
*/
export const voteComment = commentWithUpdatedVote => ({
  commentWithUpdatedVote,
  type: actionType.VOTE_COMMENT,
});
