import axios from 'axios';

const configured = axios.create({
    baseURL: '/api/',
    timeout: 30000
});

export default configured;
