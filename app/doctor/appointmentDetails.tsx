import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Footer } from '../../component/doctorFooter';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function AppointmentDetails() {
    const { name, gender, age, date, time, avatar, email, phone, dob, testResult, meetingUrl } = useLocalSearchParams();

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.header}>Details</Text>
                <View style={styles.detailsContainer}>
                    {/* <Image source={{ uri: avatar }} style={styles.avatar} /> */}
                    <Text style={styles.name}>Mr. {name}</Text>
                    <Text style={styles.age}>{age} Years, {gender}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.info}>{email}</Text>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.info}>{phone}</Text>
                    <Text style={styles.label}>Date of Birth</Text>
                    <Text style={styles.info}>{dob}</Text>
                    <Text style={styles.label}>Test Result</Text>
                    <Text style={styles.info}>{testResult}</Text>
                    <Text style={styles.label}>Appointment Date & Time</Text>
                    <Text style={styles.info}>{date} - {time}</Text>
                    <Text style={styles.label}>Google Meet Link</Text>
                    <TouchableOpacity onPress={() => {
                        if (typeof meetingUrl === 'string') {
                            Linking.openURL(meetingUrl);
                        } else {
                            console.error('Invalid meeting URL');
                        }
                    }}>
                        <Text style={[styles.info, styles.link]}>{typeof meetingUrl === 'string' ? meetingUrl : 'Invalid URL'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.declineButton}>
                        <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
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
        color: '#AF93D2',
    },
    detailsContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    age: {
        fontSize: 16,
        color: '#555',
    },
    infoContainer: {
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#999',
        marginTop: 10,
    },
    info: {
        fontSize: 16,
        color: '#333',
    },
    link: {
        color: '#1E90FF',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    declineButton: {
        backgroundColor: '#E74C3C',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
