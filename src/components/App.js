import React, { Component } from 'react';
import './App.css';
import '../font.css';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchCatogeries, fetchPosts, fetchComments } from '../actions';
import HomeView from './HomeView.js';
import AddPost from './AddPost.js';
import ViewPost from './ViewPost.js';

class App extends Component {
  //Flag
  isCommentRequested = false;  

  /**
  * @description - Do dispatch calls getAllCategories & getAllPosts
  * @description - Carries HTML
  * @lifeCycle
  * @returns null
  */
  componentDidMount = () => {
    if (!this.props.isInitialized) {
      this.props.getAllCategories();
      this.props.getAllPosts();
    }
    return null;
  };
  
  /**
  * @description - Massages the recieved state 
  * @description - Makes get-comments calls for each post
  * @lifeCycle
  * @returns null
  */  
  componentWillReceiveProps = newProps => {
    if (!_.isEmpty(newProps.posts)) {
      if (!this.isCommentRequested) {
        newProps.posts.map(post => this.props.getAllComments(post.id));
        this.isCommentRequested = true;
      }
    }
    return null;
  };

  /**
  * @description - Renderer for this component
  * @description - Carries HTML
  * @lifeCycle
  * @returns html template
  */
  render() {
    return(
          <div className="App">
             <Route path="/" exact render={(windowCtx) =>
                (
                <HomeView
                   match
                   location={windowCtx.location}
                   history={windowCtx.history}>
                   >
                </HomeView>
                )}>
             </Route>
             <Route path="/addpost" exact render={(windowCtx, categories) =>
                (
                <AddPost
                   match
                   location={windowCtx.location}
                   history={windowCtx.history}>
                </AddPost>
                )}>
             </Route>
             <Route path="/viewpost/:postid" render={(windowCtx) =>
                (
                <ViewPost
                   match
                   location={windowCtx.location}
                   history={windowCtx.history}>
                </ViewPost>
                )}>
             </Route>
          </div>
    );
  }
}

/**
* @description - Maps updated state to props of this component
* @callBack
* @param {object} state - state from store
* @param {object} propsFromParent - props pushed from parent component
* @returns state
*/
const mapStateToProps = (state, propsFromParent) => state;

/**
* @description - Maps action dispatchers to props of this component
* @callBack
* @param {object} dispatch - dispatch from store
* @returns object containing dispatchers
*/
const mapDispatchToProps = dispatch => ({
  getAllPosts: () => dispatch(fetchPosts()),
  getAllCategories: () => dispatch(fetchCatogeries()),
  getAllComments: postId => dispatch(fetchComments(postId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
