import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { Footer } from "../../component/Footer";
import { Student_Header } from "../../component/Student_Header";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

type Doctor = {
    id: string;
    name: string;
    specialty: string;
    fee: number;
    image: string;
};

type Patient = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
};

export default function ConfirmAppointment() {
    const { date, time, doctorId, patientId } = useLocalSearchParams(); // Thêm patientId
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null); // Thêm state cho patient
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No authentication token found");
                }
                const decoded: any = jwtDecode(token);
                const patientId = decoded.profileId;
                // Fetch doctor details
                const doctorResponse = await fetch(`https://psychologysupport-profile.azurewebsites.net/doctors/${doctorId}`);
                if (!doctorResponse.ok) {
                    throw new Error("Failed to fetch doctor details");
                }
                const doctorData = await doctorResponse.json();
                const doctorProfile = doctorData.doctorProfileDto;

                const formattedDoctor: Doctor = {
                    id: doctorProfile.id,
                    name: doctorProfile.fullName,
                    specialty: (doctorProfile.specialties as { name: string }[]).map(s => s.name).join(", "),
                    fee: 170000,
                    image: "https://kenh14cdn.com/203336854389633024/2022/5/6/f04d70b1f6e140338a7d2f27ebe67685-1651808959048730170550.png",
                };
                setDoctor(formattedDoctor);

                // Fetch patient details
                const patientResponse = await fetch(`https://psychologysupport-profile.azurewebsites.net/patients/${patientId}`);
                if (!patientResponse.ok) {
                    throw new Error("Failed to fetch patient details");
                }
                const patientData = await patientResponse.json();
                const patientProfile = patientData.patientProfileDto; // Điều chỉnh theo cấu trúc response thực tế của API

                const formattedPatient: Patient = {
                    id: patientProfile.id,
                    fullName: patientProfile.fullName,
                    email: patientProfile.contactInfo.email,
                    phoneNumber: patientProfile.contactInfo.phoneNumber,
                };
                setPatient(formattedPatient);

            } catch (err) {
                // setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [doctorId, patientId]); // Thêm patientId vào dependency array

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (error || !doctor || !patient) { // Kiểm tra cả patient
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error || "Data not found"}</Text>
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
                            <Text style={styles.textBold}>{patient.fullName}</Text>
                            <Text style={styles.text}>{patient.email}</Text>
                            <Text style={styles.text}>{patient.phoneNumber}</Text>
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

                <TouchableOpacity
                onPress={() => router.push(`/user/PaymentSuccessScreen`)}
                style={styles.confirmButton} >
                    <Text style={styles.confirmText}>Confirm Appointment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton}
                onPress={() => router.push(`/user/PaymentFailedScreen`)}
                >
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
        paddingTop: 100,
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
        backgroundColor: "red",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom:40
    },
    confirmText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
