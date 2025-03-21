import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Student_Header } from "../../component/Student_Header";
import { router } from "expo-router";
import { Footer } from "../../component/Footer";

export default function PaymentSuccessScreen() {


    return (
        <>
        <Student_Header/>
            <View style={styles.container}>
                {/* Icon thành công */}
                <Icon name="checkmark-circle" size={80} color="#4CAF50" />

                {/* Tiêu đề */}
                <Text style={styles.title}>Payment Successful!</Text>

                {/* Thông báo */}
                <Text style={styles.message}>
                    Thank you for your payment. Your transaction has been completed successfully.
                </Text>

                {/* Nút quay lại */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push(`/user/home`)}
                    >
                    <Text style={styles.buttonText}>Back to Home</Text>
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
        backgroundColor: "#4CAF50",
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