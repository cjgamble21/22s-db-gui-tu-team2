import axios from 'axios';

// .env file should have this line: REACT_APP_API_URL=http://localhost:8000
const url = process.env.REACT_APP_API_URL;

const apiConfig = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;application/json'
}

export const loginUser = user => new Promise((resolve, reject) => {
    axios.post(`${url}/session`, user, apiConfig)
        .then(x => resolve(x.data))
        .catch(x => {
            alert(x);
            reject(x);
        })
})

export const registerUser = user => new Promise((resolve, reject) => {
    axios.post(`${url}/users`, user, apiConfig)
        .then(x => {
            resolve(x.status);
            console.log(x.status);
        })
        .catch(x => {
            alert(x.status);
            reject(x.status);
        })
})