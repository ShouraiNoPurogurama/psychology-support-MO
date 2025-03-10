import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Pressable,
} from "react-native";
import { Footer } from "../../../component/doctorFooter";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FontAwesome5 } from "@expo/vector-icons";

export default function DoctorPatients() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation cho danh sách

  interface Patient {
    id: number;
    name: string;
    gender: string;
    age: number;
    dob: string;
    avatar: string;
  }

  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    try {
      const response = await fetch(
        "https://psychologysupportprofile-fddah4eef4a7apac.eastasia-01.azurewebsites.net/patients?PageIndex=1&PageSize=10"
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const result = await response.json();
      setPatientList(result?.paginatedResult?.data || []);
      
      // Bắt đầu animation fade-in khi dữ liệu tải xong
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error("Error fetching patient data:", error);
      setPatientList([]);
    } finally {
      setLoading(false);
    }
  }, [fadeAnim]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6A8CAF" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
        </TouchableOpacity>
        <Text style={styles.header}>Patients</Text>
      </View>

      <View style={styles.container}>
        {patientList.length === 0 ? (
          <Text style={styles.noPatientsText}>No patients found</Text>
        ) : (
          <Animated.FlatList
            style={{ opacity: fadeAnim }}
            data={patientList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image
                  source={{ uri: item.avatar || "https://placehold.co/60x60" }}
                  style={styles.avatar}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name || "Unknown Name"}</Text>
                  <Text style={styles.details}>
                    {item.gender}, {item.age ? `${item.age} years` : "N/A"}
                  </Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.detailButton,
                    { backgroundColor: pressed ? "#388E3C" : "#4CAF50" },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/doctors/patients/patientDetails",
                      params: {
                        name: item.name,
                        gender: item.gender,
                        age: item.age,
                        dob: item.dob,
                        avatar: item.avatar,
                      },
                    })
                  }
                >
                  <Text style={styles.statusText}>Detail</Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FB",
    paddingTop: 20,
    paddingHorizontal: 20,
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
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B3F72",
    marginLeft: 40,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -22 }],
    zIndex: 10,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#AF93D2",
  },
  info: { flex: 1 },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
  detailButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noPatientsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});
