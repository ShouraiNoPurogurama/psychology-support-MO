import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';
import { router } from 'expo-router';

export default function AboutUs() {
  return (
    <>
    <Student_Header/>
    <ScrollView style={{ padding: 16, backgroundColor: 'white', marginTop:80 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333' }}>About Us</Text>
      <Text style={{ fontSize: 16, textAlign: 'center', color: '#666', marginTop: 8 }}>
        Welcome to EmoEase – a place where you can listen, understand, and take care of your emotions.
      </Text>
      
      <View style={{ marginTop: 16, padding: 16, backgroundColor: '#f3f3f3', borderRadius: 16, shadowOpacity: 0.1, shadowRadius: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#444' }}>🧡 Who Are We?</Text>
        <Text style={{ fontSize: 14, color: '#555', marginTop: 8 }}>
          EmoEase was created with the desire to make psychological counseling easily accessible, safe, and warm.
        </Text>
      </View>
      
      <View style={{ marginTop: 16, padding: 16, backgroundColor: '#f3f3f3', borderRadius: 16, shadowOpacity: 0.1, shadowRadius: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#444' }}>✨ Our Mission</Text>
        <Text style={{ fontSize: 14, color: '#555', marginTop: 8 }}>
          We provide in-depth psychological assessments and suggest suitable solutions, accompanying you on your mental well-being journey.
        </Text>
      </View>
      
      <View style={{ marginTop: 16, padding: 16, backgroundColor: '#f3f3f3', borderRadius: 16, shadowOpacity: 0.1, shadowRadius: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#444' }}>🌱 Why Choose EmoEase?</Text>
        <Text style={{ fontSize: 14, color: '#555', marginTop: 8 }}>✅ Privacy & Security – Your information is always protected.</Text>
        <Text style={{ fontSize: 14, color: '#555' }}>✅ Convenient & Easy to Use – Just a few taps to receive valuable advice.</Text>
        <Text style={{ fontSize: 14, color: '#555' }}>✅ Scientific & Accurate – Based on modern psychological research.</Text>
      </View>
      
      <TouchableOpacity
      onPress={() => router.push('/user/home/')}
       style={{ marginTop: 16, backgroundColor: '#007bff',marginBottom:140, padding: 12, borderRadius: 16, alignItems: 'center', shadowOpacity: 0.1, shadowRadius: 4 }}
      
      >
        <Text style={{ color: 'white', fontWeight: '600',  }}>Discover EmoEase Now!</Text>
      </TouchableOpacity>
    </ScrollView>
    <Footer/>
    
    </>
    
  );
}
