import axios from 'axios';

export function post({...params}) {
  return axios.post(`http://localhost:3000/api/v1/${params.path}`, params.formData, params.headers)
  .catch((error) => error.response)
}

export function get({...params}) {
  return axios.get(`http://localhost:3000/api/v1/${params.path}`, params.headers)
  .catch((error) => error.response)
}

// console.log(response.headers);
// console.log(response.request);
// console.log(response.data);

// console.log(error.response.data.errors);
// setAlerts(arr => error.response.data.errors);
// console.log(alerts);

  // .then((rep) => {
  //   response = rep
  // }).catch((error) => {
  //   console.log('111', error.response)
  //   response = error.response
  // });
