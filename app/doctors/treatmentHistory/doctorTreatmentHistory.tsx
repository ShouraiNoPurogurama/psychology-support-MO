import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { DoctorHeader } from "../../../component/doctorHeader";

type HistoryRecord = {
  id: number;
  patientName: string;
  symptoms: string;
  diagnosis: string;
};

type HistoryRecords = Record<string, HistoryRecord[]>;

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
  return (
    <>
      <DoctorHeader />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <View style={styles.backButtonContent}>
            <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>Treatment History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(historyRecords).map(([date, records]) => (
          <View key={date} style={styles.historySection}>
            <Text style={styles.date}>{date}</Text>
            {records.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.historyItem}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/doctors/medicalRecords/medicalRecordDetails",
                    params: { id: item.id.toString() },
                  })
                }
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="person" size={30} color="#6C63FF" />
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.patientName}>{item.patientName}</Text>
                  <Text style={styles.symptoms}>🩺 Symptoms: {item.symptoms}</Text>
                  <Text style={styles.diagnosis}>📋 Diagnosis: {item.diagnosis}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    paddingHorizontal: 15,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 100,
    paddingHorizontal: 15,
  },
  header: {
    flex: 1, 
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C63FF",
    textAlign: "center",
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
  },
  historySection: {
    marginBottom: 15,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
    marginLeft: 5,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3E1FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  symptoms: {
    fontSize: 14,
    color: "#666",
  },
  diagnosis: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});

