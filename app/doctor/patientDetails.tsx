import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { Footer } from "../../component/doctorFooter";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function PatientProfile() {
  const { name, gender, age, avatar, dob } = useLocalSearchParams();

  const patientData = {
    name: name || "Unknown",
    gender: gender || "Unknown",
    age: age || "Unknown",
    avatar: avatar || "https://via.placeholder.com/100",
    dob: dob || "Unknown",
    email: "johndoe@example.com",
    phone: "+123456789",
    medicalHistory: "Diabetes, Hypertension",
    allergies: "Peanuts, Shellfish",
    personalityTraits: "Introversion, Adaptability",
    medicalRecords: [
      { id: 1, title: "Medical Record 1", date: "10 Jan 2024" },
      { id: 2, title: "Medical Record 2", date: "15 Feb 2024" },
    ],
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#AF93D2" />
          </TouchableOpacity>
          <Text style={styles.header}>Patient Profile</Text>
          <MaterialIcons
            name="person"
            size={24}
            color="#AF93D2"
            style={styles.personIcon}
          />
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.profileContainer}>
            {/* <Image source={{ uri: patientData.avatar }} style={styles.avatar} /> */}
            <Text style={styles.name}>{patientData.name}</Text>
            <Text style={styles.gender}>{patientData.gender}</Text>
            <Text style={styles.dob}>{patientData.dob}</Text>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Contact Information</Text>
          <View style={styles.iconRow}>
            <MaterialIcons name="email" size={20} color="#999" />
            <Text style={styles.info}>{patientData.email}</Text>
          </View>
          <View style={styles.iconRow}>
            <MaterialIcons name="phone" size={20} color="#999" />
            <Text style={styles.info}>{patientData.phone}</Text>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Health condition</Text>
          <Text style={styles.label}>Medical History</Text>
          <Text style={styles.info}>
            {patientData.medicalHistory || "No medical history available"}
          </Text>
          <Text style={styles.label}>Allergies</Text>
          <Text style={styles.info}>
            {patientData.allergies || "No allergies reported"}
          </Text>
          <Text style={styles.label}>Personality Traits</Text>
          <Text style={styles.info}>
            {patientData.personalityTraits || "No personality traits reported"}
          </Text>
        </View>
        <View style={styles.sectionContainer}>
        <Text style={styles.header}>Medical Records</Text>
          {patientData.medicalRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <Text style={styles.recordText}>
                {record.title} - {record.date}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/doctor/medicalRecordDetails",
                    params: { id: record.id },
                  })
                }
              >
                <Text style={styles.buttonText}>{">"}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <Footer />
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
  sectionContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#AF93D2",
    marginLeft: 8,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
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
    marginLeft: 10,
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  recordText: {
    fontSize: 16,
    color: "#333",
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  gender: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  dob: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  personIcon: {
    marginLeft: 8,
  },
});
