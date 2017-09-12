import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Modal from 'react-modal'
import EditComment from './EditComment.js';
import { deleteCommentAPI } from '../actions';

class CommentCard extends Component {
  state={
    isCommentModalOpen:false
  }


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
          <div> Created at: {comment.time}</div>
          <div> Votes : {comment.voteScore} ^ V</div>

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
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentCard);
