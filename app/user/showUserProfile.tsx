import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // Add this import

const ShowUserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    fullName: string;
    gender: string;
    allergies: string;
    personalityTraits: string;
    avatarUrl: string;
    contactInfo: {
      address: string;
      phoneNumber: string;
      email: string;
    };
  } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // Add state for avatar URL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error("User not authenticated");

        const decoded: any = jwtDecode(token);
        const patientId = decoded.profileId;
        const userId = decoded.userId;

        // Fetch user profile data
        const profileResponse = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/patients/${patientId}`
        );
        const profileData = await profileResponse.json();
        setUser(profileData.patientProfileDto);

        // Fetch avatar image using axios
        const IMAGE_API_URL = "https://psychologysupport-image.azurewebsites.net/image/get";
        const imageResponse = await axios.get(`${IMAGE_API_URL}?ownerType=User&ownerId=${userId}`);
        setAvatarUrl(imageResponse.data.url || "https://via.placeholder.com/150");

      } catch (error) {
        console.error("Error fetching user data:", error);
        setAvatarUrl("https://via.placeholder.com/150"); // Fallback image on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a5acd" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load user information.</Text>
      </View>
    );
  }

  return (
    <>
      <Student_Header />
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarUrl }} // Use the fetched avatarUrl
            style={styles.avatar}
          />
        </View>

        {/* User Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{user.fullName}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.contactInfo.email}</Text>

          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{user.contactInfo.address}</Text>

          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{user.contactInfo.phoneNumber}</Text>

          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{user.gender}</Text>

          <Text style={styles.label}>Allergies:</Text>
          <Text style={styles.value}>{user.allergies}</Text>

          <Text style={styles.label}>Personality Traits:</Text>
          <Text style={styles.value}>{user.personalityTraits}</Text>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/user/userProfile")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </>
  );
};

export default ShowUserProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    alignItems: "center",
    marginTop: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#6a5acd",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  editButton: {
    marginTop: 30,
    backgroundColor: "#6a5acd",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 150,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});