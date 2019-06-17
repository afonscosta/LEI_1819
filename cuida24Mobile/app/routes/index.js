import React, { Component } from 'react';
import { 
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CalendarPage from '../pages/Calendar.page'
import MedicationPage from '../pages/Medication.page'
import HabitsPage from '../pages/Habits.page'
import ChatPage from '../pages/Chat.page'
import GamesPage from '../pages/Games.page'
import InfoPage from '../pages/Info.page'
import LoginPage from '../pages/Login.page'
import MealPage from '../pages/Habits/Meal.page'
import IndivLeisurePage from '../pages/Habits/IndivLeisure.page'
import PhysicalActivityPage from '../pages/Habits/PhysicalActivity.page'
import SleepPage from '../pages/Habits/Sleep.page'
import NapPage from '../pages/Habits/Nap.page'
import SOSPage from '../pages/Habits/SOS.page'
import SocialLeisurePage from '../pages/Habits/SocialLeisure.page'
import WaterPage from '../pages/Habits/Water.page'
import WeeklyGoalsPage from '../pages/Habits/WeeklyGoals.page'
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import { subDays, isBefore, differenceInDays } from 'date-fns';
 
class NavigationDrawerStructure extends Component {
  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require('../assets/drawer.png')}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }


  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    AsyncStorage.getItem('@login:')
      .then((userToken) => {
        this.props.navigation.navigate(userToken ? 'SleepLoading' : 'Auth');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

class SleepLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
    this.state = {
      base_url: "http://10.0.2.2:8000/cuida24/"
    }
  }

  getLastSleep(sleeps) {
    var lastSleep = new Date(sleeps[0].date);
    for (var i = 1; i < sleeps.length; i++) {
      var s = new Date(sleeps[i].date);
      if (isAfter(s, lastSleep)) {
        lastSleep = s;
      }
    }
    return lastSleep;
  }

  fetchSleep(token) {
    const url = this.state.base_url + "sleep/";
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(sleep => sleep.json())
      .then(sleep => {
        console.log('sleep', sleep);
        if (sleep.length > 0) {
          var lastSleep = this.getLastSleep(sleep);
          console.log('lastSleep', lastSleep);
          AsyncStorage.setItem(
            '@sleep',
            JSON.stringify({ 'lastSleep': lastSleep })
          )
            .then(() => {
              this.fetchMealTypes(token);
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: sleep', error);
            });
        } else {
          this.fetchMealTypes(token);
        }
      })
      .catch((error) => {
        this.fetchMealTypes(token);
      });
  }

  fetchMealTypes(token) {
    const url = this.state.base_url + "meal/constitution/";
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(meals => meals.json())
      .then(meals => {
        console.log('meals', meals);
        var mealsReady = meals.map(function(meal) {
          var m = Object.assign({}, meal);
          m.selected = false;
          return m;
        })
        if (mealsReady.length > 0) {
          AsyncStorage.setItem(
            '@meals',
            JSON.stringify(mealsReady)
          )
            .then(() => {
              // this.fetchMeal(token);
              this.processSleep();
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: meals', error);
            });
        } else {
          // this.fetchMeal(token);
          this.processSleep();
        }
      })
      .catch((error) => {
        // this.fetchMeal(token);
        this.processSleep();
      });
  }

  fetchMeal(token) {
    const url = this.state.base_url + "meal/";
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    }).then(meal => meal.json())
      .then(meal => {
        if (meal.length > 0) {
          AsyncStorage.setItem('@meal', meal)
            .then(() => {
              // this.processSleep();
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: meal', error);
            });
        } else {
          // this.processSleep();
        }
      })
      .catch((error) => {
        console.warn('fetchMeal: ', error);
        // this.processSleep();
      });
  }

  processSleep() {
    AsyncStorage.getItem('@sleep')
      .then((lastSleepStr) => {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        var lastSleepObj = JSON.parse(lastSleepStr);
        console.log('lastSleepObj', lastSleepObj);
        if (!lastSleepObj) {
          this.props.navigation.navigate('Sleep');
        } else {
          lastSleep = new Date(lastSleepObj.lastSleep);
          if (Math.abs(differenceInDays(lastSleep, today)) > 1) {
            this.props.navigation.navigate('Sleep');
          } else {
            this.props.navigation.navigate('MealLoading');
          }
        }
      })
      .catch((error) => {
        console.log('error get sleep', error);
      });
  }

  async fetchs() {
    AsyncStorage.getItem('@login:')
      .then((token) => {
        this.fetchSleep(token);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    this.fetchs();
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

class MealLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  lastToFill() {
    var today = new Date();
    var h = today.getHours();
    if (h > 19) {
      today.setHours(19);
    } else if (h > 16) {
      today.setHours(16);
    } else if (h > 12) {
      today.setHours(12);
    } else if (h > 10) {
      today.setHours(10);
    } else if (h > 7) {
      today.setHours(7);
    }
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
  }

  todayBreakfast() {
    var today = new Date();
    var h = today.getHours();
    if (h > 7) {
      today.setHours(7);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      return today;
    }
    return null;
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    AsyncStorage.getItem('@meal')
      .then((lastMealStr) => {
        var lastMealObj = JSON.parse(lastMealStr);
        if (!lastMealObj && this.todayBreakfast()) {
          this.props.navigation.navigate('Meal');
        } else if (lastMealObj) {
          lastMeal = new Date(lastMealObj.lastMeal);
          var lastToFill = this.lastToFill();
          if (isBefore(lastMeal, lastToFill)) {
            this.props.navigation.navigate('Meal');
          } else {
            this.props.navigation.navigate('App');
          }
        } else {
          this.props.navigation.navigate('App');
        }
      })
      .catch((error) => {
        console.log('error get meal', error);
      });
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch(exception) {
      return false;
    }
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    try{
      const tokenRemoved = await this.removeItemValue('@login:');

      await AsyncStorage.clear();

      console.log(tokenRemoved);

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      this.props.navigation.navigate(tokenRemoved ? 'Auth' : 'App');
    } catch(error) {
      console.log(error);
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const bgColor = '#FFD185';
const htColor = '#343F4B';

const Login_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  Login: {
    screen: LoginPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Iniciar sessão',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});
 
const Calendar_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  Calendar: {
    screen: CalendarPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Calendário',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});
 
const Medication_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Medication: {
    screen: MedicationPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Medicação',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});
 
const Habits_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Habits: {
    screen: HabitsPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Hábitos',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
	IndivLeisure: {
		screen: IndivLeisurePage,
    navigationOptions: ({ navigation }) => ({
      title: 'Lazer Individual',
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
	},
	PhysicalActivity: {
		screen: PhysicalActivityPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Atividade Física',
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
	},
	Nap: {
		screen: NapPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Sestas',
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
	},
	SOS: {
		screen: SOSPage,
    navigationOptions: ({ navigation }) => ({
      title: 'SOS',
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
	},
	SocialLeisure: {
		screen: SocialLeisurePage,
    navigationOptions: ({ navigation }) => ({
      title: 'Lazer Social',
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
	},
	Water: {
		screen: WaterPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Água',
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
	},
	WeeklyGoals: {
		screen: WeeklyGoalsPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Objetivos',
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
	}
});

const Chat_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Chat: {
    screen: ChatPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Chat',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});
 
const Games_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Games: {
    screen: GamesPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Jogos',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});

const Info_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Info: {
    screen: InfoPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Páginas Informativas',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});

const DrawerNavigatorNoLogin = createDrawerNavigator({
  //Drawer Optons and indexing
  Login: {
    //Title
    screen: Login_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Iniciar sessão',
    },
  },
  Info: {
    //Title
    screen: Info_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Páginas informativas',
    },
  },
},
{
  drawerBackgroundColor: bgColor,
});


const DrawerNavigator = createDrawerNavigator({
    //Drawer Optons and indexing
    Calendar: {
      //Title
      screen: Calendar_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Calendário',
      },
    },
    Medication: {
      //Title
      screen: Medication_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Medicação',
      },
    },
    Habits: {
      //Title
      screen: Habits_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Hábitos',
      },
    },
    Chat: {
      //Title
      screen: Chat_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Chat',
      },
    },
    Games: {
      //Title
      screen: Games_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Jogos',
      },
    },
    Info: {
      //Title
      screen: Info_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Páginas informativas',
      },
    },
    Logout: {
      //Title
      screen: Logout,
    }
  },
  {
    drawerBackgroundColor: bgColor,
  });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: DrawerNavigator,
    SleepLoading: SleepLoadingScreen,
    Sleep: SleepPage,
    MealLoading: MealLoadingScreen,
    Meal: MealPage,
    Auth: DrawerNavigatorNoLogin
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
