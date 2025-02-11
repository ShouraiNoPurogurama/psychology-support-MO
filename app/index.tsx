import { StatusBar } from 'expo-status-bar';
import {  router } from "expo-router";

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import "../global.css";


export default function App() {
  return (
    <View className='flex-1 justify-center items-center bg-slate-400 ' >
      <Text className="italic text-3xl font-semibold  " >Welcome to our app</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={{ color: "blue", fontSize: 18 }}>Go to Login Page</Text>
            </TouchableOpacity>
    </View>
  );
}


