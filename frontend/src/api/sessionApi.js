import axios from 'axios';

const url = "http://localhost:8000";

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