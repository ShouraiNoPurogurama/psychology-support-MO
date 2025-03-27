import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from "react-native";
import { Card } from "react-native-paper";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface Booking {
    bookingCode: string;
    doctorId: string;
    patientId: string;
    date: string;
    startTime: string;
    duration: number;
    price: number;
    promoCodeId: string | null;
    giftCodeId: string | null;
    status: string;
}

interface MedicalHistory {
    description: string;
    diagnosedAt: string;
    specificMentalDisorders: { name: string; subtype: string; description: string }[];
    physicalSymptoms: { name: string; description: string }[];
}

interface MedicalRecord {
    id: string;
    notes: string;
    status: string;
    specificMentalDisorders: { name: string; subtype: string; description: string }[];
    createdAt: string;
}

interface TestResult {
    id: string;
    patientId: string;
    testId: string;
    takenAt: string;
    depressionScore: { value: number };
    anxietyScore: { value: number };
    stressScore: { value: number };
    severityLevel: string;
    recommendation: string;
    selectedOptions: any[];
    domainEvents: any[];
    createdAt: string;
    createdBy: string;
    lastModified: string;
    lastModifiedBy: string;
}

type EvaluationType = "depression" | "anxiety" | "stress";

const getCategoryFromScore = (score: number, type: EvaluationType): string => {
    if (type === "stress") {
        if (score <= 14) return "Normal";
        if (score <= 18) return "Mild";
        if (score <= 25) return "Moderate";
        if (score <= 33) return "Severe";
        return "Extremely Severe";
    }
    if (type === "anxiety") {
        if (score <= 7) return "Normal";
        if (score <= 9) return "Mild";
        if (score <= 14) return "Moderate";
        if (score <= 19) return "Severe";
        return "Extremely Severe";
    }
    if (type === "depression") {
        if (score <= 9) return "Normal";
        if (score <= 13) return "Mild";
        if (score <= 20) return "Moderate";
        if (score <= 27) return "Severe";
        return "Extremely Severe";
    }
    return "Normal";
};

const getColorForCategory = (category: string) => {
    switch (category) {
        case "Normal":
            return "#34c759"; // Xanh lá
        case "Mild":
            return "#FFD700"; // Vàng đậm
        case "Moderate":
            return "#f97316"; // Cam
        case "Severe":
            return "#ef4444"; // Đỏ
        case "Extremely Severe":
            return "#6b21a8"; // Tím đậm
        default:
            return "#9ca3af"; // Xám
    }
};

const UserHistory: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
    const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState<boolean>(true);
    const [isMedicalRecordsOpen, setIsMedicalRecordsOpen] = useState<boolean>(false);
    const [isTestResultsOpen, setIsTestResultsOpen] = useState<boolean>(false);

    // Animation for fade effect
    const bookingFade = useRef(new Animated.Value(0)).current;
    const medicalHistoryFade = useRef(new Animated.Value(1)).current;
    const medicalRecordsFade = useRef(new Animated.Value(0)).current;
    const testResultsFade = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (!token) throw new Error("No authentication token found");
                const decoded: any = jwtDecode(token);
                const patientId = decoded.profileId;
    
                // Fetch Bookings với SortBy và SortOrder
                const bookingResponse = await fetch(
                    `https://psychologysupport-scheduling.azurewebsites.net/bookings?PageIndex=0&PageSize=10&patientId=${patientId}&SortBy=date&SortOrder=desc`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const bookingData = await bookingResponse.json();
                setBookings(bookingData.bookings.data);
    
                // Fetch Profile (Medical History and Medical Records)
                const profileResponse = await fetch(
                    `https://psychologysupport-profile.azurewebsites.net/patients/${patientId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const profileData = await profileResponse.json();
                const patientProfile = profileData.patientProfileDto;
                setMedicalHistory(patientProfile.medicalHistory || null);
                setMedicalRecords(patientProfile.medicalRecords || []);
    
                // Fetch Test Results
                const testResultsResponse = await fetch(
                    `https://psychologysupport-test.azurewebsites.net/test-results/${patientId}?PageIndex=0&PageSize=10&SortOrder=asc`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const testResultsData = await testResultsResponse.json();
                setTestResults(testResultsData.testResults.data);
    
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    const toggleSection = (section: string) => {
        const fade = section === "booking" ? bookingFade : section === "history" ? medicalHistoryFade : section === "records" ? medicalRecordsFade : testResultsFade;
        const isOpen = section === "booking" ? isBookingOpen : section === "history" ? isMedicalHistoryOpen : section === "records" ? isMedicalRecordsOpen : isTestResultsOpen;
        const setOpen = section === "booking" ? setIsBookingOpen : section === "history" ? setIsMedicalHistoryOpen : section === "records" ? setIsMedicalRecordsOpen : setIsTestResultsOpen;

        setOpen(!isOpen);
        Animated.timing(fade, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <>
            <Student_Header />
            <ScrollView style={styles.container}>
                {/* Booking History */}
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection("booking")}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                >
                    <Animated.View style={[styles.titleContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.sectionTitle}>Booking History</Text>
                        <Text style={styles.arrow}>{isBookingOpen ? "▼" : "▶"}</Text>
                    </Animated.View>
                </TouchableOpacity>
                {isBookingOpen && (
                    <Animated.View style={{ opacity: bookingFade }}>
                        {bookings.length > 0 ? (
                            bookings.map((item, index) => (
                                <Card key={index} style={styles.card}>
                                    <Text style={styles.cardTitle}>Booking: {item.bookingCode}</Text>
                                    <Text style={styles.cardText}>Date: {item.date}</Text>
                                    <Text style={styles.cardText}>
                                        Time: {item.startTime} (Duration: {item.duration} mins)
                                    </Text>
                                    <Text style={styles.cardText}>
                                        Price: {item.price.toLocaleString()} VND
                                    </Text>
                                    <Text
                                        style={[
                                            styles.cardText,
                                            { color: item.status === "Confirmed" ? "#34c759" : "#ef4444" },
                                        ]}
                                    >
                                        Status: {item.status}
                                    </Text>
                                </Card>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No booking history available</Text>
                        )}
                    </Animated.View>
                )}

                {/* Medical History */}
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection("history")}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                >
                    <Animated.View style={[styles.titleContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.sectionTitle}>Medical History</Text>
                        <Text style={styles.arrow}>{isMedicalHistoryOpen ? "▼" : "▶"}</Text>
                    </Animated.View>
                </TouchableOpacity>
                {isMedicalHistoryOpen && (
                    <Animated.View style={{ opacity: medicalHistoryFade }}>
                        {medicalHistory ? (
                            <Card style={styles.card}>
                                <Text style={styles.cardTitle}>Description: {medicalHistory.description}</Text>
                                <Text style={styles.cardText}>
                                    Diagnosed At: {new Date(medicalHistory.diagnosedAt).toLocaleDateString()}
                                </Text>
                                <Text style={styles.subTitle}>Mental Disorders:</Text>
                                {medicalHistory.specificMentalDisorders.length > 0 ? (
                                    medicalHistory.specificMentalDisorders.map((disorder, index) => (
                                        <Text key={index} style={styles.cardText}>
                                            • {disorder.name} - Subtype - Subtype: {disorder.subtype} - {disorder.description}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={styles.noDataText}>No mental disorders recorded</Text>
                                )}
                                <Text style={styles.subTitle}>Physical Symptoms:</Text>
                                {medicalHistory.physicalSymptoms.length > 0 ? (
                                    medicalHistory.physicalSymptoms.map((symptom, index) => (
                                        <Text key={index} style={styles.cardText}>
                                            • {symptom.name}: {symptom.description}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={styles.noDataText}>No physical symptoms recorded</Text>
                                )}
                            </Card>
                        ) : (
                            <Text style={styles.noDataText}>No medical history available</Text>
                        )}
                    </Animated.View>
                )}

                {/* Medical Records */}
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection("records")}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                >
                    <Animated.View style={[styles.titleContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.sectionTitle}>Medical Records</Text>
                        <Text style={styles.arrow}>{isMedicalRecordsOpen ? "▼" : "▶"}</Text>
                    </Animated.View>
                </TouchableOpacity>
                {isMedicalRecordsOpen && (
                    <Animated.View style={{ opacity: medicalRecordsFade }}>
                        {medicalRecords.length > 0 ? (
                            medicalRecords.map((item, index) => (
                                <Card key={index} style={styles.card}>
                                    <Text style={styles.cardTitle}>
                                        Date: {new Date(item.createdAt).toLocaleDateString()}
                                    </Text>
                                    <Text style={styles.cardText}>Notes: {item.notes}</Text>
                                    <Text style={styles.cardText}>Status: {item.status}</Text>
                                    <Text style={styles.subTitle}>Mental Disorders:</Text>
                                    {item.specificMentalDisorders.length > 0 ? (
                                        item.specificMentalDisorders.map((disorder, index) => (
                                            <Text key={index} style={styles.cardText}>
                                                • {disorder.name} - Subtype - Subtype: {disorder.subtype} - {disorder.description}
                                            </Text>
                                        ))
                                    ) : (
                                        <Text style={styles.noDataText}>No disorders recorded</Text>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No medical records available</Text>
                        )}
                    </Animated.View>
                )}

                {/* Test Result History */}
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection("testResults")}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                >
                    <Animated.View style={[styles.titleContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.sectionTitle}>Test Result History</Text>
                        <Text style={styles.arrow}>{isTestResultsOpen ? "▼" : "▶"}</Text>
                    </Animated.View>
                </TouchableOpacity>
                {isTestResultsOpen && (
                    <Animated.View style={{ opacity: testResultsFade }}>
                        {testResults.length > 0 ? (
                            testResults.map((item, index) => {
                                const depressionCategory = getCategoryFromScore(item.depressionScore.value, "depression");
                                const anxietyCategory = getCategoryFromScore(item.anxietyScore.value, "anxiety");
                                const stressCategory = getCategoryFromScore(item.stressScore.value, "stress");

                                const depressionColor = getColorForCategory(depressionCategory);
                                const anxietyColor = getColorForCategory(anxietyCategory);
                                const stressColor = getColorForCategory(stressCategory);

                                return (
                                    <Card key={index} style={styles.card}>
                                        <Text style={styles.cardTitle}>
                                            Taken At: {new Date(item.takenAt).toLocaleString()}
                                        </Text>
                                        <Text style={styles.cardText}>Severity Level: {item.severityLevel}</Text>
                                        <View style={styles.scoreContainer}>
                                            <View style={[styles.scoreBox, { backgroundColor: depressionColor }]}>
                                                <Text style={[styles.scoreLabel, { color: "#fff" }]}>Depression</Text>
                                                <Text style={[styles.scoreValue, { color: "#fff" }]}>{item.depressionScore.value}</Text>
                                            </View>
                                            <View style={[styles.scoreBox, { backgroundColor: anxietyColor }]}>
                                                <Text style={[styles.scoreLabel, { color: "#fff" }]}>Anxiety</Text>
                                                <Text style={[styles.scoreValue, { color: "#fff" }]}>{item.anxietyScore.value}</Text>
                                            </View>
                                            <View style={[styles.scoreBox, { backgroundColor: stressColor }]}>
                                                <Text style={[styles.scoreLabel, { color: "#fff" }]}>Stress</Text>
                                                <Text style={[styles.scoreValue, { color: "#fff" }]}>{item.stressScore.value}</Text>
                                            </View>
                                        </View>
                                    </Card>
                                );
                            })
                        ) : (
                            <Text style={styles.noDataText}>No test results available</Text>
                        )}
                    </Animated.View>
                )}
            </ScrollView>
            <Footer />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12, // Giảm padding để giao diện thoáng hơn
        backgroundColor: "#f5f3ff", // Tím nhạt sáng
        marginTop: 100,
        marginBottom: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f3ff",
    },
    loadingText: {
        fontSize: 16, // Giảm kích thước chữ
        color: "#6d28d9", // Tím đậm
        fontFamily: "Roboto",
    },
    errorText: {
        fontSize: 16,
        color: "#ef4444", // Đỏ cho lỗi
        fontFamily: "Roboto",
    },
    sectionHeader: {
        backgroundColor: "#7c3aed", // Tím đậm
        paddingVertical: 12, // Giảm padding dọc
        paddingHorizontal: 16, // Giảm padding ngang
        borderRadius: 10, // Bo góc nhẹ hơn
        marginVertical: 8, // Giảm khoảng cách giữa các section
        elevation: 4, // Giảm bóng
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 18, // Giảm kích thước chữ
        fontWeight: "600", // Giảm độ đậm
        color: "#ffffff", // Trắng
        letterSpacing: 0.5, // Giảm khoảng cách chữ
        fontFamily: "Roboto",
    },
    arrow: {
        fontSize: 18, // Giảm kích thước mũi tên
        color: "#ffffff",
    },
    card: {
        padding: 16, // Giảm padding
        marginBottom: 8, // Giảm khoảng cách giữa các card
        borderRadius: 10, // Bo góc nhẹ hơn
        backgroundColor: "#ffffff", // Trắng
        elevation: 2, // Giảm bóng
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderWidth: 0, // Bỏ viền
    },
    cardTitle: {
        fontSize: 16, // Giảm kích thước chữ
        fontWeight: "600", // Giảm độ đậm
        color: "#6d28d9", // Tím đậm
        marginBottom: 8, // Giảm khoảng cách
        letterSpacing: 0.3, // Giảm khoảng cách chữ
        fontFamily: "Roboto",
    },
    cardText: {
        fontSize: 14, // Giảm kích thước chữ
        color: "#4b5563", // Xám đậm
        marginBottom: 4, // Giảm khoảng cách
        fontFamily: "Roboto",
    },
    subTitle: {
        fontSize: 14, // Giảm kích thước chữ
        fontWeight: "500", // Giảm độ đậm
        color: "#7c3aed", // Tím đậm
        marginTop: 8, // Giảm khoảng cách
        marginBottom: 4, // Giảm khoảng cách
        letterSpacing: 0.3, // Giảm khoảng cách chữ
        fontFamily: "Roboto",
    },
    noDataText: {
        fontSize: 13, // Giảm kích thước chữ
        color: "#9ca3af", // Xám nhạt
        fontStyle: "italic",
        marginVertical: 6, // Giảm khoảng cách
        fontFamily: "Roboto",
    },
    scoreContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8, // Giảm khoảng cách
    },
    scoreBox: {
        flex: 1,
        alignItems: "center",
        padding: 8, // Giảm padding
        borderRadius: 6, // Bo góc nhẹ hơn
        marginHorizontal: 4, // Giảm khoảng cách giữa các ô
    },
    scoreLabel: {
        fontSize: 12, // Giảm kích thước chữ
        fontWeight: "500", // Giảm độ đậm
        marginBottom: 4, // Giảm khoảng cách
        fontFamily: "Roboto",
    },
    scoreValue: {
        fontSize: 20, // Giảm kích thước chữ
        fontWeight: "600", // Giảm độ đậm
        fontFamily: "Roboto",
    },
});

export default UserHistory; 