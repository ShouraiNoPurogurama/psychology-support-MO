import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Footer } from '../../component/Footer';
import { Student_Header } from '../../component/Student_Header';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons'; // Thêm thư viện icon
import { LinearGradient } from 'expo-linear-gradient'; // Thêm gradient

const { width: screenWidth } = Dimensions.get('window');
const HomeScreenImage = require("../../assets/images/HomeScreen.png");
const DoctorImage = require("../../assets/images/Doctor.jpg");

export default function Home() {
    useEffect(() => {
        const getTokenAndDecode = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    const decode: any = jwtDecode(token);
                    console.log("decode.profileId:", decode.profileId);
                } else {
                    console.log("No token found");
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        };
        getTokenAndDecode();
    }, []);

    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Section 1: Test */}
                <View style={styles.section}>
                    <Image source={HomeScreenImage} style={styles.image} resizeMode="cover" />
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.3)']}
                        style={styles.bannerContainer}
                    >
                        <View style={styles.iconTextContainer}>
                            <Ionicons name="fitness-outline" size={24} color="white" />
                            <Text style={styles.bannerText}>
                                Assess Your Condition
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.testButton}
                            onPress={() => router.push("/user/studentTest")}
                        >
                            <Ionicons name="play-circle-outline" size={20} color="white" />
                            <Text style={styles.testButtonText}>Start Test</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* Section 2: Doctor */}
                <View style={styles.section}>
                    <Image source={DoctorImage} style={styles.image} resizeMode="cover" />
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.3)']}
                        style={styles.bannerContainer}
                    >
                        <View style={styles.iconTextContainer}>
                            <Ionicons name="medkit-outline" size={24} color="white" />
                            <Text style={styles.bannerText}>Doctor’s Advice</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.testButton}
                            onPress={() => router.push("/user/doctorList")}
                        >
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
                            <Text style={styles.testButtonText}>Contact Doctor</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>

            <Footer />
            <Student_Header />
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 100,
        paddingTop: 120,
        backgroundColor: '#F5F7FA', // Nền nhẹ nhàng
    },
    section: {
        position: "relative",
        alignItems: "center",
        marginVertical: 20, // Tăng khoảng cách giữa các section
        marginHorizontal: 15,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5, // Đổ bóng
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    image: {
        width: screenWidth * 0.9,
        height: 320,
        borderRadius: 20,
    },
    bannerContainer: {
        position: "absolute",
        bottom: 20,
        padding: 20,
        borderRadius: 15,
        width: "90%", // Tăng chiều rộng
        alignItems: "center",
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    bannerText: {
        color: "white",
        fontSize: 22, // Tăng kích thước chữ
        fontWeight: "700", // Đậm hơn
        textAlign: "center",
        marginLeft: 10,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6B48FF', // Màu tím đậm hơn
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 3,
    },
    testButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});