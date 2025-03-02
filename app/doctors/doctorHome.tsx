import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { DoctorHeader } from "../../component/doctorHeader";
import { Footer } from "../../component/doctorFooter";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";


const avatarUrl =
  "https://bizweb.dktcdn.net/100/175/849/files/chup-anh-profile-cho-bac-si-tai-ha-noi-studio-yeu-media-dep-01.jpg?v=1636203347577";
const bannerUrl =
  "https://file.hstatic.net/200000256325/article/auc1576544994_a7cc6e2aaa604d3c86351b929f853a9e.jpg";
const doctorName = "Dr. John Doe";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <DoctorHeader avatarUrl={avatarUrl} />
      <View style={styles.container}>
 
        <View style={styles.profileSection}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={styles.title}>Welcome, {doctorName}</Text>
        </View>


        <View style={styles.bannerContainer}>
          <Image source={{ uri: bannerUrl }} style={styles.banner} />
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
            style={styles.bannerOverlay}
          />
        </View>


        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/doctors/appointments/doctorAppointments")}
          >
            <MaterialIcons name="event" size={32} color="#AF93D2" />
            <Text style={styles.cardText}>Appointment Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/doctors/patients/doctorPatients")}
          >
            <MaterialIcons name="group" size={32} color="#AF93D2" />
            <Text style={styles.cardText}>My Patients</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/doctors/workingSchedules/doctorSchedules")}
          >
            <MaterialIcons name="schedule" size={32} color="#AF93D2" />
            <Text style={styles.cardText}>My Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  bannerOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
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
});
