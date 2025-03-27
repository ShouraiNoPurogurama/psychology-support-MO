import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ScrollView, Image, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Specialty {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  userId: string;  // Added userId
  name: string;
  fee: number;
  rating: number;
  image: string;
  specialties: Specialty[];
  startDate: string;
  endDate: string;
}

const DOCTORS_API_URL = "https://psychologysupport-profile.azurewebsites.net/doctors";
const SPECIALTIES_API_URL = "https://psychologysupport-profile.azurewebsites.net/specialties?PageIndex=1&PageSize=10";
const IMAGE_API_URL = "https://psychologysupport-image.azurewebsites.net/image/get";

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [specialtyModalVisible, setSpecialtyModalVisible] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch specialties from API
  const fetchSpecialties = async () => {
    try {
      const response = await axios.get(SPECIALTIES_API_URL);
      const specialtiesData: Specialty[] = response.data.specialties || [];
      setSpecialties(specialtiesData);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  };

  // Fetch image for a specific doctor using userId
  const fetchDoctorImage = async (userId: string): Promise<string> => {
    try {
      const response = await axios.get(`${IMAGE_API_URL}?ownerType=User&ownerId=${userId}`);
      return response.data.url || "https://via.placeholder.com/150"; // Fallback image if API fails
    } catch (error) {
      console.error(`Error fetching image for userId ${userId}:`, error);
      return "https://via.placeholder.com/150"; // Fallback image on error
    }
  };

  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const params: any = {
        PageIndex: 0,
        PageSize: 10,
        SortBy: sortBy === 'startDate' || sortBy === 'endDate' ? 'rating' : sortBy,
        SortOrder: 'asc',
        Search: searchText,
        Specialties: selectedSpecialty || undefined,
      };

      if (startDate && startTime && endDate && endTime) {
        const startDateTime = new Date(startDate);
        startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
        const endDateTime = new Date(endDate);
        endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

        params.StartDate = formatDateTime(startDateTime);
        params.EndDate = formatDateTime(endDateTime);

        console.log("Params StartDate:", params.StartDate);
        console.log("Params EndDate:", params.EndDate);
      }

      const response = await axios.get(DOCTORS_API_URL, { params });
      console.log("Doctors API Response:", response.data); // Thêm log để xem dữ liệu từ API bác sĩ
      const apiDoctorsPromises = (response.data?.doctorProfiles?.data || []).map(async (doc: any, index: number) => {
        const imageUrl = await fetchDoctorImage(doc.userId); // Giả sử userId từ API
        return {
          id: doc.id,
          userId: doc.userId, // Giả sử field này tồn tại trong response
          name: doc.fullName,
          fee: 200000,
          rating: doc.rating || 4.0,
          image: imageUrl,
          specialties: doc.specialties || [],
        };
      });

      const apiDoctors = await Promise.all(apiDoctorsPromises);
      console.log("Processed Doctors Data:", apiDoctors); // Thêm log để xem dữ liệu sau khi xử lý
      setDoctors(apiDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [sortBy, searchText, selectedSpecialty, startDate, startTime, endDate, endTime]);

  const filteredDoctors = doctors.sort((a, b) => {
    if (sortBy === 'fee') return a.fee - b.fee;
    return 0;
  });

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name': return 'Name';
      case 'fee': return 'Fee';
      case 'rating': return 'Rating';
      case 'specialty': return 'Specialty';
      case 'startDate': return 'Start Date';
      case 'endDate': return 'End Date';
      default: return 'Name';
    }
  };

  const getSpecialtyLabel = () => {
    if (!selectedSpecialty) return 'All Specialties';
    const specialty = specialties.find(s => s.id === selectedSpecialty);
    return specialty ? specialty.name : 'All Specialties';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
      <Student_Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={styles.dateFilterContainer}>
          <View style={styles.dateRow}>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateInput}>
              <Text style={styles.dateText}>
                {startDate ? startDate.toLocaleDateString() : 'Start Date'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#374151" />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}
            <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.timeInput}>
              <Text style={styles.dateText}>
                {startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Start Time'}
              </Text>
              <Ionicons name="time-outline" size={20} color="#374151" />
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(false);
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            )}
          </View>
          <View style={styles.dateRow}>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateInput}>
              <Text style={styles.dateText}>
                {endDate ? endDate.toLocaleDateString() : 'End Date'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#374151" />
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.timeInput}>
              <Text style={styles.dateText}>
                {endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'End Time'}
              </Text>
              <Ionicons name="time-outline" size={20} color="#374151" />
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime || new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(false);
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            )}
          </View>
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => setSortModalVisible(true)} style={styles.sortButton}>
            <Ionicons name="filter-circle-outline" size={22} color="white" />
            <Text style={styles.sortText}>Sort By</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSpecialtyModalVisible(true)} style={styles.specialtyButton}>
            <Ionicons name="list-outline" size={22} color="white" />
            <Text style={styles.sortText}>Filter Specialty</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sortInfo}>
          Sorted by: {getSortLabel()}, Filtered by: {getSpecialtyLabel()}
        </Text>

        <Modal animationType="fade" transparent={true} visible={sortModalVisible} onRequestClose={() => setSortModalVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setSortModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => { setSortBy('name'); setSortModalVisible(false); }} style={styles.modalOption}>
                <Text style={styles.modalText}>Sort by Name</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSortBy('fee'); setSortModalVisible(false); }} style={styles.modalOption}>
                <Text style={styles.modalText}>Sort by Fee</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSortBy('rating'); setSortModalVisible(false); }} style={styles.modalOption}>
                <Text style={styles.modalText}>Sort by Rating</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={specialtyModalVisible} onRequestClose={() => setSpecialtyModalVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setSpecialtyModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => { setSelectedSpecialty(null); setSpecialtyModalVisible(false); }} style={styles.modalOption}>
                <Text style={styles.modalText}>All Specialties</Text>
              </TouchableOpacity>
              {specialties.map((specialty) => (
                <TouchableOpacity
                  key={specialty.id}
                  onPress={() => { setSelectedSpecialty(specialty.id); setSpecialtyModalVisible(false); }}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalText}>{specialty.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.container}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            filteredDoctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={styles.card}
                onPress={() => router.push(`/user/doctorDetail/${doctor.id}`)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: doctor.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{doctor.name}</Text>
                  <Text style={styles.specialty}>
                    {doctor.specialties.map(s => s.name).join(', ') || "No specialties"}
                  </Text>
                  <Text style={styles.fee}>Fee: {doctor.fee.toLocaleString()} đ</Text>
                  <Text style={styles.rating}>Rating: {doctor.rating} ⭐</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  dateFilterContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  timeInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#374151',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    marginTop: 90,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sortButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#60a5fa',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  specialtyButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#10b981',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sortText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sortInfo: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: 200,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalText: {
    fontSize: 16,
    color: '#374151',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  specialty: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  fee: {
    fontSize: 15,
    color: '#16a34a',
    marginTop: 6,
  },
  rating: {
    fontSize: 15,
    color: '#f59e0b',
    marginTop: 6,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});