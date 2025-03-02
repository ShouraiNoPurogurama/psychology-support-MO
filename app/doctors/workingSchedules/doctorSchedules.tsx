import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

type Appointment = {
  id: number;
  name: string;
  time: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
};

type Appointments = {
  [date: string]: Appointment[];
};

type DayObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const appointments: Appointments = {
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
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [patients, setPatients] = useState<Appointment[]>(
    appointments[today] || []
  );

  useEffect(() => {
    setPatients(appointments[selectedDate] || []);
  }, [selectedDate]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const markedDates = Object.keys(appointments).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: "red", selectedColor: "red" };
    return acc;
  }, {} as { [key: string]: { marked: boolean; dotColor: string; selectedColor: string } });

  const handleAppointmentPress = (patient: Appointment) => {
    router.push({
      pathname: "/doctors/appointments/scheduleAppointmentDetails",
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
        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.5 : 1 }, // Hiệu ứng mờ khi nhấn
            ]}
          >
            <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
          </Pressable>

          <Text style={styles.headerTitle}>Working Schedule</Text>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
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
            onDayPress={(day: DayObject) => setSelectedDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: "#6A8CAF",
              todayTextColor: "#D9534F",
              arrowColor: "#6A8CAF",
              textMonthFontSize: 20,
              textMonthFontWeight: "bold",
              textDayHeaderFontSize: 14,
              textDayHeaderFontWeight: "bold",
              textDayHeaderColor: "#000",
            }}
          />
        </View>

        {/* Appointment List */}
        <Text style={styles.title}>
          {patients.length > 0
            ? `Patients scheduled on ${formatDate(selectedDate)}`
            : `No appointments on ${formatDate(selectedDate)}`}
        </Text>

        <FlatList
          data={patients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.patientItem}
              onPress={() => handleAppointmentPress(item)}
            >
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientTime}>{item.time}</Text>
            </Pressable>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
    paddingVertical: 10,
  },
  backButton: {
    position: "absolute",
    left: 10, // Căn lề trái
    padding: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A8CAF",
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
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
