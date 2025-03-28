import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { DoctorHeader } from "../../../component/doctorHeader";

export default function DoctorHistory() {
  interface MedicalRecord {
    id: string;
    patientProfileId: string;
    notes: string;
    createdAt: string;
  }

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState(""); // State cho thanh tìm kiếm
  const [statusFilter, setStatusFilter] = useState<"Processing" | "Done">(
    "Processing"
  ); // State cho bộ lọc trạng thái
  const [isSortModalVisible, setSortModalVisible] = useState(false); // State cho modal sort
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // State cho thứ tự sắp xếp

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const doctorId = decoded?.profileId;
        if (!doctorId) throw new Error("Profile ID not found in token");

        const response = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/medical-records?DoctorId=${doctorId}&PageIndex=1&PageSize=10&SortBy=CreatedAt&SortOrder=${sortOrder}&Status=${statusFilter}`
        );

        if (!response.ok) throw new Error("Failed to fetch medical records");

        const result = await response.json();
        setMedicalRecords(result.medicalRecords.data);

        // Fetch patient names only if patientProfileId is valid
        result.medicalRecords.data.forEach(
          async (record: { patientProfileId: string }) => {
            if (record.patientProfileId) {
              try {
                const patientResponse = await fetch(
                  `https://psychologysupport-profile.azurewebsites.net/patients/${record.patientProfileId}`
                );

                if (patientResponse.ok) {
                  const patientData = await patientResponse.json();
                  setPatientNames((prev) => ({
                    ...prev,
                    [record.patientProfileId]:
                      patientData.patientProfileDto.fullName,
                  }));
                } else {
                  console.error(
                    "Error fetching patient name: Invalid response",
                    patientResponse.status
                  );
                }
              } catch (err) {
                console.error("Error fetching patient name:", err);
              }
            }
          }
        );
      } catch (error) {
        Alert.alert(
          "Error",
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        console.error("Fetch Error:", error);
      }
    };

    fetchMedicalRecords();
  }, [statusFilter, sortOrder]); // Gọi lại API khi trạng thái hoặc thứ tự sắp xếp thay đổi

  return (
    <>
      <DoctorHeader />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Patient Medical Records</Text>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchSortContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by patient name"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.sortIconButton}
          onPress={() => setSortModalVisible(true)} // Hiển thị modal sort
        >
          <MaterialIcons name="sort" size={24} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Nút lọc trạng thái */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() =>
            setStatusFilter((prev) =>
              prev === "Processing" ? "Done" : "Processing"
            )
          }
        >
          <Text style={styles.filterText}>
            {statusFilter === "Processing" ? "Show Done" : "Show Processing"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal Sort */}
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
                <Text style={styles.modalOptionText}>
                  Created At (Ascending)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setSortOrder("desc");
                  setSortModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  Created At (Descending)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {medicalRecords
          .filter((record) =>
            (patientNames[record.patientProfileId] || "Unknown Patient")
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )
          .map((record) => (
            <TouchableOpacity
              key={record.id}
              style={styles.historyItem}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/doctors/medicalRecords/medicalRecordDetails",
                  params: { id: record.id },
                })
              }
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name="person" size={30} color="#6C63FF" />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.patientName}>
                  {patientNames[record.patientProfileId] || "Unknown Patient"}
                </Text>
                <Text style={styles.notes}>📝 Notes: {record.notes}</Text>
                <Text style={styles.createdAt}>
                  📅 Date: {new Date(record.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  scrollContainer: {
    paddingBottom: 100,
    paddingHorizontal: 15,
  },
  header: {
    flex: 1,
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C63FF",
    textAlign: "center",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3E1FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  notes: {
    fontSize: 14,
    color: "#666",
  },
  createdAt: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  searchSortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
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
  sortIconButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3E1FD", // Màu tím nhạt
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#E3E1FD", // Màu tím nhạt
  },
  filterText: {
    color: "#FFF", // Màu trắng
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
    width: 300,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#E3E1FD", // Màu tím nhạt
    borderRadius: 10,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#FFF", // Màu trắng
  },
});
