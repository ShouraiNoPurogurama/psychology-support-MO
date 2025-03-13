import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';

interface Doctor {
  id: string;
  name: string;
  fee: number;
  rating: number;
  image: string;
}
const doctors = [
  { id: "1", name: "Dr. Nguyen Anh", fee: 250000, rating: 4.4, image: ("https://images2.thanhnien.vn/thumb_w/686/528068263637045248/2024/3/7/41498385661961282804899348165590311304931596n-17098051418122006775403-0-286-2048-1822-crop-1709805739243640175866.jpg") },
  { id: "2", name: "Dr. Le Minh", fee: 180000, rating: 4.5, image: ("https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp") },
  { id: "3", name: "Dr. Tran Duy", fee: 170000, rating: 4.7, image: ("https://bizweb.dktcdn.net/100/175/849/files/chup-anh-profile-cho-bac-si-tai-ha-noi-studio-yeu-media-dep-01.jpg?v=1636203347577") },
  { id: "4", name: "Dr. Pham Tuan", fee: 220000, rating: 4.2, image: ("https://taimuihongsg.com/wp-content/uploads/2023/10/BS-TRUONG-CONG-TRANG-KHOA-CHAN-DOAN-HINH-ANH_taimuihongsg.jpg") },
  { id: "5", name: "Dr. Minh Trung", fee: 210000, rating: 4.9, image: ("https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg") },
  { id: "6", name: "Dr. Thanh Dat", fee: 240000, rating: 4.7, image: ("https://luxclinic.vn/wp-content/uploads/2024/07/bac-Phuong-1.jpg") },
  { id: "7", name: "Dr. Thanh Sang", fee: 150000, rating: 3.5, image: ("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHR00f0tBnxetmeLESBPgKeKMFT2qqj8PZ4Q&s") },
  { id: "8", name: "Dr. Minh Hieu", fee: 110000, rating: 4.2, image: ("https://cdn2.tuoitre.vn/471584752817336320/2025/2/28/z635975903982367f6f7bbe8fedac7b3c8af5972d78479-17407110210901300008601.jpg") },
  { id: "9", name: "Dr. Chau Ngan", fee: 400000, rating: 4.7, image: ("https://vcdn1-suckhoe.vnecdn.net/2024/07/18/BS-Va-n-1-jpg-2195-1721273181.png?w=460&h=0&q=100&dpr=2&fit=crop&s=ns32I0w6u4R5J-HvFQ4Ayw") },
  { id: "10", name: "Dr. Thuy An", fee: 350000, rating: 3.7, image: ("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx1onekoQK5X6gsPgmSlzcWwfbSFXwYDX5Op9vVuQsmeutmyb-g49YCvbqE2mVz2fuWgA&usqp=CAU") },
  { id: "11", name: "Dr. Thanh Hai", fee: 200000, rating: 4.8, image: ("https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg") },

];

const API_URL = "https://psychologysupportprofile-fddah4eef4a7apac.eastasia-01.azurewebsites.net/doctors?PageIndex=0&PageSize=10";

export default function doctorList() {

  const [doctors, setDoctors] = useState<Doctor[]>([]); 
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(doctors);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("API Response:", response.data);

        const apiDoctors: Doctor[] = (response.data?.doctorProfiles?.data || []).map((doc: any, index: number) => ({
          id: doc.id || `unknown-${index}`,
          name: doc.fullName || `Dr. Unknown ${index + 1}`,
          fee: doc.fee ?? (150000 + index * 10000),
          rating: doc.rating || (4.0 + (index % 5) * 0.1),
          image: doc.image || "data:image/jpeg;base64,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",
        }));
        setDoctors(apiDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors
    .filter(doctor => doctor.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'fee') return (a.fee ?? 0) - (b.fee ?? 0);
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;

    });

  return (
    <>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.sortButton}>
        <Ionicons name='filter-circle-outline' size={20} color='white' />
        <Text style={styles.sortText}>Sort By</Text>
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => { setSortBy('name'); setModalVisible(false); }} style={styles.modalOption}>
            <Text>Sort by Name</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSortBy('fee'); setModalVisible(false); }} style={styles.modalOption}>
            <Text>Sort by Fee</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSortBy('rating'); setModalVisible(false); }} style={styles.modalOption}>
            <Text>Sort by Rating</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.container}>
          {filteredDoctors.map((doctor, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => router.push(`/user/doctorDetail/${doctor.id}`)}
            >
              <Image source={{ uri: doctor.image }} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{doctor.name}</Text>
                <Text style={styles.fee}>Consultation fee: {doctor.fee.toLocaleString()} đ</Text>
                <Text style={styles.rating}>Rating: {doctor.rating} ⭐</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
      <Student_Header />
      <Footer />
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    marginTop: 80,
    marginHorizontal: 10
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortButton: {
    padding: 10,
    backgroundColor: '#87CEFA',
    borderRadius: 5,
    marginLeft: 300,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10

  },
  sortText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -50 }],
    borderRadius: 10,
    elevation: 5,
    borderWidth: 3
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fee: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 5,
  },
  rating: {
    fontSize: 14,
    color: '#ffbf00',
    marginTop: 5,
  },
});