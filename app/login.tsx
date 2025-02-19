import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import "../global.css";
import { useState } from "react";
import { router } from "expo-router";
import React from "react";
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: '398851471046-f7p7vh7ncamknt4shpolr7kqrevfmeue.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Handle successful authentication here
      console.log(authentication);
    }
  }, [response]);

  return (
    <View className="flex-2 mt-48  justify-center items-center ">
      <Text className="text-4xl font-extrabold text-[#AF93D2]">EmoEase</Text>
      <View className="items-center ">
        <Text className="text-2xl font-extrabold m-4">Login</Text>
        <Text className="text-2xl font-extrabold">Welcome Back</Text>
      </View>
      <View className="w-80 mt-5 space-y-4  ">
        <TextInput
          className="border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6 px-4"
          placeholder="Enter Your Username / Email"
        />
        <TextInput
          className="border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6 px-4 "
          placeholder="Enter Your Password"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => router.push("/resetpass")}>
          <Text className="justify-center rounded-md text-blue-700 w-ful mt-1 px-1 ">
            Forget Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        >
          <Text style={[styles.googleButton, !request && styles.disabledButton]}>
            Login with Google
          </Text>
        </TouchableOpacity>

        <Text className="text-center mt-4 text-gray-500">
          Don't have an account? <Text className="text-blue-700" onPress={() => router.push("/register")}>Register</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#AF93D2',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 4,
  },
  form: {
    width: '80%',
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    color: 'gray',
    width: '100%',
  },
  linkText: {
    color: 'blue',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#AF93D2',
    color: 'white',
    paddingVertical: 16,
    textAlign: 'center',
    borderRadius: 8,
    marginTop: 28,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    color: 'white',
    paddingVertical: 16,
    textAlign: 'center',
    borderRadius: 8,
    marginTop: 28,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
    color: 'gray',
  },
});
