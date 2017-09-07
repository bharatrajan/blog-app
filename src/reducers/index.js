import { combineReducers } from 'redux';
import { actionType } from '../actions';

const localState = {
  posts: [],
  categories: []
}

const postsReducer = (state = localState, action) => {
  switch (action.type) {
    case actionType.RECEIVE_POSTS :
      return action.posts;
    default:
        return state;
  }
};

const categoryReducer = (state = localState, action) => {
  switch (action.type) {
    case actionType.RECEIVE_CATEGORIES :
      return action.categories;
    default :
      return state;
  }
}

export default combineReducers({posts: postsReducer, categories: categoryReducer});
