
export const POST_WATER = 'POST_WATER';
export const POST_MEAL = 'POST_MEAL';
export const POST_NAPS = 'POST_NAPS';
export const POST_SLEEP = 'POST_SLEEP';
export const POST_SOS = 'POST_SOS';
export const POST_PHYACT = 'POST_PHYACT';
export const GET_PHYACT = 'GET_PHYACT';
export const GET_PHYACT_COMMIT = 'GET_PHYACT_COMMIT';
export const POST_INDLEI = 'POST_INDLEI';
export const GET_INDLEI = 'GET_INDLEI';
export const GET_INDLEI_COMMIT = 'GET_INDLEI_COMMIT';
export const POST_SOCLEI = 'POST_SOCLEI';
export const GET_SOCLEI = 'GET_SOCLEI';
export const GET_SOCLEI_COMMIT = 'GET_SOCLEI_COMMIT';

const ROOT_URL = 'http://10.0.2.2:8000/cuida24/';

export const postWater = ({token, water, date}) => {
  return {
    type: POST_WATER,
    payload: { token: token, water: water, date: date },
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'water/',
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            water: water,
            date: date,
          })
        }
      }
    }
  }
}

export const postMeal = ({token, meal, date}) => {
  return {
    type: POST_MEAL,
    payload: { token: token, meal: meal, date: date },
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'meal/',
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meal: meal,
            date: date,
          })
        }
      }
    }
  }
}

export const postNaps = ({token, naps, date}) => {
  return {
    type: POST_NAPS,
    payload: { token: token, naps: naps, date: date },
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'nap/',
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            naps: naps,
            date: date
          })
        }
      }
    }
  }
}

export const postSleep = ({token, sleep, date}) => {
  return {
    type: POST_SLEEP,
    payload: { token: token, sleep: sleep, date: date },
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'sleep/',
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: sleep,
            date: date
          })
        }
      }
    }
  }
}

export const postSOS = ({token, sos, date}) => {
  return {
    type: POST_SOS,
    payload: { token: token, sos: sos, date: date },
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'sos/',
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sos: sos,
            date: date
          })
        }
      }
    }
  }
}

export const postPhyAct = ({token, date, type, act, duration}) => {
  return {
    type: POST_PHYACT,
    payload: {
      token: token,
      date: date,
      type: type,
      act: act,
      duration: duration,
    },
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'physicalActivity/',
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: date,
            type: type,
            act: act,
            duration: duration
          })
        }
      }
    }
  }
}

export const getPhyAct = ({token}) => {
  return {
    type: GET_PHYACT,
    payload: [],
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'physicalActivity/',
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          }
        },
        commit: {
          type: GET_PHYACT_COMMIT
        }
      }
    }
  }
}

export const postIndLei = ({token, date, type, act, duration}) => {
  return {
    type: POST_INDLEI,
    payload: {
      token: token,
      date: date,
      type: type,
      act: act,
      duration: duration,
    },
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'individualLeisure/',
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: date,
            type: type,
            act: act,
            duration: duration
          })
        }
      }
    }
  }
}

export const getIndLei = ({token}) => {
  return {
    type: GET_INDLEI,
    payload: [],
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'individualLeisure/',
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          }
        },
        commit: {
          type: GET_INDLEI_COMMIT
        }
      }
    }
  }
}

export const postSocLei = ({token, date, type, act, duration}) => {
  return {
    type: POST_SOCLEI,
    payload: {
      token: token,
      date: date,
      type: type,
      act: act,
      duration: duration,
    },
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'socialLeisure/',
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: date,
            type: type,
            act: act,
            duration: duration
          })
        }
      }
    }
  }
}

export const getSocLei = ({token}) => {
  return {
    type: GET_SOCLEI,
    payload: [],
    meta: {
      offline: {
        effect: {
          url: ROOT_URL + 'socialLeisure/',
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
          }
        },
        commit: {
          type: GET_SOCLEI_COMMIT
        }
      }
    }
  }
}
