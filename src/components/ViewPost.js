import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {Link, withRouter} from 'react-router-dom';
import { addComment , deletePostApi, refreshAction } from '../actions';
import CommentCard from './CommentCard.js';
import serializeForm from 'form-serialize';
import util from '../utils/utils.js';
import Modal from 'react-modal'
import EditPost from './EditPost.js';


class ViewPost extends Component {

  state = {
    commentSortOption : [{
      "label": "vote",
      "field": "voteScore"
    }, {
      "label": "created date",
      "field": "timestamp"
    }],
    isPostModalOpen: false,
    isCommentModalOpen: false,
    commentValidationResults: {}
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
      "comments": _.orderBy(this.state.comments, [sortOption],['desc'])
    });
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
      pathname: newProps.location.pathname
    })

    if(!_.isEmpty(newProps.categories) &&
          !_.isEmpty(newProps.posts)){
            let post = newProps.posts.filter( post => post.id === this.props.match.params.postid );
            this.setState({
              post:post[0],
              categories: newProps.categories
            });
    }

    if(!_.isEmpty(newProps.comments)){
      let comments = newProps.comments[this.props.match.params.postid] || [];
      let enabledComments = comments.filter( comment => !comment.deleted);
      let shouldShowSortOptions = (enabledComments.length !== 0);
      this.setState({
        shouldShowSortOptions,
        comments: _.orderBy(comments, ['voteScore'],['desc'])
      })
    }


  };

  closeModal = () => {};

  render() {
    const {categories, post, comments, commentSortOption, commentValidationResults, shouldShowSortOptions, isPostModalOpen} = this.state;

    if(_.isEmpty(categories)){
      return(<div className="loading-post"></div>)
    }else if( _.isEmpty(post) || post.deleted  ){
      return(<div>
        POST DELETED
        <div>
          <Link to="/"> {"<-"} </Link>
        </div>
        </div>)
    }else{
      return (
        <div className="home-view">

          <span onClick={()=> this.props.deletePost(post.id)}
          > X </span>
          &nbsp;&nbsp;
          <span onClick={()=> this.setState({isPostModalOpen: true})}
          > EDIT </span>

          <br/>
          <br/>

          <div className="sub-header"><u>POST</u></div>
          <div className="post-detail">Title : {post.title} </div>
          <div className="post-detail">Body : {post.body} </div>
          <div className="post-detail">Owner : {post.author} </div>
          <div className="post-detail">Votes : {post.voteScore} </div>
          <div className="post-detail">Created at : {post.time} </div>
          <br/>
          <br/>

          <div className="sub-header"><u>COMMENTS</u></div>
          <form className="add-comment-form" onSubmit={this._submitForm}>
              <fieldset>
                <legend>Add comment</legend>
                <textarea rows="4" cols="50" type="multi" name="body" placeholder="body for comment ..."/>
                <span
                      hidden={!commentValidationResults.isBodyInvalid}
                      className="invalid-form-entry"> Invalid Comment</span>
                <br/>
                <input type="text" name="author" placeholder="author"/>
                <span
                      hidden={!commentValidationResults.isOwnerInvalid}
                      className="invalid-form-entry"> Invalid author name </span>
                <br/>
                <button> Add </button>
              </fieldset>
            </form>

            <br/>
            <br/>

          {shouldShowSortOptions && (
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
          <br/>
          <br/>
          {!_.isEmpty(comments) && (
            comments.map((item, index) =>
              <CommentCard comment={item} key={index} />
            )
          )}

          <div>
            <Link to="/"> {"<-"} </Link>
          </div>

          <Modal
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
      );
    }
  }
}

const mapStateToProps = (state, propsFromParent) => {
  console.log("state", state)
  return state;
};

const mapDispatchToProps = dispatch => ({
  refreshAction : () => dispatch(refreshAction()),
  deletePost : postId => dispatch(deletePostApi(postId)),
  addComment : newComment => dispatch(addComment(newComment))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewPost));
