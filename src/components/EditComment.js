import React, { Component } from 'react';
import _ from 'lodash';
import serializeForm from 'form-serialize';
import { connect } from 'react-redux';
import { editCommentApi } from '../actions';
import { withRouter } from 'react-router-dom';

class EditComment extends Component {
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
      isBodyInvalid: _.isEmpty(postData['body']),
    };

    if (!validationResults.isBodyInvalid) {
      this.props.editComment(this.props.comment.id, {
        timestamp: new Date().getTime(),
        ...postData,
      });
      this.setState({
        validationResults: {},
      });
      this._closeModel();
    } else this.setState({ validationResults });
    return null;    
  };

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
    const { comment } = this.props;
    const { validationResults } = this.state;

    if (_.isEmpty(comment)) return <div />;

    return (
        <div className="edit-comment display-flex justify-center">
           <form className="edit-comment-form" onSubmit={this._submitForm} ref={(formEl) =>
              { this.formEl = formEl; }}>
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

/**
* @description - Maps action dispatchers to props of this component
* @callBack
* @param {object} dispatch - dispatch from store
* @returns object containing dispatchers
*/
const mapDispatchToProps = dispatch => ({
  editComment: (commentId, updatedComment) =>
    dispatch(editCommentApi(commentId, updatedComment)),
});

export default withRouter(connect(() => ({}), mapDispatchToProps)(EditComment));
