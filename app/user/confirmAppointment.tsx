import { router, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Footer } from "../../component/Footer";
import { Student_Header } from "../../component/Student_Header";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import WebView from "react-native-webview";

type Doctor = {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  fee: number;
  image: string;
};

type Patient = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
};

export default function ConfirmAppointment() {
  const { date, time, doctorId, patientId } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const IMAGE_API_URL = "https://psychologysupport-image.azurewebsites.net/image/get";

  const fetchDoctorImage = async (userId: string): Promise<string> => {
    try {
      const response = await axios.get(`${IMAGE_API_URL}?ownerType=User&ownerId=${userId}`);
      return response.data.url || "https://via.placeholder.com/150"; // Fallback image if API fails
    } catch (error) {
      console.error(`Error fetching image for userId ${userId}:`, error);
      return "https://via.placeholder.com/150"; // Fallback image on error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const decoded: any = jwtDecode(token);
        const fetchedPatientId = decoded.profileId;

        const doctorResponse = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/doctors/${doctorId}`
        );
        if (!doctorResponse.ok) {
          throw new Error("Failed to fetch doctor details");
        }
        const doctorData = await doctorResponse.json();
        const doctorProfile = doctorData.doctorProfileDto;
        const imageUrl = await fetchDoctorImage(doctorProfile.userId);

        const formattedDoctor: Doctor = {
          id: doctorProfile.id,
          userId: doctorProfile.userId,
          name: doctorProfile.fullName,
          specialty: (doctorProfile.specialties as { name: string }[])
            .map((s) => s.name)
            .join(", "),
          fee: 200000,
          image:
            imageUrl ||
            "https://kenh14cdn.com/203336854389633024/2022/5/6/f04d70b1f6e140338a7d2f27ebe67685-1651808959048730170550.png",
        };
        setDoctor(formattedDoctor);

        const patientResponse = await fetch(
          `https://psychologysupport-profile.azurewebsites.net/patients/${fetchedPatientId}`
        );
        if (!patientResponse.ok) {
          throw new Error("Failed to fetch patient details");
        }
        const patientData = await patientResponse.json();
        const patientProfile = patientData.patientProfileDto;

        const formattedPatient: Patient = {
          id: patientProfile.id,
          fullName: patientProfile.fullName,
          email: patientProfile.contactInfo.email,
          phoneNumber: patientProfile.contactInfo.phoneNumber,
        };
        setPatient(formattedPatient);
      } catch (err) {
        console.error("Something went wrong:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId, patientId]);

  const calculateDuration = (timeString: string): number => {
    try {
      const [start, end] = timeString.split("-");
      const [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);

      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      const duration = endInMinutes - startInMinutes;

      return duration > 0 ? duration : 60;
    } catch (err) {
      console.error("Error calculating duration:", err);
      return 60;
    }
  };

  const formatStartTime = (timeString: string): string => {
    try {
      const [start] = timeString.split("-");
      return `${start}:00`;
    } catch (err) {
      console.error("Error formatting startTime:", err);
      return `${timeString}:00`;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const dateObj = new Date(dateString);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  const handleConfirmPayment = async () => {
    if (!doctor || !patient || !date || !time) {
      setError("Missing required data for payment");
      return;
    }

    setPaymentLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const duration = calculateDuration(time as string);
      const formattedStartTime = formatStartTime(time as string);
      const formattedDate = formatDate(date as string);

      const paymentPayload = {
        bookingDto: {
          doctorId: doctor.id,
          patientId: patient.id,
          date: formattedDate,
          startTime: formattedStartTime,
          duration: duration,
          price: doctor.fee,
          promoCode: null,
          giftCodeId: null,
          paymentMethod: "VNPay",
        },
      };

      console.log("Payment Payload:", JSON.stringify(paymentPayload, null, 2));

      const response = await axios.post(
        "https://psychologysupport-scheduling.azurewebsites.net/bookings",
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment Response:", JSON.stringify(response.data, null, 2));

      if (response.data && response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);
        setWebViewVisible(true);
      } else {
        throw new Error("No payment URL returned from server");
      }
    } catch (err) {
      setError("Failed to process payment. Please try again.");
      router.push("/user/PaymentFailedScreen");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleWebViewNavigation = async (navState: any) => {
    const { url } = navState;
    console.log("WebView URL:", url);

    if (url.includes("http://localhost:5173/payments/callback")) {
      setWebViewVisible(false);

      try {
        // Lấy query parameters từ URL
        const queryParams = new URLSearchParams(url.split("?")[1]);

        // Lấy tất cả các tham số từ URL
        const paymentData = {
          amount: queryParams.get("vnp_Amount"),
          bankCode: queryParams.get("vnp_BankCode"),
          bankTranNo: queryParams.get("vnp_BankTranNo"),
          cardType: queryParams.get("vnp_CardType"),
          orderInfo: queryParams.get("vnp_OrderInfo"),
          payDate: queryParams.get("vnp_PayDate"),
          responseCode: queryParams.get("vnp_ResponseCode"),
          tmnCode: queryParams.get("vnp_TmnCode"),
          transactionNo: queryParams.get("vnp_TransactionNo"),
          transactionStatus: queryParams.get("vnp_TransactionStatus"),
          txnRef: queryParams.get("vnp_TxnRef"),
          secureHash: queryParams.get("vnp_SecureHash"),
        };

        // Gửi request tới backend với toàn bộ query params
        await axios.get(
          `https://psychologysupport-payment.azurewebsites.net/payments/callback?${queryParams.toString()}`
        );

        // Kiểm tra kết quả thanh toán
        if (
          paymentData.responseCode === "00" &&
          paymentData.transactionStatus === "00"
        ) {
          // Chuyển hướng đến trang thành công
          router.replace({
            pathname: "/user/PaymentSuccessScreen",
            params: {
              transactionNo: paymentData.transactionNo,
              amount: paymentData.amount
                ? (parseInt(paymentData.amount) / 100).toString()
                : "0", // VNPay trả về amount nhân 100
              payDate: paymentData.payDate,
            },
          });
        } else {
          // Chuyển hướng đến trang thất bại
          router.replace({
            pathname: "/user/PaymentFailedScreen",
            params: {
              responseCode: paymentData.responseCode,
              message: getVNPayErrorMessage(paymentData.responseCode || "99"),
            },
          });
        }
      } catch (error) {
        console.error("Error processing payment callback:", error);
        router.replace({
          pathname: "/user/PaymentFailedScreen",
          params: {
            error: "Đã xảy ra lỗi khi xử lý kết quả thanh toán",
          },
        });
      }
    }
  };

  const getVNPayErrorMessage = (responseCode: string) => {
    const errorMessages = {
      "24": "Transaction canceled by customer",
      "51": "Insufficient account balance",
      "65": "Transaction limit exceeded for the day",
      "75": "Payment bank under maintenance",
      "99": "Unknown error",
      "02": "Transaction failed",
    };
    return errorMessages[responseCode] || "Transaction failed";
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error || !doctor || !patient) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Data not found"}</Text>
      </View>
    );
  }

  return (
    <>
      <Student_Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Confirm Appointment</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patient</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-circle-outline" size={40} color="#2A86FF" />
            <View>
              <Text style={styles.textBold}>{patient.fullName}</Text>
              <Text style={styles.text}>{patient.email}</Text>
              <Text style={styles.text}>{patient.phoneNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Doctor</Text>
          <View style={styles.infoRow}>
            <Image source={{ uri: doctor.image }} style={styles.doctorImage} resizeMode="stretch" />
            <View>
              <Text style={styles.textBold}>{doctor.name}</Text>
              <Text style={styles.text}>{doctor.specialty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Appointment Date & Time</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={30} color="#FFA500" />
            <View>
              <Text style={styles.textBold}>{date}</Text>
              <Text style={styles.text}>{time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.feeContainer}>
          <Ionicons name="cash-outline" size={30} color="#34A853" />
          <Text style={styles.feeText}> Consultation Fee </Text>
          <Text style={styles.feeAmount}>{doctor.fee.toLocaleString()} đ</Text>
        </View>

        <TouchableOpacity
          onPress={handleConfirmPayment}
          style={[styles.confirmButton, paymentLoading && styles.buttonDisabled]}
          disabled={paymentLoading}
        >
          <Text style={styles.confirmText}>
            {paymentLoading ? "Processing..." : "Confirm Appointment"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.push("/user/PaymentFailedScreen")}
          disabled={paymentLoading}
        >
          <Text style={styles.confirmText}>Cancel Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />

      <Modal visible={webViewVisible} animationType="slide" onRequestClose={() => setWebViewVisible(false)}>
        <View style={{ flex: 1 }}>
          {paymentUrl && (
            <WebView
              source={{ uri: paymentUrl }}
              onNavigationStateChange={handleWebViewNavigation}
              style={{ flex: 1 }}
            />
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setWebViewVisible(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  container: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    paddingTop: 100,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 7,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "blue",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    fontSize: 14,
    color: "#666",
  },
  textBold: {
    fontSize: 16,
    fontWeight: "600",
  },
  feeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "center",
  },
  feeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34A853",
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34A853",
    marginLeft: 5,
  },
  confirmButton: {
    backgroundColor: "#2A86FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#A0C4FF",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  confirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#2A86FF",
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});