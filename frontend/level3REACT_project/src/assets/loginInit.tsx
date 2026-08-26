import axios from 'axios';


// create a connection between the port 8000 and the frontend
// const API = axios.create({
    // baseURL: 'http://localhost:8000',
    // headers: {
        // 'Content-Type': 'application/json',
    // }
// });
// 
// go to /register and post it and return a response.data
// export const registerUser = async(email,password) => {
    // const response = await API.post('/register', {email,password});
    // return response.data
// };
// 
// go to /login and post it and return a response.data
// export const loginUser = async (email,password) => {
    // const response = await API.post('/login', {email,password});
    // return response.data
// };

export const registerUser = async (email, password) => {
    const response = await axios.post(
        'http://localhost:8000/register',
        {email,password},
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
};

export const loginUser = async (email,password) => {
    const response = await axios.post(
        'http://localhost:8000/login',
        {email,password},
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
};