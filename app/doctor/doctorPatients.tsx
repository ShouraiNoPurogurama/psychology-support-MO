import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Footer } from '../../component/doctorFooter';
import { router } from 'expo-router';
import React from 'react';

const appointments = [
    { id: '1', name: 'Jack Trinh', gender: 'Male', age: 28, avatar: 'https://via.placeholder.com/50' },
    { id: '2', name: 'Jack Tran', gender: 'Female', age: 23, avatar: 'https://via.placeholder.com/50' },
    { id: '3', name: 'Jack Phuong', gender: 'Male', age: 27, avatar: 'https://via.placeholder.com/50' },
    { id: '4', name: 'Jack Tuan', gender: 'Male', age: 28, avatar: 'https://via.placeholder.com/50' },
    { id: '5', name: 'Jack BoCon', gender: 'Female', age: 42, avatar: 'https://via.placeholder.com/50' },
    { id: '6', name: 'Jack BoVo', gender: 'Male', age: 35, avatar: 'https://via.placeholder.com/50' }
];

export default function DoctorAppointments() {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.header}>Patients</Text>
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
                                onPress={() => router.push('/doctor/patientDetails')}
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
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
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
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: '#555',
    },
    detailButton: {
        backgroundColor: '#AF93D2',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 15,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});
