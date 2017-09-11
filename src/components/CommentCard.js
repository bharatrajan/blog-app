import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { deleteCommentAPI } from '../actions';

class CommentCard extends Component {

  render() {
    const {comment, deleteComment} = this.props;

    if(_.isEmpty(comment) || comment.deleted){
      return(<div className=""></div>)
    }else{
      return (
        <div className="comment-card">
          <div
          onClick={()=> deleteComment(comment.id)}
          > X </div>
          <div> {comment.body} </div>
          <div> {comment.author} </div>
          <div> {comment.voteScore} </div>
          <br/>
          <br/>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, propsFromParent) => state;

const mapDispatchToProps = dispatch => ({
  deleteComment : (commentId) => dispatch(deleteCommentAPI(commentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentCard);
