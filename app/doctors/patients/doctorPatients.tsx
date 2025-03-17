import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Text, Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { Footer } from "../../../component/doctorFooter";

export default function DoctorPatients() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  interface Patient {
    id: string;
    fullName: string;
    gender: string;
    allergies?: string;
    contactInfo: {
      address: string;
      phoneNumber: string;
      email: string;
    };
    medicalHistory: {
      diagnosedAt: string;
      specificMentalDisorders: { name: string; description: string }[];
      physicalSymptoms: { name: string; description: string }[];
    };
  }

  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(
          "https://psychologysupportprofile-fddah4eef4a7apac.eastasia-01.azurewebsites.net/patients?PageIndex=1&PageSize=10&SortBy=fullname&SortOrder=asc&MediccalRecordStatusStatus=Processing"
        );
        if (!response.ok) throw new Error("API Error");

        const result = await response.json();
        const patients = result?.paginatedResult?.data || [];

        setPatientList(patients);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatientList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, [fadeAnim]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} size="large" color="#6A8CAF" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {/* Header với nút quay lại */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
          </TouchableOpacity>
          <Text style={styles.header}>Patients</Text>
        </View>

        {/* Danh sách bệnh nhân */}
        {patientList.map((patient) => (
          <Animated.View key={patient.id} style={{ opacity: fadeAnim }}>
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: "https://placehold.co/60x60" }} // Không có avatar từ API
                  style={styles.avatar}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{patient.fullName}</Text>
                  <Text style={styles.details}>
                    {patient.gender} | {patient.allergies || "No allergies"}
                  </Text>
                </View>
                <Button
                  mode="contained"
                  buttonColor="#4CAF50"
                  onPress={() =>
                    router.push({
                      pathname: "/doctors/patients/patientDetails",
                      params: {
                        id: patient.id,
                      },
                    })
                  }
                >
                  Detail
                </Button>
              </View>
            </Card>
          </Animated.View>
        ))}
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FB",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F6FB",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B3F72",
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#AF93D2",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
});
