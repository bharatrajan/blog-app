import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import util from '../utils/utils.js';
import Modal from 'react-modal'
import EditComment from './EditComment.js';
import { deleteCommentAPI, voteCommentApi } from '../actions';
import VoteDown from 'react-icons/lib/fa/angle-down';
import VoteUp from 'react-icons/lib/fa/angle-up';
import EditButton from 'react-icons/lib/ti/edit';
import DeleteButton from 'react-icons/lib/ti/delete';

class CommentCard extends Component {
  state={
    isCommentModalOpen:false
  };

  upDownArrowStyle = {
    paddingRight : "7px",
    cursor: "pointer"
  };

  buttonStyle = {
    cursor: "pointer"
  };

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
        <div className="comment-card display-flex">
          <div className="actions">
            <DeleteButton  onClick={()=> deleteComment(comment.id)} size={35} style={this.buttonStyle}/>
            <EditButton onClick={()=> this.setState({ isCommentModalOpen:true })} size={35} style={this.buttonStyle}/>
          </div>        
          <div className="comment">  
            <div> <b>{comment.author}</b> says, {comment.body} </div>
            <div> <i>Created at</i> {util.ts2Time(comment.timestamp)}</div> 
          </div>  
          <div className="vote">
            <VoteUp onClick={()=> this.changeVote(comment.id, "upVote")} size={35} style={this.upDownArrowStyle}/>
            <div> Vote({comment.voteScore})</div>          
            <VoteDown onClick={()=> this.changeVote(comment.id, "downVote")} size={35} style={this.upDownArrowStyle}/>
          </div>

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
