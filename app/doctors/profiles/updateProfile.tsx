import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";

export default function UpdateProfile() {
  const params = useLocalSearchParams();

  const [name, setName] = useState(
    typeof params.name === "string" ? params.name : ""
  );
  const [specialty, setSpecialty] = useState(
    typeof params.specialty === "string" ? params.specialty : ""
  );
  const [experience, setExperience] = useState(
    typeof params.experience === "string" ? params.experience : ""
  );
  const [email, setEmail] = useState(
    typeof params.email === "string" ? params.email : ""
  );
  const [phone, setPhone] = useState(
    typeof params.phone === "string" ? params.phone : ""
  );
  const [address, setAddress] = useState(
    typeof params.address === "string" ? params.address : ""
  );
  const [workplace, setWorkplace] = useState(
    typeof params.workplace === "string" ? params.workplace : ""
  );
  const [certificates, setCertificates] = useState(
    typeof params.certificates === "string" ? params.certificates : ""
  );
  const [avatar, setAvatar] = useState(
    typeof params.avatar === "string"
      ? params.avatar
      : "https://via.placeholder.com/150"
  );

  const handleSave = () => {
    console.log("Updated Profile:", {
      name,
      specialty,
      experience,
      email,
      phone,
      address,
      workplace,
      certificates,
      avatar,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Phần thông tin có thể cuộn */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Edit Profile</Text>

        <Image source={{ uri: avatar }} style={styles.avatar} />

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Specialty</Text>
        <TextInput
          style={styles.input}
          value={specialty}
          onChangeText={setSpecialty}
        />

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
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Workplace</Text>
        <TextInput
          style={styles.input}
          value={workplace}
          onChangeText={setWorkplace}
        />

        <Text style={styles.label}>Certificates</Text>
        <TextInput
          style={styles.input}
          value={certificates}
          onChangeText={setCertificates}
        />
      </ScrollView>

      {/* Nút Save & Cancel cố định ở dưới */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
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
    paddingBottom: 100, // Tránh bị che bởi nút
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
