import React, { Component } from 'react';
import _ from 'lodash';
import util from '../utils/utils.js';
import serializeForm from 'form-serialize';
import { connect } from 'react-redux';
import { addPost, refreshAction } from '../actions';
import {Link, withRouter} from 'react-router-dom';



class AddPost extends Component {

  state = {
    validationResults : {}
  };

  componentDidMount = () => {
    console.log("componentDidMount")
    this.forceUpdate()
  };

  _submitForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const postData = serializeForm(event.target, {hash: true})

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
  }

  componentWillReceiveProps = (newProps) => {

    if(!_.isEmpty(newProps.categories))
      this.setState({
        categories: newProps.categories
      });

  };

  render() {

    const {categories, validationResults} = this.state;

    return (
      <div className="add-post">
        <form className="add-post-form" onSubmit={this._submitForm}>
            <fieldset>
              <legend>Post details</legend>
              <input type="text" name="title" placeholder="title for post ..."/>
              <span
                    hidden={!validationResults.isTitleInvalid}
                    className="invalid-form-entry"> Invalid Title </span>
              <br/>
              <textarea rows="4" cols="50" type="multi" name="body" placeholder="body for post ..."/>
              <span
                    hidden={!validationResults.isBodyInvalid}
                    className="invalid-form-entry"> Invalid Post</span>
              <br/>
              <input type="text" name="owner" placeholder="author"/>
              <span
                    hidden={!validationResults.isOwnerInvalid}
                    className="invalid-form-entry"> Invalid author name </span>
              <br/>
              <select name="category" defaultValue={"Category..."}>
              <option value={"Category..."} disabled> Category... </option>
              {!_.isEmpty(categories) && (
                categories.map((item, index) =>
                  <option key={index} value={item.name}> {_.startCase(_.toLower(item.name))} </option>
                )
              )}
              </select>
              <span
                    hidden={!validationResults.isCategoryInvalid}
                    className="invalid-form-entry"> Invalid Category</span>
              <br/>
              <button> Post </button>
            </fieldset>
          </form>
          <div>
            <div onClick={() => {
              this.props.history.push("/")
              this.props.refreshAction()}}
            > {"<-"} </div>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state, propsFromParent) => {
  if(!_.isEmpty(state.categories)) return {categories : state.categories};
  return {categories : []}
};

const mapDispatchToProps = dispatch => ({
  refreshAction : () => dispatch(refreshAction()),
  addPost : (newPost) => dispatch(addPost(newPost))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPost));
