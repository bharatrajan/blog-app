import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
//import * as BlogAPI from '../utils/blog-api.js'
import _ from 'lodash';
import { fetchCatogeries, fetchPosts } from '../actions';


class App extends Component {

  state = {
    isPostsLoaded : false,
    sortList : [{
      "label": "vote",
      "field": "voteScore"
    }, {
      "label": "created date",
      "field": "timestamp"
    }]
  }

  componentWillReceiveProps = (newProps) => {

    if(newProps.posts &&
        newProps.posts.length &&
          newProps.posts.length != 0){
      this.setState({
        "isPostsLoaded": true,
        posts: newProps.posts
      });
    }

    if(newProps.categories &&
        newProps.categories.length &&
          newProps.categories.length != 0){
      this.setState({
        categories: newProps.categories
      });
    }
  };

  componentDidMount = () => {
    this.props.getAllCategories();
    this.props.getAllPosts();
    return null;
  };

  render() {
    const {categories, posts, sortList} = this.state;

    return (
      <div className="App">
        <div className="filter-col" >
          <ul className="filter-list">
            {categories && (categories.map((category, index) => (
              <li className="category-item" key={index}> {_.startCase(_.toLower(category.name))} </li>
            )))}
          </ul>
        </div>
        <div className="post-col" >
          <ul className="post-list">
          {posts && (posts.map((post, index) => {
              console.log("post", post);
              return <li className="post-item" key={index} hidden={post.deleted}> {post.title} </li>
          }))}
          </ul>
        </div>
        <div className="sort-col" >
          <ul className="sort-list">
            {sortList && (sortList.map((sortItem, index) => (
              <li className="sort-item" key={index}> Sort by {sortItem.label} </li>
            )))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, propsFromParent) => state;

const mapDispatchToProps = dispatch => ({
  getAllPosts : () => dispatch(fetchPosts()),
  getAllCategories : () => dispatch(fetchCatogeries())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
