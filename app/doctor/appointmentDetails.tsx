import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { Footer } from "../../component/doctorFooter";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={22} color="#888" />
          </TouchableOpacity>
          <Text style={styles.header}>Appointment Details</Text>
        </View>

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
            <FontAwesome
              name="envelope"
              size={18}
              color="#555"
              style={styles.icon}
            />
            <Text style={styles.info}>{patientData.email}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome
              name="phone"
              size={18}
              color="#555"
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
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.buttonText}>Confirm</Text>
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
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#AF93D2",
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
    color: "#999",
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
    backgroundColor: "#4CAF50",
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
