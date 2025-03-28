import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Footer } from "../../../component/doctorFooter";
import { DoctorHeader } from "../../../component/doctorHeader";

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // State để lưu URL hình ảnh

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        // Giải mã token để lấy profileId và userId
        const decoded: any = jwtDecode(token);
        const profileId = decoded?.profileId;
        const userId = decoded?.userId; // Lấy userId từ token
        if (!profileId || !userId)
          throw new Error("Profile ID or User ID not found in token");

        console.log("Decoded Profile ID:", profileId);

        // Gọi API lấy thông tin bác sĩ
        const profileResponse = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/doctors/${profileId}`
        );
        const profileData = await profileResponse.json();
        setDoctor(profileData.doctorProfileDto);

        // Gọi API lấy URL hình ảnh
        const imageResponse = await fetch(
          `https://psychologysupport-image.azurewebsites.net/image/get?ownerType=User&ownerId=${userId}`
        );
        if (!imageResponse.ok) throw new Error("Failed to fetch avatar URL");
        const imageData = await imageResponse.json();
        setAvatarUrl(imageData.url); // Lưu URL hình ảnh vào state
      } catch (error) {
        console.error("Error fetching doctor info or avatar:", error);
      }
    };

    fetchDoctorInfo();
  }, []);

  return (
    <>
      <DoctorHeader />
      <View style={styles.wrapper}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Doctor Profile</Text>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.profileContainer}>
              {avatarUrl ? (
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                </View>
              ) : (
                <FontAwesome
                  name="user-md"
                  size={80}
                  color="#6A8CAF"
                  style={styles.icon}
                />
              )}
              <Text style={styles.name}>
                {doctor.fullName || "Doctor not updated"}
              </Text>
              <Text style={styles.specialty}>
                {doctor.specialties?.map((s) => s.name).join(", ") ||
                  "Specialty not updated"}
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
              <Text style={styles.info}>
                {doctor.contactInfo?.email || "Not updated"}
              </Text>
            </View>
            <View style={styles.iconRow}>
              <FontAwesome5 name="phone" size={20} color="#6A8CAF" />
              <Text style={styles.info}>
                {doctor.contactInfo?.phoneNumber || "Not updated"}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.headerSection}>Additional Information</Text>
            <Text style={styles.info}>
              🎓 {doctor.qualifications || "No qualifications available"}
            </Text>
            <Text style={styles.info}>
              📍 {doctor.contactInfo?.address || "No address provided"}
            </Text>
            <Text style={styles.info}>
              📝 {doctor.bio || "No biography available"}
            </Text>
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
                    specialties:
                      doctor.specialties?.map((s) => s.name).join(", ") || "",
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

            <View style={styles.buttonSpacing} />

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                AsyncStorage.removeItem("authToken");
                router.push("/login");
              }}
            >
              <Text style={styles.buttonText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Footer />
    </>
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
  header: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A8CAF",
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: -1, // Đẩy lên trên để avatar không bị che phủ
  },
  avatarContainer: {
    width: 120, // Kích thước khung avatar
    height: 120, // Kích thước khung avatar
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60, // Bo tròn khung ảnh
    overflow: "hidden", // Cắt phần ảnh vượt ra ngoài
    shadowColor: "#000", // Thêm bóng cho chiều sâu
    elevation: 5, // Bóng cho Android
    marginBottom: 10,
  },
  avatar: {
    width: "100%", // Đảm bảo ảnh chiếm toàn bộ chiều rộng container
    height: "100%", // Đảm bảo ảnh chiếm toàn bộ chiều cao container
    resizeMode: "contain", // Hiển thị ảnh theo tỷ lệ gốc, không bị cắt
  },
  icon: {
    marginBottom: 10,
  },
  name: {
    top: 5,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  specialty: {
    fontSize: 16,
    color: "#777",
  },
  experience: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  headerSection: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
  },
  iconRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  info: { fontSize: 16, marginLeft: 10, color: "#333" },
  editButton: {
    backgroundColor: "#6A8CAF", // Keep the same color for Edit Profile
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#D9534F", // Change to a red color for Logout
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSpacing: {
    height: 10, // Add vertical spacing between buttons
  },
});
