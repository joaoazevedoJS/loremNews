import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL,
});

export default api;
