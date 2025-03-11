import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

const notifications = [
  {
    id: "1",
    title: "Appointment Reminder",
    message: "You have an appointment with John Doe at 10:00 AM.",
    time: "2025-03-06 09:00 AM",
  },
  {
    id: "2",
    title: "New Patient Registration",
    message: "A new patient, Jane Smith, has registered.",
    time: "2025-03-05 02:00 PM",
  },
  {
    id: "3",
    title: "System Update",
    message: "The system will undergo maintenance at 12:00 AM.",
    time: "2025-03-04 11:00 PM",
  },
];

export default function DoctorNotification() {
  const renderItem = ({ item }: { item: { id: string; title: string; message: string; time: string } }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  return (
    <>
      <DoctorHeader />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#AF93D2",
    shadowColor: "#000",
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  listContainer: {
    padding: 20,
  },
  notificationItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "right",
  },
});