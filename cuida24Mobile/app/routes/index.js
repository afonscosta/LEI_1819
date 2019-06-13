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
    try{
      const userToken = await AsyncStorage.getItem('@login:');

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      console.log('userToken', userToken);
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
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
	Meal: {
		screen: MealPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Alimentação',
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
	Sleep: {
		screen: SleepPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Dormir',
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
    Auth: DrawerNavigatorNoLogin,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
