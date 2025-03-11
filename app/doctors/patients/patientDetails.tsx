import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Footer } from "../../../component/doctorFooter";
import { FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";


export default function PatientProfile() {
  const { id } = useLocalSearchParams();

  interface PatientData {
    fullName: string;
    gender: string;
    age?: number;
    dob?: string;
    personalityTraits?: string;
    contactInfo: {
      email: string;
      phoneNumber: string;
      address: string;
    };
    medicalHistory?: {
      specificMentalDisorders?: { name: string; description: string }[];
      physicalSymptoms?: { name: string; description: string }[];
    };
    allergies?: string;
  }

  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatientDetails() {
      if (!id) return;

      try {
        const response = await fetch(
          `https://psychologysupportprofile-fddah4eef4a7apac.eastasia-01.azurewebsites.net/patients/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch patient details");

        const data = await response.json();
        setPatientData(data.patientProfileDto);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setPatientData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPatientDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6A8CAF" />
      </View>
    );
  }

  if (!patientData) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>No patient data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
        </TouchableOpacity>
        <Text style={styles.header}>Patient Profile</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.nameRow}>
            <FontAwesome5 name="user" size={20} color="#6C63FF" style={styles.iconSpacing} />
            <Text style={styles.name}>{patientData.fullName}</Text>
          </View>
          <Text style={styles.info}>Allergies: {patientData.allergies || "N/A"}</Text>
          <Text style={styles.info}>Personality: {patientData.personalityTraits || "N/A"}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>
            <FontAwesome5 name="address-book" size={20} color="#6C63FF" /> Contact Information
          </Text>
          <View style={styles.iconRow}>
            <FontAwesome5 name="envelope" size={16} color="#6C63FF" style={styles.iconSpacing} />
            <Text style={styles.info}>{patientData.contactInfo.email}</Text>
          </View>
          <View style={styles.iconRow}>
            <FontAwesome5 name="phone" size={16} color="#6C63FF" style={styles.iconSpacing} />
            <Text style={styles.info}>{patientData.contactInfo.phoneNumber}</Text>
          </View>
          <View style={styles.iconRow}>
            <FontAwesome5 name="map-marker-alt" size={16} color="#6C63FF" style={styles.iconSpacing} />
            <Text style={styles.info}>{patientData.contactInfo.address}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>
            <FontAwesome5 name="heartbeat" size={20} color="#6C63FF" /> Health Condition
          </Text>
          <Text style={styles.subHeader}>Mental Disorders</Text>
          {patientData.medicalHistory?.specificMentalDisorders?.map((disorder, index) => (
            <Text key={index} style={styles.bulletPoint}>• {disorder.name} - {disorder.description}</Text>
          )) || <Text style={styles.info}>No mental disorder history available</Text>}

          <Text style={styles.subHeader}>Physical Symptoms</Text>
          {patientData.medicalHistory?.physicalSymptoms?.map((symptom, index) => (
            <Text key={index} style={styles.bulletPoint}>• {symptom.name} ({symptom.description})</Text>
          )) || <Text style={styles.info}>No physical symptoms reported</Text>}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 4,
  },
  header: { fontSize: 24, fontWeight: "bold", color: "#4B3F72", marginLeft: 40 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  iconSpacing: { marginRight: 10 },
  iconRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 20 },
  sectionContainer: {
    borderWidth: 1,
    borderColor: "#4B3F72",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    elevation: 4,
  },
  backButton: { marginRight: 15 },
  info: { fontSize: 16, color: "#333", marginLeft: 10 },
  headerSection: { fontSize: 20, fontWeight: "bold", color: "#4B3F72", marginBottom: 10 },
  subHeader: { fontSize: 18, fontWeight: "bold", color: "#4B3F72", marginTop: 10 },
  bulletPoint: { fontSize: 16, color: "#333", marginLeft: 10, marginVertical: 2 },
  name: { fontSize: 22, fontWeight: "bold", color: "#4B3F72", marginBottom: 10 },
});
