import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { Footer } from "../../component/Footer";
import { Student_Header } from "../../component/Student_Header";
import { Ionicons } from "@expo/vector-icons";

export default function ConfirmAppointment() {
    const { date, time, doctorId } = useLocalSearchParams();

    const doctors = [
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
        {
            id: 2,
            name: "Le Minh",
            fee: 180000,
            rating: 4.5,
            image: "https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp",
            specialty: "Pediatrics",
            qualifications: "MD",
            yearsOfExperience: 10,
            certificates: ["Certified Pediatrician", "Neonatal Resuscitation Program"],
            address: "12 Tran Phu, District 1, HCM",
            bio: "Dr. Le Minh is a dedicated pediatrician with over 10 years of experience in treating infants and children. He is passionate about child health and development, ensuring young patients receive the best care. His expertise includes diagnosing and treating childhood illnesses, vaccinations, and nutritional counseling."
        },
        {
            id: 3,
            name: "Tran Duy",
            fee: 170000,
            rating: 4.7,
            image: "https://bizweb.dktcdn.net/100/175/849/files/chup-anh-profile-cho-bac-si-tai-ha-noi-studio-yeu-media-dep-01.jpg?v=1636203347577",
            specialty: "Orthopedics",
            qualifications: "MD, MS",
            yearsOfExperience: 12,
            certificates: ["Certified Orthopedic Surgeon", "Sports Medicine Specialist"],
            address: "22 Vo Van Tan, District 3, HCM",
            bio: "Dr. Tran Duy specializes in orthopedic surgery and sports injuries. With over 12 years of experience, he has successfully treated numerous patients with bone and joint conditions, including fractures, arthritis, and ligament injuries. He is known for his patient-centric approach and commitment to rehabilitation."
        },
        {
            id: 4,
            name: "Pham Tuan",
            fee: 220000,
            rating: 4.2,
            image: "https://taimuihongsg.com/wp-content/uploads/2023/10/BS-TRUONG-CONG-TRANG-KHOA-CHAN-DOAN-HINH-ANH_taimuihongsg.jpg",
            specialty: "ENT (Ear, Nose, Throat)",
            qualifications: "MD, PhD",
            yearsOfExperience: 14,
            certificates: ["Otolaryngology Board Certified", "Sinus Surgery Specialist"],
            address: "45 Nguyen Dinh Chieu, District 3, HCM",
            bio: "Dr. Pham Tuan is an expert in ENT disorders, helping patients with hearing loss, sinus infections, and voice disorders. His research on nasal surgeries has been recognized internationally. He emphasizes minimally invasive procedures and patient comfort."
        },
        {
            id: 5,
            name: "Minh Trung",
            fee: 210000,
            rating: 4.9,
            image: "https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg",
            specialty: "Cardiology",
            qualifications: "MD, FACC",
            yearsOfExperience: 18,
            certificates: ["Fellow of the American College of Cardiology", "Advanced Cardiac Imaging"],
            address: "77 Le Loi, District 1, HCM",
            bio: "Dr. Minh Trung is a leading cardiologist with 18 years of experience in treating heart conditions. His expertise includes hypertension, arrhythmias, and heart failure. He is actively involved in research on new cardiac treatments and preventive care."
        },
        {
            id: 6,
            name: "Thanh Dat",
            fee: 240000,
            rating: 4.7,
            image: "https://luxclinic.vn/wp-content/uploads/2024/07/bac-Phuong-1.jpg",
            specialty: "Dermatology",
            qualifications: "MD, MSc",
            yearsOfExperience: 13,
            certificates: ["Board Certified Dermatologist", "Laser Therapy Specialist"],
            address: "88 Phan Dinh Phung, Phu Nhuan, HCM",
            bio: "Dr. Thanh Dat is an experienced dermatologist specializing in skin disorders and cosmetic dermatology. He is highly skilled in laser treatments, acne management, and anti-aging therapies."
        },
        {
            id: 7,
            name: "Thanh Sang",
            fee: 150000,
            rating: 3.5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHR00f0tBnxetmeLESBPgKeKMFT2qqj8PZ4Q&s",
            specialty: "General Medicine",
            qualifications: "MD",
            yearsOfExperience: 8,
            certificates: ["General Practitioner License", "Emergency Medicine Certified"],
            address: "55 Bui Thi Xuan, District 1, HCM",
            bio: "Dr. Thanh Sang is a general practitioner with a focus on family medicine. He provides primary healthcare services, including diagnosis, treatment, and prevention of common illnesses."
        },
        {
            id: 8,
            name: "Minh Hieu",
            fee: 110000,
            rating: 4.2,
            image: "https://cdn2.tuoitre.vn/471584752817336320/2025/2/28/z635975903982367f6f7bbe8fedac7b3c8af5972d78479-17407110210901300008601.jpg",
            specialty: "Neurology",
            qualifications: "MD, PhD",
            yearsOfExperience: 11,
            certificates: ["Board Certified Neurologist", "Stroke Management Specialist"],
            address: "99 Dinh Tien Hoang, Binh Thanh, HCM",
            bio: "Dr. Minh Hieu specializes in neurology, with expertise in treating stroke, migraines, and neurodegenerative diseases. He is passionate about research in brain health and cognitive function."
        },
        {
            id: 9,
            name: "Chau Ngan",
            fee: 400000,
            rating: 4.7,
            image: "https://vcdn1-suckhoe.vnecdn.net/2024/07/18/BS-Va-n-1-jpg-2195-1721273181.png?w=460&h=0&q=100&dpr=2&fit=crop&s=ns32I0w6u4R5J-HvFQ4Ayw",
            specialty: "Plastic Surgery",
            qualifications: "MD, FACS",
            yearsOfExperience: 16,
            certificates: ["Fellow of the American College of Surgeons", "Aesthetic Surgery Specialist"],
            address: "123 Nguyen Van Troi, Phu Nhuan, HCM",
            bio: "Dr. Chau Ngan is a renowned plastic surgeon specializing in cosmetic and reconstructive surgery. She has performed numerous successful aesthetic procedures, helping patients enhance their natural beauty."
        },
        {
            id: 10,
            name: "Thuy An",
            fee: 350000,
            rating: 3.7,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx1onekoQK5X6gsPgmSlzcWwfbSFXwYDX5Op9vVuQsmeutmyb-g49YCvbqE2mVz2fuWgA&usqp=CAU",
            specialty: "Obstetrics & Gynecology",
            qualifications: "MD, MSc",
            yearsOfExperience: 14,
            certificates: ["Board Certified in Obstetrics & Gynecology", "Prenatal Care Specialist"],
            address: "77 Tran Hung Dao, District 5, HCM",
            bio: "Dr. Thuy An is an experienced obstetrician-gynecologist, providing exceptional care for women in all stages of life. She specializes in prenatal care, reproductive health, and minimally invasive surgeries."
        },
        {
            id: 11,
            name: "Thanh Hai",
            fee: 200000,
            rating: 4.8,
            image: "https://taimuihongsg.com/wp-content/uploads/2018/05/Kim-Bun-ThuongE_taimuihongsg.jpg",
            specialty: "Endocrinology",
            qualifications: "MD, PhD",
            yearsOfExperience: 17,
            certificates: ["Board Certified in Endocrinology", "Diabetes Management Expert"],
            address: "65 Ly Tu Trong, District 1, HCM",
            bio: "Dr. Thanh Hai specializes in endocrine disorders, including diabetes, thyroid diseases, and hormonal imbalances. He is committed to patient education and personalized treatment plans."
        }
    ];
    const selectedDoctor = doctors.find(doc => doc.id === Number(doctorId));
    if (!selectedDoctor) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Doctor not found</Text>
            </View>
        );
    }

    return (
        <>
            <Student_Header />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Confirm Appointment</Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Patient</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-circle-outline" size={40} color="#2A86FF" />
                        <View>
                            <Text style={styles.textBold}>Minh Trung</Text>
                            <Text style={styles.text}>nguyenminhtrung18072004@gmail.com</Text>
                            <Text style={styles.text}>+84 784927089</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Doctor</Text>
                    <View style={styles.infoRow}>
                        <Image source={{ uri: selectedDoctor.image }} style={styles.doctorImage} resizeMode="stretch" />
                        <View>
                            <Text style={styles.textBold}>{selectedDoctor.name}</Text>
                            <Text style={styles.text}>{selectedDoctor.specialty}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Appointment Date & Time</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={30} color="#FFA500" />
                        <View>
                            <Text style={styles.textBold}>{date}</Text>
                            <Text style={styles.text}>{time}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.feeContainer}>
                    <Ionicons name="cash-outline" size={30} color="#34A853" />
                    <Text style={styles.feeText}>  Consultation Fee </Text>
                    <Text style={styles.feeAmount}>{selectedDoctor.fee.toLocaleString()} đ</Text>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={() => console.log("Confirmed!")}>
                    <Text style={styles.confirmText}>Confirm Appointment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => console.log("Canceled!")}>
                    <Text style={styles.confirmText}>Cancel Appointment</Text>
                </TouchableOpacity>
            </ScrollView>

            <Footer />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 80,
        paddingHorizontal: 20,
        paddingTop: 80,
        gap: 20

    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginVertical: 7,
    },
    card: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        color: 'blue'
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    doctorImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        fontSize: 14,
        color: "#666",
    },
    textBold: {
        fontSize: 16,
        fontWeight: "600",
    },
    feeContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#FFF",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        justifyContent: "center",
    },
    feeText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#34A853",
    },
    feeAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#34A853",
        marginLeft: 5,
    },
    confirmButton: {
        backgroundColor: "#2A86FF",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    confirmText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
