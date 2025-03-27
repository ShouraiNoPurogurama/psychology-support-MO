import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";

export default function UpdateDoctorProfile() {
  const [doctor, setDoctor] = useState({
    fullName: "",
    gender: "Female",
    contactInfo: {
      address: "",
      phoneNumber: "",
      email: "",
    },
    specialtyIds: [] as string[],
    qualifications: "",
    yearsOfExperience: "",
    bio: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const profileId = decoded?.profileId;
        const userId = decoded?.userId;
        if (!profileId || !userId) throw new Error("Profile ID or User ID not found in token");

        const profileResponse = await fetch(`https://psychologysupport-profile.azurewebsites.net/doctors/${profileId}`);
        const profileData = await profileResponse.json();
        setDoctor({ ...profileData.doctorProfileDto });

        const imageResponse = await fetch(`https://psychologysupport-image.azurewebsites.net/image/get?ownerType=User&ownerId=${userId}`);
        if (!imageResponse.ok) throw new Error("Failed to fetch avatar URL");
        const imageData = await imageResponse.json();
        setAvatarUrl(imageData.url);
      } catch (error) {
        console.error("Error fetching doctor info or avatar:", error);
      }
    };

    const fetchSpecialties = async () => {
      try {
        const response = await fetch("https://psychologysupport-profile.azurewebsites.net/specialties?PageIndex=1&PageSize=10");
        const data = await response.json();
        setSpecialties(data.specialties);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchDoctorInfo();
    fetchSpecialties();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Token not found");
  
      const decoded: any = jwtDecode(token);
      const profileId = decoded?.profileId;
      if (!profileId) throw new Error("Profile ID not found in token");
  
      const response = await fetch(`https://psychologysupport-profile.azurewebsites.net/doctors/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorProfileUpdate: doctor }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
  
      Alert.alert("Success", "Profile updated successfully");
      router.push("/doctors/profiles/doctorProfile");
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      Alert.alert("Error", errorMessage);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setAvatarUrl(selectedImage.uri);
  
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");
  
        const decoded: any = jwtDecode(token);
        const userId = decoded?.userId;
        if (!userId) throw new Error("User ID not found in token");
  
        const formData = new FormData();
        formData.append("file", {
          uri: selectedImage.uri,
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);
        formData.append("ownerType", "User");
        formData.append("ownerId", userId);
  
        const response = await fetch("https://psychologysupport-image.azurewebsites.net/image/update", {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update avatar");
        }
  
        Alert.alert("Success", "Avatar updated successfully");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update avatar";
      Alert.alert("Error", errorMessage);
    }
  };

  const toggleSpecialty = (id: string) => {
    setDoctor((prevDoctor) => {
      const updatedSpecialtyIds = prevDoctor.specialtyIds?.includes(id)
        ? prevDoctor.specialtyIds.filter((specialtyId) => specialtyId !== id)
        : [...(prevDoctor.specialtyIds || []), id]; // Ensure specialtyIds is always an array
      return { ...prevDoctor, specialtyIds: updatedSpecialtyIds };
    });
  };

  return (
    <>
    <DoctorHeader />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileContainer}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUrl || "https://via.placeholder.com/100" }} style={styles.avatar} />
          <TouchableOpacity style={styles.cameraIconContainer} onPress={pickImage}>
            <FontAwesome name="camera" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Full Name */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <FontAwesome name="user" size={20} color="#6A8CAF" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Full Name</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={doctor.fullName}
            onChangeText={(text) => setDoctor({ ...doctor, fullName: text })}
          />
        </View>

        {/* Gender */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <FontAwesome5 name="venus-mars" size={20} color="#6A8CAF" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Gender</Text>
          </View>
          <Picker
            selectedValue={doctor.gender}
            onValueChange={(itemValue) => setDoctor({ ...doctor, gender: itemValue })}
            style={styles.input}
          >
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Years of Experience */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <FontAwesome5 name="briefcase" size={20} color="#6A8CAF" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Years of Experience</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter years of experience"
            value={doctor.yearsOfExperience}
            onChangeText={(text) => setDoctor({ ...doctor, yearsOfExperience: text })}
            keyboardType="numeric"
          />
        </View>

        {/* Specialties */}
        <View style={styles.specialtiesContainer}>
          <Text style={styles.label}>Select Specialties:</Text>
          {specialties.map((specialty) => (
            <View key={specialty.id} style={styles.checkboxRow}>
              <Checkbox
                value={doctor.specialtyIds?.includes(specialty.id) || false}
                onValueChange={() => toggleSpecialty(specialty.id)}
              />
              <Text style={styles.checkboxLabel}>{specialty.name}</Text>
            </View>
          ))}
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <FontAwesome name="envelope" size={20} color="#6A8CAF" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Email</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={doctor.contactInfo.email}
            onChangeText={(text) =>
              setDoctor({ ...doctor, contactInfo: { ...doctor.contactInfo, email: text } })
            }
          />
        </View>

        {/* Phone Number */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <FontAwesome name="phone" size={20} color="#6A8CAF" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Phone Number</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={doctor.contactInfo.phoneNumber}
            onChangeText={(text) =>
              setDoctor({ ...doctor, contactInfo: { ...doctor.contactInfo, phoneNumber: text } })
            }
          />
        </View>

        {/* Address */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <FontAwesome5 name="map-marker-alt" size={20} color="#6A8CAF" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Address</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={doctor.contactInfo.address}
            onChangeText={(text) =>
              setDoctor({ ...doctor, contactInfo: { ...doctor.contactInfo, address: text } })
            }
          />
        </View>

        {/* Qualifications */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <FontAwesome5 name="graduation-cap" size={20} color="#6A8CAF" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Qualifications</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your qualifications"
            value={doctor.qualifications}
            onChangeText={(text) => setDoctor({ ...doctor, qualifications: text })}
          />
        </View>

        {/* Bio */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <FontAwesome5 name="info-circle" size={20} color="#6A8CAF" style={styles.fieldIcon} />
            <Text style={styles.fieldLabel}>Bio</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your bio"
            value={doctor.bio}
            onChangeText={(text) => setDoctor({ ...doctor, bio: text })}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16, // Thêm khoảng trống để tránh bị footer che mất
    backgroundColor: "#F7F6FB",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B3F72",
    marginBottom: 8,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50, // Tăng khoảng trống để tránh bị footer che
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 25, // Thêm khoảng cách 5pt (20 + 5)
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#6A8CAF",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6A8CAF",
    borderRadius: 20,
    padding: 5,
  },
  icon: {
    marginBottom: 10,
  },
  fieldContainer: {
    flexDirection: "column", // Đặt các thành phần theo chiều dọc
    alignItems: "flex-start", // Căn các thành phần về bên trái
    marginVertical: 8,
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row", // Đặt icon và tiêu đề trên cùng một hàng
    alignItems: "center", // Căn giữa icon và tiêu đề theo chiều dọc
    marginBottom: 8,
    width: "80%", // Đảm bảo tiêu đề và icon có cùng chiều rộng với input
    alignSelf: "center", // Căn giữa tiêu đề và icon
  },
  fieldIcon: {
    marginRight: 8, // Khoảng cách giữa icon và tiêu đề
    width: 20,
    height: 20,
    textAlign: "center",
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B3F72",
    flex: 1, // Đảm bảo tiêu đề chiếm không gian còn lại
  },
  input: {
    width: "80%", // Giảm chiều rộng của trường nhập liệu xuống 80%
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#FFF",
    alignSelf: "center", // Căn giữa trường nhập liệu
  },
  specialtiesContainer: {
    width: "80%", // Giảm chiều rộng của container chuyên môn
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#FFF",
    alignSelf: "center", // Căn giữa container
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#6A8CAF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "80%", // Giảm chiều rộng của nút
    alignSelf: "center", // Căn giữa nút
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
