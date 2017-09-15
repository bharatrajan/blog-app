import React, { Component } from 'react';
import _ from 'lodash';
import serializeForm from 'form-serialize';
import { connect } from 'react-redux';
import { editPostApi } from '../actions';
import {withRouter} from 'react-router-dom';



class EditPost extends Component {

  state = {
    validationResults : {}
  };

  _submitForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const postData = serializeForm(this.formEl, {hash: true})

    let validationResults = {
      isTitleInvalid: _.isEmpty(postData['title']),
      isBodyInvalid: _.isEmpty(postData['body'])
    }

    if(!validationResults.isTitleInvalid &&
        !validationResults.isBodyInvalid){
        this.props.editPost(this.props.post.id, {
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

    const {post} = this.props;
    const {validationResults} = this.state;

    if(_.isEmpty(post)) return(<div></div>)

    return (
      <div className="edit-post display-flex justify-center">
        <form className="edit-post-form" onSubmit={this._submitForm}  ref={(formEl) => { this.formEl = formEl; }}>
              <legend className="edit-post-sub-header"> EDIT POST </legend>    
              <input type="text" name="title" defaultValue={post.title} placeholder="title for post ..."/>
              <span
                    hidden={!validationResults.isTitleInvalid}
                    className="invalid-form-entry"> Invalid Title </span>
              <textarea rows="4" cols="50" type="multi" name="body" placeholder="body for post ..." defaultValue={post.body}/>
              <span
                    hidden={!validationResults.isBodyInvalid}
                    className="invalid-form-entry"> Invalid Post</span>
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
  editPost : (postId, updatedPost) => dispatch(editPostApi(postId, updatedPost))
});

export default withRouter(connect( ()=>({}) , mapDispatchToProps)(EditPost));
