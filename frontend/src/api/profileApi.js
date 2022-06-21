import axios from 'axios';

const users_url = process.env.REACT_APP_API_URL + "/users";
const vaccines_url = process.env.REACT_APP_API_URL + "/vaccine";

const apiConfig = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;application/json'
}

export const getUserById = id => new Promise((resolve, reject) => {
    axios.get(`${users_url}/${id}`, apiConfig)
        .then(x => resolve(x.data))
        .catch(x => {
            reject(x);
            alert(x);
        })
});

export const updateUserInfo = (id, user) => new Promise((resolve, reject) => {
    axios.put(`${users_url}/${id}`, user, apiConfig)
        .then(x => resolve(x.status))
        .catch(x => {
            reject(x);
            alert(x);
        })
});

export const getVaccines = id => new Promise((resolve, reject) => {
    axios.get(`${vaccines_url}/${id}`, apiConfig)
        .then(x => resolve(x.data))
        .catch(x => {
            reject(x);
            alert(x);
        })
})

export const addVaccine = (id, vaccine) => new Promise((resolve, reject) => {
    axios.post(`${users_url}/${id}/dose`, vaccine, apiConfig)
        .then(x => resolve(x.status))
        .catch(x => {
            reject(x);
            alert(x);
        })
}); 