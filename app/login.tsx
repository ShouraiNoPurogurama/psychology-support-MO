import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import "../global.css";
import { useState } from 'react';



export default function Login() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState(false);
  return (
    <View className='flex-2 mt-20  justify-center items-center '>
      <Text className='text-4xl font-extrabold text-[#AF93D2]' >EmoEase</Text>
      <View className='items-center '>
        <Text className='text-2xl font-extrabold m-4'>Login</Text>
        <Text className='text-2xl font-extrabold'>Welcome Back</Text>
      </View>
      <View>
        <TextInput className='border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6'
        placeholder="Enter Your Username / Email"
        />
      </View>
    </View>
  );
};


