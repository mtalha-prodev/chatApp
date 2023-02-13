import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [profile, setProfile] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // upload profile pic
  const selectProfile = async () => {
    try {
      const selectImg = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory',
      });
      setProfile(selectImg);

      // upload profile pic firebase storage
      // await storage()
      //   .ref(`profile/${selectImg.name}`)
      //   .putFile(selectImg.fileCopyUri);
      // Alert.alert('upload successfuly');
    } catch (error) {
      console.log(error);
    }
  };

  // user Sign up

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const handleSignup = async () => {
    try {
      if (email && password && profile && name) {
        setLoading(true);
        const res = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );

        // store user information in firestore
        await firestore().collection('users').doc(res.user.uid).set({
          name: name,
          pic: profile,
          email: res.user.email,
          uid: res.user.uid,
        });

        // UPLOAD USER PIC IN FIREBASE STORAGE
        await storage()
          .ref(`profile/${profile.name}`)
          .putFile(profile.fileCopyUri);

        Alert.alert('Alert', 'Your Account Create Successfuly');

        setEmail('');
        setPassword('');
        setName('');
        setProfile(null);
        setShow(false);
        setLoading(false);
      } else {
        console.log('please enter correct information');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={style.container}>
        <Text style={style.hText}>Sign Up</Text>
        {!show && (
          <>
            <TextInput
              style={style.inputText}
              placeholder="Email ..."
              value={email}
              onChangeText={val => setEmail(val)}
            />
            <TextInput
              style={style.inputText}
              placeholder="Password ..."
              value={password}
              onChangeText={val => setPassword(val)}
            />
            <TouchableOpacity
              style={style.signupBtn}
              onPress={() => setShow(true)}>
              <Text style={style.btnText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {show && (
          <>
            <TextInput
              style={style.inputText}
              placeholder="User Name ..."
              value={name}
              onChangeText={val => setName(val)}
            />

            <TouchableOpacity
              style={style.profile}
              onPress={() => selectProfile()}>
              <Text style={style.btnText}>Select Profile Pic</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.signupBtn}
              onPress={() => handleSignup()}>
              <Text style={style.btnText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={style.text}>Already have an account !</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const {width} = Dimensions.get('screen');
const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  hText: {
    fontSize: 35,
    marginVertical: 30,
    fontWeight: 'bold',
  },
  inputText: {
    width: width - 50,
    borderBottomWidth: 3,
    borderBottomColor: '#28B463',
    fontSize: 22,
    paddingLeft: 3,
    marginVertical: 30,
  },
  profile: {
    backgroundColor: '#3498DB',
    padding: 8,
    marginTop: 10,
    width: width - 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  signupBtn: {
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
  text: {
    marginTop: 10,
    color: '#3498DB',
    fontSize: 25,
    fontWeight: 500,
  },
});

export default Signup;
