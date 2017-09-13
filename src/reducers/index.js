import { combineReducers } from 'redux';
import { actionType } from '../actions';


let mainState = {
  posts: [],
  categories: [],
  comments: {}
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

    case actionType.EDIT_POSTS:
      let filteredPostList = posts.filter(post => post.id !== action.updatedPost.id);
          filteredPostList.push(action.updatedPost);
      return filteredPostList;

    case actionType.DELETE_POST:
      let filteredPosts = posts.filter(post => post.id !== action.postId);
      return filteredPosts;

    case actionType.VOTE_POST:
      let filteredPostsList = posts.filter(post => post.id !== action.postWithUpdatedVote.id);
          filteredPostsList.push(action.postWithUpdatedVote);
      return filteredPostsList;

    default:
        return posts.filter(post=>true);
  }
};

const commentReducer = (comments = mainState.comments, action) => {
  switch (action.type) {
    case actionType.GET_COMMENTS :
      comments[action.postId] = action.comments || [];
      return {...comments};

    case actionType.UPDATE_COMMENTS :
      let newCommentParentId = action.newComment.parentId;
      let commentsForPost = comments[newCommentParentId];
          commentsForPost.push(action.newComment)
      comments[newCommentParentId] = commentsForPost;
      return {...comments};

    case actionType.EDIT_COMMENT:
    let updatedCommentParentId = action.updatedComment.parentId;
    let updatedCommentList = comments[updatedCommentParentId];
    let updatedCommentListFiltered = updatedCommentList.filter(comment => comment.id !== action.updatedComment.id)
        updatedCommentListFiltered.push(action.updatedComment);

      comments[updatedCommentParentId] = updatedCommentListFiltered;
      return {...comments};

    case actionType.DELETE_COMMENT :
      let deletedCommentparentId = action.comment.parentId;
      let commentForPost = comments[deletedCommentparentId];
      let filteredComment = commentForPost.filter( comment => comment.id !== action.comment.id)
          filteredComment.push(action.comment)
      comments[deletedCommentparentId] = filteredComment;
      return {...comments};

    default :
      return {...comments};
  }
}

const categoryReducer = (categories = mainState.categories, action) => {
  switch (action.type) {
    case actionType.RECEIVE_CATEGORIES :
      categories = action.categories;
      return categories.filter( item => true);

    default :
      return categories.filter( item => true);
  }
}

export default combineReducers({posts: postsReducer, categories: categoryReducer, comments: commentReducer});
