import React, { Component } from 'react';
import _ from 'lodash';
import util from '../utils/utils.js';
import serializeForm from 'form-serialize';
import { connect } from 'react-redux';
import { addPost } from '../actions';
import {withRouter} from 'react-router-dom';



class AddPost extends Component {

  /**
  * @description - State for this component .
  * @description - Carry validation state of internal form
  * @type object
  */
  state = {
    validationResults : {}
  };

  /**
  * @description - Triggered when user hits ADD button.
  * @description - Validates the form and makes action dispatcher call
  * @eventListener
  * @param {object} event - click event from form
  * @returns null
  */
  _submitForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const postData = serializeForm(this.formEl, {hash: true})

    let validationResults = {
      isTitleInvalid: _.isEmpty(postData['title']),
      isBodyInvalid: _.isEmpty(postData['body']),
      isOwnerInvalid: _.isEmpty(postData['owner']),
      isCategoryInvalid: postData['category'] === "Category...",
    }

    if(!validationResults.isTitleInvalid &&
        !validationResults.isBodyInvalid &&
          !validationResults.isOwnerInvalid &&
            !validationResults.isCategoryInvalid){
        this.props.addPost({
          id : util.uuid(),
          timestamp : new Date().getTime(),
          voteScore : 1,
          deleted : false,
          ...postData
        });
        this.setState({
          validationResults: {}
        });
        this.props.history.push("/");
    }else
      this.setState({ validationResults });
    
      return null;  
  }

  /**
  * @description - Renderer for this component
  * @description - Carries HTML
  * @lifeCycle
  * @returns html template
  */
  render() {

    const {categories} = this.props;
    const {validationResults} = this.state;

    return (
          <div className="add-post">
             <div className="header"> ADD NEW POST </div>
             <div className="form-wrapper">
                <form className="add-post-form" onSubmit={this._submitForm} ref={(formEl) =>
                   { this.formEl = formEl; }} >
                   <input type="text" name="title" placeholder="Title for post ..." className="form-el"/>
                   <div className="invalid-indicator">
                      <span
                         hidden={!validationResults.isTitleInvalid}
                         className="invalid-form-entry"> Invalid Title </span>
                   </div>
                   <textarea rows="50" cols="50" type="multi" name="body" placeholder="Body for post ..." className="form-el"/>
                   <div className="invalid-indicator">
                      <span
                         hidden={!validationResults.isBodyInvalid}
                         className="invalid-form-entry"> Invalid Post</span>
                   </div>
                   <input type="text" name="owner" placeholder="Author" className="form-el"/>
                   <div className="invalid-indicator">
                      <span
                         hidden={!validationResults.isOwnerInvalid}
                         className="invalid-form-entry"> Invalid author name </span>
                   </div>
                   <select name="category" defaultValue={"Category..."} className="form-el">
                      <option value={"Category..."} disabled  className="form-el"> Category... </option>
                      {!_.isEmpty(categories) && (
                      categories.map((item, index) =>
                      <option key={index} value={item.name}  className="form-el"> {_.startCase(_.toLower(item.name))} </option>
                      )
                      )}
                   </select>
                   <div className="invalid-indicator">
                      <span
                         hidden={!validationResults.isCategoryInvalid}
                         className="invalid-form-entry"> Invalid Category</span>
                   </div>
                   <div className="justify-space-between display-flex form-button-wrapper">
                      <span onClick={() => this.props.history.push("/")} className="form-button"> Cancel </span>
                      <span onClick={this._submitForm} className="form-button"> Post </span>
                   </div>
                </form>
             </div>
          </div>
    );
  }
}

/**
* @description - Maps updated state to props of this component
* @callBack
* @param {object} state - state from store
* @param {object} propsFromParent - props pushed from parent component
* @returns categories
*/
const mapStateToProps = (state, propsFromParent) => {
  if(!_.isEmpty(state.categories)) return {categories : state.categories};
  return {categories : []}
};

/**
* @description - Maps action dispatchers to props of this component
* @callBack
* @param {object} dispatch - dispatch from store
* @returns object containing dispatchers
*/
const mapDispatchToProps = dispatch => ({
  addPost : (newPost) => dispatch(addPost(newPost))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPost));
