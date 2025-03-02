import { router } from "expo-router";

// import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { StyleSheet,Text, View, Alert, TouchableOpacity } from "react-native";
import  messaging, { registerDeviceForRemoteMessages }  from "@react-native-firebase/messaging";
import React, {useEffect} from "react"; 


export default function App() {
//   const requestUserPermission = async () => {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log("Authorization status:", authStatus);
//     }
//     return authStatus;
// };

// useEffect(() => {
//   const checkPermissionAndToken = async () => {
//     const authStatus = await requestUserPermission(); 
//     if (authStatus) {
//       messaging()
//         .getToken()
//         .then((token) => {
//           console.log("FCM Token:", token);
//         });
//     } else {
//       console.log("Permission is not granted", authStatus);
//     }


//   //check wheter an initial notification is avaiable
//   messaging()
//     .getInitialNotification()
//     .then(async (remoteMessage) =>{
//       if(remoteMessage) {
//         console.log(
//           "Notification caused app to open from quit state asdasdwassdawwad",
//           remoteMessage.notification
//         );
//       }
//     });
//     // Assume a message-notification contains a "types " property in the data payload of the screen to open
//     messaging().onNotificationOpenedApp((remoteMessage) => {
//       console.log(
//         "Notification caused app to open from background state",
//         remoteMessage.notification
//       );
//     }); 

//     // Register background handler
//     messaging().setBackgroundMessageHandler(async (remoteMessage) =>{
//       console.log("Message handled in the background", remoteMessage);
//     });

//     const unsubscribe = messaging().onMessage(async(remoteMessage) =>{
//       Alert.alert("A new FCM message arrived", JSON.stringify(remoteMessage));
//     });

//     return unsubscribe;
//   };
//   checkPermissionAndToken();
//   },[]);

    // return (
    //   <View style={styles.container}>
    //       <Text> FCM Tutorial </Text>
    //       <StatusBar style="auto"/>
    //   </View>
    // );
    return (
      <>
        <View className='flex-1 justify-center items-center bg-slate-400 ' >
          <Text className="italic text-3xl font-semibold  " >Welcome to our app, haha</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={{ color: "blue", fontSize: 18 }}>Go to Login Page</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/doctor/doctorHome")}>
            <Text style={{ color: "blue", fontSize: 18 }}>Go to Doctor Page</Text>
          </TouchableOpacity>
        </View>
  
      </>
  
    );
  }
