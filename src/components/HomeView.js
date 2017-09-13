import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from '../utils/utils.js';
import { getAllPosts } from '../actions';
import {withRouter} from 'react-router-dom';
class HomeView extends Component {


  state = {
    sortList : [{
      "label": "vote",
      "field": "voteScore"
    }, {
      "label": "created date",
      "field": "timestamp"
    }],
    selectedSortOption: "voteScore",
    commentCount:{}
  }

  _viewPost = postId => {
    this.props.history.push(`/viewpost/${postId}`);
  }

  _sortPost = sortOption => {
      this.setState({
        "selectedSortOption": sortOption
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

  _computeCommentCount = (postId) => {
    if(_.isEmpty(this.props.comments) || _.isEmpty(this.props.comments[postId])) return 0;
    let commentsForPosts = this.props.comments[postId];
    let enabledCommentsForPosts = commentsForPosts.filter( comment => !comment.deleted );
    return enabledCommentsForPosts.length;
  }

  render() {
    if(_.isEmpty(this.props.categories) || _.isEmpty(this.props.posts)) return(<div> Loading . . . </div>);

    const {categories} = this.props;
    const {sortList, selectedSortOption} = this.state;
    const posts = _.orderBy(this.props.posts, [selectedSortOption],['desc']);
    

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
                    <li className="post-item" key={index}
                        hidden={post.deleted}
                        onClick={()=> this._viewPost(post.id)}>
                        <div> {post.title} </div>
                        <div> {post.body} </div>
                        <div> Created at : {util.ts2Time(post.timestamp)} </div>
                        <div> Votes : {post.voteScore}</div>
                        <div> Comments :  {this._computeCommentCount(post.id)}</div>
                        <br/>
                        <br/>
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
          <div onClick={() => this.props.history.push("/addpost")}> {"+"} </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, propsFromParent) => state;
const mapDispatchToProps = dispatch => ({
  getAllPosts : () => dispatch(getAllPosts()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeView));
