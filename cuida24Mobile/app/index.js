import React, {Component} from 'react';

import App from './App.container';

import { Provider } from 'react-redux';

// Redux-persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import store from './redux/index'

const persistor = persistStore(store)

class Cuida24App extends Component {

  render () {
    return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<App />
				</PersistGate>
			</Provider>
    );
  }
}

export default Cuida24App;
