import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import {StatusBar, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="#28B463" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTintColor: 'green',
              headerRight: () => (
                <MaterialIcons
                  name="account-circle"
                  // style={{marginRight: 10}}
                  color="green"
                  size={40}
                  onPress={() => auth().signOut()}
                />
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigator;
