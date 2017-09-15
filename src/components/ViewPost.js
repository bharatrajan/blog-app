import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {Link, withRouter} from 'react-router-dom';
import { addComment , deletePostApi, votePostApi } from '../actions';
import CommentCard from './CommentCard.js';
import serializeForm from 'form-serialize';
import util from '../utils/utils.js';
import Modal from 'react-modal'
import EditPost from './EditPost.js';
import VoteDown from 'react-icons/lib/fa/angle-down';
import VoteUp from 'react-icons/lib/fa/angle-up';
import BackButton from 'react-icons/lib/fa/arrow-circle-left';
import EditButton from 'react-icons/lib/ti/edit';
import DeleteButton from 'react-icons/lib/ti/delete';

class ViewPost extends Component {

  state = {
    commentSortOption : [{
      "label": "vote",
      "field": "voteScore"
    }, {
      "label": "created date",
      "field": "timestamp"
    }],
    selectedCommentSortOption: "voteScore",
    isPostModalOpen: false,
    isCommentModalOpen: false,
    commentValidationResults: {}
  };

  buttonStyle={
    cursor: "pointer",
    fill: "#cacaca"
  };

  upDownArrowStyle={
    cursor: "pointer",    
    paddingRight: "5px"
  }

  _submitForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const postData = serializeForm(event.target, {hash: true})

    let commentValidationResults = {
      isBodyInvalid: _.isEmpty(postData['body']),
      isOwnerInvalid: _.isEmpty(postData['author'])
    }

    if(!commentValidationResults.isBodyInvalid &&
          !commentValidationResults.isOwnerInvalid ){
        const newCommentBody = {
          id : util.uuid(),
          parentId: this.props.match.params.postid,
          timestamp : new Date().getTime() ,
          voteScore : 1,
          deleted : false,
          parentDeleted: false,
          ...postData
        };
        this.props.addComment(newCommentBody);
        this.setState({
          commentValidationResults: {}
        });
        event.target.reset();
    }else
      this.setState({ commentValidationResults });
  }

  _sortComments = (sortOption) => {
    this.setState({
      "selectedCommentSortOption": sortOption
    });
  }

  changeVote = (postId, option) => {
    this.props.votePost(postId, {option})
  };

  closeModal = () => {};

  shouldComponentUpdate(nextProps, nextState) {
    return ( !_.isEmpty(nextProps.posts) || !_.isEmpty(nextProps.categories) )
  }

  _computeClassName = (selectedOption, listOption) => {
    let className = "category-item";
    if(selectedOption === listOption) className += " selectedOption";
    return className;
  }  

  render() {
    const {categories, posts, comments} = this.props;
    const {commentSortOption, commentValidationResults, isPostModalOpen, selectedCommentSortOption} = this.state;
    const post = posts.filter( post => post.id === this.props.match.params.postid )[0]
    const commentsForThisPost = comments[this.props.match.params.postid] || [];
    const enabledCommentsForThisPost = commentsForThisPost.filter( comment => !comment.deleted);
    const areCommentsSortSortable = (enabledCommentsForThisPost.length !== 0); 
    const sortedCommentsList = _.orderBy(enabledCommentsForThisPost, [selectedCommentSortOption],['desc'])
    
    
    if(_.isEmpty(post) || post.deleted){
      return(
        <div className="view-post-view">      
          <div className="header display-flex justify-space-between"> 
            <div> <Link to="/"><BackButton size={42.5} style={this.buttonStyle} /></Link></div>        
            <div className="header-text"> POST DELETED</div>
            <div>
            </div>
          </div> 
        </div>  
      )
    }
    
    return (
      <div className="view-post-view">
          <div className="header display-flex justify-space-between"> 
            <div> <Link to="/"><BackButton size={42.5} style={this.buttonStyle} /></Link></div>        
            <div className="header-text"> POST </div>
            <div>
              <DeleteButton size={50} style={this.buttonStyle} span onClick={()=> this.props.deletePost(post.id)}/> 
              <EditButton size={50} style={this.buttonStyle} onClick={()=> this.setState({isPostModalOpen: true})}/> 
            </div>
          </div>    
          <div className="view-post-content">
            <div className="post-title">{post.title} </div>
            <div className="post-detail">{post.body} </div>
            <div className="post-detail"><i>Owner : </i>{post.author} </div>
            <div className="post-detail"><i>Created at</i> : {util.ts2Time(post.timestamp)} </div>
            <div className="vote">
              <VoteUp onClick={()=> this.changeVote(post.id, "upVote")} size={50} style={this.upDownArrowStyle}/>
              <div className="post-detail">votes({post.voteScore}) </div>
              <VoteDown onClick={()=> this.changeVote(post.id, "downVote")} size={50} style={this.upDownArrowStyle}/>
            </div>
            <br/>
            <br/>

            <div className="comment-sub-header">COMMENTS</div>
            <form className="add-comment-form" onSubmit={this._submitForm}>
                <textarea rows="4" cols="50" type="multi" name="body" placeholder="body for comment ..." className="form-el"/>
                <div className="invalid-indicator">  
                  <span hidden={!commentValidationResults.isBodyInvalid}
                      className="invalid-form-entry"> Invalid Comment</span>
                </div>
                <input type="text" name="author" placeholder="author" className="form-el"/>
                <div className="invalid-indicator">
                <span hidden={!commentValidationResults.isOwnerInvalid}
                      className="invalid-form-entry"> Invalid author name </span>
                </div>
                <button className="form-button" > Add </button>
              </form>

              <br/>
              <br/>

            {areCommentsSortSortable && (
              <div className="comment-sort-col display-flex" >
                  {commentSortOption.map((sortOption, index) => (
                    <div key={index} onClick={()=> this._sortComments(sortOption.field)}
                         className={this._computeClassName(selectedCommentSortOption, sortOption.field)}>
                      <span className="sort-item"> Sort by {sortOption.label} </span>
                    </div>    
                  ))}
              </div>
            )}
            <div className="comments">
              {!_.isEmpty(sortedCommentsList) && (
                sortedCommentsList.map((item, index) =>
                  <CommentCard comment={item} key={index} />
                )
              )}
            </div>  
            <Modal
              id="editPostModal"
              className='modal'
              overlayClassName='overlay'
              isOpen={isPostModalOpen}
              onRequestClose={this.closeModal}
              contentLabel='Modal'>
              {(isPostModalOpen &&
                <EditPost post={post} closeModal={()=> this.setState({isPostModalOpen: false})} />
              )}
            </Modal>
         </div>     
      </div>
    );
  }
}

const mapStateToProps = (state, propsFromParent) => state;

const mapDispatchToProps = dispatch => ({
  deletePost : postId => dispatch(deletePostApi(postId)),
  addComment : newComment => dispatch(addComment(newComment)),
  votePost : (postId, voteOption) => {dispatch(votePostApi(postId, voteOption))}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewPost));
