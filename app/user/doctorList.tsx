import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


 const doctors = [
  {id:1, name: "Dr. Nguyen Anh", fee: 250000, rating: 4.4, image: ("https://images2.thanhnien.vn/thumb_w/686/528068263637045248/2024/3/7/41498385661961282804899348165590311304931596n-17098051418122006775403-0-286-2048-1822-crop-1709805739243640175866.jpg") },
  {id:2, name: "Dr. Le Minh", fee: 180000, rating: 4.5, image: ("https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp") },
  {id:3, name: "Dr. Tran Duy", fee: 170000, rating: 4.7, image: ("https://bizweb.dktcdn.net/100/175/849/files/chup-anh-profile-cho-bac-si-tai-ha-noi-studio-yeu-media-dep-01.jpg?v=1636203347577") },
  {id:4, name: "Dr. Pham Tuan", fee: 220000, rating: 4.2, image: ("https://taimuihongsg.com/wp-content/uploads/2023/10/BS-TRUONG-CONG-TRANG-KHOA-CHAN-DOAN-HINH-ANH_taimuihongsg.jpg") },
  {id:5, name: "Dr. Minh Trung", fee: 210000, rating: 4.9, image: ("https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg") },
  {id:6, name: "Dr. Thanh Dat", fee: 240000, rating: 4.7, image: ("https://luxclinic.vn/wp-content/uploads/2024/07/bac-Phuong-1.jpg") },
  {id:7, name: "Dr. Thanh Sang", fee: 150000, rating: 3.5, image: ("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHR00f0tBnxetmeLESBPgKeKMFT2qqj8PZ4Q&s") },
  {id:8, name: "Dr. Minh Hieu", fee: 110000, rating: 4.2, image: ("https://cdn2.tuoitre.vn/471584752817336320/2025/2/28/z635975903982367f6f7bbe8fedac7b3c8af5972d78479-17407110210901300008601.jpg") },
  {id:9, name: "Dr. Chau Ngan", fee: 400000, rating: 4.7, image: ("https://vcdn1-suckhoe.vnecdn.net/2024/07/18/BS-Va-n-1-jpg-2195-1721273181.png?w=460&h=0&q=100&dpr=2&fit=crop&s=ns32I0w6u4R5J-HvFQ4Ayw") },
  {id:10, name: "Dr. Thuy An", fee: 350000, rating: 3.7, image: ("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx1onekoQK5X6gsPgmSlzcWwfbSFXwYDX5Op9vVuQsmeutmyb-g49YCvbqE2mVz2fuWgA&usqp=CAU") },
  {id:11, name: "Dr. Thanh Hai", fee: 200000, rating: 4.8, image: ("https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg") },

];

export default function doctorList() {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [modalVisible, setModalVisible] = useState(false);

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
        <Ionicons name='filter-circle-outline' size={20} color='white'/>
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
    marginLeft:300,
    flexDirection: "row",
    alignItems: "center",
    gap:10,
    marginBottom:10
    
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
    borderWidth:3
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