import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface Booking {
    bookingCode: string;
    doctorId: string;
    patientId: string;
    date: string;
    startTime: string;
    duration: number;
    price: number;
    promoCodeId: string | null;
    giftCodeId: string | null;
    status: string;
}

interface MedicalHistory {
    description: string;
    diagnosedAt: string;
    specificMentalDisorders: { name: string; description: string }[];
    physicalSymptoms: { name: string; description: string }[];
}

interface MedicalRecord {
    id: string;
    notes: string;
    status: string;
    specificMentalDisorders: { name: string; description: string }[];
    createdAt: string;
}

const UserHistory = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (!token) throw new Error("No authentication token found");

                const decoded: any = jwtDecode(token);
                const patientId = decoded.profileId;

                const bookingResponse = await fetch(
                    `https://psychologysupport-scheduling.azurewebsites.net/bookings?PageIndex=0&PageSize=10&patientId=${patientId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const bookingData = await bookingResponse.json();
                setBookings(bookingData.bookings.data);

                const profileResponse = await fetch(
                    `https://psychologysupport-profile.azurewebsites.net/patients/${patientId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const profileData = await profileResponse.json();
                const patientProfile = profileData.patientProfileDto;

                setMedicalHistory(patientProfile.medicalHistory || null);
                setMedicalRecords(patientProfile.medicalRecords || []);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <>
            <Student_Header />
            <ScrollView style={styles.container}>
                {/* Booking History */}
                <Text style={styles.sectionTitle}>Booking History</Text>
                {bookings.length > 0 ? (
                    <FlatList
                        data={bookings}
                        keyExtractor={(item) => item.bookingCode}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <Card style={styles.card}>
                                <Text style={styles.cardTitle}>Booking: {item.bookingCode}</Text>
                                <Text style={styles.cardText}>Date: {item.date}</Text>
                                <Text style={styles.cardText}>
                                    Time: {item.startTime} (Duration: {item.duration} mins)
                                </Text>
                                <Text style={styles.cardText}>
                                    Price: {item.price.toLocaleString()} VND
                                </Text>
                                <Text style={[styles.cardText, { color: item.status === "Confirmed" ? "#28a745" : "#dc3545" }]}>
                                    Status: {item.status}
                                </Text>
                            </Card>
                        )}
                    />
                ) : (
                    <Text style={styles.noDataText}>No booking history available</Text>
                )}

                {/* Medical History */}
                <Text style={styles.sectionTitle}>Medical History</Text>
                {medicalHistory ? (
                    <Card style={styles.card}>
                        <Text style={styles.cardTitle}>Description: {medicalHistory.description}</Text>
                        <Text style={styles.cardText}>
                            Diagnosed At: {new Date(medicalHistory.diagnosedAt).toLocaleDateString()}
                        </Text>
                        <Text style={styles.subTitle}>Mental Disorders:</Text>
                        {medicalHistory.specificMentalDisorders.length > 0 ? (
                            medicalHistory.specificMentalDisorders.map((disorder, index) => (
                                <Text key={index} style={styles.cardText}>
                                    • {disorder.name}: {disorder.description}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No mental disorders recorded</Text>
                        )}
                        <Text style={styles.subTitle}>Physical Symptoms:</Text>
                        {medicalHistory.physicalSymptoms.length > 0 ? (
                            medicalHistory.physicalSymptoms.map((symptom, index) => (
                                <Text key={index} style={styles.cardText}>
                                    • {symptom.name}: {symptom.description}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No physical symptoms recorded</Text>
                        )}
                    </Card>
                ) : (
                    <Text style={styles.noDataText}>No medical history available</Text>
                )}

                {/* Medical Records */}
                <Text style={styles.sectionTitle}>Medical Records</Text>
                {medicalRecords.length > 0 ? (
                    <FlatList
                        style={styles.flatList}
                        data={medicalRecords}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <Card style={styles.card}>
                                <Text style={styles.cardTitle}>
                                    Date: {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
                                <Text style={styles.cardText}>Notes: {item.notes}</Text>
                                <Text style={styles.cardText}>Status: {item.status}</Text>
                                <Text style={styles.subTitle}>Mental Disorders:</Text>
                                {item.specificMentalDisorders.length > 0 ? (
                                    item.specificMentalDisorders.map((disorder, index) => (
                                        <Text key={index} style={styles.cardText}>
                                            • {disorder.name}: {disorder.description}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={styles.noDataText}>No disorders recorded</Text>
                                )}
                            </Card>
                        )}
                    />
                ) : (
                    <Text style={styles.noDataText}>No medical records available</Text>
                )}
            </ScrollView>
            <Footer />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5", // Màu nền nhẹ
        marginTop: 80,
        marginBottom:80
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    loadingText: {
        fontSize: 18,
        color: "#666",
    },
    errorText: {
        fontSize: 18,
        color: "#dc3545", // Màu đỏ cho lỗi
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 16,
    },
    card: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: "#fff",
        elevation: 4, // Bóng đổ
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2c3e50", // Màu xanh đậm
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
    },
    subTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#34495e",
        marginTop: 12,
        marginBottom: 4,
    },
    noDataText: {
        fontSize: 14,
        color: "#888",
        fontStyle: "italic",
        marginVertical: 8,
    },
    flatList: {
        marginBottom: 80,
    },
});

export default UserHistory;