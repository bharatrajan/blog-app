import * as BlogAPI from '../utils/blog-api.js'
import _ from 'lodash';

export const actionType = {
  RECEIVE_POSTS: 'RECEIVE_POSTS',
  RECEIVE_CATEGORIES: 'RECEIVE_CATEGORIES'
};

export const receiveCategories = categories => ({
  type: actionType.RECEIVE_CATEGORIES,
  categories: categories
});

export const fetchCatogeries = () => dispatch => (
  BlogAPI.getAllCategories().then(
    resp => {
        let categories = resp.categories;
            categories.push({name: "all", path: "all"});
            categories = _.orderBy(categories, ['name'],['asc']);

        return dispatch(receiveCategories(categories));
    }
  )
);



export const receivePosts = posts => ({
  type: actionType.RECEIVE_POSTS,
  posts
});

export const fetchPosts = () => dispatch => (
  BlogAPI.getAllPosts().then(
    posts => {
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
