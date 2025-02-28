import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import { Footer } from "../../component/doctorFooter";
import { router } from "expo-router";
import React, { useRef } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { DoctorHeader } from "../../component/doctorHeader";

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
      <DoctorHeader />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={28} color="#6D5BA5" />
        </TouchableOpacity>
        <Text style={styles.header}>Appointment Requests</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AppointmentCard item={item} />}
        />
      </View>
      <Footer />
    </>
  );
}

const AppointmentCard = ({ item }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.item, { transform: [{ scale: scaleValue }] }]}>
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
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FB",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B3F72",
    marginLeft: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 4, // Shadow Android
    shadowColor: "#000", // Shadow iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: "#AF93D2",
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 14,
    color: "#777",
  },
  detailButton: {
    backgroundColor: "#6D5BA5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#6D5BA5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
