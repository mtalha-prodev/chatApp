import {View, Text} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';

const Chat = () => {
  const route = useRoute();
  // console.log(route.params);
  const {item} = route.params;
  return (
    <View style={{flex: 1}}>
      <Text style={{color: '#000'}}>{item.name}</Text>
    </View>
  );
};

export default Chat;
