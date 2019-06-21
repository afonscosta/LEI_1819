import habitsService from '../../services/habitsService'

const state = {
  goalTypes: [],
  goals: [],
  physicalActivities: [],
  socialLeisures: [],
  indivLeisures: [],
  userActivities: [],
  userWater: [],
  userSOS: [],
  userSleep: [],
  userNap: [],
  userMeal: []
}

const getters = {
  goalTypes: state => {
    return state.goalTypes
  },
  goals: state => {
    return state.goals
  },
  physicalActivities: state => {
    return state.physicalActivities
  },
  socialLeisures: state => {
    return state.socialLeisures
  },
  indivLeisures: state => {
    return state.indivLeisures
  },
  userActivities: state => {
    return state.userActivities
  },
  userWater: state => {
    return state.userWater
  },
  userSOS: state => {
    return state.userSOS
  },
  userSleep: state => {
    return state.userSleep
  },
  userNap: state => {
    return state.userNap
  },
  userMeal: state => {
    return state.userMeal
  }
}

const mutations = {
  setGoalTypes (state, gt) {
    var gtUpdated = gt.map((g) => {
      g.text = g.title
      delete g.title
      return g
    })
    state.goalTypes = gtUpdated
  },
  setGoals (state, gs) {
    state.goals = gs
  },
  addGoal (state, g) {
    state.goals.push(g)
  },
  deleteGoal (state, goalPK) {
    state.goals = state.goals.filter(g => g.pk !== goalPK)
  },
  // Physical Activities
  setPhysicalActivities (state, pa) {
    state.physicalActivities = pa
  },
  addPhysicalActivity (state, pa) {
    state.physicalActivities.push(pa)
  },
  deletePhysicalActivity (state, paPK) {
    state.physicalActivities = state.physicalActivities.filter(pa => pa.pk !== paPK)
  },
  // Social Leisures
  setSocialLeisures (state, sl) {
    state.socialLeisures = sl
  },
  addSocialLeisure (state, sl) {
    state.socialLeisures.push(sl)
  },
  deleteSocialLeisure (state, slPK) {
    state.socialLeisures = state.socialLeisures.filter(sl => sl.pk !== slPK)
  },
  // Individual Leisures
  setIndivLeisures (state, il) {
    state.indivLeisures = il
  },
  addIndivLeisure (state, il) {
    state.indivLeisures.push(il)
  },
  deleteIndivLeisure (state, ilPK) {
    state.indivLeisures = state.indivLeisures.filter(il => il.pk !== ilPK)
  },
  // Habits fetch
  setUserActivities (state, items) {
    state.userActivities = items
  },
  setUserMeal (state, items) {
    state.userMeal = items
  },
  setUserWater (state, items) {
    state.userWater = items
  },
  setUserSOS (state, items) {
    state.userSOS = items
  },
  setUserSleep (state, items) {
    state.userSleep = items
  },
  setUserNap (state, items) {
    state.userNap = items
  }
}

const actions = {
  getGoalTypes ({ commit }) {
    habitsService.fetchGoalTypes()
      .then(gt => {
        console.log('fetch goalTypes', gt)
        commit('setGoalTypes', gt)
      })
  },
  getGoals ({ commit }) {
    habitsService.fetchGoals()
      .then(gs => {
        console.log('fetch goals', gs)
        commit('setGoals', gs)
      })
  },
  addGoal ({ commit }, goal) {
    return new Promise((resolve, reject) => {
      habitsService.postGoal(goal)
        .then(newGoal => {
          console.log('addGoal', newGoal)
          commit('addGoal', newGoal)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteGoal ({ commit }, goalPK) {
    return new Promise((resolve, reject) => {
      habitsService.deleteGoal(goalPK)
        .then(() => {
          commit('deleteGoal', goalPK)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getPhysicalActivities ({ commit }) {
    habitsService.fetchPhysicalActivities()
      .then(items => {
        console.log('fetch physicalActivities', items)
        commit('setPhysicalActivities', items)
      })
  },
  addPhysicalActivity ({ commit }, item) {
    return new Promise((resolve, reject) => {
      habitsService.postPhysicalActivity(item)
        .then(newItem => {
          console.log('addPhysicalActivity', newItem)
          commit('addPhysicalActivity', newItem)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deletePhysicalActivity ({ commit }, itemPK) {
    return new Promise((resolve, reject) => {
      habitsService.deletePhysicalActivity(itemPK)
        .then(() => {
          commit('deletePhysicalActivity', itemPK)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getSocialLeisures ({ commit }) {
    habitsService.fetchSocialLeisures()
      .then(items => {
        console.log('fetch socialLeisures', items)
        commit('setSocialLeisures', items)
      })
  },
  addSocialLeisure ({ commit }, item) {
    return new Promise((resolve, reject) => {
      habitsService.postSocialLeisure(item)
        .then(newItem => {
          console.log('addSocialLeisure', newItem)
          commit('addSocialLeisure', newItem)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteSocialLeisure ({ commit }, itemPK) {
    return new Promise((resolve, reject) => {
      habitsService.deleteSocialLeisure(itemPK)
        .then(() => {
          commit('deleteSocialLeisure', itemPK)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getIndivLeisures ({ commit }) {
    habitsService.fetchIndivLeisures()
      .then(items => {
        console.log('fetch indivLeisures', items)
        commit('setIndivLeisures', items)
      })
  },
  addIndivLeisure ({ commit }, item) {
    return new Promise((resolve, reject) => {
      habitsService.postIndivLeisure(item)
        .then(newItem => {
          console.log('addIndivLeisure', newItem)
          commit('addIndivLeisure', newItem)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteIndivLeisure ({ commit }, itemPK) {
    return new Promise((resolve, reject) => {
      habitsService.deleteIndivLeisure(itemPK)
        .then(() => {
          commit('deleteIndivLeisure', itemPK)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getHabits ({ commit }, payload) {
    habitsService.fetchUserActivities(payload)
      .then(items => {
        console.log('fetch activities', items)
        commit('setUserActivities', items)
      })
    habitsService.fetchUserMeal(payload)
      .then(items => {
        console.log('fetch meals', items)
        commit('setUserMeal', items)
      })
    habitsService.fetchUserSOS(payload)
      .then(items => {
        console.log('fetch sos', items)
        commit('setUserSOS', items)
      })
    habitsService.fetchUserWater(payload)
      .then(items => {
        console.log('fetch water', items)
        commit('setUserWater', items)
      })
    habitsService.fetchUserSleep(payload)
      .then(items => {
        console.log('fetch sleep', items)
        commit('setUserSleep', items)
      })
    habitsService.fetchUserNap(payload)
      .then(items => {
        console.log('fetch nap', items)
        commit('setUserNap', items)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
