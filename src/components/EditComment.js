import React, { Component } from 'react';
import _ from 'lodash';
import serializeForm from 'form-serialize';
import { connect } from 'react-redux';
import { editCommentApi } from '../actions';
import {withRouter} from 'react-router-dom';



class EditComment extends Component {

  state = {
    validationResults : {}
  };

  _submitForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const postData = serializeForm(this.formEl, {hash: true})

    let validationResults = {
      isBodyInvalid: _.isEmpty(postData['body'])
    }

    if(!validationResults.isBodyInvalid){
        this.props.editComment(this.props.comment.id, {
          timestamp : new Date().getTime() ,
          ...postData
        });
        this.setState({
          validationResults: {}
        });
        this._closeModel();
    }else
      this.setState({ validationResults });
  }

  _closeModel = () => {
    this.props.closeModal();
  };

  render() {

    const {comment} = this.props;
    const {validationResults} = this.state;

    if(_.isEmpty(comment)) return(<div></div>)

    return (
      <div className="edit-comment display-flex justify-center">
        <form className="edit-comment-form" onSubmit={this._submitForm} ref={(formEl) => { this.formEl = formEl; }}>
            <legend className="edit-comment-sub-header"> EDIT COMMENT </legend>    
            <textarea rows="4" cols="50" type="multi" name="body" placeholder="body for comment ..." defaultValue={comment.body}/>
            <span
                  hidden={!validationResults.isBodyInvalid}
                  className="invalid-form-entry"> Invalid comment</span>

            <div className="justify-space-between display-flex form-button-wrapper">              
              <div onClick={this._submitForm} className="form-button"> Update </div>
              <div onClick={this._closeModel} className="form-button"> Cancel </div>
            </div>
        </form>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  editComment : (commentId, updatedComment) => dispatch(editCommentApi(commentId, updatedComment))
});

export default withRouter(connect( ()=>({}) , mapDispatchToProps)(EditComment));
