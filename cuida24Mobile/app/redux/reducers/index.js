import {
  POST_WATER,
  POST_NAPS,
  POST_SLEEP,
  POST_SOS
} from '../actions/index'

const INITIAL_STATE = [

];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_WATER:
      return action.payload
    case POST_NAPS:
      return action.payload
    case POST_SLEEP:
      return action.payload
    case POST_SOS:
      return action.payload
    default:
      return state
  }
}
