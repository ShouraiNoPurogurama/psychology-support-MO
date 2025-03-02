import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

type HistoryRecord = {
  id: number;
  patientName: string;
  symptoms: string;
  diagnosis: string;
};

type HistoryRecords = {
  [date: string]: HistoryRecord[];
};

const historyRecords: HistoryRecords = {
  "2025-02-25": [
    {
      id: 1,
      patientName: "Nguyen Van A",
      symptoms: "Headache, fever",
      diagnosis: "Migraine",
    },
    {
      id: 2,
      patientName: "Tran Thi B",
      symptoms: "Cough, sore throat",
      diagnosis: "Flu",
    },
  ],
  "2025-02-20": [
    {
      id: 3,
      patientName: "Le Hoang C",
      symptoms: "Stomach pain",
      diagnosis: "Gastritis",
    },
  ],
};

export default function DoctorHistory() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [history, setHistory] = useState(historyRecords[today] || []);
  const router = useRouter();

  // Tạo object để đánh dấu ngày có lịch sử điều trị
  const markedDates = Object.keys(historyRecords).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: "#D9534F", selectedColor: "#6A8CAF" };
    return acc;
  }, {} as Record<string, any>);

  // Đánh dấu ngày được chọn
  markedDates[selectedDate] = { selected: true, selectedColor: "#6A8CAF" };

  const handleDateChange = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setHistory(historyRecords[day.dateString] || []);
  };

  return (
    <>
      <DoctorHeader />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <View style={styles.backButtonContent}>
              <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Treatment History</Text>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={today}
            markedDates={markedDates}
            onDayPress={handleDateChange}
            theme={{
              selectedDayBackgroundColor: "#6A8CAF",
              todayTextColor: "#D9534F",
              arrowColor: "#6A8CAF",
            }}
          />
        </View>

        <Text style={styles.title}>History on {selectedDate}</Text>

        {/* Lịch sử điều trị */}
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() =>
                router.push({
                  pathname: "/doctors/history/details",
                  params: {
                    patientName: item.patientName,
                    symptoms: item.symptoms,
                    diagnosis: item.diagnosis,
                    date: selectedDate,
                  },
                })
              }
            >
              <Text style={styles.patientName}>{item.patientName}</Text>
              <Text style={styles.symptoms}>Symptoms: {item.symptoms}</Text>
              <Text style={styles.diagnosis}>Diagnosis: {item.diagnosis}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noDataText}>No records for this date</Text>
          }
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
    backgroundColor: "#F7F6FB",
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
    left: 10,
    top: "50%",
    transform: [{ translateY: -22 }],
    zIndex: 10,
  },
  backButtonContent: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A8CAF",
  },
  calendarContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#6A8CAF",
  },
  historyItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  symptoms: {
    fontSize: 14,
    color: "#666",
  },
  diagnosis: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
});
