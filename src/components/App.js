import React, { Component } from 'react';
import './App.css';
import {Route, withRouter, matchPath} from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchCatogeries, fetchPosts, fetchComments } from '../actions';
import HomeView from './HomeView.js';
import AddPost from './AddPost.js';
import ViewPost from './ViewPost.js';

class App extends Component {

  isCommentRequested = false;

  componentWillReceiveProps = (newProps) => {

    if(!_.isEmpty(newProps.posts)){
      this.setState({
        "posts": _.orderBy(newProps.posts, ['voteScore'],['desc'])
      });

      if(!this.isCommentRequested){
        newProps.posts.map( post => this.props.getAllComments(post.id));
        this.isCommentRequested = true;
      }
    }

    if(!_.isEmpty(newProps.categories))
      this.setState({
        categories: newProps.categories
      });

  };

  componentDidMount = () => {
    if(!this.props.isInitialized){
      this.props.getAllCategories();
      this.props.getAllPosts();
    }
    return null;
  };

  _getPostId = pathname => {
    const match = matchPath(pathname, {
      path: '/viewpost/:postid',
      exact: true,
      strict: false
    });
    return match.params.postid;
  }

  render() {
    return (
      <div className="App">

      <Route path="/" exact location={window.location} render={(windowCtx) => (
        <HomeView
          location={windowCtx.location}
          history={windowCtx.history}>
        ></HomeView>
       )}></Route>

       <Route path="/addpost" exact location={window.location} render={(windowCtx, categories) => (
         <AddPost
          history={windowCtx.history}>
         </AddPost>
       )}></Route>

       <Route path="/viewpost/:postid" location={window.location} render={(windowCtx) => (
         <ViewPost
          postId={this._getPostId(windowCtx.location.pathname)}
          history={windowCtx.history}>
         </ViewPost>
       )}></Route>

      </div>
    );
  }
}

const mapStateToProps = (state, propsFromParent) => state;

const mapDispatchToProps = dispatch => ({
  getAllPosts : () => dispatch(fetchPosts()),
  getAllCategories : () => dispatch(fetchCatogeries()),
  getAllComments: postId => dispatch(fetchComments(postId))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
