import { router } from "expo-router";
import React from "react";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
// import '../assets/Google.jpg';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// const GoogleLogo = require('../assets/Google.jpg');

WebBrowser.maybeCompleteAuthSession();

export default function Login(): React.JSX.Element {


  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: '398851471046-27k27bpi63vn7roon2g1phl00d6a2jn6.apps.googleusercontent.com',
  //   webClientId: '398851471046-f7p7vh7ncamknt4shpolr7kqrevfmeue.apps.googleusercontent.com',
  // });

  // useEffect(() => {
  //   if (response) {
  //     console.log('Google login response:', response);
  //     if (response.type === 'success') {
  //       const { authentication } = response;
  //       // Handle successful authentication here
  //       console.log('Authentication successful:', authentication);
  //       router.push("/home");
  //     } else {
  //       console.log('Authentication failed:', response);
  //     }
  //   }
  // }, [response]);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("fcmToken");
        if (storedToken) {
          setFcmToken(storedToken);
          console.log("Retrieved FCM Token:", storedToken);
        } else {
          console.log("no fcm token")
        }
      } catch (error) {
        console.error("Error retrieving/generating FCM Token:", error);
      }
    };

    fetchFcmToken();
  }, []);

  const isValidEmail = (email: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const isValidPhoneNumber = (phone: string) => {
    return /^(0|\+84)[1-9][0-9]{8}$/.test(phone);
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert(
        "Error",
        "Please enter your Email or Phone number and Password"
      );
      console.error(
        "Error",
        "Please enter your Email or Phone number and Password"
      );
      return;
    }

    // Lấy FCM token từ state
    const deviceToken = fcmToken;

    let loginData: any = {
      password,
      deviceToken: deviceToken || "",
      deviceType: "Android"
    };

    if (isValidEmail(identifier)) {
      loginData.email = identifier;
    } else if (isValidPhoneNumber(identifier)) {
      loginData.phoneNumber = identifier;
    } else {
      Alert.alert("Error", "Please enter a valid Email or Phone number");
      console.error("Error", "Please enter a valid Email or Phone number");
      return;
    }

    try {
      const response = await fetch(
        "https://psychologysupport-auth.azurewebsites.net/Auth/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      console.log("Login data sent:", loginData);
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        const token = data.token;
        await AsyncStorage.setItem('authToken', token);

        if (!token) {
          Alert.alert("Error", "No token received");
          return;
        }

        try {
          const decoded: any = jwtDecode(token);
          console.log("Decoded Token:", decoded);

          const roleKey = Object.keys(decoded).find(key => key.toLowerCase().includes("role"));

          const userRole = roleKey ? decoded[roleKey] : null;

          Alert.alert("Success", "Login successful");

          if (userRole === "User") {
            router.push("/user/home");
          } else if (userRole === "Doctor") {
            router.push("/doctors/doctorHome");
          }
        } catch (decodeError) {
          console.error("JWT Decode Error:", decodeError);
          Alert.alert("Error", "Invalid token format");
        }
      } else {
        Alert.alert("Error", data.message || "Login failed");
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.log("API Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

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
          placeholder="Enter Your Email or Phone number"
          value={identifier}
          onChangeText={setIdentifier}
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Your Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push("/resetpass")}>
          <Text style={styles.linkText}>Forget Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => router.push("/user/home")} style={styles.button}> */}
        {/* <TouchableOpacity onPress={() => router.push("/user/home")} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
         </TouchableOpacity> 
 */}

        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => router.push("/register")}
          >
            Register
          </Text>
        </Text>

        {/* <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
          style={styles.googleButtonContainer}
        >
          <Image source={GoogleLogo} style={styles.googleLogo} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#AF93D2",
  },
  header: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 4,
  },
  form: {
    width: "80%",
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    color: "gray",
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
    color: "gray",
  },
  button: {
    backgroundColor: "#AF93D2",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  linkText: {
    color: "blue",
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: "#AF93D2",
    color: "white",
    paddingVertical: 16,
    paddingHorizontal: 100,
    textAlign: "center",
    borderRadius: 8,
    marginTop: 28,
  },
  googleButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
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
    backgroundColor: "#A0A0A0",
  },
  footerText: {
    textAlign: "center",
    marginTop: 16,
    color: "gray",
  },
});
function messaging() {
  throw new Error("Function not implemented.");
}

