import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { Footer } from "../../../component/doctorFooter";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { DoctorHeader } from "../../../component/doctorHeader";

export default function PatientProfile() {
  const { name, gender, age, avatar, dob } = useLocalSearchParams();

  const patientData = {
    name: name || "Unknown",
    gender: gender || "Unknown",
    age: age || "Unknown",
    avatar:
      typeof avatar === "string" ? avatar : "https://via.placeholder.com/100",
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
      <DoctorHeader />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <View style={styles.backButtonContent}>
            <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>Patient Profile</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: patientData.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{patientData.name}</Text>
            <Text style={styles.gender}>
              {patientData.gender}, {patientData.age}
            </Text>
            <Text style={styles.info}>{patientData.dob}</Text>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>
            <FontAwesome5 name="address-book" size={24} color="#6C63FF" />{" "}
            Contact Information
          </Text>
          <View style={styles.iconRow}>
            <FontAwesome5
              name="envelope"
              size={18}
              color="#6C63FF"
              style={styles.icon}
            />
            <Text style={styles.info}>{patientData.email}</Text>
          </View>
          <View style={styles.iconRow}>
            <FontAwesome5
              name="phone"
              size={18}
              color="#6C63FF"
              style={styles.icon}
            />
            <Text style={styles.info}>{patientData.phone}</Text>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>
            <FontAwesome5 name="heartbeat" size={24} color="#6C63FF" /> Health
            Condition
          </Text>
          <Text style={styles.subHeader}>Medical History</Text>
          <Text style={styles.info}>
            {patientData.medicalHistory || "No medical history available"}
          </Text>
          <Text style={styles.subHeader}>Allergies</Text>
          <Text style={styles.info}>
            {patientData.allergies || "No allergies reported"}
          </Text>
          <Text style={styles.subHeader}>Personality Traits</Text>
          <Text style={styles.info}>
            {patientData.personalityTraits || "No personality traits reported"}
          </Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>
            <FontAwesome5 name="file-medical" size={24} color="#6C63FF" />{" "}
            Medical Records
          </Text>
          {patientData.medicalRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <Text
                style={styles.recordText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {record.title} - {record.date}
              </Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() =>
                  router.push({
                    pathname: "/doctors/medicalRecords/medicalRecordDetails",
                    params: { id: record.id },
                  })
                }
              >
                <Text style={styles.statusText}>Detail</Text>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C63FF",
    marginLeft: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    elevation: 4,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -22 }],
    zIndex: 10,
  },
  backButtonContent: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  gender: {
    fontSize: 18,
    color: "#333",
    marginTop: 5,
  },
  headerSection: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C63FF",
    marginTop: 10,
  },
  info: {
    fontSize: 18,
    color: "#333",
    marginTop: 5,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  icon: {
    marginRight: 10,
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
    fontSize: 18,
    color: "#333",
  },
  detailButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
