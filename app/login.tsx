import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import "../global.css";
import { useState } from "react";
import { router } from "expo-router";

export default function Login() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState(false);
  return (
    <View className="flex-2 mt-48  justify-center items-center ">
      <Text className="text-4xl font-extrabold text-[#AF93D2]">EmoEase</Text>
      <View className="items-center ">
        <Text className="text-2xl font-extrabold m-4">Login</Text>
        <Text className="text-2xl font-extrabold">Welcome Back</Text>
      </View>
      <View className="w-80 mt-5 space-y-4  ">
        <TextInput
          className="border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6 px-4"
          placeholder="Enter Your Username / Email"
        />
        <TextInput
          className="border-2 rounded-md  py-3 text-gray-500 w-full focus:border-black mt-6 px-4 "
          placeholder="Enter Your Password"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => router.push("/resetpass")}>
          <Text className="justify-center rounded-md text-blue-700 w-ful mt-1 px-1 ">
            Forget Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/createProfile")}>
          <Text className=" rounded-md  py-4 text-white w-ful mt-7 px-4 text-center bg-[#AF93D2]">
            Login
          </Text>
        </TouchableOpacity>

        <Text className="text-center mt-4 text-gray-500">
          Don't have an account? <Text className="text-blue-700" onPress={() => router.push("/register")}>Register</Text>
        </Text>
      </View>
    </View>
  );
}
