import { router } from "expo-router";

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Footer } from '../../component/Footer';
import React from 'react';


export default function userChat() {
  return (
    <>
      <View className='flex-1 justify-center items-center' >
        <Text className="italic text-3xl font-semibold  " >User Chat</Text>
      </View>
      <Footer/>
    </>


  );
}


