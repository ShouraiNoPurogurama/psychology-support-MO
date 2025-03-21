import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// Define data type
type Task = {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  date: string;
  description?: string;
  benefits?: string[];
  duration?: string;
  icon?: string;
  originalTime?: Date; // Added temporarily for sorting (optional)
};

// API Config
const BASE_URL = "https://psychologysupport-scheduling.azurewebsites.net";
const SCHEDULES_ENDPOINT = `${BASE_URL}/schedules`;
const ACTIVITIES_ENDPOINT = `${BASE_URL}/schedule-activities`;




// Format date to YYYY-MM-DD
const formatDateKey = (date: Date | string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

// Get day of the week
const getWeekday = (dateStr: string) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateStr);
  return days[date.getDay()];
};

const createTaskObject = (activity: any) => {
  const time = new Date(activity.timeRange);

  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  const endTime = new Date(time);
  const durationMinutes = parseInt(activity.duration?.split(" ")[0] || "30");
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);

  const endTimeString = endTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  let text = "Activity";
  let description = "No description available";
  let benefits: string[] = [];
  let icon = "help-circle-outline";

  if (activity.foodActivity) {
    text = `Meal: ${activity.foodActivity.name}`;
    description = activity.foodActivity.description;
    benefits = [
      `Time: ${activity.foodActivity.mealTime}`,
      `Nutrients: ${activity.foodActivity.foodNutrients.join(", ")}`,
      `Intensity: ${activity.foodActivity.intensityLevel}`,
    ];
    icon = "restaurant-outline";
  } else if (activity.physicalActivity) {
    text = `Physical Activity: ${activity.physicalActivity.name}`;
    description = activity.physicalActivity.description;
    benefits = [
      `Intensity: ${activity.physicalActivity.intensityLevel}`,
      `Impact Level: ${activity.physicalActivity.impactLevel}`,
    ];
    icon = "walk-outline";
  } else if (activity.entertainmentActivity) {
    text = `Entertainment: ${activity.entertainmentActivity.name}`;
    description = activity.entertainmentActivity.description;
    benefits = [
      `Intensity: ${activity.entertainmentActivity.intensityLevel}`,
      `Impact Level: ${activity.entertainmentActivity.impactLevel}`,
    ];
    icon = "musical-notes-outline";
  } else if (activity.therapeuticActivity) {
    text = `Therapy: ${activity.therapeuticActivity.name}`;
    description = activity.therapeuticActivity.description;
    benefits = [
      `Intensity: ${activity.therapeuticActivity.intensityLevel}`,
      `Impact Level: ${activity.therapeuticActivity.impactLevel}`,
      `Instructions: ${activity.therapeuticActivity.instructions}`,
    ];
    icon = "flower-outline";
  }

  return {
    id: activity.id,
    text,
    time: timeString,
    completed: activity.status === "Completed",
    date: formatDateKey(time),
    description,
    benefits,
    duration: `${timeString} - ${endTimeString}`,
    icon,
    originalTime: time, // Added for sorting
  };
};

export default function UserTask() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const itemRefs = useRef<{ [key: string]: any }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayNow, setDayNow] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [taskLoading, setTaskLoading] = useState<{ [key: string]: boolean }>({});
  const [sessionForDate, setSessionForDate] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch sessions list
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found.");
        return;
      }
  
      // Decode token để lấy profileId
      const decoded: any = jwtDecode(token);
      const profileId = decoded.profileId; // Đảm bảo key này đúng với token của bạn
  
      if (!profileId) {
        console.error("No profile ID found in token.");
        return;
      }
      const response = await fetch(
        `${SCHEDULES_ENDPOINT}?PageIndex=1&PageSize=10&SortBy=startDate&SortOrder=asc&PatientId=${profileId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (!data?.schedules?.data) {
        console.error("Invalid data:", data);
        return;
      }

      const sessionsData = data.schedules.data[0]?.sessions || [];
      setSessions(sessionsData);

      const uniqueDates = [
        ...new Set(sessionsData.map((s: any) => formatDateKey(s.startDate))),
      ];
      setAvailableDates(uniqueDates);

      const today = formatDateKey(new Date());
      setSelectedDate(uniqueDates.includes(today) ? today : uniqueDates[0] || null);
      setDayNow(uniqueDates.includes(today) ? today : uniqueDates[0] || null);
    } catch (error) {
      console.error("Error fetching sessions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities for the selected date
  const fetchActivitiesForDate = async () => {
    if (!selectedDate || sessions.length === 0) return;

    try {
      setLoading(true);
      const session = sessions.find(
        (s) => formatDateKey(s.startDate) === selectedDate
      );

      if (session) {
        setSessionForDate(session.id);
        const response = await fetch(`${ACTIVITIES_ENDPOINT}/${session.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Create tasks list from activities
        const activities = data.scheduleActivities.map((activity: any) =>
          createTaskObject(activity)
        );

        // Sort by start time (originalTime)
        const sortedActivities = activities.sort(
          (a: Task & { originalTime: Date }, b: Task & { originalTime: Date }) =>
            a.originalTime - b.originalTime
        );

        // Remove originalTime if not needed in UI
        const finalTasks = sortedActivities.map(
          ({ originalTime, ...rest }) => rest
        );

        setTasks(finalTasks);
      } else {
        setTasks([]);
        setSessionForDate(null);
      }
    } catch (error) {
      console.error("Error fetching activities:", error.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !sessionForDate) {
      console.warn("Task or sessionForDate not found:", { taskId, sessionForDate });
      return;
    }
  
    const newStatus = !task.completed;
    const apiStatus = newStatus ? "Completed" : "Pending";
  
    // Update UI first (optimistic update) and show loading
    setTaskLoading((prev) => ({ ...prev, [taskId]: true }));
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, completed: newStatus } : t
      )
    );
  
    // Update selectedTask optimistically to reflect the change in the modal
    setSelectedTask((prev) =>
      prev && prev.id === taskId ? { ...prev, completed: newStatus } : prev
    );
  
    try {
      const url = `${BASE_URL}/schedule-activities/${taskId}/${sessionForDate}/status`;
      console.log("Sending request to:", url, "with payload:", { status: apiStatus });
  
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: apiStatus }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
  
      const result = await response.json(); // Read response data from API
      console.log("API response:", result);
  
      // Since API doesn't return the updated status, we assume success if response.ok is true
      // The optimistic update to selectedTask and tasks will remain
  
    } catch (error) {
      console.error("Error updating status:", error.message);
  
      // Rollback UI status if API fails
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, completed: !newStatus } : t
        )
      );
  
      // Rollback selectedTask as well
      setSelectedTask((prev) =>
        prev && prev.id === taskId ? { ...prev, completed: !newStatus } : prev
      );
    } finally {
      setTaskLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  // Animation for modal
  const openModal = () => {
    setShowTaskDetail(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowTaskDetail(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchActivitiesForDate();
  }, [selectedDate, sessions]);

  useEffect(() => {
    if (dayNow && itemRefs.current[dayNow]?.current && scrollViewRef.current) {
      itemRefs.current[dayNow]?.current?.measureLayout(
        scrollViewRef.current.getNativeScrollRef(),
        (x: number) => {
          scrollViewRef.current?.scrollTo({ x: x - 125, animated: true });
        },
        () => console.log("Unable to measure layout of element")
      );
    }
  }, [dayNow, availableDates]);

  return (
    <>
      <Student_Header />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#F5F6FA",
          padding: 20,
          marginTop: 70,
          marginBottom: 80,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
            color: "#4A4A4A",
            fontFamily: "Nunito-Bold",
          }}
        >
          Your Activity Schedule 🌟
        </Text>

        {/* Display list of dates */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row", marginVertical: 15 }}
          ref={scrollViewRef}
        >
          {availableDates.map((date) => {
            if (!itemRefs.current[date]) {
              itemRefs.current[date] = React.createRef();
            }

            return (
              <TouchableOpacity
                ref={itemRefs.current[date]}
                key={date}
                onPress={() => setSelectedDate(date)}
                style={{
                  padding: 15,
                  marginRight: 10,
                  backgroundColor: selectedDate === date ? "#AF93D2" : "#FFFFFF", // Change to purple
                  borderRadius: 15,
                  borderColor: dayNow === date ? "#AF93D2" : "#E0E0E0", // Change to purple
                  borderWidth: 2,
                  alignItems: "center",
                  minWidth: 100,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: selectedDate === date ? "#FFFFFF" : "#4A4A4A",
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  {getWeekday(date)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: selectedDate === date ? "#FFFFFF" : "#4A4A4A",
                    fontFamily: "Nunito-Regular",
                  }}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Task list */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#A8D5BA"
            style={{ marginTop: 20 }}
          />
        ) : tasks.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              color: "#4A4A4A",
              marginTop: 20,
              fontSize: 16,
              fontFamily: "Nunito-Regular",
            }}
          >
            No activities today, take a rest! 🌸
          </Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTask(item);
                  openModal();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 15,
                  marginBottom: 10,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 15,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Icon
                  name={item.icon || "help-circle-outline"}
                  size={24}
                  color={item.completed ? "#F4A7B9" : "#A8D5BA"}
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#4A4A4A",
                      fontFamily: "Nunito-Bold",
                    }}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#4A4A4A",
                      fontFamily: "Nunito-Regular",
                    }}
                  >
                    {item.time}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#A8D5BA" />
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>

      {/* Modal to display task details */}
      <Modal
        visible={showTaskDetail}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            opacity: fadeAnim,
          }}
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedTask?.text || "Activity Details"} 🌼
              </Text>
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Icon name="close-circle-outline" size={28} color="#F4A7B9" />
              </Pressable>
            </View>

            {/* Body */}
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Time ⏰</Text>
                <Text style={styles.sectionContent}>
                  {selectedTask?.duration || "No information"}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Description 📝</Text>
                <Text style={styles.sectionContent}>
                  {selectedTask?.description || "No description"}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Benefits 🌟</Text>
                {selectedTask?.benefits && selectedTask.benefits.length > 0 ? (
                  selectedTask.benefits.map((benefit, index) => (
                    <Text key={index} style={styles.benefitItem}>
                      • {benefit}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.sectionContent}>No benefits</Text>
                )}
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Status ✅</Text>
                <View style={styles.statusContainer}>
                  <Pressable
                    onPress={() => selectedTask && toggleTaskStatus(selectedTask.id)}
                    disabled={taskLoading[selectedTask?.id || ""]}
                    style={styles.checkboxContainer}
                  >
                    <Icon
                      name={selectedTask?.completed ? "checkbox-outline" : "square-outline"}
                      size={24}
                      color={selectedTask?.completed ? "#F4A7B9" : "#A8D5BA"}
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={[
                        styles.checkboxLabel,
                        { color: selectedTask?.completed ? "#F4A7B9" : "#A8D5BA" },
                      ]}
                    >
                      {selectedTask?.completed ? "Completed" : "Mark as Completed"}
                    </Text>
                  </Pressable>
                  {taskLoading[selectedTask?.id || ""] && (
                    <ActivityIndicator size="small" color="#A8D5BA" style={{ marginLeft: 10 }} />
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <Pressable onPress={closeModal} style={styles.closeModalButton}>
                <Text style={styles.closeModalButtonText}>Close 💖</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Modal>

      <Footer />
    </>
  );
}

// Styles for the UI
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom:0
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F9FAFC",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
    fontFamily: "Nunito-Bold",
    flex: 1, // Allow title to take remaining space
    marginRight: 10, // Ensure spacing with close button
    numberOfLines: 1, // Limit to 1 line
    ellipsizeMode: "tail", // Truncate with "..." if too long
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 15,
  },
  detailSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A8D5BA",
    textTransform: "uppercase",
    marginBottom: 5,
    fontFamily: "Nunito-Bold",
  },
  sectionContent: {
    fontSize: 16,
    color: "#4A4A4A",
    fontFamily: "Nunito-Regular",
  },
  benefitItem: {
    fontSize: 16,
    color: "#4A4A4A",
    marginLeft: 10,
    fontFamily: "Nunito-Regular",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F9FAFC", // Light background to stand out
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#4A4A4A",
    fontFamily: "Nunito-Regular",
    marginLeft: 5,
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    alignItems: "center",
  },
  closeModalButton: {
    backgroundColor: "#F4A7B9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  closeModalButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Nunito-Bold",
  },
});