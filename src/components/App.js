import React, { Component } from 'react';
import './App.css';
import '../font.css';
import {Route, withRouter} from 'react-router-dom';
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

  render() {
    return (
      <div className="App">

      <Route path="/" exact render={(windowCtx) => (
        <HomeView
          match
          location={windowCtx.location}
          history={windowCtx.history}>
        ></HomeView>
       )}></Route>

       <Route path="/addpost" exact render={(windowCtx, categories) => (
         <AddPost
          match
          location={windowCtx.location}
          history={windowCtx.history}>
         </AddPost>
       )}></Route>

       <Route path="/viewpost/:postid" render={(windowCtx) => (
         <ViewPost
          match
          location={windowCtx.location}
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
