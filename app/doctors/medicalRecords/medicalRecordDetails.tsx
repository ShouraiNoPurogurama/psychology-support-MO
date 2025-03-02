import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function MedicalRecordDetails() {
  const { id } = useLocalSearchParams() as { id?: string };

  const medicalRecords: Record<string, { 
    title: string;
    date: string;
    diagnosis: string;
    treatment: string;
    doctor: string;
    notes: string;
    physicalSymptoms: string[];
    mentalDisorders: string[];
    therapeuticActivities: string[];
    physicalActivities: string[];
    foodPreferences: string[];
    entertainmentPreferences: string[];
  }> = {
    "1": {
      title: "Medical Record 1",
      date: "10 Jan 2024",
      diagnosis: "Hypertension",
      treatment: "Prescribed medication and lifestyle changes",
      doctor: "Dr. John Smith",
      notes: "Regular blood pressure checks recommended.",
      physicalSymptoms: ["Fatigue", "Dizziness"],
      mentalDisorders: ["Anxiety Disorder"],
      therapeuticActivities: ["Meditation", "Cognitive Behavioral Therapy"],
      physicalActivities: ["Jogging", "Yoga"],
      foodPreferences: ["Like: Vegetables", "Dislike: Fast Food"],
      entertainmentPreferences: ["Like: Reading", "Neutral: Movies"],
    },
  };
  
  const record = medicalRecords[id ?? ""] || {
    title: "Unknown Record",
    date: "N/A",
    diagnosis: "N/A",
    treatment: "N/A",
    doctor: "N/A",
    notes: "No details available.",
    physicalSymptoms: [],
    mentalDisorders: [],
    therapeuticActivities: [],
    physicalActivities: [],
    foodPreferences: [],
    entertainmentPreferences: [],
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#6C63FF" />
          </TouchableOpacity>
          <Text style={styles.header}>Medical Record Details</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{record.title}</Text>
          <Text style={styles.date}>{record.date}</Text>

          {[
            {
              icon: "notes-medical",
              label: "Diagnosis",
              value: record.diagnosis,
            },
            { icon: "pills", label: "Treatment", value: record.treatment },
            { icon: "user-md", label: "Doctor", value: record.doctor },
            { icon: "clipboard-list", label: "Notes", value: record.notes },
          ].map((item, index) => (
            <View style={styles.section} key={index}>
              <FontAwesome5 name={item.icon} size={18} color="#6C63FF" />
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.info}>{item.value}</Text>
            </View>
          ))}

          {[
            { title: "Physical Symptoms", data: record.physicalSymptoms },
            { title: "Mental Disorders", data: record.mentalDisorders },
            {
              title: "Therapeutic Activities",
              data: record.therapeuticActivities,
            },
            { title: "Physical Activities", data: record.physicalActivities },
            { title: "Food Preferences", data: record.foodPreferences },
            {
              title: "Entertainment Preferences",
              data: record.entertainmentPreferences,
            },
          ].map((section, index) => (
            <View key={index}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.data.map((item, subIndex) => (
                <Text key={subIndex} style={styles.info}>
                  - {item}
                </Text>
              ))}
            </View>
          ))}
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
    backgroundColor: "#f5f5f5",
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C63FF",
    marginLeft: 8,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  date: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  info: {
    fontSize: 16,
    color: "#555",
    flex: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C63FF",
    marginTop: 15,
  },
});
