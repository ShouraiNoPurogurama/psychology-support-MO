import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet } from 'react-native';
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

export default function UserChatList() {
  const [search, setSearch] = useState('');

  return (
    <>
      <Student_Header />
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={18} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search here..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Chat List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {chatList.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              onPress={() =>
                router.push({
                  pathname: "/user/chatDetail",
                })
              }
              style={styles.chatItem}
            >
              {chat.avatar ? (
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
              ) : (
                <FontAwesome name="user-circle" size={50} color="#ccc" />
              )}
              <View style={styles.chatContent}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {chat.message}
                </Text>
              </View>
              <Text style={styles.chatDate}>{chat.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 15,
    paddingTop: 80,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 3,
  },
  chatMessage: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  chatDate: {
    fontSize: 12,
    color: '#95A5A6',
    marginLeft: 10,
  },
});