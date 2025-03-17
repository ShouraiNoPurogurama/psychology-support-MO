import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";

const workshopData = [
    {
        id:"1",
        text: "📢 Chia sẻ từ chuyên gia tâm lý",
        image: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
        date: "Thứ Hai, 21/07/2025",
        time: "10:00 - 12:00",
        location: "Phòng họp A, Trung tâm Hội nghị ABC, Quận 1, TP. HCM",
        detail: "Buổi chia sẻ từ chuyên gia tâm lý giúp bạn hiểu rõ hơn về cách kiểm soát căng thẳng, tăng cường sức khỏe tinh thần và cải thiện các mối quan hệ cá nhân."
    },
    {
        id:"2",
        text: "🤝 Trò chuyện và hỗ trợ nhóm",
        image: "https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg",
        date: "Thứ Ba, 22/07/2025",
        time: "14:00 - 16:00",
        location: "Phòng họp B, Trung tâm Hội nghị ABC, Quận 1, TP. HCM",
        detail: "Một không gian mở để bạn có thể chia sẻ câu chuyện của mình, lắng nghe và nhận được sự hỗ trợ từ những người có cùng trải nghiệm."
    },
    {
        id:"3",
        text: "🧘‍♂️ Thiền và thực hành chánh niệm",
        image: "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg",
        date: "Thứ Tư, 23/07/2025",
        time: "08:00 - 10:00",
        location: "Sân vườn, Trung tâm Hội nghị ABC, Quận 1, TP. HCM",
        detail: "Buổi thực hành chánh niệm và thiền định giúp bạn thư giãn, tập trung vào hiện tại và cải thiện sức khỏe tâm lý tổng thể."
    },
    {
        id:"4",
        text: "🎨 Hoạt động sáng tạo giúp giảm căng thẳng",
        image: "https://images.pexels.com/photos/3817587/pexels-photo-3817587.jpeg",
        date: "Thứ Năm, 24/07/2025",
        time: "16:00 - 18:00",
        location: "Phòng nghệ thuật, Trung tâm Hội nghị ABC, Quận 1, TP. HCM",
        detail: "Tham gia vào các hoạt động sáng tạo như vẽ tranh, viết lách giúp bạn giải tỏa căng thẳng, thể hiện cảm xúc và cải thiện tinh thần."
    }
];

export default function Workshop() {

    return (
        <>
            <Student_Header />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Workshop: Cùng nhau chăm sóc sức khỏe tâm lý</Text>

                {workshopData.map((event) => (
                    <View key={event.id} style={styles.card}>
                        <Image source={{ uri: event.image }} style={styles.image} />
                        <Text style={styles.title}>{event.text}</Text>
                        <Text style={styles.info}>
                            <Ionicons name="calendar-outline" size={18} color="gray" /> {event.date}
                        </Text>
                        <Text style={styles.info}>
                            <Ionicons name="time-outline" size={18} color="gray" /> {event.time}
                        </Text>
                        <Text style={styles.info}>
                            <Ionicons name="location-outline" size={18} color="gray" /> {event.location}
                        </Text>
                        <Text style={styles.details}>{event.detail}</Text>
                    </View>
                ))}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Đăng ký ngay</Text>
                </TouchableOpacity>
            </ScrollView>
            <Footer />
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 110,
        paddingHorizontal: 15,
        backgroundColor: "#f9f9f9",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#6B21A8",
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "blue",
    },
    info: {
        fontSize: 14,
        color: "gray",
        marginBottom: 5,
    },
    details: {
        fontSize: 14,
        color: "#555",
        marginTop: 8,
    },
    button: {
        backgroundColor: "#6B21A8",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
      },
      buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
      },
});
