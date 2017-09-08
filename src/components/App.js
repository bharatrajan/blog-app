import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import AddPost from './AddPost.js';
import HomeView from './HomeView.js';

class App extends Component {

  render() {

    return (
      <div className="App">

      <Route path="/" exact render={(history) => (
        <HomeView history={history}></HomeView>
       )}></Route>

       <Route path="/addpost" exact render={(windowCtx) => (
         <AddPost history={windowCtx.history}></AddPost>
       )}></Route>

      </div>
    );
  }
}

export default App;
