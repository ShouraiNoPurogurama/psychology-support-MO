import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";

export default function AppointmentDetails() {
  const params = useLocalSearchParams();

  const doctorMeetingUrl = "https://meet.google.com/doctor-meeting-link";

  const patientData = {
    name: params.name || "John Doe",
    gender: params.gender || "Male",
    age: params.age || 35,
    avatar: Array.isArray(params.avatar)
      ? params.avatar[0]
      : params.avatar || "https://via.placeholder.com/100",
    email: params.email || "johndoe@example.com",
    phone: params.phone || "+123456789",
    dob: params.dob || "15 March 1989",
    testResult: params.testResult || "Normal",
    date: params.date || "20 March 2024",
    time: params.time || "10:30 AM",
  };

  return (
    <View style={styles.wrapper}>
      <DoctorHeader />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{ marginLeft: 10 }}
        >
          <FontAwesome5 name="arrow-left" size={22} color="#4B3F72" light />
        </TouchableOpacity>
        <Text style={styles.header}>Appointment Details</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.detailsContainer}>
            <Image source={{ uri: patientData.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{patientData.name}</Text>
            <Text style={styles.age}>
              {patientData.age} Years, {patientData.gender}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Contact Information</Text>
          <View style={styles.row}>
            <FontAwesome5
              name="envelope"
              size={18}
              color="#4B3F72"
              style={styles.icon}
            />
            <Text style={styles.info}>{patientData.email}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5
              name="phone"
              size={18}
              color="#4B3F72"
              style={styles.icon}
            />
            <Text style={styles.info}>{patientData.phone}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Medical Information</Text>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.info}>{patientData.dob}</Text>
          <Text style={styles.label}>Test Result</Text>
          <Text style={styles.info}>{patientData.testResult}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Appointment Details</Text>
          <Text style={styles.label}>Date & Time</Text>
          <Text style={styles.info}>
            {patientData.date} - {patientData.time}
          </Text>
          <Text style={styles.label}>Doctor's Google Meet Link</Text>
          <TouchableOpacity onPress={() => Linking.openURL(doctorMeetingUrl)}>
            <Text style={[styles.info, styles.link]}>{doctorMeetingUrl}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.declineButton} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Complete</Text>
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
    marginLeft: 10,
  },
  detailsContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#AF93D2",
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
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
