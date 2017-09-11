import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchCatogeries, fetchPosts } from '../actions';
import HomeView from './HomeView.js';
import AddPost from './AddPost.js';
import ViewPost from './ViewPost.js';

class App extends Component {

  componentWillReceiveProps = (newProps) => {

    if(!_.isEmpty(newProps.posts))
      this.setState({
        "isPostsLoaded": true,
        "posts": _.orderBy(newProps.posts, ['voteScore'],['desc'])
      });

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
          categories={this.props.categories}
          posts={this.props.posts}
          history={windowCtx.history}>
        ></HomeView>
       )}></Route>

       <Route path="/addpost" exact render={(windowCtx, categories) => (
         <AddPost
          categories={this.props.categories}
          history={windowCtx.history}>
         </AddPost>
       )}></Route>

       <Route path="/viewpost" render={(windowCtx, postid) => (
         <ViewPost
          postId={"8xf0y6ziyjabvozdd253nd"}
          history={windowCtx.history}>
         </ViewPost>
       )}></Route>

      </div>
    );
  }
}

const mapStateToProps = (state, propsFromParent) => {
  console.log("state", state);
  return state;
};

const mapDispatchToProps = dispatch => ({
  getAllPosts : () => dispatch(fetchPosts()),
  getAllCategories : () => dispatch(fetchCatogeries())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
