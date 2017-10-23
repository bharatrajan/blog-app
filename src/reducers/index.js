import { combineReducers } from 'redux';
import { actionType } from '../actions';

/**
* @description - Default state object
*/
let mainState = {
  posts: [],
  categories: [],
  comments: {},
};

/**
* @description - Posts reducer. Handles all post related actions
* @description - Updates the state for its subscriber
* @reducer
* @param {object} posts - Object from actionDispatcher
* @param {object} action - Object from actionDispatcher
* @returns post object
*/
const postsReducer = (posts = mainState.posts, action) => {
  switch (action.type) {
    case actionType.GET_POSTS:
      return mainState.posts.filter(item => true);

    case actionType.RECEIVE_POSTS:
      mainState.posts = action.posts;
      return mainState.posts.filter(item => true);

    case actionType.UPDATE_POSTS:
      mainState.posts.push(action.newPost);
      return mainState.posts.filter(item => true);

    case actionType.EDIT_POSTS:
      let filteredPostList = posts.filter(
        post => post.id !== action.updatedPost.id
      );
      filteredPostList.push(action.updatedPost);
      return filteredPostList;

    case actionType.DELETE_POST:
      let filteredPosts = posts.filter(post => post.id !== action.postId);
      let deletedPost = posts.filter(post => post.id === action.postId)[0];
      deletedPost.deleted = true;
      filteredPosts.push(deletedPost);
      return filteredPosts;

    case actionType.VOTE_POST:
      let filteredPostsList = posts.filter(
        post => post.id !== action.postWithUpdatedVote.id
      );
      filteredPostsList.push(action.postWithUpdatedVote);
      return filteredPostsList;

    default:
      return posts.filter(post => true);
  }
};

/**
* @description - Comments reducer. Handles all comment related actions
* @description - Updates the state for its subscriber
* @reducer
* @param {object} comments - Object from actionDispatcher
* @param {object} action - Object from actionDispatcher
* @returns comment object
*/
const commentReducer = (comments = mainState.comments, action) => {
  switch (action.type) {
    case actionType.GET_COMMENTS:
      comments[action.postId] = action.comments || [];
      return { ...comments };

    case actionType.UPDATE_COMMENTS:
      let newCommentParentId = action.newComment.parentId;
      let commentsForPost = comments[newCommentParentId];
      commentsForPost.push(action.newComment);
      comments[newCommentParentId] = commentsForPost;
      return { ...comments };

    case actionType.EDIT_COMMENT:
      let updatedCommentParentId = action.updatedComment.parentId;
      let updatedCommentList = comments[updatedCommentParentId];
      let updatedCommentListFiltered = updatedCommentList.filter(
        comment => comment.id !== action.updatedComment.id
      );
      updatedCommentListFiltered.push(action.updatedComment);

      comments[updatedCommentParentId] = updatedCommentListFiltered;
      return { ...comments };

    case actionType.DELETE_COMMENT:
      let deletedCommentparentId = action.comment.parentId;
      let commentForPost = comments[deletedCommentparentId];
      let filteredComment = commentForPost.filter(
        comment => comment.id !== action.comment.id
      );
      filteredComment.push(action.comment);
      comments[deletedCommentparentId] = filteredComment;
      return { ...comments };

    case actionType.VOTE_COMMENT:
      let voteChangedCommentParentId = action.commentWithUpdatedVote.parentId;
      let voteChangedCommentList = comments[voteChangedCommentParentId];
      let voteUNChangedCommentList = voteChangedCommentList.filter(
        comment => comment.id !== action.commentWithUpdatedVote.id
      );
      voteUNChangedCommentList.push(action.commentWithUpdatedVote);
      comments[voteChangedCommentParentId] = voteUNChangedCommentList;
      return { ...comments };

    default:
      return { ...comments };
  }
};

/**
* @description - Categories reducer. Handles all category related actions
* @description - Updates the state for its subscriber
* @reducer
* @param {object} categories - Object from actionDispatcher
* @param {object} action - Object from actionDispatcher
* @returns category object 
*/
const categoryReducer = (categories = mainState.categories, action) => {
  switch (action.type) {
    case actionType.RECEIVE_CATEGORIES:
      categories = action.categories;
      return categories.filter(item => true);

    default:
      return categories.filter(item => true);
  }
};

export default combineReducers({
  posts: postsReducer,
  categories: categoryReducer,
  comments: commentReducer,
});
