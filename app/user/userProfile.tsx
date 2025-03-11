import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';

interface ActivityItem {
    name: string;
    frequency?: string;  
    severity?: string;   
    isDisease?: boolean; 
}

const activities: { title: string; icon: string; data: ActivityItem[] }[] = [
    {
        title: "Personal activities",
        icon: "⚡",
        data: [
            { name: "Gardening", frequency: "Daily" },
            { name: "Reading", frequency: "Weekly" },
            { name: "Cooking", frequency: "Monthly" },
            { name: "Meditation", frequency: "Weekly" },
            { name: "Writing", frequency: "Daily" },
            { name: "Studying", frequency: "Monthly" },
            { name: "Volunteering", frequency: "Weekly" },
        ],
    },
    {
        title: "Entertainment Activity",
        icon: "🎭",
        data: [
            { name: "Soccer", frequency: "Daily" },
            { name: "Tennis", frequency: "Weekly" },
            { name: "Swimming", frequency: "Monthly" },
            { name: "Walk", frequency: "Weekly" },
            { name: "Rowing", frequency: "Daily" },
            { name: "Basketball", frequency: "Monthly" },
            { name: "Yoga", frequency: "Weekly" },
            { name: "Golf", frequency: "Weekly" },
            { name: "Boxing", frequency: "Daily" },
        ],
    },
    {
        title: "Underlying disease",
        icon: "⏳",
        data: [
            { name: "Hypertension", severity: "Mild", isDisease: true },
            { name: "Diabetes", severity: "Moderate", isDisease: true },
            { name: "Asthma", severity: "Moderate", isDisease: true },
            { name: "Arthritis", severity: "Mild", isDisease: true },
            { name: "Heart Disease", severity: "Severe", isDisease: true },
            { name: "Allergies", severity: "Severe", isDisease: true },
            { name: "Migraine", severity: "Mild", isDisease: true },
        ],
    },
];


const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
        case "Daily":
            return "#B065F6"; 
        case "Weekly":
            return "#00C5B8"; 
        case "Monthly":
            return "#F5B700"; 
        default:
            return "#ccc";
    }
};
const getSeverityColor = (severity: string) => {
    switch (severity) {
        case "Mild":
            return "#B065F6"; 
        case "Moderate":
            return "#00C5B8"; 
        case "Severe":
            return "#F5B700"; 
        default:
            return "#ccc";
    }
};


const UserProfile = () => {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activityFrequencies, setActivityFrequencies] = useState<Record<string, string>>({});

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');

    const selectActivity = (activity: { name: string; isDisease?: boolean }) => {
        setSelectedActivity(activity);
        setModalVisible(true);
    };

    const selectFrequency = (frequency: string) => {
        if (!selectedActivity) return;
        setActivityFrequencies({
            ...activityFrequencies,
            [selectedActivity.name]: frequency,
        });
        setModalVisible(false);
    };

    const selectSeverity = (severity: string) => {
        if (!selectedActivity) return;
        setActivityFrequencies({
            ...activityFrequencies,
            [selectedActivity.name]: severity,
        });
        setModalVisible(false);
    };


    const handleSave = () => {
        console.log("Profile updated:", { fullName, email, address, contactNumber, gender, password });
    };
    const toggleCategory = (title: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <>
            <Student_Header />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.pageName} > Your Profile </Text>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Nguyen Minh Trung" />

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="trungdepzai@gmail.com" keyboardType="email-address" />

                    <Text style={styles.label}>Address</Text>
                    <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Ba Ria Vung Tau" />

                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput style={styles.input} value={contactNumber} onChangeText={setContactNumber} placeholder="+84 876696969" keyboardType="phone-pad" />

                    <Text style={styles.label}>Gender</Text>
                    <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder="Male" />

                    {/* <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry /> */}


                </View>

                {activities.map((category, index) => (
                    <View key={index} style={styles.categoryContainer}>
                        <TouchableOpacity style={styles.categoryHeader} onPress={() => toggleCategory(category.title)}>
                            <Text style={styles.categoryTitle}>{category.icon} {category.title}</Text>
                            <Text style={styles.arrow}>{expandedCategories[category.title] ? "🔽" : "▶️"}</Text>
                        </TouchableOpacity>

                        {expandedCategories[category.title] && (
                            <FlatList
                                data={category.data}
                                keyExtractor={(item) => item.name}
                                numColumns={3}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.activityItem,
                                            {
                                                backgroundColor: item.isDisease
                                                    ? getSeverityColor(activityFrequencies[item.name] || item.severity || "Mild")
                                                    : getFrequencyColor(activityFrequencies[item.name] || item.frequency || "Daily")
                                            }
                                        ]}
                                        onPress={() => selectActivity(item)}
                                    >
                                        <Text style={styles.activityText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                ))}


                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {selectedActivity?.isDisease ? "Select severity for " : "Select frequency for "}
                                {selectedActivity?.name}
                            </Text>

                            {selectedActivity?.isDisease
                                ? ["Mild", "Moderate", "Severe"].map((severity) => (
                                    <TouchableOpacity
                                        key={severity}
                                        style={[styles.frequencyButton, { backgroundColor: getSeverityColor(severity) }]}
                                        onPress={() => selectSeverity(severity)}
                                    >
                                        <Text style={styles.frequencyText}>{severity}</Text>
                                    </TouchableOpacity>
                                ))
                                : ["Daily", "Weekly", "Monthly"].map((frequency) => (
                                    <TouchableOpacity
                                        key={frequency}
                                        style={[styles.frequencyButton, { backgroundColor: getFrequencyColor(frequency) }]}
                                        onPress={() => selectFrequency(frequency)}
                                    >
                                        <Text style={styles.frequencyText}>{frequency}</Text>
                                    </TouchableOpacity>
                                ))
                            }

                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton}><Text>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <Footer />
        </>

    );
};

const styles = StyleSheet.create({
    pageName: {justifyContent:"center", alignItems:"center", marginLeft:90, fontSize:30,marginBottom:10},
    container: { flexGrow: 1, padding: 20, marginBottom:60,marginTop:70 },
    formContainer: { marginBottom: 30 },
    label: { fontWeight: "bold", marginBottom: 5, fontSize: 18 },
    input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    cancelButton: { padding: 10, borderWidth: 1, borderRadius: 5, paddingHorizontal: 80, marginTop: 6 },
    saveButton: { backgroundColor: "#D4B5FF", padding: 10, borderRadius: 5, paddingHorizontal: 50 },
    saveText: { color: "white", fontWeight: "bold" },
    categoryTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
    activityItem: {
        padding: 10,
        borderRadius: 15,
        margin: 5,
        minWidth: 90,
        alignItems: "center",
    },
    activityText: { color: "white", fontWeight: "bold" },
    frequencyText: { color: "white" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    frequencyButton: { backgroundColor: "#570A57", padding: 10, marginVertical: 5, borderRadius: 5, width: 200, alignItems: "center" },
    modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
    categoryContainer: {
        borderWidth: 2,
        borderColor: "#D4B5FF",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "white",
    },
    categoryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    arrow: {
        fontSize: 18,
    },

});

export default UserProfile;
