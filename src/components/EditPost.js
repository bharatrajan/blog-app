import React, { Component } from 'react';
import _ from 'lodash';
import serializeForm from 'form-serialize';
import { connect } from 'react-redux';
import { editPostApi } from '../actions';
import { withRouter } from 'react-router-dom';

class EditPost extends Component {
  /**
  * @description - State for this component .
  * @description - Carry validation state of internal form
  * @type object
  */
  state = {
    validationResults: {},
  };

  /**
  * @description - Triggered when user hits ADD button.
  * @description - Validates the form and makes action dispatcher call
  * @eventListener
  * @param {object} event - click event from form
  * @returns null
  */  
  _submitForm = event => {
    event.preventDefault();
    event.stopPropagation();
    const postData = serializeForm(this.formEl, { hash: true });

    let validationResults = {
      isTitleInvalid: _.isEmpty(postData['title']),
      isBodyInvalid: _.isEmpty(postData['body']),
    };

    if (!validationResults.isTitleInvalid && !validationResults.isBodyInvalid) {
      this.props.editPost(this.props.post.id, {
        ...postData,
      });
      this.setState({
        validationResults: {},
      });
      this._closeModel();
    } else this.setState({ validationResults });
    return null;
  };

  /**
  * @description - Closes this modal
  * @callback
  * @returns null
  */  
  _closeModel = () => {
    this.props.closeModal();
    return null;
  };

  /**
  * @description - Renderer for this component
  * @description - Carries HTML
  * @lifeCycle
  * @returns html template
  */  
  render() {
    const { post } = this.props;
    const { validationResults } = this.state;

    if (_.isEmpty(post)) return <div />;

    return (
      <div className="edit-post display-flex justify-center">
         <form className="edit-post-form" onSubmit={this._submitForm}  ref={(formEl) =>
            { this.formEl = formEl; }}>
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

/**
* @description - Maps action dispatchers to props of this component
* @callBack
* @param {object} dispatch - dispatch from store
* @returns object containing dispatchers
*/
const mapDispatchToProps = dispatch => ({
  editPost: (postId, updatedPost) => dispatch(editPostApi(postId, updatedPost)),
});

export default withRouter(connect(() => ({}), mapDispatchToProps)(EditPost));
