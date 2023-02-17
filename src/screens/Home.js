import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import {useNavigation, StackActions} from '@react-navigation/native';

const Home = () => {
  const [users, setUsers] = useState(null);

  const navigation = useNavigation();

  // get all users
  const getAllUser = async () => {
    try {
      const user = await auth().currentUser;
      console.log(user.uid);
      const querySnap = await firestore()
        .collection('users')
        .where('uid', '!=', user.uid)
        .get();

      const allUsers = querySnap.docs.map(users => users.data());
      setUsers(allUsers);
      // console.log(allUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      console.log('call singout');
      await auth().signOut();
      navigation.dispatch(StackActions.replace('Login'));
      Alert.alert('logout Successfuly !');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={{color: 'green', fontSize: 20}}>Home</Text>
        <TouchableOpacity onPress={() => logout()}>
          <MaterialIcons name="account-circle" color="green" size={40} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        renderItem={({item}) => {
          // console.log(item);
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('Chat', {item})}>
              <View style={style.cardView}>
                <Image source={{uri: item.url}} style={style.image} />
                <View style={{justifyContent: 'space-between'}}>
                  <Text style={[style.text, {fontWeight: 'bold'}]}>
                    {item.name}
                  </Text>
                  <Text style={style.text}>{item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 55,
    width: '100%',
    backgroundColor: '#fff',
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10,
  },
  cardView: {
    width: '90%',
    elevation: 4,
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  text: {
    color: '#000',
    fontSize: 17,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default Home;
