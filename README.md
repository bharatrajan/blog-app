## Blog App 

[`DEMO`](http://bharat-blog-app-using-react-redux.mybluemix.net)

This project contains the following functionalities
- User views the list of available blogs
- User can create a new blog
- User views detailed view, which includes comments, of 1 blog, upon selection. 

## To Run the Locally
- npm i
- yarn start

## Imports
- react-redux :: For state maintainence 
- react-router-dom :: For app routing
- fetch :: For making api calls
- form-serialize :: To serialize form input
- react-icons :: For icons
- lodash :: For array maniplation
- react-modal :: For edit views

## Backend Server
  - Backend server is written in node. File : `server.js`
  - All the data are static to the backend server
  - So a restart of the REST API will clear out any data that was submitted to the API

## NPM scripts
  - To start development server : `npm run start-dev`
  - To prod development server : `npm run start`
  - To test : `npm run test`
  - To build : `npm run build`
  - To deploy : `npm run deploy`
