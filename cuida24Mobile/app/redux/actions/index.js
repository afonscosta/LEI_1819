
export const POST_WATER = "POST_WATER";
export const POST_NAPS = "POST_NAPS";
export const POST_SLEEP = "POST_SLEEP";
export const POST_SOS = "POST_SOS";

export const postWater = ({url, token, water, date}) => {
  return {
    type: POST_WATER,
    payload: { token: token, water: water, date: date },
    meta: {
      offline: {
        effect: {
          url: url,
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

export const postNaps = ({url, token, naps, date}) => {
  return {
    type: POST_NAPS,
    payload: { token: token, naps: naps, date: date },
    meta: {
      offline: {
        effect: {
          url: url,
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

export const postSleep = ({url, token, sleep, date}) => {
  return {
    type: POST_SLEEP,
    payload: { token: token, sleep: sleep, date: date },
    meta: {
      offline: {
        effect: {
          url: url,
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

export const postSOS = ({url, token, sos, date}) => {
  return {
    type: POST_SOS,
    payload: { token: token, sos: sos, date: date },
    meta: {
      offline: {
        effect: {
          url: url,
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
