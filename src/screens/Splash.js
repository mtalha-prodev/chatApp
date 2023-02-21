import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation, StackActions} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      const unSubscription = auth().onAuthStateChanged(user => {
        const isActive = user !== null ? 'Home' : 'Login';
        if (user !== null) {
          console.log(user.uid);
          unSubscription();
          // console.log('IS ACTIVE ', isActive);
          navigation.dispatch(StackActions.replace('Home'));
          firestore().collection('users').doc(user.uid).update({
            status: 'Online',
          });
        } else {
          navigation.dispatch(StackActions.replace('Login'));
        }
      });
    }, 2000);
  }, []);

  return (
    <View style={style.container}>
      <Text style={style.text}>Splash</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28B463',
  },
  text: {
    fontSize: 35,
    color: '#D5D8DC',
  },
});

export default Splash;
