import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Footer } from "../../../component/doctorFooter";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DoctorHeader } from "../../../component/doctorHeader";

export default function AppointmentDetails() {
  const params = useLocalSearchParams();
  const [bookingDetails, setBookingDetails] = useState<any>({});
  const [patientDetails, setPatientDetails] = useState<any>({});
  const [patientImage, setPatientImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        const bookingResponse = await fetch(
          `https://psychologysupport-scheduling.azurewebsites.net/bookings/${params.bookingCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!bookingResponse.ok)
          throw new Error("Failed to fetch booking details");

        const bookingData = await bookingResponse.json();
        setBookingDetails(bookingData.booking);

        if (bookingData.booking.patientId) {
          const patientResponse = await fetch(
            `https://psychologysupport-profile.azurewebsites.net/patients/${bookingData.booking.patientId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!patientResponse.ok)
            throw new Error("Failed to fetch patient details");

          const patientData = await patientResponse.json();
          setPatientDetails(patientData.patientProfileDto);

          if (!patientData.patientProfileDto.userId) {
            console.error("User ID is missing for the patient");
          } else {
            const imageResponse = await fetch(
              `https://psychologysupport-image.azurewebsites.net/image/get?ownerType=User&ownerId=${patientData.patientProfileDto.userId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (!imageResponse.ok) {
              console.error("Failed to fetch patient image");
            } else {
              const imageData = await imageResponse.json();
              console.log("Patient Image URL:", imageData.url); // Kiểm tra URL ảnh
              setPatientImage(imageData.url); // Lưu URL ảnh vào state
            }
          }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    if (params.bookingCode) {
      fetchDetails();
    }
  }, [params.bookingCode]);

  return (
    <>
      <DoctorHeader />
      <View style={styles.wrapper}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Appointment Details</Text>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.detailsContainer}>
              {patientImage ? (
                <Image
                  source={{ uri: patientImage }}
                  style={styles.avatar}
                  onError={(error) => {
                    console.error("Error loading image:", error.nativeEvent);
                    setPatientImage(null); // Đặt lại ảnh về null nếu lỗi
                  }}
                />
              ) : (
                <MaterialIcons
                  name="person"
                  size={100}
                  color="#AF93D2"
                  style={styles.avatarIcon}
                />
              )}
              <Text style={styles.name}>
                {patientDetails.fullName || "Unknown Patient"}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.header}>Appointment Details</Text>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.info}>
              {bookingDetails.date || "Unknown Date"} -{" "}
              {bookingDetails.startTime || "Unknown Time"}
            </Text>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.info}>{bookingDetails.price || 0} VND</Text>
            <Text style={styles.label}>
              Status: {bookingDetails.status || "Awaiting Meeting"}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.header}>Contact Information</Text>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.info}>
              {patientDetails.contactInfo?.address || "Not provided"}
            </Text>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.info}>
              {patientDetails.contactInfo?.phoneNumber || "Not provided"}
            </Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.info}>
              {patientDetails.contactInfo?.email || "Not provided"}
            </Text>
          </View>
        </ScrollView>
        <Footer />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F7F6FB",
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B3F72",
    marginLeft: 55,
  },
  detailsContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarIcon: {
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  age: {
    fontSize: 16,
    color: "#555",
  },
  avatar: {
    width: 120, // Chiều rộng ảnh
    height: 120, // Chiều cao ảnh
    borderRadius: 60, // Hiển thị ảnh dưới dạng hình tròn
    borderWidth: 2,
    borderColor: "#AF93D2",
    marginBottom: 10,
    resizeMode: "cover", // Đảm bảo ảnh được cắt đúng tỷ lệ
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#777",
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: "#333",
  },
  link: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  declineButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
