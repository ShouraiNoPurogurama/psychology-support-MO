import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      animation:"none"
    }}>
      {/* General Screens */}
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="home" />
      <Stack.Screen name="resetpass" />

      {/* Doctor Screens */}
      <Stack.Screen name="doctor/doctorHome" />
      <Stack.Screen name="doctor/doctorAppointments" />
      <Stack.Screen name="doctor/appointmentDetails" />
      <Stack.Screen name="doctor/chatList" />
      <Stack.Screen name="doctor/chatDetails" />
      <Stack.Screen name="doctor/doctorPatients" />
      <Stack.Screen name="doctor/patientDetails" />
      <Stack.Screen name="doctor/medicalRecordDetails" />

      {/* Patient Screens */}
    </Stack>
  );
}
