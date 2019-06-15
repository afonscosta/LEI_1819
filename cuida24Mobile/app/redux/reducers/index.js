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
  GET_INDLEI_COMMIT,
  POST_SOCLEI,
  GET_SOCLEI,
  GET_SOCLEI_COMMIT
} from '../actions/index';
import AsyncStorage from '@react-native-community/async-storage';
import { sha256 } from 'react-native-sha256';

const INITIAL_STATE = [

];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Water
    case POST_WATER:
      return action.payload
    // Naps
    case POST_NAPS:
      return action.payload
    // Sleep
    case POST_SLEEP:
      return action.payload
    // SOS
    case POST_SOS:
      return action.payload
    // Physical Activity
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
    // Individual Leisure
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
    // Social Leisure
    case POST_SOCLEI:
      return action.payload
    case GET_SOCLEI:
      return action.payload
    case GET_SOCLEI_COMMIT:
      AsyncStorage.setItem(
        '@socialLeisure',
        JSON.stringify(action.payload)
      ).catch((error) => {
        console.warn('AsyncStorage - setItem: socialLeisure', error);
      });
      return action.payload

    default:
      return state
  }
}
