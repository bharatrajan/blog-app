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
      return mainState.posts;

    case actionType.RECEIVE_POSTS :
      mainState.posts = action.posts;
      return action.posts;

    case actionType.UPDATE_POSTS:
      mainState.posts.push(action.newPost);
      return mainState.posts;

    default:
        return posts;
  }
};

const commentReducer = (comments = mainState.comments, action) => {
  switch (action.type) {
    case actionType.GET_COMMENTS :
      mainState.comments = action.comments;
      return comments;

    case actionType.DELETE_COMMENT:
      let commentsForPost = mainState.comments[action.comment.parentId];
      let updatedCommentsForPost = commentsForPost.map( comment => {
        if(comment.id === action.comment.id) comment.deleted = true;
        return comment
      })
      mainState.comments[action.comment.parentId] = updatedCommentsForPost;
      mainState.comments["randomAction"] = util.uuid();
      return mainState.comments;
    default :
      return comments;
  }
}

const categoryReducer = (categories = mainState.categories, action) => {
  switch (action.type) {
    case actionType.RECEIVE_CATEGORIES :
      mainState.categories = action.categories;
      return action.categories;

    default :
      return categories;
  }
}

export default combineReducers({posts: postsReducer, categories: categoryReducer, comments: commentReducer});
