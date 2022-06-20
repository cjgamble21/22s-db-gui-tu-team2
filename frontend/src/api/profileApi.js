import axios from 'axios';

const users_url = process.env.REACT_APP_API_URL + "/users";

const apiConfig = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;application/json'
}

export const addVaccine = user => new Promise((resolve, reject) => {
    axios.post(`${url}/${user.name}/dose`, user, apiConfig)
        .then(x => resolve(x.data))
        .catch(x => {
            reject(x);
            alert(x);
        })
}); 