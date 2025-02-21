import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import "../global.css";
import { router } from "expo-router";
import React from "react";
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import '../assets' ; // Import the Google logo

const GoogleLogo = require('../assets/Google.jpg'); // Assign the Google logo to a variable

WebBrowser.maybeCompleteAuthSession(); // Ensure to clear any existing auth sessions

// The Login component
export default function Login() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'AIzaSyCA1ck7cua4ewWBYpqagjBDyIyR8XJVoWA',
    webClientId: '398851471046-f7p7vh7ncamknt4shpolr7kqrevfmeue.apps.googleusercontent.com',
    clientId: '',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Handle successful authentication here
      console.log(authentication);
      router.push("/home");
    }
  }, [response]);

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>EmoEase</Text>
      <View style={styles.header}>
        <Text style={styles.headerText}>Login</Text>
        <Text style={styles.headerText}>Welcome Back</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Username / Email"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Your Password"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => router.push("/resetpass")}>
          <Text style={styles.linkText}>Forget Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/home")}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.linkText} onPress={() => router.push("/register")}>Register</Text>
        </Text>

        <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
          style={styles.googleButtonContainer}
        >
          <Image source={GoogleLogo} style={styles.googleLogo} />
        </TouchableOpacity>
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
    alignItems: 'center', 
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
    paddingHorizontal: 100,
    textAlign: 'center',
    borderRadius: 8,
    marginTop: 28,
  },
  googleButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4', 
    borderRadius: 50, 
    width: 50, 
    height: 50, 
    marginTop: 16, 
  },
  googleLogo: {
    width: 50,
    height: 50,
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
