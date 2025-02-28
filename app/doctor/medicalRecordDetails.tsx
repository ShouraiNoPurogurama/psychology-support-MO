// MedicalRecordDetails.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function MedicalRecordDetails() {
  const { id } = useLocalSearchParams() as { id?: string };

  const medicalRecords: { [key: string]: { title: string; date: string; diagnosis: string; treatment: string; doctor: string; notes: string } } = {
    "1": {
      title: "Medical Record 1",
      date: "10 Jan 2024",
      diagnosis: "Hypertension",
      treatment: "Prescribed medication and lifestyle changes",
      doctor: "Dr. John Smith",
      notes: "Regular blood pressure checks recommended.",
    },
    "2": {
      title: "Medical Record 2",
      date: "15 Feb 2024",
      diagnosis: "Diabetes",
      treatment: "Insulin therapy and diet control",
      doctor: "Dr. Alice Brown",
      notes: "Monitor blood sugar levels daily.",
    },
  };

  const record = medicalRecords[id ?? ""] || {
    title: "Unknown Record",
    date: "N/A",
    diagnosis: "N/A",
    treatment: "N/A",
    doctor: "N/A",
    notes: "No details available.",
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#AF93D2" />
          </TouchableOpacity>
          <Text style={styles.header}>Medical Record Details</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.title}>{record.title}</Text>
          <Text style={styles.date}>{record.date}</Text>

          <Text style={styles.label}>Diagnosis</Text>
          <Text style={styles.info}>{record.diagnosis}</Text>

          <Text style={styles.label}>Treatment</Text>
          <Text style={styles.info}>{record.treatment}</Text>

          <Text style={styles.label}>Doctor</Text>
          <Text style={styles.info}>{record.doctor}</Text>

          <Text style={styles.label}>Notes</Text>
          <Text style={styles.info}>{record.notes}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#AF93D2",
    marginLeft: 8,
  },
  sectionContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: "#333",
  },
});
