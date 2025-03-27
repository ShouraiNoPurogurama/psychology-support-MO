import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";

const workshopData = [
    {
        id: "1",
        text: "📢 Sharing from a Psychology Expert",
        image: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
        date: "Monday, 07/21/2025",
        time: "10:00 - 12:00",
        location: "Room A, ABC Conference Center, District 1, Ho Chi Minh City",
        detail: "A sharing session from a psychology expert to help you better understand how to manage stress, enhance mental health, and improve personal relationships."
    },
    {
        id: "2",
        text: "🤝 Group Conversation and Support",
        image: "https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg",
        date: "Tuesday, 07/22/2025",
        time: "14:00 - 16:00",
        location: "Room B, ABC Conference Center, District 1, Ho Chi Minh City",
        detail: "An open space where you can share your story, listen, and receive support from others with similar experiences."
    },
    {
        id: "3",
        text: "🧘‍♂️ Meditation and Mindfulness Practice",
        image: "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg",
        date: "Wednesday, 07/23/2025",
        time: "08:00 - 10:00",
        location: "Garden Area, ABC Conference Center, District 1, Ho Chi Minh City",
        detail: "A mindfulness and meditation practice session to help you relax, focus on the present, and improve overall mental well-being."
    },
    {
        id: "4",
        text: "🎨 Creative Activities to Reduce Stress",
        image: "https://images.pexels.com/photos/3817587/pexels-photo-3817587.jpeg",
        date: "Thursday, 07/24/2025",
        time: "16:00 - 18:00",
        location: "Art Room, ABC Conference Center, District 1, Ho Chi Minh City",
        detail: "Join creative activities like painting and writing to relieve stress, express emotions, and boost your mental state."
    }
];

export default function Workshop() {
    return (
        <>
            <Student_Header />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Workshop: Together for Mental Health Care</Text>

                {workshopData.map((event) => (
                    <View key={event.id} style={styles.card}>
                        <Image source={{ uri: event.image }} style={styles.image} />
                        <Text style={styles.title}>{event.text}</Text>
                        <Text style={styles.info}>
                            <Ionicons name="calendar-outline" size={18} color="gray" /> {event.date}
                        </Text>
                        <Text style={styles.info}>
                            <Ionicons name="time-outline" size={18} color="gray" /> {event.time}
                        </Text>
                        <Text style={styles.info}>
                            <Ionicons name="location-outline" size={18} color="gray" /> {event.location}
                        </Text>
                        <Text style={styles.details}>{event.detail}</Text>
                    </View>
                ))}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Register Now</Text>
                </TouchableOpacity>
            </ScrollView>
            <Footer />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 110,
        paddingHorizontal: 15,
        backgroundColor: "#f9f9f9",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#6B21A8",
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "blue",
    },
    info: {
        fontSize: 14,
        color: "gray",
        marginBottom: 5,
    },
    details: {
        fontSize: 14,
        color: "#555",
        marginTop: 8,
    },
    button: {
        backgroundColor: "#6B21A8",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});