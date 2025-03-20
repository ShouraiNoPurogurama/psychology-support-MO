import React from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";

const mockBookings = [
    { id: "1", date: "2025-03-15", service: "Psychological Counseling", status: "Completed" },
    { id: "2", date: "2025-03-10", service: "Psychotherapy", status: "Canceled" },
    { id: "3", date: "2025-02-28", service: "Psychological Counseling", status: "Completed" },
    { id: "4", date: "2025-02-18", service: "Group Therapy", status: "Pending" },
    { id: "5", date: "2025-01-25", service: "Online Counseling", status: "Completed" },
    { id: "6", date: "2024-12-10", service: "Mental Health Assessment", status: "Completed" },
];

const mockConditions = [
    { id: "1", name: "Depression" },
    { id: "2", name: "Anxiety" },
    { id: "3", name: "Bipolar Disorder" },
    { id: "4", name: "Chronic Insomnia" },
    { id: "5", name: "Obsessive-Compulsive Disorder (OCD)" },
];

const mockRecords = [
    { id: "1", date: "2025-02-20", diagnosis: "Generalized Anxiety Disorder", notes: "Requires continued monitoring." },
    { id: "2", date: "2025-01-15", diagnosis: "Major Depression", notes: "Undergoing Cognitive Behavioral Therapy (CBT)." },
    { id: "3", date: "2024-11-30", diagnosis: "Post-Traumatic Stress Disorder (PTSD)", notes: "Patient needs monitoring for insomnia." },
    { id: "4", date: "2024-09-22", diagnosis: "Bipolar Disorder", notes: "Prescribed mood stabilizers." },
    { id: "5", date: "2024-06-10", diagnosis: "Social Anxiety", notes: "Continuing gradual exposure therapy." },
];

const UserHistory = () => {
    return (
        <>
            <Student_Header />
            <ScrollView style={{ padding: 16, marginTop: 80 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>Booking History</Text>
                <FlatList
                    data={mockBookings}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <Card style={{ marginBottom: 8, padding: 16 }}>
                            <Text style={{ fontWeight: "bold" }}>{item.service}</Text>
                            <Text>Date: {item.date}</Text>
                            <Text>Status: {item.status}</Text>
                        </Card>
                    )}
                />

                <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 16, marginBottom: 8 }}>Underlying Conditions</Text>
                <FlatList
                    data={mockConditions}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card style={{ marginBottom: 8, padding: 16 }}>
                            <Text>{item.name}</Text>
                        </Card>
                    )}
                />

                <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 16, marginBottom: 8 }}>Medical Records</Text>
                <FlatList
                    style={{ marginBottom: 80 }}
                    data={mockRecords}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <Card style={{ marginBottom: 8, padding: 16 }}>
                            <Text style={{ fontWeight: "bold" }}>Diagnosis: {item.diagnosis}</Text>
                            <Text>Date: {item.date}</Text>
                            <Text>Notes: {item.notes}</Text>
                        </Card>
                    )}
                />
            </ScrollView>
            <Footer />
        </>
    );
};

export default UserHistory;