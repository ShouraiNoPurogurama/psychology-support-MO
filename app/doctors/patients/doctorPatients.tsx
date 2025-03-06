import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Footer } from "../../../component/doctorFooter";
import { router } from "expo-router";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { DoctorHeader } from "../../../component/doctorHeader";
import { FontAwesome5 } from "@expo/vector-icons";

const appointments = [
  {
    id: "1",
    name: "Trinh Van Minh",
    gender: "Male",
    age: 28,
    dob: "01-01-1993",
    avatar:
      "https://gobranding.com.vn/wp-content/uploads/2023/06/9-photographer-la-gi.jpg",
  },
  {
    id: "2",
    name: "Tran Thi Hoa",
    gender: "Female",
    age: 23,
    dob: "02-02-1998",
    avatar: "https://topjobvn.com/wp-content/uploads/2020/08/Nhiep_anh_gia.jpg",
  },
  {
    id: "3",
    name: "Phuong Van Nam",
    gender: "Male",
    age: 27,
    dob: "03-03-1994",
    avatar:
      "https://gobranding.com.vn/wp-content/uploads/2023/06/9-photographer-la-gi.jpg",
  },
  {
    id: "4",
    name: "Tuan Van Bao",
    gender: "Male",
    age: 28,
    dob: "04-04-1993",
    avatar:
      "https://gobranding.com.vn/wp-content/uploads/2023/06/9-photographer-la-gi.jpg",
  },
  {
    id: "5",
    name: "Nguyen Thi Lan",
    gender: "Female",
    age: 42,
    dob: "05-05-1979",
    avatar: "https://topjobvn.com/wp-content/uploads/2020/08/Nhiep_anh_gia.jpg",
  },
  {
    id: "6",
    name: "Le Van Duc",
    gender: "Male",
    age: 35,
    dob: "06-06-1986",
    avatar:
      "https://gobranding.com.vn/wp-content/uploads/2023/06/9-photographer-la-gi.jpg",
  },
  {
    id: "7",
    name: "Pham Thi Mai",
    gender: "Female",
    age: 30,
    dob: "07-07-1991",
    avatar: "https://topjobvn.com/wp-content/uploads/2020/08/Nhiep_anh_gia.jpg",
  },
  {
    id: "8",
    name: "Lam Van Tien",
    gender: "Male",
    age: 26,
    dob: "08-08-1995",
    avatar:
      "https://gobranding.com.vn/wp-content/uploads/2023/06/9-photographer-la-gi.jpg",
  },
  {
    id: "9",
    name: "Hoang Van Khoa",
    gender: "Male",
    age: 29,
    dob: "09-09-1992",
    avatar:
      "https://gobranding.com.vn/wp-content/uploads/2023/06/9-photographer-la-gi.jpg",
  },
  {
    id: "10",
    name: "Linh Thi Phuong",
    gender: "Female",
    age: 24,
    dob: "10-10-1997",
    avatar: "https://topjobvn.com/wp-content/uploads/2020/08/Nhiep_anh_gia.jpg",
  },
];

export default function DoctorPatients() {
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
        <Text style={styles.header}>Patients</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>
                  {item.gender}, {item.age} years
                </Text>
              </View>
              <TouchableOpacity
                style={styles.detailButton}
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
    backgroundColor: "#F7F6FB",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B3F72",
    marginLeft: 40,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    color: "#777",
  },
  detailButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
