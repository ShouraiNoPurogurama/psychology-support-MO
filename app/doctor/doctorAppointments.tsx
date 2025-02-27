import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Footer } from "../../component/doctorFooter";
import { router } from "expo-router";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const appointments = [
  {
    id: "1",
    name: "Jack Trinh",
    gender: "Male",
    age: 28,
    date: "2025-02-27",
    time: "7:00-7:30",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: "2",
    name: "Jack Tran",
    gender: "Female",
    age: 23,
    date: "2025-02-27",
    time: "8:00-8:30",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: "3",
    name: "Jack Phuong",
    gender: "Male",
    age: 27,
    date: "2025-02-27",
    time: "9:00-9:30",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: "4",
    name: "Jack Tuan",
    gender: "Male",
    age: 28,
    date: "2025-02-27",
    time: "10:00-10:30",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: "5",
    name: "Jack BoCon",
    gender: "Female",
    age: 42,
    date: "2025-02-27",
    time: "11:00-11:30",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: "6",
    name: "Jack BoVo",
    gender: "Male",
    age: 35,
    date: "2025-02-27",
    time: "12:00-12:30",
    avatar: "https://via.placeholder.com/50",
  },
];

export default function DoctorAppointments() {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#AF93D2" />
          </TouchableOpacity>
          <Text style={styles.header}>Appointment Requests</Text>
        </View>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.name} ({item.gender}, {item.age})
                </Text>
                <Text style={styles.time}>
                  {item.date} | {item.time}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() =>
                  router.push({
                    pathname: "/doctor/appointmentDetails",
                    params: {
                      name: item.name,
                      gender: item.gender,
                      age: item.age,
                      date: item.date,
                      time: item.time,
                      avatar: item.avatar,
                    },
                  })
                }
              >
                <Text style={styles.statusText}>Detail</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 14,
    color: "#555",
  },
  detailButton: {
    backgroundColor: "#AF93D2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
