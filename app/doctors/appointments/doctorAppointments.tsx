import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Footer } from "../../../component/doctorFooter";
import { router } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { FontAwesome5, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns"; // Thêm thư viện date-fns
import { DoctorHeader } from "../../../component/doctorHeader";

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
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "AwaitMeeting" | "Cancelled"
  >("AwaitMeeting");
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày được chọn
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  ); // Bắt đầu tuần hiện tại

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const doctorId = decoded?.profileId;
        if (!doctorId) throw new Error("Profile ID not found in token");

        const response = await fetch(
          `https://psychologysupport-scheduling.azurewebsites.net/bookings?PageIndex=1&SortBy=time&PageSize=10&SortOrder=${sortOrder}&DoctorId=${doctorId}&Date=${format(
            selectedDate,
            "yyyy-MM-dd"
          )}&Status=${statusFilter}`, // Truyền ngày được chọn vào API
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
  }, [sortOrder, statusFilter, selectedDate]); // Thêm selectedDate vào dependency array

  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => subDays(prev, 7)); // Lùi về tuần trước
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7)); // Tiến tới tuần tiếp theo
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date); // Cập nhật ngày được chọn
  };

  const renderWeekDays = () => {
    const days = [];
    const weekStart = currentWeekStart;
    const weekEnd = endOfWeek(weekStart);

    for (let day = weekStart; day <= weekEnd; day = addDays(day, 1)) {
      days.push(
        <TouchableOpacity
          key={day.toISOString()}
          style={[
            styles.dateButton,
            selectedDate.toDateString() === day.toDateString() &&
              styles.selectedDateButton,
          ]}
          onPress={() => handleDateSelect(day)}
        >
          <Text
            style={[
              styles.dateText,
              selectedDate.toDateString() === day.toDateString() &&
                styles.selectedDateText,
            ]}
          >
            {format(day, "EEE")}
          </Text>
          <Text
            style={[
              styles.dateNumber,
              selectedDate.toDateString() === day.toDateString() &&
                styles.selectedDateText,
            ]}
          >
            {format(day, "d")}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  function toggleSortOrder(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <DoctorHeader />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Appointment Requests</Text>
      </View>

      <View style={styles.searchSortContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by booking code"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          onPress={() => setSortModalVisible(true)} // Hiển thị Modal khi bấm vào icon
          style={styles.sortButton}
        >
          <AntDesign name="filter" size={22} color="#6A8CAF" />
        </TouchableOpacity>
      </View>

      {/* Lịch tuần */}
      <View style={styles.weekContainer}>
        <TouchableOpacity
          onPress={handlePreviousWeek}
          style={styles.arrowButton}
        >
          <AntDesign name="left" size={20} color="#6A8CAF" />
        </TouchableOpacity>
        <View style={styles.weekDaysContainer}>{renderWeekDays()}</View>
        <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
          <AntDesign name="right" size={20} color="#6A8CAF" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isSortModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setSortOrder("asc");
                  setSortModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>Time (Ascending)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setSortOrder("desc");
                  setSortModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>Time (Descending)</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Filter By Status</Text>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => setStatusFilter("AwaitMeeting")}
              >
                <Text style={styles.modalOptionText}>AwaitMeeting</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => setStatusFilter("Cancelled")}
              >
                <Text style={styles.modalOptionText}>Cancelled</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.container}>
        <FlatList
          data={appointments.filter((appointment) =>
            appointment.bookingCode
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )}
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
  searchSortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
  },
  sortButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#E8E8E8",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  weekContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Đưa toàn bộ phần lịch vào giữa
    marginHorizontal: 20,
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "center", // Đưa các ngày vào giữa
    alignItems: "center",
    flex: 1,
  },
  dateButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 33, // Tăng chiều rộng để cân đối hơn
    height: 38, // Chiều cao cố định
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 2, // Khoảng cách giữa các nút
  },
  selectedDateButton: {
    backgroundColor: "#6A8CAF",
  },
  dateText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  dateNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  selectedDateText: {
    color: "#FFF",
  },
  arrowButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 1, // Tăng khoảng cách ngang để tách nút điều hướng ra
  },
});
