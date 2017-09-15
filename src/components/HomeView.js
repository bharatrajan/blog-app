import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from '../utils/utils.js';
import { getAllPosts, votePostApi } from '../actions';
import { withRouter } from 'react-router-dom';
import PlusCircle from 'react-icons/lib/fa/plus-circle';
import VoteDown from 'react-icons/lib/fa/angle-down';
import VoteUp from 'react-icons/lib/fa/angle-up';

class HomeView extends Component {
  //Local state
  state = {
    sortList: [
      {
        label: 'vote',
        field: 'voteScore',
      },
      {
        label: 'created date',
        field: 'timestamp',
      },
    ],
    selectedSortOption: 'voteScore',
    selectedFilterOption: 'all',
    commentCount: {},
  };

  /**
  * @description - Make action-dispatch for changing vote
  * @callBack
  * @param {object} option - body for API call
  * @param {string} postId - Id of the post whose vote is getting changed
  * @returns null
  */
  changeVote = (postId, option) => this.props.votePost(postId, { option });

  /**
  * @description - Updates route witht he postId
  * @callBack
  * @param {string} postId - Id of the post who is getting viewed
  * @returns null
  */
  _viewPost = postId => this.props.history.push(`/viewpost/${postId}`);

  /**
  * @description - Takes a sort option and sorts list of post. Then updates local-state 
  * @util
  * @param {string} sortOption - "voteScore" | "timeStamp"
  * @returns null
  */
  _sortPost = sortOption => {
    this.setState({
      selectedSortOption: sortOption,
    });
  };

  /**
  * @description - Takes a filterField and filter list of post. Then updates local-state 
  * @util
  * @param {string} filterField - Any field of the catogeries ("react" | "redux" | "udacity")
  * @returns null
  */
  _filterByCategory = filterField => {
    this.setState({
      selectedFilterOption: filterField,
    });
  };

  /**
  * @description - Calculated number of comments available for the post 
  * @util
  * @param {string} postId - id of the post which need the no. comments
  * @returns number of comment for postId
  */
  _computeCommentCount = postId => {
    if (
      _.isEmpty(this.props.comments) ||
      _.isEmpty(this.props.comments[postId])
    )
      return 0;
    let commentsForPosts = this.props.comments[postId];
    let enabledCommentsForPosts = commentsForPosts.filter(
      comment => !comment.deleted
    );
    return enabledCommentsForPosts.length;
  };

  /**
  * @description - Takes the selected option and available options.
  * @description - Options can be sort or filter options.
  * @description - Compute CSS class name for all selectable option. 
  * @description - If option is selected, then only "selectedOption" class name will be added to classList 
  * @util
  * @param {string} selectedOption - Option selected by user
  * @param {string} listOption - List of options available
  * @returns className - A string with the name of css classes
  */
  _computeClassName = (selectedOption, listOption) => {
    let className = 'category-item';
    if (selectedOption === listOption) className += ' selectedOption';
    return className;
  };

  /**
  * @description - Util to check is all the posts are deleted
  * @description - Used in negative use case
  * @util
  * @param {array} postList - array of posts from props
  * @returns boolean 
  */
  _areAllPostsDeleted = postList => {
    let deletedList = postList.filter(post => post.deleted);
    return deletedList.length === postList.length;
  };

  /**
  * @description - Renderer for this component
  * @description - Carries HTML
  * @lifeCycle
  * @returns html template
  */  
  render() {
    if (_.isEmpty(this.props.categories) || _.isEmpty(this.props.posts))
      return <div> Loading . . . </div>;

    let { categories, posts } = this.props;
    const { sortList, selectedSortOption, selectedFilterOption } = this.state;

    if (selectedFilterOption !== 'all')
      posts = posts.filter(post => post.category === selectedFilterOption);

    posts = _.orderBy(posts, [selectedSortOption], ['desc']);

    return (
        <div className="home-view">
           <div className="header"> BLOG POST </div>
           <div className="content display-flex justify-center">
              <div className="filter-col" >
                 <div className="filter-list">
                    <div className={this._computeClassName(selectedFilterOption, 'all')}
                    onClick={()=> this._filterByCategory("all")}>
                    All
                 </div>
                 {categories && (categories.map((category, index) => (
                 <div className={this._computeClassName(selectedFilterOption, category.name)}
                    onClick={()=> this._filterByCategory(category.name)}
                    key={index}> {_.startCase(_.toLower(category.name))}
                 </div>
                 )))}
              </div>
           </div>
           <div className="post-col" >
              <div className="post-list">
                 {!this._areAllPostsDeleted(posts) && (posts.map((post, index) => (
                 <div className="post-item" key={index}
                    hidden={post.deleted}
                    onClick={()=>
                    this._viewPost(post.id)}>
                    <div className="post-wrapper">
                       <div className="post-title"> {post.title} </div>
                       <div className="author-name"><i> By : </i>{post.author} </div>
                       <div> {post.body} </div>
                       <div><i> Created at : </i>{util.ts2Time(post.timestamp)} </div>
                       <div className="right-align">
                          <span onClick={(event)=>
                             {event.preventDefault();
                             event.stopPropagation();
                             this.changeVote(post.id, "downVote")}} >
                             <VoteDown size={50}/>
                          </span>
                          vote({post.voteScore})
                          <span onClick={(event)=>
                             {event.preventDefault();
                             event.stopPropagation();
                             this.changeVote(post.id, "upVote")}} >
                             <VoteUp size={50}/>
                          </span>
                       </div>
                       <div className="right-align"> Comments :  {this._computeCommentCount(post.id)}</div>
                    </div>
                 </div>
                 )))}
                 {this._areAllPostsDeleted(posts) && (
                 <div className="add-post-place-holder" onClick={() => this.props.history.push("/addpost")}>
                    Add some blog ...
                 </div>
                 )}
              </div>
           </div>
           <div className="sort-col" >
              <div className="sort-list">
                 {sortList && (sortList.map((sortItem, index) => (
                 <div className={this._computeClassName(selectedSortOption, sortItem.field)}
                    onClick={()=> this._sortPost(sortItem.field)}
                    key={index}> Sort by {sortItem.label}
                 </div>
                 )))}
              </div>
           </div>
        </div>
        <div>
           <div className="add-icon" onClick={() =>
              this.props.history.push("/addpost")}>
              <PlusCircle size={75}/>
           </div>
        </div>
        </div>
    );
  }
}

/**
* @description - Maps updated state to props of this component
* @callBack
* @param {object} state - state from store
* @param {object} propsFromParent - props pushed from parent component
* @returns categories
*/
const mapStateToProps = (state, propsFromParent) => state;

/**
* @description - Maps action dispatchers to props of this component
* @callBack
* @param {object} dispatch - dispatch from store
* @returns object containing dispatchers
*/
const mapDispatchToProps = dispatch => ({
  getAllPosts: () => dispatch(getAllPosts()),
  votePost: (postId, voteOption) => {
    dispatch(votePostApi(postId, voteOption));
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeView)
);
