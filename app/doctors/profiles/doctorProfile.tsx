import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { Footer } from "../../../component/doctorFooter";

interface DoctorProfile {
  profileId: string;
  fullName?: string;
  specialties?: { name: string }[];
  yearsOfExperience?: number;
  contactInfo?: {
    email?: string;
    phoneNumber?: string;
    address?: string;
  };
  qualifications?: string;
  bio?: string;
}

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<DoctorProfile>({
    profileId: "",
  });

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        // Giải mã token để lấy profileId
        const decoded: any = jwtDecode(token);
        const profileId = decoded?.profileId;
        if (!profileId) throw new Error("Profile ID not found in token");

        console.log("Decoded Profile ID:", profileId);

        // Gọi API lấy thông tin bác sĩ
        const response = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/doctors/${profileId}`
        );
        const data = await response.json();
        setDoctor(data.doctorProfileDto);
      } catch (error) {
        console.error("Error fetching doctor info:", error);
      }
    };

    fetchDoctorInfo();
  }, []);

  return (
    <View style={styles.wrapper}>
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
            <FontAwesome name="user-md" size={80} color="#6A8CAF" style={styles.icon} />
            <Text style={styles.name}>{doctor.fullName || "Doctor not updated"}</Text>
            <Text style={styles.specialty}>
              {doctor.specialties?.map((s) => s.name).join(", ") || "Specialty not updated"}
            </Text>
            <Text style={styles.experience}>
              🧬 {doctor.yearsOfExperience || 0} years of experience
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>Contact Information</Text>
          <View style={styles.iconRow}>
            <FontAwesome5 name="envelope" size={20} color="#6A8CAF" />
            <Text style={styles.info}>{doctor.contactInfo?.email || "Not updated"}</Text>
          </View>
          <View style={styles.iconRow}>
            <FontAwesome5 name="phone" size={20} color="#6A8CAF" />
            <Text style={styles.info}>{doctor.contactInfo?.phoneNumber || "Not updated"}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.headerSection}>Additional Information</Text>
          <Text style={styles.info}>🎓 {doctor.qualifications || "No qualifications available"}</Text>
          <Text style={styles.info}>📍 {doctor.contactInfo?.address || "No address provided"}</Text>
          <Text style={styles.info}>📝 {doctor.bio || "No biography available"}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: "/doctors/profiles/updateProfile",
                params: {
                  id: doctor.profileId || "",
                  fullName: doctor.fullName || "",
                  specialties: doctor.specialties?.map((s) => s.name).join(", ") || "",
                  yearsOfExperience: String(doctor.yearsOfExperience || 0),
                  email: doctor.contactInfo?.email || "",
                  phoneNumber: doctor.contactInfo?.phoneNumber || "",
                  address: doctor.contactInfo?.address || "",
                  qualifications: doctor.qualifications || "",
                  bio: doctor.bio || "",
                },
              })
            }
          >
            <Text style={styles.buttonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              AsyncStorage.removeItem("authToken");
              router.push("/login");     
            }
          }>
            <Text style={styles.buttonText}>🔓 Logout</Text>
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
  icon: { marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "bold", color: "#333" },
  specialty: { fontSize: 16, color: "#777" },
  experience: { fontSize: 14, color: "#555", marginTop: 5 },
  headerSection: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#444" },
  iconRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  info: { fontSize: 16, marginLeft: 10, color: "#333" },
  editButton: { backgroundColor: "#6A8CAF", padding: 12, borderRadius: 8, alignItems: "center" },
  logoutButton: { backgroundColor: "#6A8CAF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  statText: { fontSize: 16, color: "#555" },
});
