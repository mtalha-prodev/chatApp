import {View, Text, Alert} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import firestore, {firebase} from '@react-native-firebase/firestore';

const Chat = () => {
  const route = useRoute();
  // console.log(route.params);
  const {item, currentUser} = route.params;
  const [messages, setMessages] = useState([]);

  // create id
  const docId =
    currentUser > item.uid
      ? `${currentUser}-${item.uid}`
      : `${item.uid}-${currentUser}`;

  useEffect(() => {
    // on realtime chat
    const messageRef = firestore()
      .collection('chatRoom')
      .doc(docId)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    // handle realtime chat ref
    messageRef.onSnapshot(querySnap => {
      const getMsg = querySnap.docs.map(docSnap => {
        const data = docSnap.data();
        if (data.createdAt) {
          return {
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSnap.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(getMsg);
      console.log(messages);
    });
  }, []);

  // user send side message fuction
  const onSend = async message => {
    const msg = message[0];
    const sendMsg = {
      ...msg,
      sendBy: currentUser,
      sendTo: item.uid,
      createdAt: new Date(),
    };

    setMessages(prevMessages => GiftedChat.append(prevMessages, sendMsg));

    // add messages in firestore

    firestore()
      .collection('chatRoom')
      .doc(docId)
      .collection('messages')
      .add({
        ...sendMsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  };

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: currentUser,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {backgroundColor: 'green'},
                left: {backgroundColor: 'lightgray'},
              }}
            />
          );
        }}
        renderInputToolbar={props => {
          return <InputToolbar {...props} textInputStyle={{color: '#000'}} />;
        }}
      />
    </View>
  );
};

export default Chat;
