import { router, useLocalSearchParams } from "expo-router";

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Student_Header } from "../../../component/Student_Header";
import { Footer } from "../../../component/Footer";
import { FontAwesome } from '@expo/vector-icons';
import { useState } from "react";


const doctors = [
    // {id:1, name: "Dr. Nguyen Anh", fee: 250000, rating: 4.4, image: ("https://images2.thanhnien.vn/thumb_w/686/528068263637045248/2024/3/7/41498385661961282804899348165590311304931596n-17098051418122006775403-0-286-2048-1822-crop-1709805739243640175866.jpg") },
    // {id:2, name: "Dr. Le Minh", fee: 180000, rating: 4.5, image: ("https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp") },
    // {id:3, name: "Dr. Tran Duy", fee: 170000, rating: 4.7, image: ("https://bizweb.dktcdn.net/100/175/849/files/chup-anh-profile-cho-bac-si-tai-ha-noi-studio-yeu-media-dep-01.jpg?v=1636203347577") },
    // {id:4, name: "Dr. Pham Tuan", fee: 220000, rating: 4.2, image: ("https://taimuihongsg.com/wp-content/uploads/2023/10/BS-TRUONG-CONG-TRANG-KHOA-CHAN-DOAN-HINH-ANH_taimuihongsg.jpg") },
    // {id:5, name: "Dr. Minh Trung", fee: 210000, rating: 4.9, image: ("https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg") },
    // {id:6, name: "Dr. Thanh Dat", fee: 240000, rating: 4.7, image: ("https://luxclinic.vn/wp-content/uploads/2024/07/bac-Phuong-1.jpg") },
    // {id:7, name: "Dr. Thanh Sang", fee: 150000, rating: 3.5, image: ("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHR00f0tBnxetmeLESBPgKeKMFT2qqj8PZ4Q&s") },
    // {id:8, name: "Dr. Minh Hieu", fee: 110000, rating: 4.2, image: ("https://cdn2.tuoitre.vn/471584752817336320/2025/2/28/z635975903982367f6f7bbe8fedac7b3c8af5972d78479-17407110210901300008601.jpg") },
    // {id:9, name: "Dr. Chau Ngan", fee: 400000, rating: 4.7, image: ("https://vcdn1-suckhoe.vnecdn.net/2024/07/18/BS-Va-n-1-jpg-2195-1721273181.png?w=460&h=0&q=100&dpr=2&fit=crop&s=ns32I0w6u4R5J-HvFQ4Ayw") },
    // {id:10, name: "Dr. Thuy An", fee: 350000, rating: 3.7, image: ("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx1onekoQK5X6gsPgmSlzcWwfbSFXwYDX5Op9vVuQsmeutmyb-g49YCvbqE2mVz2fuWgA&usqp=CAU") },
    // {id:11, name: "Dr. Thanh Hai", fee: 200000, rating: 4.8, image: ("https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg") },
    {
        id: 1,
        name: "Nguyen Thi Kim Anh",
        fee: 250000,
        rating: 4.4,
        image: "https://images2.thanhnien.vn/thumb_w/686/528068263637045248/2024/3/7/41498385661961282804899348165590311304931596n-17098051418122006775403-0-286-2048-1822-crop-1709805739243640175866.jpg",
        specialty: "Internal Medicine",
        qualifications: "MD, PhD",
        yearsOfExperience: 15,
        certificates: ["Board Certified in Internal Medicine", "Advanced Cardiac Life Support"],
        address: "37 Hoang Hoa Tham, Tan Binh, HCM",
        bio: "Dr. Nguyen Thi Kim Anh has over 15 years of experience in the field of internal medicine. She has worked in various prestigious hospitals and clinics, specializing in diagnosing and treating complex internal diseases. Her passion lies in patient care, ensuring that each individual receives the best possible treatment tailored to their needs. She has published numerous research papers in international medical journals and is actively involved in mentoring young medical professionals. Dr. Kim Anh believes in a holistic approach to medicine, integrating modern treatments with lifestyle modifications to achieve optimal health outcomes."

    },
];

export default function doctorDetail() {
    const { id } = useLocalSearchParams();
    const doctor = doctors.find(doc => doc.id === Number(id));
    const [showMore, setShowMore] = useState(false);

    if (!doctor) {
        return (
            <View style={styles.container}>
                <Text>Doctor not found</Text>
            </View>
        );
    }

    return (
        <>
            <Student_Header />
            <View style={styles.fixedImageContainer}>
                <Image source={{ uri: doctor.image }} style={styles.image} resizeMode="stretch" />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.name}>{doctor.name}</Text>
                    <Text style={styles.specialty}>{doctor.specialty}</Text>
                    <Text style={styles.address}>{doctor.address}</Text>
                    <Text style={styles.fee}>Consultation Fee: {doctor.fee.toLocaleString()} VND</Text>
                    <View style={styles.ratingContainer}>
                        <FontAwesome name="star" size={18} color="gold" />
                        <Text style={styles.rating}>{doctor.rating} / 5</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Doctor's Information</Text>
                    <Text style={styles.bio} numberOfLines={showMore ? undefined : 3}>{doctor.bio}</Text>
                    <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                        <Text style={styles.showMore}>{showMore ? "Show Less" : "Show More"}</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Experience</Text>
                    <Text style={styles.textLeft}>Years of Experience: {doctor.yearsOfExperience}</Text>

                    <Text style={styles.sectionTitle}>Education</Text>
                    <Text style={styles.textLeft}>{doctor.qualifications}</Text>

                    <Text style={styles.sectionTitle}>Certificates</Text>
                    {doctor.certificates.map((cert, index) => (
                        <Text key={index} style={styles.textLeft}>- {cert}</Text>
                    ))}
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Book Appointment</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Footer />


        </>


    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 80,
        flexGrow:1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        marginTop: 370,
        borderRadius:40
    },
    fixedImageContainer: {
        position: 'absolute',
        top: 65,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: 'white',
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: '70%',
        height: 300,
        borderRadius: 600,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    specialty: {
        fontSize: 16,
        color: 'gray'
    },
    address: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    rating: {
        fontSize: 16,
        marginLeft: 5
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        alignSelf: 'flex-start'
    },
    bio: {
        fontSize: 14,
        color: 'gray',
        marginVertical: 5,
        textAlign: 'justify'
    },
    showMore: {
        fontSize: 14,
        color: '#007BFF',
        fontWeight: 'bold',
        marginTop: 5
    },
    experience: {
        fontSize: 16,
        marginVertical: 5
    },
    qualifications: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    certificateItem: {
        fontSize: 14,
        color: 'gray'
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    textLeft: {
        fontSize: 16,
        marginVertical: 5,
        textAlign: 'left',
        alignSelf: 'flex-start'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
       fee: {
        fontSize: 16,
        fontWeight: 'bold'
    },
});
