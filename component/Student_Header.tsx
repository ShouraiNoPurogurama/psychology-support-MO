import { TouchableOpacity, View, StyleSheet, Text, Modal, TouchableWithoutFeedback, Image, Platform, StatusBar } from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { router, usePathname } from "expo-router";
import { Ionicons } from '@expo/vector-icons';



export const Student_Header: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pathname = usePathname();

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
                                    <Image source={{ uri: 'https://www.fashionbeans.com/wp-content/uploads/2022/02/Medium-Length-Layered-Hair_zeno_vic.jpg' }} style={styles.avatar} />
                                    <Text style={styles.userName}>Minh Trung</Text>
                                    <Text style={styles.userPhone}>+84 785901245</Text>
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

                                <TouchableOpacity style={styles.drawerItem}>
                                    <Ionicons name="time" size={24} color="white" />
                                    <Text style={styles.drawerText}>Booking History</Text>
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

                                <TouchableOpacity style={styles.drawerItem}>
                                    <Ionicons name="settings" size={24} color="white" />
                                    <Text style={styles.drawerText}>Setting</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.drawerItem}>
                                    <Ionicons name="information-circle" size={24} color="white" />
                                    <Text style={styles.drawerText}>About Us</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.drawerItem}
                                    onPress={() => {
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
