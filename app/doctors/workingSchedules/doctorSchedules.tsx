import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

type TimeSlot = {
  status: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  occupiedInfo: string;
};

type DayObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

export default function DoctorSchedule() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("No token found");

        const decoded: any = jwtDecode(token);
        const doctorId = decoded.profileId;

        const response = await fetch(
          `https://psychologysupport-scheduling.azurewebsites.net/doctor-schedule/${doctorId}/${selectedDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch time slots");
        }

        const data = await response.json();
        setTimeSlots(data.timeSlots || []);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
      }
    };

    fetchTimeSlots();
  }, [selectedDate]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const extractBookingCode = (occupiedInfo: string) => {
    const match = occupiedInfo.match(/BookingCode:\s?(\S+)/i);
    return match ? match[1] : null;
  };

  const navigateToDetails = (bookingCode: string) => {
    router.push(
      `/doctors/appointments/scheduleAppointmentDetails?bookingCode=${bookingCode}`
    );
  };

  return (
    <>
      <DoctorHeader />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <View style={styles.backButtonContent}>
              <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Working Schedule</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            current={today}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "rgba(147, 112, 219, 0.5)",
              },
              [today]: {
                selected: true,
                selectedColor: "#D9534F",
                textDayFontWeight: "bold",
                textDayFontSize: 18,
              },
            }}
            onDayPress={(day: DayObject) => setSelectedDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: "rgba(147, 112, 219, 0.5)",
              todayTextColor: "#D9534F",
              arrowColor: "#6A8CAF",
              textMonthFontSize: 20,
              textMonthFontWeight: "bold",
              textDayHeaderFontSize: 14,
              textDayHeaderFontWeight: "bold",
              textDayHeaderColor: "#000",
              dayTextColor: "rgba(0,0,0,0.5)",
            }}
          />
        </View>

        <Text style={styles.title}>
          {timeSlots.filter((slot) => slot.status === "Unavailable").length > 0
            ? `Unavailable time slots on ${formatDate(selectedDate)}`
            : `No unavailable time slots on ${formatDate(selectedDate)}`}
        </Text>

        <View style={styles.listContainer}>
          <FlatList
            data={timeSlots.filter((slot) => slot.status === "Unavailable")}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const bookingCode = extractBookingCode(item.occupiedInfo);
              return (
                <Pressable
                  style={[styles.timeSlotItem, { backgroundColor: "#9B59B6" }]}
                  disabled={!bookingCode}
                  onPress={() => bookingCode && navigateToDetails(bookingCode)}
                >
                  <Text
                    style={styles.timeSlotText}
                  >{`${item.startTime} - ${item.endTime}`}</Text>
                  {bookingCode ? (
                    <Text
                      style={styles.occupiedInfo}
                    >{`Booking Code: ${bookingCode}`}</Text>
                  ) : item.occupiedInfo ? (
                    <Text
                      style={styles.occupiedInfo}
                    >{`Patient: ${item.occupiedInfo}`}</Text>
                  ) : null}
                </Pressable>
              );
            }}
            nestedScrollEnabled={true}
          />
        </View>
      </View>
      <Footer />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
    paddingVertical: 10,
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
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A8CAF",
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  listContainer: {
    maxHeight: 300,
  },
  timeSlotItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#6A8CAF",
  },
  timeSlotText: {
    fontSize: 16,
    color: "#fff",
  },
  occupiedInfo: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
});
