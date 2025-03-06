import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";

export default function DoctorProfile() {
  const params = useLocalSearchParams();

  const doctor = {
    id: params.id || "",
    name: params.name || "Doctor not updated",
    specialty: params.specialty || "Specialty not updated",
    experience: params.experience || "0",
    patientsTreated: params.patientsTreated || "0",
    phone: params.phone || "Not updated",
    email: params.email || "Not updated",
    address: params.address || "No address provided",
    certificates: params.certificates || "No certificates available",
    workplace: params.workplace || "No workplace provided",
    avatar: Array.isArray(params.avatar)
      ? params.avatar[0]
      : params.avatar || "https://via.placeholder.com/150",
  };

  return (
    <View style={styles.wrapper}>
      <DoctorHeader />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backButtonContent}>
            <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>Doctor Profile</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: doctor.avatar }}
              style={styles.avatar}
              resizeMode="contain"
            />
            <Text style={styles.name}>{doctor.name}</Text>
            <Text style={styles.specialty}>{doctor.specialty}</Text>
            <Text style={styles.experience}>
              🩺 {doctor.experience} years of experience
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>Contact Information</Text>
          <View style={styles.iconRow}>
            <MaterialIcons name="email" size={20} color="#999" />
            <Text style={styles.info}>{doctor.email}</Text>
          </View>
          <View style={styles.iconRow}>
            <MaterialIcons name="phone" size={20} color="#999" />
            <Text style={styles.info}>{doctor.phone}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>Statistics</Text>
          <Text style={styles.statText}>
            👩‍⚕️ {doctor.patientsTreated} Patients Treated
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>Additional Information</Text>
          <Text style={styles.info}>🏥 {doctor.workplace}</Text>
          <Text style={styles.info}>📜 {doctor.certificates}</Text>
          <Text style={styles.info}>📍 {doctor.address}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: "/doctors/profiles/updateProfile",
                params: {
                  id: doctor.id,
                  name: doctor.name,
                  specialty: doctor.specialty,
                  experience: doctor.experience,
                  email: doctor.email,
                  phone: doctor.phone,
                  address: doctor.address,
                  workplace: doctor.workplace,
                  certificates: doctor.certificates,
                },
              })
            }
          >
            <Text style={styles.buttonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F7F8FC" },
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: { padding: 10 },
  backButtonContent: { flexDirection: "row", alignItems: "center" },
  header: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#6A8CAF" },
  sectionContainer: { backgroundColor: "#fff", padding: 20, marginVertical: 5, borderRadius: 10 },
  profileContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "bold", color: "#333" },
  specialty: { fontSize: 16, color: "#777" },
  experience: { fontSize: 14, color: "#555", marginTop: 5 },
  headerSection: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#444" },
  iconRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  info: { fontSize: 16, marginLeft: 10, color: "#333" },
  statText: { fontSize: 16, color: "#555" },
  editButton: { backgroundColor: "#6A8CAF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
