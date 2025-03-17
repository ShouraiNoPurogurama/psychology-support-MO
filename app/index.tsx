import { router, useRootNavigationState } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import "../global.css";
import { StatusBar } from "expo-status-bar";
import  messaging, { registerDeviceForRemoteMessages }  from "@react-native-firebase/messaging";
import React, {useEffect} from "react"; 





export default function App() {
  const navigationState = useRootNavigationState(); 

  useEffect(() => {
    if (!navigationState?.ready) return; 

    router.replace("/login");
  }, [navigationState?.ready]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, ); 

    return () => clearTimeout(timeout); // Xóa timeout khi unmount
  }, []);

  
//   useEffect(() => {
//     const fetchFCMToken = async () => {
//       try {
//         await messaging().registerDeviceForRemoteMessages();
//         const token = await messaging().getToken();
//         console.log("FCM Token:", token);
//       } catch (error) {
//         console.error("Error fetching FCM Token:", error);
//       }
//     };
  
//     fetchFCMToken(); 
//   }, []);
  
  
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
//           "Notification caused app to open from quit state ",
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
// const getToken = async () => {
//   try {
//       const token = await messaging().getToken();
//       console.log("FCM Token:", token);
//   } catch (error) {
//       console.error("Error getting FCM token:", error);
//   }
// };

// useEffect(() => {
//   getToken();
// }, []);



//     // return (
//     //   <View style={styles.container}>
//     //       <Text> FCM Tutorial </Text>
//     //       <StatusBar style="auto"/>
//     //   </View>
//     // );



    
    return (
      <>
        <View className='flex-1 justify-center items-center bg-slate-400 ' >
          <Text className="italic text-3xl font-semibold  " >Welcome to our app, haha</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={{ color: "blue", fontSize: 18 }}>Go to Login Page</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/doctors/doctorHome")}>
            <Text style={{ color: "blue", fontSize: 18 }}>Go to Doctor Page</Text>
          </TouchableOpacity>
        </View>
  
      </>
  
    );
  }
function initializeApp(firebaseConfig: any) {
  throw new Error("Function not implemented.");
}

function getApps() {
  throw new Error("Function not implemented.");
}

