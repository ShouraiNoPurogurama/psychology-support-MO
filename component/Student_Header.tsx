import { TouchableOpacity, View, StyleSheet, Text, Modal, TouchableWithoutFeedback, Image, Platform, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { router, usePathname } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type User = {
    fullName: string;
    phoneNumber: string;
};

export const Student_Header: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState<string>("https://www.fashionbeans.com/wp-content/uploads/2022/02/Medium-Length-Layered-Hair_zeno_vic.jpg"); // Default placeholder
    const pathname = usePathname();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Lấy patientId và userId từ token
                const token = await AsyncStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No authentication token found");
                }
                const decoded: any = jwtDecode(token);
                const patientId = decoded.profileId;
                const userId = decoded.userId; // Thêm userId để lấy hình ảnh
    
                // Fetch thông tin user từ API
                const response = await fetch(`https://psychologysupport-profile.azurewebsites.net/patients/${patientId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user details");
                }
                const data = await response.json();
                const patientProfile = data.patientProfileDto;
    
                const userData: User = {
                    fullName: patientProfile.fullName,
                    phoneNumber: patientProfile.contactInfo.phoneNumber,
                };
                setUser(userData);
    
                // Fetch avatar image từ API
                const IMAGE_API_URL = "https://psychologysupport-image.azurewebsites.net/image/get";
                const imageResponse = await axios.get(`${IMAGE_API_URL}?ownerType=User&ownerId=${userId}`);
                setAvatarUrl(imageResponse.data.url || "https://via.placeholder.com/150");
    
            } catch (error) {
                console.error("Error fetching user data or image:", error);
                setAvatarUrl("https://via.placeholder.com/150"); // Fallback nếu lỗi
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
    }, []);

    return (
        <>
            <View style={styles.HeaderContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsDrawerOpen(true)}
                >
                    <SimpleLineIcons size={24} color="white" name="options-vertical" />
                </TouchableOpacity>
                <Text style={styles.title}>EmoEase</Text>
                <TouchableOpacity style={styles.button}>
                    <MaterialCommunityIcons size={28} color="white" name="bell-outline" />
                </TouchableOpacity>
            </View>
            <Modal
                visible={isDrawerOpen}
                animationType="fade"
                transparent
            >
                <TouchableWithoutFeedback onPress={() => setIsDrawerOpen(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.drawer}>
                            <View style={styles.userInfo}>
                                    <Image 
                                        source={{ uri: avatarUrl }} 
                                        style={styles.avatar} 
                                    />
                                    {loading ? (
                                        <Text style={styles.userName}>Loading...</Text>
                                    ) : user ? (
                                        <>
                                            <Text style={styles.userName}>{user.fullName}</Text>
                                            <Text style={styles.userPhone}>{user.phoneNumber}</Text>
                                        </>
                                    ) : (
                                        <Text style={styles.userName}>User not found</Text>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
                                        router.push("/user/showUserProfile");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="person" size={24} color="white" />
                                    <Text style={styles.drawerText}>My Profile</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
                                        router.push("/user/Meeting");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="videocam" size={24} color="white" />
                                    <Text style={styles.drawerText}>Meetings</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
                                        router.push("/user/userHistory");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="time" size={24} color="white" />
                                    <Text style={styles.drawerText}>History</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
                                        router.push("/user/Blog");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="book" size={24} color="white" />
                                    <Text style={styles.drawerText}>Blog</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
                                        router.push("/user/Workshop");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="shapes" size={24} color="white" />
                                    <Text style={styles.drawerText}>Worshop</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
                                        router.push("/user/Shop");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="cart" size={24} color="white" />
                                    <Text style={styles.drawerText}>Shop</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
                                        router.push("/user/Services");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="gift" size={24} color="white" />
                                    <Text style={styles.drawerText}>Services</Text>
                                </TouchableOpacity>

   
                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
                                        router.push("/user/AboutUs");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="information-circle" size={24} color="white" />
                                    <Text style={styles.drawerText}>About Us</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.drawerItem}

                                    onPress={() => {
                                        AsyncStorage.removeItem("authToken");
                                        router.push("/login");
                                        setIsDrawerOpen(false)
                                    }
                                    }
                                >
                                    <Ionicons name="log-out-sharp" size={24} color="white" />
                                    <Text style={styles.drawerText}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>


    );
};

const styles = StyleSheet.create({
    HeaderContainer: {
        paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,  // chỉ dùng khi test expo go
        position: "absolute",
        top: 0,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#AF93D2",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "black",
        paddingHorizontal: 16,
        justifyContent: "space-between",
        zIndex: 1000,
    },
    button: {
        paddingVertical: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    drawer: {
        width: "52%",
        backgroundColor: "#AF93D2",
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderBottomRightRadius:20,
        borderTopRightRadius:20,
        height:"100%",
        gap:10
    },
    userInfo: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    userPhone: {
        fontSize: 14,
        color: "white",
    },
    drawerItem: {
        fontSize: 18,
        color: "white",
        paddingVertical: 10,
        fontWeight: "bold",
        flexDirection: "row",
        alignItems: "center",


    },
    drawerText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        marginLeft: 10,
    }
});
