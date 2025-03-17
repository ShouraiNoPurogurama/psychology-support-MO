import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';

const chatList = [
  {
    id: '1',
    name: 'Smith Mathew',
    message: "Hi, Trung. Hope you're doing...",
    date: '29 Jan',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Smith Mathew',
    message: 'Hi, Trung. Do you need any.....',
    date: '14 Jan',
    avatar: null,
  },
];

export default function userChatList() {
  const [search, setSearch] = useState('');

  return (
    <>
      <Student_Header />
      <View style={{ flex: 1, backgroundColor: 'white', padding: 15, marginTop:40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 10 }}>
          <FontAwesome name="search" size={18} color="#aaa" style={{ marginRight: 5 }} />
          <TextInput
            placeholder="Search here.."
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, height: 40 }}
          />
        </View>



        <ScrollView showsVerticalScrollIndicator={false}>
          {chatList.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              // onPress={() => router.push(`/chat/${chat.id}`)}
                            onPress={() =>
                              router.push({
                                pathname: "/user/chatDetail",
                                // params: {
                                //   id: item.id,
                                //   name: item.name,
                                //   avatar: item.avatar,
                                //   message: item.message,
                                // },
                              })
                            }
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
            >
              {chat.avatar ? (
                <Image source={{ uri: chat.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
              ) : (
                <FontAwesome name="user-circle" size={40} color="#aaa" />
              )}
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{chat.name}</Text>
                <Text style={{ color: 'gray' }}>{chat.message}</Text>
              </View>
              <Text style={{ color: 'gray' }}>{chat.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <Footer />
    </>

  );
}
