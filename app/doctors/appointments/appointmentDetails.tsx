import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Footer } from "../../../component/doctorFooter";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppointmentDetails() {
  const params = useLocalSearchParams();
  const [bookingDetails, setBookingDetails] = useState<any>({});
  const [patientDetails, setPatientDetails] = useState<any>({});

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

        if (!bookingResponse.ok) throw new Error("Failed to fetch booking details");

        const bookingData = await bookingResponse.json();
        setBookingDetails(bookingData.booking);

        if (bookingData.booking.patientId) {
          const patientResponse = await fetch(
            `https://psychologysupport-profile.azurewebsites.net/patients/${bookingData.booking.patientId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!patientResponse.ok) throw new Error("Failed to fetch patient details");

          const patientData = await patientResponse.json();
          setPatientDetails(patientData.patientProfileDto);
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
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backButtonContent}>
            <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
          </View>
        </TouchableOpacity>

        <Text style={styles.header}>Appointment Details</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.sectionContainer}>
          <View style={styles.detailsContainer}>
            <MaterialIcons name="person" size={100} color="#AF93D2" style={styles.avatarIcon} />
            <Text style={styles.name}>{patientDetails.fullName || "Unknown Patient"}</Text>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.info}>{patientDetails.gender || "Unknown"}</Text>
            <Text style={styles.label}>Allergies</Text>
            <Text style={styles.info}>{patientDetails.allergies || "None"}</Text>
            <Text style={styles.label}>Personality Traits</Text>
            <Text style={styles.info}>{patientDetails.personalityTraits || "Not specified"}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Appointment Details</Text>
          <Text style={styles.label}>Date & Time</Text>
          <Text style={styles.info}>
            {bookingDetails.date || "Unknown Date"} - {bookingDetails.startTime || "Unknown Time"}
          </Text>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.info}>{bookingDetails.price || 0} VND</Text>
          <Text style={styles.label}>Status: {bookingDetails.status || "Pending"}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Contact Information</Text>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.info}>{patientDetails.contactInfo?.address || "Not provided"}</Text>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.info}>{patientDetails.contactInfo?.phoneNumber || "Not provided"}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.info}>{patientDetails.contactInfo?.email || "Not provided"}</Text>
        </View>
      </ScrollView>
      <Footer />
    </View>
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
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -22 }],
    zIndex: 10,
    marginBottom: 50,
  },
  backButtonContent: {
    marginBottom: 50,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#AF93D2",
    marginBottom: 10,
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
