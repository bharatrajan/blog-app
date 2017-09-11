import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import { fetchComments } from '../actions';
import CommentCard from './CommentCard.js';

class ViewPost extends Component {

  state = {
    commentSortOption : [{
      "label": "vote",
      "field": "voteScore"
    }, {
      "label": "created date",
      "field": "timestamp"
    }]
  }

  componentDidMount = () => {
    this.props.getAllComments( this.props.postId );
  };

  _sortComments = (sortOption) => {
    this.setState({
      "comments": _.orderBy(this.state.comments, [sortOption],['desc'])
    });
  }

  componentWillReceiveProps = (newProps) => {

    if(!_.isEmpty(newProps.categories) &&
          !_.isEmpty(newProps.posts)){
            let post = newProps.posts.filter( post => post.id === this.props.postId );
            let comments = newProps.comments[newProps.postId] || [];
            this.setState({
              post:post[0],
              comments: _.orderBy(comments, ['voteScore'],['desc']),
              categories: newProps.categories
            });
    }

  };

  render() {
    const {categories, post, comments, commentSortOption} = this.state;

    if(_.isEmpty(categories) || _.isEmpty(post)){
      return(<div className="loading-post"></div>)
    }else{
      return (
        <div className="home-view">

          <div className="sub-header"><u>POST</u></div>
          <div className="post-detail">Title : {post.title} </div>
          <div className="post-detail">Body : {post.body} </div>
          <div className="post-detail">Owner : {post.author} </div>
          <div className="post-detail">Votes : {post.voteScore} </div>
          <div className="post-detail">Created at : {post.time} </div>
          <br/>
          <br/>

          <div className="sub-header"><u>COMMENTS</u></div>

          {!_.isEmpty(comments) && (
            <div className="sort-col" >
              <ul className="sort-list">
                {commentSortOption.map((sortOption, index) => (
                  <li className="sort-item"
                      onClick={()=> this._sortComments(sortOption.field)}
                      key={index}> Sort by {sortOption.label} </li>
                ))}
              </ul>
            </div>
          )}

          {!_.isEmpty(comments) && (
            comments.map((item, index) =>
              <CommentCard comment={item} key={index} />
            )
          )}

          <div>
            <Link to="/"> {"<-"} </Link>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, propsFromParent) => state;

const mapDispatchToProps = dispatch => ({
  getAllComments : (postId) => dispatch(fetchComments(postId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPost);
