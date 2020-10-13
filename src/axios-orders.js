import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burgerbuilder-71595.firebaseio.com/',
});

export default instance;