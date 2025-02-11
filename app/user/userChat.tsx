import { StatusBar } from 'expo-status-bar';
import {  router } from "expo-router";

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';


export default function userChat() {
  return (
    <View className='flex-1 justify-center items-center bg-slate-400 ' >
      <Text className="italic text-3xl font-semibold  " >Chat</Text>

    </View>
  );
}


