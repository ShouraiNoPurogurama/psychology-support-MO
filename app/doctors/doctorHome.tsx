import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { DoctorHeader } from "../../component/doctorHeader";
import { Footer } from "../../component/doctorFooter";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const topBannerImage =
  "https://file.hstatic.net/200000256325/article/auc1576544994_a7cc6e2aaa604d3c86351b929f853a9e.jpg";

export default function Home() {
  const router = useRouter();
  const [doctorName, setDoctorName] = useState("Loading...");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const profileId = decoded?.profileId;
        if (!profileId) throw new Error("Profile ID not found in token");

        const response = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/doctors/${profileId}`
        );
        const data = await response.json();

        setDoctorName(data?.doctorProfileDto?.fullName || "Doctor not found");
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  const handleMyPatientsPress = async () => {
    try {
      const response = await fetch(
        "https://psychologysupport-profile.azurewebsites.net/patients?PageIndex=1&PageSize=10"
      );
      const data = await response.json();
      router.push({
        pathname: "/doctors/patients/doctorPatients",
        params: { patients: JSON.stringify(data) },
      });
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  return (
    <>
      <DoctorHeader />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // Thêm paddingBottom để tránh bị che bởi Footer
      >
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <Text style={styles.title}>Welcome, {doctorName}</Text>
          </View>

          <View style={styles.bannerContainer}>
            <Image source={{ uri: topBannerImage }} style={styles.banner} />
          </View>

          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/doctors/appointments/doctorAppointments")
              }
            >
              <MaterialIcons name="event" size={32} color="#AF93D2" />
              <Text style={styles.cardText}>Appointment Requests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/doctors/workingSchedules/doctorSchedules")
              }
            >
              <MaterialIcons name="schedule" size={32} color="#AF93D2" />
              <Text style={styles.cardText}>My Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/doctors/treatmentHistory/doctorTreatmentHistory")
              }
            >
              <MaterialIcons name="history" size={32} color="#AF93D2" />
              <Text style={styles.cardText}>Patient Medical Records</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1, // Đảm bảo ScrollView chiếm toàn bộ không gian còn lại
    backgroundColor: "#F7F6FB", // Màu nền
  },
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B3F72",
  },
  bannerContainer: {
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  banner: {
    width: "100%",
    height: 160,
    borderRadius: 10,
  },
  cardContainer: {
    width: "90%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    transform: [{ scale: 1 }],
    marginBottom: 20, // Thêm khoảng cách giữa các thẻ
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B3F72",
  },
});
