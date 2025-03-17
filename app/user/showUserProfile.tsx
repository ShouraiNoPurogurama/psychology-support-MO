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
import Animated, { FadeIn, BounceIn } from "react-native-reanimated";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error("User not authenticated");

        const decoded: any = jwtDecode(token);
        const patientId = decoded.profileId;
        const response = await fetch(
          `https://psychologysupportprofile-fddah4eef4a7apac.eastasia-01.azurewebsites.net/patients/${patientId}`
        );
        const data = await response.json();
        setUser(data.patientProfileDto);
      } catch (error) {
        console.error("Error fetching user data:", error);
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
        <Text style={styles.errorText}>Không thể tải thông tin người dùng.</Text>
      </View>
    );
  }

  return (
    <>
      <Student_Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View entering={FadeIn.duration(700)}>
          <Text style={styles.title}>Thông Tin Người Dùng</Text>
        </Animated.View>

        {/* Avatar người dùng */}
        <Animated.View style={styles.avatarContainer} entering={BounceIn}>
          <Image
            source={{ uri: user.avatarUrl || "https://www.fashionbeans.com/wp-content/uploads/2022/02/Medium-Length-Layered-Hair_zeno_vic.jpg" }}
            style={styles.avatar}
          />
        </Animated.View>

        {/* Thông tin người dùng */}
        <Animated.View style={styles.infoContainer} entering={FadeIn.duration(500)}>
          <Text style={styles.label}>Họ và Tên:</Text>
          <Text style={styles.value}>{user.fullName}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.contactInfo.email}</Text>

          <Text style={styles.label}>Địa chỉ:</Text>
          <Text style={styles.value}>{user.contactInfo.address}</Text>

          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{user.contactInfo.phoneNumber}</Text>

          <Text style={styles.label}>Giới tính:</Text>
          <Text style={styles.value}>{user.gender}</Text>

          <Text style={styles.label}>Dị ứng:</Text>
          <Text style={styles.value}>{user.allergies}</Text>

          <Text style={styles.label}>Tính cách:</Text>
          <Text style={styles.value}>{user.personalityTraits}</Text>
        </Animated.View>

        {/* Nút Edit Profile */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/user/userProfile")}
        >
          <Text style={styles.buttonText}>Chỉnh sửa hồ sơ</Text>
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
    marginTop:40
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
