import axios from 'axios';

export function post({...params}) {
  return axios.post(`http://localhost:3000/api/v1/${params.path}`, params.formData, params.headers)
  .catch((error) => error.response)
}

export function patch({...params}) {
  return axios.patch(`http://localhost:3000/api/v1/${params.path}`, params.formData, params.headers)
  .catch((error) => error.response)
}

export function destroy({...params}) {
  return axios.delete(`http://localhost:3000/api/v1/${params.path}`, params.headers)
  .catch((error) => error.response)
}

export function get({...params}) {
  return axios.get(`http://localhost:3000/api/v1/${params.path}`, params.headers)
  .catch((error) => error.response)
}
