// offline
import { createStore } from 'redux';
import { offline } from '@redux-offline/redux-offline';
import config from '@redux-offline/redux-offline/lib/config';

// Redux-persist
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// Reducer
import rootReducer from './reducers/index'

const persistConfig = {
  key: 'root',
	storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer, offline(config))

export default store;
