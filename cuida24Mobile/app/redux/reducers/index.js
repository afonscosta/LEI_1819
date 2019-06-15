import {
  POST_WATER,
  POST_NAPS,
  POST_SLEEP,
  POST_SOS,
  POST_PHYACT,
  GET_PHYACT,
  GET_PHYACT_COMMIT,
  POST_INDLEI,
  GET_INDLEI,
  GET_INDLEI_COMMIT
} from '../actions/index';
import AsyncStorage from '@react-native-community/async-storage';
import { sha256 } from 'react-native-sha256';

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
    case POST_PHYACT:
      return action.payload
    case GET_PHYACT:
      return action.payload
    case GET_PHYACT_COMMIT:
      AsyncStorage.setItem(
        '@activities',
        JSON.stringify(action.payload)
      ).catch((error) => {
        console.warn('AsyncStorage - setItem: activities', error);
      });
      return action.payload
    case POST_INDLEI:
      return action.payload
    case GET_INDLEI:
      return action.payload
    case GET_INDLEI_COMMIT:
      AsyncStorage.setItem(
        '@indivLeisure',
        JSON.stringify(action.payload)
      ).catch((error) => {
        console.warn('AsyncStorage - setItem: indivLeisure', error);
      });
      return action.payload
    default:
      return state
  }
}
