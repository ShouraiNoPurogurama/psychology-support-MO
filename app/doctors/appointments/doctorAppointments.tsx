import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import { Footer } from "../../../component/doctorFooter";
import { router } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<
    {
      bookingCode: string;
      date: string;
      startTime: string;
      duration: number;
      price: number;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const doctorId = decoded?.profileId;
        if (!doctorId) throw new Error("Profile ID not found in token");

        const response = await fetch(
          `https://psychologysupport-scheduling.azurewebsites.net/bookings?PageIndex=1&SortBy=time&PageSize=10&SortOrder=desc&DoctorId=${doctorId}&Status=Awaiting Meeting`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch appointments");

        const data = await response.json();
        setAppointments(data.bookings.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
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
        <Text style={styles.header}>Appointment Requests</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.bookingCode}
          renderItem={({ item }) => <AppointmentCard item={item} />}
        />
      </View>

      <Footer />
    </>
  );
}

const AppointmentCard = ({
  item,
}: {
  item: {
    bookingCode: string;
    date: string;
    startTime: string;
    duration: number;
    price: number;
    status: string;
  };
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={[styles.item, { transform: [{ scale: scaleValue }] }]}
    >
      <MaterialIcons
        name="event"
        size={40}
        color="#6D5BA5"
        style={styles.icon}
      />
      <View style={styles.info}>
        <Text style={styles.name}>Booking Code: {item.bookingCode}</Text>
        <Text style={styles.time}>
          {item.date} | {item.startTime} | {item.duration} mins
        </Text>
        <Text style={styles.price}>Price: {item.price} VND</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
      </View>
      <TouchableOpacity
        style={styles.detailButton}
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() =>
          router.push({
            pathname: "/doctors/appointments/appointmentDetails",
            params: { bookingCode: item.bookingCode },
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
    marginLeft: 35,
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: {
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
  price: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
    color: "#444",
  },
  detailButton: {
    backgroundColor: "#6D5BA5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
