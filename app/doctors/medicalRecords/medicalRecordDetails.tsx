import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { DoctorHeader } from "../../../component/doctorHeader";
import { Footer } from "../../../component/doctorFooter";

export default function MedicalRecordDetails() {
  const { id } = useLocalSearchParams() as { id?: string };
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchMedicalRecord = async () => {
      try {
        const response = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/medical-records/${id}`
        );
        const data = await response.json();

        if (data?.record) {
          setRecord(data.record);
        } else {
          setError("No record found.");
        }
      } catch (err) {
        setError("Failed to fetch medical record.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Loading medical record...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <DoctorHeader />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Medical Record Details</Text>
      </View>

      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Thông tin chính */}
          <View style={styles.card}>
            <Text style={styles.title}>Medical Record</Text>
            <Text style={styles.date}>
              {new Date(record.createdAt).toLocaleDateString()}
            </Text>

            {[
              {
                icon: "user-md",
                label: "Doctor",
                value: record.doctorProfileId,
              },
              {
                icon: "clipboard-list",
                label: "Notes",
                value: record.notes || "No notes",
              },
              { icon: "clock", label: "Status", value: record.status },
            ].map((item, index) => (
              <View style={styles.section} key={index}>
                <FontAwesome5 name={item.icon} size={18} color="#6C63FF" />
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.info}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Rối loạn tâm thần */}
          {record.specificMentalDisorders &&
            record.specificMentalDisorders.length > 0 && (
              <View style={styles.borderBox}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="brain" size={18} color="#6C63FF" />
                  <Text style={styles.sectionTitle}>Mental Disorders</Text>
                </View>
                {record.specificMentalDisorders.map(
                  (disorder: any, index: number) => (
                    <View key={index} style={styles.innerSection}>
                      <Text style={styles.innerTitle}>
                        {disorder.mentalDisorderName}
                      </Text>
                      <Text style={styles.info}>{disorder.description}</Text>
                    </View>
                  )
                )}
              </View>
            )}
        </ScrollView>
      </View>
      <Footer />
    </>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B3F72",
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
