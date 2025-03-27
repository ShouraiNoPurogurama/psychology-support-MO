import { router, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Student_Header } from "../../../component/Student_Header";
import { Footer } from "../../../component/Footer";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import BookingModal from "../../../component/BookingModal";
import React from "react";
import axios from 'axios';
import { LinearGradient } from "expo-linear-gradient"; // Thêm gradient cho nút

type Doctor = {
  id: string;
  userId: string;  // Added userId
  name: string;
  specialty: string;
  address: string;
  phoneNumber: string;
  email: string;
  gender: string;
  rating: number;
  image: string;
  bio: string;
  yearsOfExperience: number;
  qualifications: string;
};

// Dữ liệu doctors giữ nguyên, không thay đổi

export default function DoctorDetail() {
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const IMAGE_API_URL = "https://psychologysupport-image.azurewebsites.net/image/get";

  const fetchDoctorImage = async (userId: string): Promise<string> => {
    try {
      const response = await axios.get(`${IMAGE_API_URL}?ownerType=User&ownerId=${userId}`);
      return response.data.url || "https://via.placeholder.com/150"; // Fallback image if API fails
    } catch (error) {
      console.error(`Error fetching image for userId ${userId}:`, error);
      return "https://via.placeholder.com/150"; // Fallback image on error
    }
  };

  useEffect(() => {
    const fetchDoctorDetail = async () => {
      try {
        const response = await fetch(`https://psychologysupport-profile.azurewebsites.net/doctors/${id}`);
        if (!response.ok) throw new Error("Failed to fetch doctor details");
        const data = await response.json();
        const doctorData = data.doctorProfileDto;
        const imageUrl = await fetchDoctorImage(doctorData.userId); // Assuming userId exists in the response

        const formattedDoctor: Doctor = {
          id: doctorData.id,
          userId: doctorData.userId, // Add userId to the formatted doctor object
          name: doctorData.fullName,
          specialty: (doctorData.specialties as { name: string }[]).map((s) => s.name).join(", "),
          address: doctorData.contactInfo.address,
          phoneNumber: doctorData.contactInfo.phoneNumber,
          email: doctorData.contactInfo.email,
          gender: doctorData.gender,
          rating: doctorData.rating,
          image: imageUrl|| "https://kenh14cdn.com/203336854389633024/2022/5/6/f04d70b1f6e140338a7d2f27ebe67685-1651808959048730170550.png",
          bio: doctorData.bio,
          yearsOfExperience: doctorData.yearsOfExperience,
          qualifications: doctorData.qualifications,
        };
        setDoctor(formattedDoctor);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error || !doctor) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Doctor not found"}</Text>
      </View>
    );
  }

  return (
    <>
      <Student_Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Avatar bác sĩ */}
          <TouchableOpacity activeOpacity={0.8}>
            <Image
              source={{ uri: doctor.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Thông tin chính */}
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <Text style={styles.address}>
            <FontAwesome name="map-marker" size={14} color="#555" /> {doctor.address}
          </Text>

          {/* Thẻ thông tin liên hệ */}
          <View style={styles.contactCard}>
            <Text style={styles.contactText}>
              <FontAwesome name="venus-mars" size={16} color="#007BFF" /> Gender: {doctor.gender}
            </Text>
            <Text style={styles.contactText}>
              <FontAwesome name="phone" size={16} color="#007BFF" /> {doctor.phoneNumber}
            </Text>
            <Text style={styles.contactText}>
              <FontAwesome name="envelope" size={16} color="#007BFF" /> {doctor.email}
            </Text>
          </View>

          {/* Đánh giá */}
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}> {doctor.rating} / 5</Text>
          </View>

          {/* Giới thiệu */}
          {doctor.bio && (
            <>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio} numberOfLines={showMore ? undefined : 3}>
                {doctor.bio}
              </Text>
              <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                <Text style={styles.showMore}>{showMore ? "Show Less" : "Show More"}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Kinh nghiệm */}
          {doctor.yearsOfExperience > 0 && (
            <>
              <Text style={styles.sectionTitle}>Experience</Text>
              <Text style={styles.text}>{doctor.yearsOfExperience} years</Text>
            </>
          )}

          {/* Trình độ học vấn */}
          {doctor.qualifications && (
            <>
              <Text style={styles.sectionTitle}>Education</Text>
              <Text style={styles.text}>{doctor.qualifications}</Text>
            </>
          )}

          {/* Nút đặt lịch */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#007BFF", "#00C4FF"]}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Book Appointment</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
      <BookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        doctorId={doctor.id}
        onConfirm={(selectedTime) => {
          console.log(`Confirmed appointment at ${selectedTime} with doctor ${doctor.id}`);
          setModalVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 110,
    paddingBottom: 80,
    backgroundColor: "#F5F7FA", // Màu nền nhẹ nhàng
  },
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#007BFF",
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  specialty: {
    fontSize: 16,
    color: "#777",
    marginVertical: 5,
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  contactCard: {
    width: "100%",
    backgroundColor: "#F0F6FF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  contactText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  rating: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007BFF",
    marginTop: 20,
    alignSelf: "flex-start",
  },
  bio: {
    fontSize: 15,
    color: "#666",
    textAlign: "justify",
    lineHeight: 22,
  },
  showMore: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
    marginTop: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    alignSelf: "flex-start",
    marginVertical: 5,
  },
  button: {
    marginTop: 30,
    width: "80%",
    borderRadius: 25,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  errorText: {
    fontSize: 16,
    color: "#FF4444",
    fontWeight: "500",
  },
});