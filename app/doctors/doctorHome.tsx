import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { DoctorHeader } from "../../component/doctorHeader";
import { Footer } from "../../component/doctorFooter";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const avatarUrl =
  "https://bizweb.dktcdn.net/100/175/849/files/chup-anh-profile-cho-bac-si-tai-ha-noi-studio-yeu-media-dep-01.jpg?v=1636203347577";

const topBannerImage =
  "https://file.hstatic.net/200000256325/article/auc1576544994_a7cc6e2aaa604d3c86351b929f853a9e.jpg";

const doctorName = "Dr. Nguyen Van Minh";

export default function Home() {
  const router = useRouter();

  const handleMyPatientsPress = async () => {
    try {
      const response = await fetch(
        "https://psychologysupportprofile-fddah4eef4a7apac.eastasia-01.azurewebsites.net/patients?PageIndex=1&PageSize=10"
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
      <DoctorHeader avatarUrl={avatarUrl} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
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
              <Text style={styles.cardText}>Appointment Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={handleMyPatientsPress}
            >
              <MaterialIcons name="group" size={32} color="#AF93D2" />
              <Text style={styles.cardText}>My Patients</Text>
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
              <Text style={styles.cardText}>Treatment History</Text>
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
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20,
  },
  container: {
    width: "100%",
    backgroundColor: "#F7F6FB",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#AF93D2",
    marginBottom: 10,
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
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  card: {
    width: "45%",
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    transform: [{ scale: 1 }],
  },
  cardText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "#4B3F72",
  },
  bottomBannerContainer: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: "#AF93D2",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
  },
  imageWrapper: {
    flex: 1,
    position: "relative",
  },
  bottomBannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bottomBannerTextContainer: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  bannerSubtitle: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
});
