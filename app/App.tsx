import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import "../global.css";


export default function App() {
  return (
    <View className='flex-1 justify-center items-center bg-slate-400 ' >
      <Text className="italic text-3xl font-semibold  " >Welcome to our Chill Bot app</Text>
      <StatusBar style="auto" />
    </View>
  );
}


