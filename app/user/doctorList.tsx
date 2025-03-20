import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ScrollView, Image, SafeAreaView } from 'react-native';
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

const API_URL = "https://psychologysupport-profile.azurewebsites.net/doctors?PageIndex=0&PageSize=10";

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
          image: doc.image || "https://kenh14cdn.com/203336854389633024/2022/5/6/f04d70b1f6e140338a7d2f27ebe67685-1651808959048730170550.png",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
      <Student_Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.sortButton}>
          <Ionicons name="filter-circle-outline" size={22} color="white" />
          <Text style={styles.sortText}>Sort By</Text>
        </TouchableOpacity>
        <Modal
          animationType="fade" // Thêm hiệu ứng mượt mà
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => { setSortBy('name'); setModalVisible(false); }} style={styles.modalOption}>
              <Text style={{ fontSize: 16, color: '#374151' }}>Sort by Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortBy('fee'); setModalVisible(false); }} style={styles.modalOption}>
              <Text style={{ fontSize: 16, color: '#374151' }}>Sort by Fee</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortBy('rating'); setModalVisible(false); }} style={styles.modalOption}>
              <Text style={{ fontSize: 16, color: '#374151' }}>Sort by Rating</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.container}>
          {filteredDoctors.map((doctor, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => router.push(`/user/doctorDetail/${doctor.id}`)}
              activeOpacity={0.8} // Hiệu ứng nhấn
            >
              <Image source={{ uri: doctor.image }} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{doctor.name}</Text>
                <Text style={styles.fee}>Fee: {doctor.fee.toLocaleString()} đ</Text>
                <Text style={styles.rating}>Rating: {doctor.rating} ⭐</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Màu nền nhẹ nhàng hơn
    paddingHorizontal: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db', // Xám nhạt
    borderRadius: 12, // Bo góc mềm mại hơn
    padding: 12,
    marginBottom: 20,
    marginTop: 60, // Đẩy xuống để tránh header
    marginHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Bóng đổ nhẹ
  },
  sortButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#60a5fa', // Xanh dương nhẹ
    borderRadius: 10,
    marginLeft: 'auto', // Đẩy sang phải
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
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
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    borderRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: 200, // Giới hạn chiều rộng
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6, // Bóng đổ nổi bật hơn
  },
  image: {
    width: 60, // Tăng kích thước ảnh
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#60a5fa', // Viền xanh nhẹ
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18, // Tăng kích thước chữ
    fontWeight: '700', // Đậm hơn
    color: '#1f2937', // Màu xám đậm
  },
  fee: {
    fontSize: 15,
    color: '#16a34a', // Xanh lá đậm hơn
    marginTop: 6,
  },
  rating: {
    fontSize: 15,
    color: '#f59e0b', // Vàng đậm
    marginTop: 6,
  },
});