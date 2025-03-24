import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";
import { router } from "expo-router";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons"; // Import FontAwesome
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

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

const extractBookingCode = (occupiedInfo: string): string | null => {
  if (!occupiedInfo) return null; // Check if occupiedInfo does not exist
  const parts = occupiedInfo.split("BookingCode: ");
  return parts.length > 1 ? parts[1].trim() : null; // Get the part after "BookingCode: "
};

export default function DoctorSchedule() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

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

  const toggleSlotSelection = (slot: TimeSlot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const stopBooking = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      // Decode token to get doctorId
      const decoded: any = jwtDecode(token);
      const doctorId = decoded.profileId;

      // Filter valid slots (at least 7 days from the current date)
      const today = new Date();
      const validSlots = selectedSlots.filter((slot) => {
        const slotDate = new Date(selectedDate);
        const diffInDays = Math.ceil(
          (slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffInDays >= 7; // Only keep slots at least 7 days from the current date
      });

      if (validSlots.length === 0) {
        Alert.alert(
          "Invalid Selection",
          "You can only request leave for slots at least 7 days in advance."
        );
        return;
      }

      // Get the list of startTimes from valid slots
      const startTimes = validSlots.map((slot) => slot.startTime);

      // Send the new API request
      const response = await fetch(
        "https://psychologysupport-scheduling.azurewebsites.net/doctor-availabilities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorAvailabilityCreate: {
              doctorId: doctorId,
              date: selectedDate,
              startTimes: startTimes,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Get detailed error from the response
        console.error("Failed to update availability:", errorText);
        throw new Error(`Failed to update availability: ${errorText}`);
      }

      Alert.alert("Success", "Selected slots have been marked as unavailable.");
      setSelectedSlots([]);
      // Refresh the time slots
      const refreshedResponse = await fetch(
        `https://psychologysupport-scheduling.azurewebsites.net/doctor-schedule/${doctorId}/${selectedDate}`
      );
      const refreshedData = await refreshedResponse.json();
      setTimeSlots(refreshedData.timeSlots || []);
    } catch (error) {
      console.error("Error updating availability:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Error", `Failed to update availability: ${errorMessage}`);
    }
  };

  return (
    <>
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
            minDate={today}
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
        <Text style={[styles.title, { marginBottom: 5 }]}>
          {timeSlots.filter((slot) => slot.status === "Unavailable").length > 0
            ? `Unavailable time slots on ${formatDate(selectedDate)}`
            : `No unavailable time slots on ${formatDate(selectedDate)}`}
        </Text>
        {/* Show Stop Booking button only when slots are selected */}
        {selectedSlots.length > 0 && (
          <TouchableOpacity
            style={styles.stopBookingButton}
            onPress={stopBooking}
            activeOpacity={0.7} // Effect when pressed
          >
            <Text style={styles.stopBookingButtonText}>Stop Booking</Text>
          </TouchableOpacity>
        )}
        <View style={styles.listContainer}>
          <FlatList
            data={timeSlots}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedSlots.includes(item);
              const backgroundColor =
                item.status === "Unavailable"
                  ? "rgba(217, 83, 79, 0.7)"
                  : isSelected
                  ? "rgba(92, 184, 92, 0.5)" // Highlight selected slots
                  : "rgba(92, 184, 92, 0.7)";

              return (
                <Pressable
                  style={[styles.timeSlotItem, { backgroundColor }]}
                  onPress={() => toggleSlotSelection(item)} // Select or deselect slot
                >
                  <View style={styles.slotContent}>
                    <Text style={styles.timeSlotText}>
                      {`${item.startTime} - ${item.endTime}`}
                    </Text>
                    {isSelected && (
                      <FontAwesome
                        name="check"
                        size={20}
                        color="#fff"
                        style={styles.checkIcon}
                      />
                    )}
                  </View>
                  {item.occupiedInfo && (
                    <Text style={styles.occupiedInfo}>{`Details: ${item.occupiedInfo}`}</Text>
                  )}
                </Pressable>
              );
            }}
            nestedScrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 80 }} // Add padding to avoid footer overlap
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
  listContainer: {
    flex: 1,
    marginTop: 70, // Create space above to avoid overlapping with the button
    paddingBottom: 80, // Add padding to avoid being covered by the footer
  },
  stopBookingButton: {
    position: "absolute", // Fixed above the list
    top: 300, // Position the button above the list
    left: "10%",
    right: "10%",
    backgroundColor: "#D9534F",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevation effect on Android
    zIndex: 10, // Ensure the button is above the list
  },
  stopBookingButtonDisabled: {
    backgroundColor: "rgba(217, 83, 79, 0.5)", // Dimmed color when disabled
  },
  stopBookingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  buttonContainer: {
    marginBottom: 20, // Create space between the button and the footer
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
  timeSlotItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5, // Reduce bottom margin
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
  slotContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkIcon: {
    marginLeft: 10,
  },
});
