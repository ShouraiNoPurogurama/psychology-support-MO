import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function DoctorHistory() {
  interface MedicalRecord {
    id: string;
    patientProfileId: string;
    notes: string;
    createdAt: string;
  }

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const doctorId = decoded?.profileId;
        if (!doctorId) throw new Error("Profile ID not found in token");

        const response = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/medical-records?DoctorId=${doctorId}&PageIndex=1&PageSize=10&SortBy=CreatedAt&SortOrder=dsc&Status=Done`
        );

        if (!response.ok) throw new Error("Failed to fetch medical records");

        const result = await response.json();
        setMedicalRecords(result.medicalRecords.data);

        // Fetch patient names only if patientProfileId is valid
        result.medicalRecords.data.forEach(async (record: { patientProfileId: string; }) => {
          if (record.patientProfileId) {
            try {
              const patientResponse = await fetch(
                `https://psychologysupport-profile.azurewebsites.net/patients/${record.patientProfileId}`
              );

              if (patientResponse.ok) {
                const patientData = await patientResponse.json();
                setPatientNames((prev) => ({
                  ...prev,
                  [record.patientProfileId]: patientData.patientProfileDto.fullName,
                }));
              } else {
                console.error("Error fetching patient name: Invalid response", patientResponse.status);
              }
            } catch (err) {
              console.error("Error fetching patient name:", err);
            }
          }
        });
      } catch (error) {
        Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
        console.error("Fetch Error:", error);
      }
    };

    fetchMedicalRecords();
  }, []);

  return (
    <>
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
        {medicalRecords.map((record) => (
          <TouchableOpacity
            key={record.id}
            style={styles.historyItem}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/doctors/medicalRecords/medicalRecordDetails",
                params: { id: record.id },
              })
            }
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="person" size={30} color="#6C63FF" />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.patientName}>
                {patientNames[record.patientProfileId] || "Unknown Patient"}
              </Text>
              <Text style={styles.notes}>📝 Notes: {record.notes}</Text>
              <Text style={styles.createdAt}>
                📅 Date: {new Date(record.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
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
  notes: {
    fontSize: 14,
    color: "#666",
  },
  createdAt: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});
