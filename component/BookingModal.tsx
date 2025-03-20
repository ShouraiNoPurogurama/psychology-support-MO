import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Dimensions } from 'react-native';
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
const { width } = Dimensions.get('window');

const BookingModal = ({ visible, onClose, onConfirm, doctorId }: BookingModalProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [availableTimes, setAvailableTimes] = useState<{ time: string, available: boolean }[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (selectedDate) {
            fetchAvailableTimes(selectedDate);
        }
    }, [selectedDate]);

    const fetchAvailableTimes = async (date: Date) => {
        setLoading(true);
        const dateToUse = selectedDate ?? new Date();

        const formattedDate = dateToUse.getFullYear() + "-" +
            String(dateToUse.getMonth() + 1).padStart(2, "0") + "-" +
            String(dateToUse.getDate()).padStart(2, "0");

        const url = `https://psychologysupport-scheduling.azurewebsites.net/doctor-schedule/${doctorId}/${formattedDate}`;

        console.log("Fetching API with:");
        console.log("Doctor ID:", doctorId);
        console.log("Selected Date:", formattedDate);
        console.log("URL:", url);
        try {

            const response = await fetch(url);
            const data = await response.json();

            if (data?.timeSlots) {
                const times = data.timeSlots.map((slot: any) => ({
                    time: `${slot.startTime.slice(0, 5)}-${slot.endTime.slice(0, 5)}`,
                    available: slot.status === "Available" 
                }));
                setAvailableTimes(times);
                

                console.log("data", data);
            } else {
                setAvailableTimes([]);
            }

        } catch (error) {
            console.error("Error fetching available times:", error);
            setAvailableTimes([]);
        }
        setLoading(false);
    };


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
                        keyExtractor={(item) => item.time}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.timeSlot,
                                    !item.available && styles.unavailableTimeSlot,
                                    selectedTime === item.time && styles.selectedTimeSlot
                                ]}
                                onPress={() => item.available && setSelectedTime(item.time)}
                                disabled={!item.available}
                            >
                                <Text style={[
                                    styles.timeText,
                                    !item.available && styles.unavailableTimeText,
                                    selectedTime === item.time && styles.selectedTimeText
                                ]}>
                                    {item.time}
                                </Text>
                            </TouchableOpacity>
                            
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        style={{ flexGrow: 0, width: '100%' }}
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
        // Tính toán chiều rộng động: chiều rộng modal (90% màn hình) trừ padding, chia cho 2 cột
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        paddingHorizontal: 10, // Giảm padding ngang để tránh tràn
        minWidth: (width * 0.9 - 60) / 2, // 60 là tổng padding ngang của modalContainer (20 * 2) + margin giữa các slot
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
    unavailableTimeSlot: {
        backgroundColor: '#FFCDD2',
    },
    unavailableTimeText: {
        color: '#D32F2F',
    },
});

export default BookingModal;
