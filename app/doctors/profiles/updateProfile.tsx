import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";

export default function UpdateProfile() {
  const params = useLocalSearchParams();
  console.log("Received params:", params);

  const doctorId = params.id;
  const [name, setName] = useState<string>(Array.isArray(params.name) ? params.name[0] : params.name || "");
  const [specialty, setSpecialty] = useState<string>(Array.isArray(params.specialty) ? params.specialty[0] : params.specialty || "");
  const [experience, setExperience] = useState<string>(Array.isArray(params.experience) ? params.experience[0] : params.experience || "0");
  const [email, setEmail] = useState<string>(Array.isArray(params.email) ? params.email[0] : params.email || "");
  const [phone, setPhone] = useState<string>(Array.isArray(params.phone) ? params.phone[0] : params.phone || "");
  const [address, setAddress] = useState<string>(Array.isArray(params.address) ? params.address[0] : params.address || "");
  const [workplace, setWorkplace] = useState(params.workplace || "");
  const [certificates, setCertificates] = useState<string>(Array.isArray(params.certificates) ? params.certificates[0] : params.certificates || "");

  const handleSave = async () => {
    console.log("handleSave function called");

    if (!doctorId) {
      Alert.alert("Error", "Doctor ID is missing.");
      return;
    }
  
    const apiUrl = `https://psychologysupportprofile-fddah4eef4a7apac.eastasia-01.azurewebsites.net/doctors/${doctorId}`;
    const payload = {
      doctorProfileUpdate: {
        fullName: name,
        gender: "Male",
        contactInfo: {
          address: address,
          phoneNumber: phone,
          email: email,
        },
      },
      specialtyIds: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
      qualifications: certificates,
      yearsOfExperience: parseInt(experience) || 0,
      bio: workplace,
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      Alert.alert("Success", "Profile updated successfully.");
      console.log("Navigating to:", `/doctors/profiles/doctorProfile`);
console.log("Doctor ID being passed:", doctorId);
router.push({ pathname: "/doctors/profiles/doctorProfile", params: { doctorId } });
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Edit Profile</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Specialty</Text>
        <TextInput style={styles.input} value={specialty} onChangeText={setSpecialty} />

        <Text style={styles.label}>Experience (years)</Text>
        <TextInput style={styles.input} value={experience} onChangeText={setExperience} keyboardType="numeric" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />

        <Text style={styles.label}>Certificates</Text>
        <TextInput style={styles.input} value={certificates} onChangeText={setCertificates} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#AF93D2",
    textAlign: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#AF93D2",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#6A8CAF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
