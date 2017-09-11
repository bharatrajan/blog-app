import { combineReducers } from 'redux';
import { actionType } from '../actions';
import _ from 'lodash';
import util from '../utils/utils.js';


let mainState = {
  posts: [],
  categories: [],
  comments: []
}

const postsReducer = (posts = mainState.posts, action) => {
  switch (action.type) {
    case actionType.GET_POSTS :
      return mainState.posts.filter( item => true);

    case actionType.RECEIVE_POSTS :
      mainState.posts = action.posts;
      return mainState.posts.filter( item => true);

    case actionType.UPDATE_POSTS:
      mainState.posts.push(action.newPost);
      return mainState.posts.filter( item => true);

    default:
        return posts;
  }
};

const commentReducer = (comments = mainState.comments, action) => {
  switch (action.type) {
    case actionType.GET_COMMENTS :
      mainState.comments = action.comments;
      return mainState.comments.filter( item => true);

    case actionType.UPDATE_COMMENTS :
      mainState.comments.push(action.newComment);
      return mainState.comments.filter( comment => true);

    case actionType.DELETE_COMMENT :
      let filteredComment = comments.filter( comment => comment.id !== action.comment.id)
          filteredComment.push(action.comment);
      return filteredComment;

    default :
      return comments.filter( item => true);
  }
}

const categoryReducer = (categories = mainState.categories, action) => {
  switch (action.type) {
    case actionType.RECEIVE_CATEGORIES :
      mainState.categories = action.categories;
      return mainState.categories.filter( item => true);

    default :
      return categories.filter( item => true);
  }
}

export default combineReducers({posts: postsReducer, categories: categoryReducer, comments: commentReducer});
