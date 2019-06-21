import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchGoalTypes () {
    return cuida24.get(`goal/typeGoal/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  // Goals
  fetchGoals () {
    return cuida24.get(`goal/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postGoal (payload) {
    return cuida24.post(`goal/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteGoal (goalPK) {
    return cuida24.delete(`goal/${goalPK}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  // Physical Activity
  fetchPhysicalActivities () {
    return cuida24.get(`physicalActivity/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postPhysicalActivity (payload) {
    return cuida24.post(`physicalActivity/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deletePhysicalActivity (itemPK) {
    return cuida24.delete(`physicalActivity/${itemPK}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  // Social Leisure
  fetchSocialLeisures () {
    return cuida24.get(`socialLeisure/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postSocialLeisure (payload) {
    return cuida24.post(`socialLeisure/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteSocialLeisure (itemPK) {
    return cuida24.delete(`socialLeisure/${itemPK}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  // Individual Leisure
  fetchIndivLeisures () {
    return cuida24.get(`individualLeisure/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postIndivLeisure (payload) {
    return cuida24.post(`individualLeisure/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteIndivLeisure (itemPK) {
    return cuida24.delete(`individualLeisure/${itemPK}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchUserActivities  (pk) {
    return cuida24.get(`activity/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchUserMeal  (pk) {
    return cuida24.get(`meal/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchUserWater  (pk) {
    return cuida24.get(`water/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchUserSleep  (pk) {
    return cuida24.get(`sleep/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchUserNap  (pk) {
    return cuida24.get(`nap/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchUserSOS  (pk) {
    return cuida24.get(`sos/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
