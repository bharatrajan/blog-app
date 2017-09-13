import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from '../utils/utils.js';
import Modal from 'react-modal'
import EditComment from './EditComment.js';
import { deleteCommentAPI, voteCommentApi } from '../actions';

class CommentCard extends Component {
  state={
    isCommentModalOpen:false
  }

  changeVote = (commentId, option) => {
    this.props.voteComment(commentId, {option})
  };

  render() {
    const {comment, deleteComment} = this.props;
    const {isCommentModalOpen} = this.state
    if(_.isEmpty(comment) || comment.deleted){
      return(<div className=""></div>)
    }else{
      return (
        <div className="comment-card">
          <span
          onClick={()=> deleteComment(comment.id)}
          > X </span>

          <span
          onClick={()=> this.setState({ isCommentModalOpen:true })}
          > EDIT </span>

          <div> {comment.author} says {comment.body} </div>
          <div> Created at: {util.ts2Time(comment.timestamp)}</div>
          <div> Vote : {comment.voteScore}</div>
          <div>
            <span onClick={()=> this.changeVote(comment.id, "downVote")} > V </span>
            <span onClick={()=> this.changeVote(comment.id, "upVote")} > ^ </span>
          </div>
          <br/>
          <br/>

          <Modal
            className='modal'
            overlayClassName='overlay'
            isOpen={isCommentModalOpen}
            onRequestClose={this.closeModal}
            contentLabel='Modal'>
            {(isCommentModalOpen &&
              <EditComment comment={comment} closeModal={()=> this.setState({isCommentModalOpen: false})}/>
            )}
          </Modal>

        </div>
      );
    }
  }
}

const mapStateToProps = (state, propsFromParent) => state;

const mapDispatchToProps = dispatch => ({
  deleteComment : (commentId) => dispatch(deleteCommentAPI(commentId)),
  voteComment : (commentId, voteOption) => {dispatch(voteCommentApi(commentId, voteOption))}
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentCard);
