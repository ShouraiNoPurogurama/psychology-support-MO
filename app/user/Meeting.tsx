import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image,
} from "react-native";
import { Card } from "react-native-paper";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

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

interface ContactInfo {
    address: string;
    phoneNumber: string;
    email: string;
}

interface Specialty {
    id: string;
    name: string;
}

interface DoctorProfile {
    id: string;
    userId: string;
    fullName: string;
    gender: string;
    contactInfo: ContactInfo;
    specialties: Specialty[];
    qualifications: string;
    yearsOfExperience: number;
    bio: string;
    rating: number;
}

interface DoctorProfileResponse {
    doctorProfileDto: DoctorProfile;
}

interface BookingResponse {
    bookings: {
        data: Booking[];
    };
}

const IMAGE_API_URL = "https://psychologysupport-image.azurewebsites.net/image/get";

const fetchDoctorImage = async (userId: string): Promise<string> => {
    try {
        const response = await axios.get<{ url: string }>(`${IMAGE_API_URL}?ownerType=User&ownerId=${userId}`);
        return response.data.url || "https://via.placeholder.com/150"; // Fallback image if API fails
    } catch (error) {
        console.error(`Error fetching image for userId ${userId}:`, error);
        return "https://via.placeholder.com/150"; // Fallback image on error
    }
};

const Meeting: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [doctorProfiles, setDoctorProfiles] = useState<Record<string, DoctorProfile>>({});
    const [doctorImages, setDoctorImages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpcomingOpen, setIsUpcomingOpen] = useState<boolean>(true);

    const upcomingFade = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (!token) throw new Error("No authentication token found");

                const decoded: { profileId: string } = jwtDecode(token);
                const patientId = decoded.profileId;

                // Fetch Bookings
                const bookingResponse = await fetch(
                    `https://psychologysupport-scheduling.azurewebsites.net/bookings?PageIndex=0&PageSize=100&patientId=${patientId}&SortBy=date&SortOrder=desc`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const bookingData: BookingResponse = await bookingResponse.json();
                const bookingList = bookingData.bookings.data;
                setBookings(bookingList);

                // Fetch Doctor Profiles and Images
                const doctorIds = [...new Set(bookingList.map((b: Booking) => b.doctorId))];
                const profiles: Record<string, DoctorProfile> = {};
                const images: Record<string, string> = {};

                for (const doctorId of doctorIds) {
                    // Fetch Doctor Profile
                    const doctorResponse = await fetch(
                        `https://psychologysupport-profile.azurewebsites.net/doctors/${doctorId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const doctorData: DoctorProfileResponse = await doctorResponse.json();
                    const doctorProfile = doctorData.doctorProfileDto;
                    profiles[doctorId] = doctorProfile;

                    // Fetch Doctor Image
                    const imageUrl = await fetchDoctorImage(doctorProfile.userId);
                    images[doctorId] = imageUrl;
                }

                setDoctorProfiles(profiles);
                setDoctorImages(images);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleSection = () => {
        setIsUpcomingOpen(!isUpcomingOpen);
        Animated.timing(upcomingFade, {
            toValue: isUpcomingOpen ? 0 : 1,
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

    const upcomingMeetings = bookings.filter((b) => b.status === "Awaiting Meeting");

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
                {/* Upcoming Meetings */}
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={toggleSection}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                >
                    <Animated.View style={[styles.titleContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
                        <Text style={styles.arrow}>{isUpcomingOpen ? "▼" : "▶"}</Text>
                    </Animated.View>
                </TouchableOpacity>
                {isUpcomingOpen && (
                    <Animated.View style={{ opacity: upcomingFade }}>
                        {upcomingMeetings.length > 0 ? (
                            upcomingMeetings.map((item, index) => {
                                const doctor = doctorProfiles[item.doctorId];
                                const doctorImage = doctorImages[item.doctorId];

                                return (
                                    <Card key={index} style={styles.card}>
                                        <View style={styles.cardContent}>
                                            {doctorImage && (
                                                <Image
                                                    source={{ uri: doctorImage }}
                                                    style={styles.doctorImage}
                                                />
                                            )}
                                            <View style={styles.textContainer}>
                                                <Text style={styles.cardTitle}>
                                                    Booking: {item.bookingCode}
                                                </Text>
                                                <Text style={styles.cardText}>
                                                    Date: {new Date(item.date).toLocaleDateString()}
                                                </Text>
                                                <Text style={styles.cardText}>
                                                    Time: {item.startTime} (Duration: {item.duration} mins)
                                                </Text>
                                                {doctor && (
                                                    <>
                                                        <Text style={styles.cardText}>
                                                            Doctor: {doctor.fullName} ({doctor.gender})
                                                        </Text>
                                                        <Text style={styles.cardText}>
                                                            Contact: {doctor.contactInfo.phoneNumber} |{" "}
                                                            {doctor.contactInfo.email}
                                                        </Text>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    </Card>
                                );
                            })
                        ) : (
                            <Text style={styles.noDataText}>No upcoming meetings available</Text>
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
        padding: 12,
        backgroundColor: "#f5f3ff",
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
        fontSize: 16,
        color: "#6d28d9",
        fontFamily: "Roboto",
    },
    errorText: {
        fontSize: 16,
        color: "#ef4444",
        fontFamily: "Roboto",
    },
    sectionHeader: {
        backgroundColor: "#7c3aed",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 8,
        elevation: 4,
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
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffff",
        letterSpacing: 0.5,
        fontFamily: "Roboto",
    },
    arrow: {
        fontSize: 18,
        color: "#ffffff",
    },
    card: {
        padding: 16,
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    doctorImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6d28d9",
        marginBottom: 8,
        letterSpacing: 0.3,
        fontFamily: "Roboto",
    },
    cardText: {
        fontSize: 14,
        color: "#4b5563",
        marginBottom: 4,
        fontFamily: "Roboto",
    },
    noDataText: {
        fontSize: 13,
        color: "#9ca3af",
        fontStyle: "italic",
        marginVertical: 6,
        fontFamily: "Roboto",
    },
});

export default Meeting;