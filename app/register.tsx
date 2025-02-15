import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import "../global.css";
import { useState } from 'react';
import React from 'react';
import { router } from 'expo-router';

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EmoEase</Text>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Sign Up</Text>
        <TextInput style={styles.input} placeholder="Enter Your Username" />
        <TextInput style={styles.input} placeholder="Enter Your Email" />
        <TextInput style={styles.input} placeholder="Enter Your Phone Number" />
        <TextInput style={styles.input} placeholder="Enter Your Password" />
        <TouchableOpacity onPress={() => router.push("/login")} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text className="text-center mt-4 text-gray-500">
        Already have an account? <Text className="text-blue-700" onPress={() => router.push("/login")}>Login</Text>
        </Text>
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
  }
});
