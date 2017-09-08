import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import { fetchCatogeries, fetchPosts } from '../actions';

class HomeView extends Component {

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

  _sortPost = sortOption => {
      this.setState({
        "posts": _.orderBy(this.state.posts, [sortOption],['desc'])
      });
  };

  _filterByCategory = filterField => {
    if(filterField === 'all'){
      this.setState({
        "posts": this.props.posts
      });
      return null;
    }

    let filteredPosts = [];
        filteredPosts = this.props.posts.filter( post => {
          return post.category === filterField
        });

    this.setState({
      "posts": filteredPosts
    });
  };

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
    const {categories, posts, sortList} = this.state;

    return (
      <div className="home-view">

        <div className="filter-col" >
          <ul className="filter-list">
            <li className="category-item"
                onClick={()=> this._filterByCategory("all")}>
                All </li>
            {categories && (categories.map((category, index) => (
              <li className="category-item"
                  onClick={()=> this._filterByCategory(category.name)}
                  key={index}> {_.startCase(_.toLower(category.name))} </li>
            )))}
          </ul>
        </div>
        <div className="post-col" >
          <ul className="post-list">
          {posts && (posts.map((post, index) => (
                    <li className="post-item" key={index} hidden={post.deleted}>
                        <div> {post.title} </div>
                        <div> {post.body} </div>
                        <div> {post.time} </div>
                        <div> {post.voteScore} </div>
                    </li>
          )))}
          </ul>
        </div>
        <div className="sort-col" >
          <ul className="sort-list">
            {sortList && (sortList.map((sortItem, index) => (
              <li className="sort-item"
                  onClick={()=> this._sortPost(sortItem.field)}
                  key={index}> Sort by {sortItem.label} </li>
            )))}
          </ul>
        </div>

        <div>
          <Link to="/addpost"> + </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
