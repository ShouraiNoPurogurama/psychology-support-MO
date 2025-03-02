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
import { DoctorHeader } from "../../component/doctorHeader";

export default function DoctorProfile() {
  const params = useLocalSearchParams();

  const doctor = {
    name: params.name || "Doctor not updated",
    specialty: params.specialty || "Specialty not updated",
    experience: params.experience || "0",
    rating: params.rating || "0",
    totalReviews: params.totalReviews || "0",
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
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#AF93D2" />
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
          <Text style={styles.statText}>
            ⭐ {doctor.rating} ({doctor.totalReviews} Reviews)
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
              router.push({ pathname: "/doctor/updateProfile", params: doctor })
            }
          >
            <Text style={styles.buttonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.buttonText}>🚪 Logout</Text>
          </TouchableOpacity>
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
    justifyContent: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#AF93D2",
    marginLeft: 8,
    flex: 1,
  },
  headerSection: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#AF93D2",
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: "50%",
    height: undefined,
    aspectRatio: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  specialty: {
    fontSize: 16,
    color: "#666",
  },
  experience: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  statText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#6A8CAF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#7A5C91",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
