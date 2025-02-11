import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import "../global.css";
import { useState } from 'react';
import React from 'react';



export default function Register() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState(false);
  return (
    <View className='flex-2 mt-20  justify-center items-center '>
      <Text className='text-4xl font-extrabold text-[#AF93D2]' >EmoEase</Text>
      <View className='items-center '>
        <Text className='text-2xl font-extrabold m-4'>Sign Up</Text>
      </View>
      <View>
        <TextInput className='border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6'
        placeholder="Enter Your Username"
        />
        <TextInput className='border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6'
        placeholder="Enter Your Email"
        />
        <TextInput className='border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6'
        placeholder="Enter Your Phone Number"
        />
        <TextInput className='border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6'
        placeholder="Enter Your Password"
        />
        <button className='bg-[#AF93D2] text-white w-full py-3 rounded-md mt-6'>Sign Up</button>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={{ color: "blue", fontSize: 18 }}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


