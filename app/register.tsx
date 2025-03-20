import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import "../global.css";
import { useState } from 'react';
import React from 'react';
import { router } from 'expo-router';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleRegister = async () => {
    if (!fullName || !gender || !email || !phoneNumber || !password || !confirmPassword) {
      console.error('Error: Please fill in all fields');
      Alert.alert('Error', 'Please fill in all fields');

      return;
    }

    if (password !== confirmPassword) {
      console.error('Error', 'Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch(
        'https://psychologysupport-auth.azurewebsites.net/Auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullName, gender, email, phoneNumber, password, confirmPassword }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      if (response.ok) {
        Alert.alert('Success', 'Registration successful');
        router.push('/login');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EmoEase</Text>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Sign Up</Text>
        <TextInput style={styles.input} placeholder="Enter Your Full name" onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="Enter Your Gender" onChangeText={setGender} />
        <TextInput style={styles.input} placeholder="Enter Your Email" keyboardType='email-address' onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Enter Your Phone Number" keyboardType='phone-pad' onChangeText={setPhoneNumber} />
        <TextInput style={styles.input} placeholder="Enter Your Password" secureTextEntry onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirm Your Password" secureTextEntry onChangeText={setConfirmPassword} />
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => router.push("/login")} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity> */}
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text style={styles.loginLink} onPress={() => router.push("/login")}>Login</Text>
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
    justifyContent: 'flex-start',
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
