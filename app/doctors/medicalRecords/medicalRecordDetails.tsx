import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function MedicalRecordDetails() {
  const { id } = useLocalSearchParams() as { id?: string };
  const [showMore, setShowMore] = useState(false);

  const medicalRecords: Record<
    string,
    {
      title: string;
      date: string;
      diagnosis: string;
      treatment: string;
      doctor: string;
      notes: string;
      physicalSymptoms: string[];
      mentalDisorders: string[];
      therapeuticActivities: string[];
      physicalActivities: string[];
      foodPreferences: string[];
      entertainmentPreferences: string[];
    }
  > = {
    "1": {
      title: "Medical Record 1",
      date: "10 Jan 2024",
      diagnosis: "Hypertension",
      treatment: "Prescribed medication and lifestyle changes",
      doctor: "Dr. John Smith",
      notes: "Regular blood pressure checks recommended.",
      physicalSymptoms: ["Fatigue", "Dizziness"],
      mentalDisorders: ["Anxiety Disorder"],
      therapeuticActivities: ["Meditation", "Cognitive Behavioral Therapy"],
      physicalActivities: ["Jogging", "Yoga"],
      foodPreferences: ["Like: Vegetables", "Dislike: Fast Food"],
      entertainmentPreferences: ["Like: Reading", "Neutral: Movies"],
    },
  };

  const record = medicalRecords[id ?? ""] || {
    title: "Unknown Record",
    date: "N/A",
    diagnosis: "N/A",
    treatment: "N/A",
    doctor: "N/A",
    notes: "No details available.",
    physicalSymptoms: [],
    mentalDisorders: [],
    therapeuticActivities: [],
    physicalActivities: [],
    foodPreferences: [],
    entertainmentPreferences: [],
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <View style={styles.backButtonContent}>
              <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.header}>Medical Record Details</Text>
        </View>

        {/* Thông tin chính */}
        <View style={styles.card}>
          <Text style={styles.title}>{record.title}</Text>
          <Text style={styles.date}>{record.date}</Text>

          {[
            {
              icon: "notes-medical",
              label: "Diagnosis",
              value: record.diagnosis,
            },
            { icon: "pills", label: "Treatment", value: record.treatment },
            { icon: "user-md", label: "Doctor", value: record.doctor },
            { icon: "clipboard-list", label: "Notes", value: record.notes },
          ].map((item, index) => (
            <View style={styles.section} key={index}>
              <FontAwesome5 name={item.icon} size={18} color="#6C63FF" />
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.info}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Nút Show more */}
        {!showMore && (
          <TouchableOpacity
            onPress={() => setShowMore(true)}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreText}>Show more</Text>
            <FontAwesome5 name="chevron-down" size={14} color="#6C63FF" />
          </TouchableOpacity>
        )}

        {/* Các danh mục chi tiết */}
        {showMore && (
          <>
            {/* Phần Triệu Chứng */}
            <View style={styles.borderBox}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="stethoscope" size={18} color="#6C63FF" />
                <Text style={styles.sectionTitle}>Symptoms</Text>
              </View>
              {[
                { title: "Physical Symptoms", data: record.physicalSymptoms },
                { title: "Mental Disorders", data: record.mentalDisorders },
              ].map((section, index) => (
                <View key={index} style={styles.innerSection}>
                  <Text style={styles.innerTitle}>{section.title}</Text>
                  {section.data.map((item, subIndex) => (
                    <Text key={subIndex} style={styles.info}>
                      {item}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {/* Phần Phương Pháp Điều Trị */}
            <View style={styles.borderBox}>
              <View style={styles.sectionHeader}>
                <FontAwesome5 name="spa" size={18} color="#6C63FF" />
                <Text style={styles.sectionTitle}>Treatment Methods</Text>
              </View>
              {[
                {
                  title: "Therapeutic Activities",
                  data: record.therapeuticActivities,
                },
                {
                  title: "Physical Activities",
                  data: record.physicalActivities,
                },
                { title: "Food Preferences", data: record.foodPreferences },
                {
                  title: "Entertainment Preferences",
                  data: record.entertainmentPreferences,
                },
              ].map((section, index) => (
                <View key={index} style={styles.innerSection}>
                  <Text style={styles.innerTitle}>{section.title}</Text>
                  {section.data.map((item, subIndex) => (
                    <Text key={subIndex} style={styles.info}>
                      {item}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {/* Nút Show less */}
            <TouchableOpacity
              onPress={() => setShowMore(false)}
              style={styles.showMoreButton}
            >
              <Text style={styles.showMoreText}>Show less</Text>
              <FontAwesome5 name="chevron-up" size={14} color="#6C63FF" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -22 }],
    zIndex: 10,
  },
  backButtonContent: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C63FF",
    marginLeft: 50,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  date: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 10 },
  section: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  info: { fontSize: 16, color: "#555", flex: 2 },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  showMoreText: { fontSize: 16, color: "#6C63FF", marginRight: 5 },
  borderBox: {
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C63FF",
    marginLeft: 8,
  },
  innerSection: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  innerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
});
