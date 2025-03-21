import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function UpdateProfile() {
  const params = useLocalSearchParams();
  console.log("Received params:", params);

  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [name, setName] = useState<string>(
    Array.isArray(params.fullName) ? params.fullName[0] : params.fullName || ""
  );
  const [experience, setExperience] = useState<string>(
    Array.isArray(params.yearsOfExperience)
      ? params.yearsOfExperience[0]
      : params.yearsOfExperience || "0"
  );
  const [email, setEmail] = useState<string>(
    Array.isArray(params.email) ? params.email[0] : params.email || ""
  );
  const [phone, setPhone] = useState<string>(
    Array.isArray(params.phoneNumber) ? params.phoneNumber[0] : params.phoneNumber || ""
  );
  const [address, setAddress] = useState<string>(
    Array.isArray(params.address) ? params.address[0] : params.address || ""
  );
  const [certificates, setCertificates] = useState<string>(
    Array.isArray(params.qualifications)
      ? params.qualifications[0]
      : params.qualifications || ""
  );
  const [bio, setBio] = useState<string>(
    Array.isArray(params.bio) ? params.bio[0] : params.bio || ""
  );

  // Fetch and decode token
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decoded: any = jwtDecode(token);
          const doctorId = decoded.profileId;
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    getToken();
  }, []);

  const handleSave = async () => {
    if (!doctorId) {
      Alert.alert("Error", "Missing Doctor ID.");
      return;
    }

    const apiUrl = `https://psychologysupport-doctor-profile.azurewebsites.net/doctors/${doctorId}`;
    const payload = {
      doctorProfileUpdate: {
        fullName: name,
        gender: "Male",
        contactInfo: {
          address: address,
          phoneNumber: phone,
          email: email,
        },
        specialties: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
        qualifications: certificates,
        yearsOfExperience: parseInt(experience) || 0,
        bio: bio,
      },
    };

    try {
      Alert.alert("Success", "Profile updated successfully.", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/doctors/profiles/doctorProfile",
            }),
        },
      ]);
    } catch (error) {
      console.error("Error during profile update:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Edit Profile</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Experience (years)</Text>
        <TextInput
          style={styles.input}
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />

        <Text style={styles.label}>Certificates</Text>
        <TextInput
          style={styles.input}
          value={certificates}
          onChangeText={setCertificates}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 150,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#AF93D2",
    textAlign: "center",
    marginBottom: 20,
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
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#6A8CAF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
