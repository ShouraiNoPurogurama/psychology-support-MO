import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';

const availableTimes = [
    "7:00-7:30", "7:30-8:00", "8:00-8:30", "8:30-9:00",
    "9:00-9:30", "9:30-10:00", "10:00-10:30", "10:30-11:00",
    "11:00-11:30"
];

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (date: string, time: string) => void;
    doctorId: string;
}

const BookingModal = ({ visible, onClose, onConfirm, doctorId }: BookingModalProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            router.push({
                pathname: "/user/confirmAppointment",
                params: { date: selectedDate.toDateString(), time: selectedTime, doctorId }

            });

        }
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Date & Time</Text>

                    {/* Date Picker */}
                    <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.dateButton}>
                        <Text style={styles.dateText}>{selectedDate ? selectedDate.toDateString() : "Select a Date"}</Text>
                    </TouchableOpacity>

                    <DatePickerModal
                        locale="en"
                        mode="single"
                        visible={datePickerVisible}
                        onDismiss={() => setDatePickerVisible(false)}
                        date={selectedDate || new Date()}
                        onConfirm={(params) => {
                            if (params.date) {
                                setSelectedDate(new Date(params.date));
                            }
                            setDatePickerVisible(false);
                        }}
                    />

                    {/* Time Picker */}
                    <Text style={styles.timeTitle}>Available Times</Text>
                    <FlatList
                        data={availableTimes}
                        numColumns={2}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.timeSlot, selectedTime === item && styles.selectedTimeSlot]}
                                onPress={() => setSelectedTime(item)}
                            >
                                <Text style={[styles.timeText, selectedTime === item && styles.selectedTimeText]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.confirmButton, (!selectedDate || !selectedTime) && styles.disabledButton]}
                            onPress={() => {
                                if (selectedDate && selectedTime) {
                                    onConfirm(selectedDate.toDateString(), selectedTime);
                                    handleConfirm();
                                }
                            }}
                            disabled={!selectedDate || !selectedTime}
                        >
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dateButton: {
        backgroundColor: '#eee',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
    },
    timeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    timeSlot: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        minWidth: 170,
        margin: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
    selectedTimeSlot: {
        backgroundColor: '#007bff',

    },
    timeText: {
        fontSize: 16,
        color: '#000',
    },
    selectedTimeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
        minWidth: 100,
    },
    confirmButton: {
        backgroundColor: '#28a745',
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 100,
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default BookingModal;
