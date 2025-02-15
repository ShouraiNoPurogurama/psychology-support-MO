import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import "../global.css";
import { useState } from 'react';
import React from 'react';
import { router } from 'expo-router';

export default function Register() {
  const handleSendOTP = () => {
    // Your logic to send OTP
    console.log('Send OTP button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EmoEase</Text>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Reset Password</Text>
        <TextInput style={styles.input} placeholder="Enter Your Email" />
        <View style={styles.otpContainer}>
          <TextInput style={[styles.input, styles.otpInput]} placeholder="Enter OTP" />
          <TouchableOpacity onPress={handleSendOTP} style={styles.otpButton}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
        <TextInput style={styles.input} placeholder="Enter Your New Password" />
        <TextInput style={styles.input} placeholder="Confirm Your New Password" />
        <TouchableOpacity onPress={() => router.push("/login")} style={styles.button}>
          <Text style={styles.buttonText}>Reset password</Text>
        </TouchableOpacity>
        <View style={styles.loginTextContainer}>
                  <Text style={styles.loginText}>Don't have an account? </Text>
                  <Text style={styles.loginLink} onPress={() => router.push("/register")}>Register</Text>
                </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed from center to start for vertical centering
    paddingTop: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#AF93D2',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%', // Adjusted to make the form container a bit narrower
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%', // Full width of the container
    marginBottom: 15,
    borderColor: '#ccc',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  otpInput: {
    flex: 1,
    marginRight: 10,
  },
  otpButton: {
    backgroundColor: '#AF93D2',
    paddingVertical: 10, // Adjusted to match the input field height
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
    height: 48, // Ensure the height matches the input field
  },
  button: {
    backgroundColor: '#AF93D2',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loginTextContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  loginText: {
    fontSize: 16,
    color: 'gray',
  },
  loginLink: {
    fontSize: 16,
    color: 'blue',
  },
});
