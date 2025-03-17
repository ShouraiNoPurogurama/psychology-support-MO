import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Footer } from '../../component/Footer';
import { Student_Header } from '../../component/Student_Header';
import React from 'react';

const { width: screenWidth } = Dimensions.get('window');
const HomeScreenImage = require("../../assets/images/HomeScreen.png");
const DoctorImage = require("../../assets/images/Doctor.jpg");

export default function Home() {
    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.section}>
                    <Image source={HomeScreenImage} style={styles.image} resizeMode="cover" />
                    <View style={styles.bannerContainer}>
                        <Text style={styles.bannerText}>
                            Proceed to assess your current condition with the first test
                        </Text>
                        <TouchableOpacity style={styles.testButton} onPress={() => router.push("/user/studentTest")}>
                            <Text style={styles.testButtonText}>Do the test</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Image source={DoctorImage} style={styles.image} resizeMode="cover" />
                    <View style={styles.bannerContainer}>
                        <Text style={styles.bannerText}>Need help from a doctor?</Text>
                        <TouchableOpacity style={styles.testButton} onPress={() => router.push("/user/doctorList")}>
                            <Text style={styles.testButtonText}>Contact our doctor</Text>
                        </TouchableOpacity>
                    </View>
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
        paddingTop:100
    },
    section: {
        position: "relative",
        alignItems: "center",
        marginVertical: 10, 
    },
    image: {
        width: screenWidth * 0.9,  
        height: 320,  
        borderRadius: 15,
    },
    bannerContainer: {
        position: "absolute",
        bottom: 20,  
        backgroundColor: "rgba(0, 0, 0, 0.5)",  
        padding: 15,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    bannerText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    testButton: {
        backgroundColor: "#AF93D2",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    testButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
