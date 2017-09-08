import { combineReducers } from 'redux';
import { actionType } from '../actions';
import _ from 'lodash';

let mainState = {
  posts: [],
  categories: []
}

const postsReducer = (posts = mainState.posts, action) => {
  switch (action.type) {
    case actionType.RECEIVE_POSTS :
      mainState.posts = action.posts;
      return action.posts;
    case "UPDATE_POSTS":
      mainState.posts.push(action.post);
      return mainState;
    default:
        return posts;
  }
};

const categoryReducer = (categories = mainState.categories, action) => {
  switch (action.type) {
    case actionType.RECEIVE_CATEGORIES :
      mainState.categories = action.categories;
      return action.categories;
    default :
      return categories;
  }
}

export default combineReducers({posts: postsReducer, categories: categoryReducer});
