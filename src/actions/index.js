import * as BlogAPI from '../utils/blog-api.js'
import _ from 'lodash';

export const actionType = {
  REFRESH:'REFRESH',

  GET_POSTS:'GET_POSTS',
  EDIT_POSTS: 'EDIT_POSTS',
  DELETE_POST: 'DELETE_POST',
  UPDATE_POSTS: 'UPDATE_POSTS',
  RECEIVE_POSTS: 'RECEIVE_POSTS',

  GET_COMMENTS: 'GET_COMMENTS',
  EDIT_COMMENT: 'EDIT_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_COMMENTS: 'UPDATE_COMMENTS',
  RECEIVE_COMMENTS: 'RECEIVE_COMMENTS',

  RECEIVE_CATEGORIES: 'RECEIVE_CATEGORIES',
};

export const refreshAction = () => ({
  type: actionType.REFRESH
});

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

        post.time = tsObj.getMonth().toString() + "/" +  tsObj.getDate().toString() + "/" + tsObj.getFullYear().toString() ;
        return post;
      });
      dispatch(receivePosts(localPosts))
    }
  )
);

export const editPost = updatedPost => ({
  type: actionType.EDIT_POSTS,
  updatedPost
});

export const editPostApi = (postId, body) => dispatch => (
  BlogAPI.editPostApi(postId, body).then(
    (updatedPost) => {
      let ts = updatedPost.timestamp.toString();
      if(ts.length !== 13) ts = ts * 1000;
      let tsObj = new Date(updatedPost.timestamp);

      updatedPost.time = tsObj.getMonth().toString() + "/" +  tsObj.getDate().toString() + "/" + tsObj.getFullYear().toString() ;
      return dispatch(editPost(updatedPost))
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


export const deletePostApi = postId => dispatch => (
  BlogAPI.deletePost(postId).then(
    resp => dispatch(deletePost( postId, resp ))
  )
);

export const deletePost = (postId, resp) => ({
  postId,
  type: actionType.DELETE_POST
});


export const fetchComments = postId => dispatch => (
  BlogAPI.getAllComments(postId).then(
    (resp) => {
      let localComments = resp.map(comment => {
        let ts = comment.timestamp.toString();
        if(ts.length !== 13) ts = ts * 1000;
        let tsObj = new Date(comment.timestamp);

        comment.time = tsObj.getMonth().toString() + "/" +  tsObj.getDate().toString() + "/" + tsObj.getFullYear().toString() ;
        return comment;
      });
      dispatch(getCommentsForPost(postId, localComments))
    }
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


export const editComment = updatedComment => ({
  type: actionType.EDIT_COMMENT,
  updatedComment
});

export const editCommentApi = (commentId, body) => dispatch => (
  BlogAPI.editCommentApi(commentId, body).then(
    updatedComment => {
      let ts = updatedComment.timestamp.toString();
      if(ts.length !== 13) ts = ts * 1000;
      let tsObj = new Date(updatedComment.timestamp);

      updatedComment.time = tsObj.getMonth().toString() + "/" +  tsObj.getDay().toString() + "/" + tsObj.getFullYear().toString() ;
      dispatch(editComment(updatedComment))
    }
  )
);
