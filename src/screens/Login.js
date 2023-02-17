import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const handleLogin = async () => {
    try {
      if (email && password) {
        setLoading(true);
        await auth().signInWithEmailAndPassword(email, password);
        Alert.alert('Alert', 'login succesfuly');

        setEmail('');
        setPassword('');
        setLoading(false);
        navigation.dispatch(StackActions.replace('Home'));
      } else {
        console.log('Please enter you email & password');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      navigation.dispatch(StackActions.replace('Login'));
    }
  };

  return (
    <View style={style.container}>
      <Text style={style.hText}>Login</Text>
      <View style={style.inputForm}>
        {/* <Text style={style.label}>Email</Text> */}
        <TextInput
          style={style.inputText}
          value={email}
          placeholder="Email..."
          onChangeText={val => setEmail(val)}
        />
      </View>
      <View style={style.inputForm}>
        {/* <Text style={style.label}>Password</Text> */}
        <TextInput
          style={style.inputText}
          value={password}
          placeholder="Password ..."
          onChangeText={val => setPassword(val)}
        />
      </View>
      <TouchableOpacity style={style.loginBtn} onPress={() => handleLogin()}>
        <Text style={style.btnText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style.signupBtn}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={style.signupText}>Please Create an Account !</Text>
      </TouchableOpacity>
    </View>
  );
};

const {width} = Dimensions.get('screen');
const style = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hText: {
    fontSize: 35,
    marginVertical: 30,
    fontWeight: 'bold',
  },
  inputForm: {
    marginTop: 25,
  },
  label: {
    fontSize: 27,
    fontWeight: 500,
    marginTop: 20,
  },
  inputText: {
    width: width - 50,
    borderBottomWidth: 3,
    borderBottomColor: '#28B463',
    fontSize: 22,
    paddingLeft: 3,
    marginVertical: 10,
  },
  loginBtn: {
    padding: 8,
    marginVertical: 30,
    backgroundColor: '#28B463',
    width: width - 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 28,
    fontWeight: 500,
    color: 'white',
  },
  signupBtn: {
    marginTop: 5,
    width: width - 20,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 25,
    color: '#2E86C1',
    fontWeight: 'bold',
  },
});

export default Login;
