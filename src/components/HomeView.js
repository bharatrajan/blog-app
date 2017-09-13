import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from '../utils/utils.js';
import { getAllPosts, votePostApi } from '../actions';
import {withRouter} from 'react-router-dom';
import PlusCircle from 'react-icons/lib/fa/plus-circle';
import VoteDown from 'react-icons/lib/fa/angle-down';
import VoteUp from 'react-icons/lib/fa/angle-up';

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
    selectedFilterOption: "all",
    commentCount:{}
  };
  
  changeVote = (postId, option) => {
    this.props.votePost(postId, {option})
  };

  _viewPost = postId => {
    this.props.history.push(`/viewpost/${postId}`);
  }

  _sortPost = sortOption => {
    this.setState({
      "selectedSortOption": sortOption
    });
  };

  _filterByCategory = filterField => {
    this.setState({
      "selectedFilterOption": filterField
    });
  };

  _computeCommentCount = (postId) => {
    if(_.isEmpty(this.props.comments) || _.isEmpty(this.props.comments[postId])) return 0;
    let commentsForPosts = this.props.comments[postId];
    let enabledCommentsForPosts = commentsForPosts.filter( comment => !comment.deleted );
    return enabledCommentsForPosts.length;
  }

  _computeClassName = (selectedOption, listOption) => {
    let className = "category-item";
    if(selectedOption === listOption) className += " selectedOption";
    return className;
  }

  render() {
    if(_.isEmpty(this.props.categories) || _.isEmpty(this.props.posts)) return(<div> Loading . . . </div>);

    let {categories, posts} = this.props;
    const {sortList, selectedSortOption, selectedFilterOption} = this.state;
    
    if(selectedFilterOption !== 'all')
      posts = posts.filter(post => post.category === selectedFilterOption)

    posts = _.orderBy(posts, [selectedSortOption],['desc']);

    return (
      <div className="home-view">
        <div className="home-view-header"> BLOG POST </div>
        <div className="content display-flex justify-center">
          <div className="filter-col" >
            <div className="filter-list">
              <div className={this._computeClassName(selectedFilterOption, 'all')}
                  onClick={()=> this._filterByCategory("all")}>
                  All </div>
              {categories && (categories.map((category, index) => (
                <div className={this._computeClassName(selectedFilterOption, category.name)}
                    onClick={()=> this._filterByCategory(category.name)}
                    key={index}> {_.startCase(_.toLower(category.name))} </div>
              )))}
            </div>
          </div>
          <div className="post-col" >
            <div className="post-list">
            {posts && (posts.map((post, index) => (
                      <div className="post-item" key={index}
                          hidden={post.deleted}
                          onClick={()=> this._viewPost(post.id)}>
                          <div className="post-wrapper">
                              <div className="post-title"> {post.title} </div>
                              <div> {post.body} </div>
                              <div><i> Created at : {util.ts2Time(post.timestamp)} </i></div>
                              <div className="right-align"> 
                                <span onClick={(event)=> {event.preventDefault();
                                                          event.stopPropagation();  
                                                          this.changeVote(post.id, "downVote")}} > <VoteDown size={50}/> </span>
                                vote({post.voteScore})                                                      
                                <span onClick={(event)=> {event.preventDefault();
                                                          event.stopPropagation();
                                                          this.changeVote(post.id, "upVote")}} > <VoteUp size={50}/> </span>                            
                              </div>
                              <div className="right-align"> Comments :  {this._computeCommentCount(post.id)}</div>
                            </div>      
                      </div>
            )))}
            </div>
          </div>
          <div className="sort-col" >
            <div className="sort-list">
              {sortList && (sortList.map((sortItem, index) => (
                <div className={this._computeClassName(selectedSortOption, sortItem.field)}
                    onClick={()=> this._sortPost(sortItem.field)}
                    key={index}> Sort by {sortItem.label} </div>
              )))}
            </div>
          </div>
         </div> 
         
         <div>
          <div className="add-icon" onClick={() => this.props.history.push("/addpost")}> <PlusCircle size={50}/> </div>
         </div>
      </div>
    );
  }
}

const mapStateToProps = (state, propsFromParent) => state;
const mapDispatchToProps = dispatch => ({
  getAllPosts : () => dispatch(getAllPosts()),
  votePost : (postId, voteOption) => {dispatch(votePostApi(postId, voteOption))}  
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeView));
