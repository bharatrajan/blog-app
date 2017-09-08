import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import { addpost } from './addpost.js';
import { homeview } from './homeview.js';

class App extends Component {

  render() {

    return (
      <div className="App">

      <Route path="/" exact render={(history) => (
        <homeview></homeview>
       )}></Route>

       <Route path="/addpost" exact render={(windowCtx) => (
         <addpost></addpost>
       )}></Route>

      </div>
    );
  }
}

export default App;
