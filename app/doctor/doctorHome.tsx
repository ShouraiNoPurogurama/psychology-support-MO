import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import "../global.css";
import { useState } from 'react';
import { router } from 'expo-router';
import { Footer } from '../component/Footer';




export default function Home() {
    return (
        <>
            <View className='flex-2 mt-48  justify-center items-center '>
                <Text className='text-4xl font-extrabold text-[#AF93D2]' >EmoEase</Text>
                <View className='items-center '>
                    <Text className='text-2xl font-extrabold m-4'>Hello DoctorDoctor</Text>
                    
                </View>
                
            </View>
            <Footer 

        />

        </>


    );
};


