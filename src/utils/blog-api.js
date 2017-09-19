let api = '/api';
if(window.location.hostname.indexOf("localhost") > -1)
  api = 'http://localhost:3001/api';

// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token;
if (!token) token = localStorage.token = Math.random().toString(36).substr(-8);

const headers = {
  Accept: 'application/json',
  Authorization: token,
};

export const getAllCategories = () =>
  fetch(`${api}/categories`, { headers })
    .then(res => res.json())
    .then(categories => categories);

export const getAllPosts = () =>
  fetch(`${api}/posts`, { headers })
    .then(res => res.json())
    .then(posts => posts);

export const getPostsInCategory = category =>
  fetch(`${api}/${category}/posts`, { headers })
    .then(res => res.json())
    .then(posts => posts);

export const editPostApi = (postId, body) =>
  fetch(`${api}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(resp => resp);

export const addPost = post =>
  fetch(`${api}/posts`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })
    .then(res => res.json())
    .then(resp => resp);

export const votePost = (postid, body) =>
  fetch(`${api}/posts/${postid}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(resp => resp);

export const deletePost = postId =>
  fetch(`${api}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res)
    .then(resp => resp);

export const getAllComments = postId =>
  fetch(`${api}/posts/${postId}/comments`, { headers })
    .then(res => res.json())
    .then(comments => comments);

export const deleteComment = commentId =>
  fetch(`${api}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(resp => resp);

export const addComment = post =>
  fetch(`${api}/comments`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })
    .then(res => res.json())
    .then(resp => resp);

export const editCommentApi = (commentId, body) =>
  fetch(`${api}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(resp => resp);

export const voteComment = (commentid, body) =>
  fetch(`${api}/comments/${commentid}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(resp => resp);
