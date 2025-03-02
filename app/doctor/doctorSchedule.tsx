import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { DoctorHeader } from "../../component/doctorHeader";
import { Footer } from "../../component/doctorFooter";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const appointments = {
  "2025-03-01": [
    {
      id: 1,
      name: "Nguyen Van A",
      time: "09:00 AM",
      gender: "Male",
      age: 30,
      phone: "0123456789",
      email: "nguyenvana@example.com",
    },
    {
      id: 2,
      name: "Tran Thi B",
      time: "10:30 AM",
      gender: "Female",
      age: 25,
      phone: "0987654321",
      email: "tranthib@example.com",
    },
  ],
  "2025-03-05": [
    {
      id: 3,
      name: "Le Hoang C",
      time: "02:00 PM",
      gender: "Male",
      age: 40,
      phone: "0934567890",
      email: "lehoangc@example.com",
    },
  ],
};

export default function DoctorSchedule() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [patients, setPatients] = useState(appointments[today] || []);

  useEffect(() => {
    setPatients(appointments[selectedDate] || []);
  }, [selectedDate]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const markedDates = Object.keys(appointments).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: "red", selectedColor: "red" };
    return acc;
  }, {});

  const handleAppointmentPress = (patient) => {
    router.push({
      pathname: "/doctor/scheduleAppointment",
      params: {
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        date: selectedDate,
        time: patient.time,
      },
    });
  };

  return (
    <>
      <DoctorHeader />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
        </TouchableOpacity>

        <Calendar
          current={today}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              selectedColor: "#6A8CAF",
              marked: !!appointments[selectedDate],
              dotColor: "red",
            },
            [today]: {
              selected: true,
              selectedColor: "#D9534F",
              textDayFontWeight: "bold",
              textDayFontSize: 18,
            },
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            selectedDayBackgroundColor: "#6A8CAF",
            todayTextColor: "#D9534F",
            arrowColor: "#6A8CAF",
            textMonthFontSize: 26,
            textMonthFontWeight: "bold",
            textDayHeaderFontSize: 14,
            textDayHeaderFontWeight: "bold",
            textDayHeaderColor: "#000",
          }}
        />

        <Text style={styles.title}>
          {patients.length > 0
            ? `Patients scheduled on ${formatDate(selectedDate)}`
            : `No appointments on ${formatDate(selectedDate)}`}
        </Text>

        <FlatList
          data={patients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.patientItem}
              onPress={() => handleAppointmentPress(item)}
            >
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientTime}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#6A8CAF",
  },
  patientItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  patientTime: {
    fontSize: 14,
    color: "#666",
  },
});
