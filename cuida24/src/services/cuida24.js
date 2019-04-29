import axios from 'axios'
import Cookies from 'js-cookie'
// import jwtDecode from 'jwt-decode'
import store from '@/store/modules/login'

var axiosInstance = axios.create({
  baseURL: '/cuida24',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken')
  }
})

function updateToken () {
  store.dispatch('login/refreshtoken', {
    refreshtoken: store.state.refreshtoken
  })
  return store.state.access
}

axiosInstance.interceptors.response.use(null, (error) => {
  if (error.config && error.response && error.response.status === 401) {
    return updateToken().then((token) => {
      error.config.headers.Authorization = 'Bearer ' + token
      return axios.request(error.config)
    })
  }

  return Promise.reject(error)
})

export default axiosInstance
