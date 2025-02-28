import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Footer } from "../../component/doctorFooter";
import { router } from "expo-router";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const appointments = [
    { id: '1', name: 'Jack Trinh', gender: 'Male', age: 28, dob: '1993-01-01', avatar: 'https://via.placeholder.com/50' },
    { id: '2', name: 'Jack Tran', gender: 'Female', age: 23, dob: '1998-02-02', avatar: 'https://via.placeholder.com/50' },
    { id: '3', name: 'Jack Phuong', gender: 'Male', age: 27, dob: '1994-03-03', avatar: 'https://via.placeholder.com/50' },
    { id: '4', name: 'Jack Tuan', gender: 'Male', age: 28, dob: '1993-04-04', avatar: 'https://via.placeholder.com/50' },
    { id: '5', name: 'Jack BoCon', gender: 'Female', age: 42, dob: '1979-05-05', avatar: 'https://via.placeholder.com/50' },
    { id: '6', name: 'Jack BoVo', gender: 'Male', age: 35, dob: '1986-06-06', avatar: 'https://via.placeholder.com/50' }
];

export default function DoctorPatients() {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color="#AF93D2" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Patients</Text>
                </View>
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.details}>{item.gender}, {item.age}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.detailButton}
                                onPress={() =>
                                    router.push({
                                        pathname: "/doctor/patientDetails",
                                        params: {
                                            name: item.name,
                                            gender: item.gender,
                                            age: item.age,
                                            dob: item.dob, // ✅ Truyền thêm ngày sinh
                                            avatar: item.avatar,
                                        },
                                    })
                                }
                            >
                                <Text style={styles.statusText}>Detail</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            <Footer />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 10,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#F5F5F5",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    details: {
        fontSize: 14,
        color: "#555",
    },
    detailButton: {
        backgroundColor: "#AF93D2",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 15,
    },
    statusText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
