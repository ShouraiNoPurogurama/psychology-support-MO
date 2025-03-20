import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Footer } from "../../../component/doctorFooter";

export default function AppointmentDetails() {
  const params = useLocalSearchParams();

  interface BookingDetails {
    bookingCode: string;
    doctorId: string;
    patientId: string;
    date: string;
    startTime: string;
    duration: number;
    price: number;
    promoCodeId?: string;
    giftCodeId?: string;
    status: string;
  }

  interface PatientDetails {
    id: string;
    fullName: string;
    gender: string;
    contactInfo: {
      address: string;
      phoneNumber: string;
      email: string;
    };
  }

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!params.bookingCode) return;

        const bookingResponse = await fetch(
          `https://psychologysupport-scheduling.azurewebsites.net/bookings/${params.bookingCode}`
        );

        if (!bookingResponse.ok) {
          throw new Error("Failed to fetch booking details");
        }

        const bookingData = await bookingResponse.json();
        setBookingDetails(bookingData.booking);

        const patientResponse = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/patients/${bookingData.booking.patientId}`
        );

        if (!patientResponse.ok) {
          throw new Error("Failed to fetch patient details");
        }

        const patientData = await patientResponse.json();
        const patientProfile = patientData.patientProfileDto;

        setPatientDetails({
          id: patientProfile.id,
          fullName: patientProfile.fullName,
          gender: patientProfile.gender,
          contactInfo: patientProfile.contactInfo,
        });
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [params.bookingCode]);

  const getGenderIcon = (gender: string): MaterialIconName => {
    switch (gender.toLowerCase()) {
      case "male":
        return "male";
      case "female":
        return "female";
      default:
        return "person-outline";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3F72" />
      </View>
    );
  }

  if (!bookingDetails || !patientDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking or Patient not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={24} color="#4B3F72" />
        </TouchableOpacity>
        <Text style={styles.header}>Schedule Information</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Patient Information</Text>
          <InfoRow
            icon="person-outline"
            label="Name"
            value={patientDetails.fullName}
          />
          <InfoRow
            icon={getGenderIcon(patientDetails.gender)}
            label="Gender"
            value={patientDetails.gender}
          />
          <InfoRow
            icon="phone"
            label="Phone"
            value={patientDetails.contactInfo.phoneNumber}
          />
          <InfoRow
            icon="email"
            label="Email"
            value={patientDetails.contactInfo.email}
          />
          <InfoRow
            icon="home"
            label="Address"
            value={patientDetails.contactInfo.address}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.header}>Booking Information</Text>
          <InfoRow icon="date-range" label="Date" value={bookingDetails.date} />
          <InfoRow
            icon="access-time"
            label="Start Time"
            value={bookingDetails.startTime}
          />
          <InfoRow
            icon="timer"
            label="Duration"
            value={`${bookingDetails.duration} minutes`}
          />
          <InfoRow
            icon="check-circle"
            label="Status"
            value={bookingDetails.status}
          />
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: MaterialIconName;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={24} color="#6A8CAF" />
    <Text style={styles.info}>
      <Text style={styles.infoLabel}>{label}: </Text>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    borderRadius: 16,
    padding: 5,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 5,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  info: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  infoLabel: {
    fontWeight: "500",
    color: "#4B3F72",
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4B3F72",
  },
  //
  backButtonContent: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "#E8EAF6",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#E74C3C",
  },
});
