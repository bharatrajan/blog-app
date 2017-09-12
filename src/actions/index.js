import * as BlogAPI from '../utils/blog-api.js'
import _ from 'lodash';

export const actionType = {
  GET_POSTS:'GET_POSTS',
  UPDATE_POSTS: 'UPDATE_POSTS',
  RECEIVE_POSTS: 'RECEIVE_POSTS',

  GET_COMMENTS: 'GET_COMMENTS',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_COMMENTS: 'UPDATE_COMMENTS',
  RECEIVE_COMMENTS: 'RECEIVE_COMMENTS',

  RECEIVE_CATEGORIES: 'RECEIVE_CATEGORIES',
};

export const receiveCategories = categories => ({
  type: actionType.RECEIVE_CATEGORIES,
  categories: categories
});

export const fetchCatogeries = () => dispatch => (
  BlogAPI.getAllCategories().then(
    resp => dispatch(receiveCategories(_.orderBy(resp.categories, ['name'],['asc'])))
  )
);

export const receivePosts = posts => ({
  type: actionType.RECEIVE_POSTS,
  posts
});

export const fetchPosts = () => dispatch => (
  BlogAPI.getAllPosts().then(
    (posts) => {
      let localPosts = posts.map(post => {
        let ts = post.timestamp.toString();
        if(ts.length !== 13) ts = ts * 1000;
        let tsObj = new Date(post.timestamp);

        post.time = tsObj.getMonth().toString() + "/" +  tsObj.getDay().toString() + "/" + tsObj.getFullYear().toString() ;
        return post;
      });
      dispatch(receivePosts(localPosts))
    }
  )
);

export const updatePosts = newPost => ({
  type: actionType.UPDATE_POSTS,
  newPost
});

export const addPost = (newPost) => dispatch => (
  BlogAPI.addPost(newPost).then(
    newPost => dispatch(updatePosts(newPost))
  )
);

export const getAllPosts = post => ({
  type: actionType.GET_POSTS,
  post
});

export const fetchComments = postId => dispatch => (
  BlogAPI.getAllComments(postId).then(
    resp => dispatch(getCommentsForPost( postId, resp ))
  )
);

export const getCommentsForPost = (postId, comments) => ({
  type: actionType.GET_COMMENTS,
  comments,
  postId
});

export const deleteCommentAPI = commentId => dispatch => (
  BlogAPI.deleteComment(commentId).then(
    resp => dispatch(deleteComment( resp ))
  )
);

export const deleteComment = (resp) => ({
  comment: resp,
  type: actionType.DELETE_COMMENT
});

export const updateComments = newComment => ({
  type: actionType.UPDATE_COMMENTS,
  newComment
});

export const addComment = (newComment) => dispatch => (
  BlogAPI.addComment(newComment).then(
    newComment => dispatch(updateComments(newComment))
  )
);
