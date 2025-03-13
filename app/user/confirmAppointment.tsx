import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { Footer } from "../../component/Footer";
import { Student_Header } from "../../component/Student_Header";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

type Doctor = {
    id: string;
    name: string;
    specialty: string;
    fee: number;
    image: string;
};

export default function ConfirmAppointment() {
    const { date, time, doctorId } = useLocalSearchParams();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchDoctorDetail = async () => {
            try {
                const response = await fetch(`https://psychologysupportprofile-fddah4eef4a7apac.eastasia-01.azurewebsites.net/doctors/${doctorId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch doctor details");
                }
                const data = await response.json();
                const doctorData = data.doctorProfileDto;

                const formattedDoctor: Doctor = {
                    id: doctorData.id,
                    name: doctorData.fullName,
                    specialty: (doctorData.specialties as { name: string }[]).map(s => s.name).join(", "),
                    fee: 0, // API chưa có fee
                    image: "https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg", // API chưa có image
                };
                setDoctor(formattedDoctor);
            } catch (err) {
                setError("Doctor not found");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetail();
    }, [doctorId]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (error || !doctor) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }
    return (
        <>
            <Student_Header />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Confirm Appointment</Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Patient</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-circle-outline" size={40} color="#2A86FF" />
                        <View>
                            <Text style={styles.textBold}>Minh Trung</Text>
                            <Text style={styles.text}>nguyenminhtrung18072004@gmail.com</Text>
                            <Text style={styles.text}>+84 784927089</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Doctor</Text>
                    <View style={styles.infoRow}>
                        <Image source={{ uri: doctor.image }} style={styles.doctorImage} resizeMode="stretch" />
                        <View>
                            <Text style={styles.textBold}>{doctor.name}</Text>
                            <Text style={styles.text}>{doctor.specialty}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Appointment Date & Time</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={30} color="#FFA500" />
                        <View>
                            <Text style={styles.textBold}>{date}</Text>
                            <Text style={styles.text}>{time}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.feeContainer}>
                    <Ionicons name="cash-outline" size={30} color="#34A853" />
                    <Text style={styles.feeText}>  Consultation Fee </Text>
                    <Text style={styles.feeAmount}>{doctor.fee.toLocaleString()} đ</Text>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={() => console.log("Confirmed!")}>
                    <Text style={styles.confirmText}>Confirm Appointment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => console.log("Canceled!")}>
                    <Text style={styles.confirmText}>Cancel Appointment</Text>
                </TouchableOpacity>
            </ScrollView>

            <Footer />
        </>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
    },
    container: {
        paddingBottom: 80,
        paddingHorizontal: 20,
        paddingTop: 80,
        gap: 20

    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginVertical: 7,
    },
    card: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        color: 'blue'
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    doctorImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        fontSize: 14,
        color: "#666",
    },
    textBold: {
        fontSize: 16,
        fontWeight: "600",
    },
    feeContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#FFF",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        justifyContent: "center",
    },
    feeText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#34A853",
    },
    feeAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#34A853",
        marginLeft: 5,
    },
    confirmButton: {
        backgroundColor: "#2A86FF",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    confirmText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
