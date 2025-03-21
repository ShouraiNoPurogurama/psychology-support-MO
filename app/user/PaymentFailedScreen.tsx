import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";
import { router } from "expo-router";

export default function PaymentFailedScreen() {
  const handleTryAgain = () => {
    // Thay bằng logic của bạn, ví dụ: console.log hoặc chuyển hướng thủ công
    console.log("Try Again pressed!");
  };

  return (
    <>
    <Student_Header/>
    <View style={styles.container}>
      {/* Icon thất bại */}
      <Icon name="close-circle" size={80} color="#F44336" />

      {/* Tiêu đề */}
      <Text style={styles.title}>Payment Failed!</Text>

      {/* Thông báo */}
      <Text style={styles.message}>
        Sorry, your payment could not be processed. Please try again or contact support.
      </Text>

      {/* Nút thử lại */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/user/home`)}
        >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
    <Footer/>
    
    </>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginTop: 20,
    fontFamily: "Nunito-Bold", // Bỏ nếu không dùng font Nunito
  },
  message: {
    fontSize: 16,
    color: "#4A4A4A",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    fontFamily: "Nunito-Regular", // Bỏ nếu không dùng font Nunito
  },
  button: {
    backgroundColor: "#F44336", // Màu đỏ cho nút
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Nunito-Bold", // Bỏ nếu không dùng font Nunito
  },
});