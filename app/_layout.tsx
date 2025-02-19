import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      animation:"none"
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="home" />
      <Stack.Screen name="resetpass" />
      <Stack.Screen name="doctor/doctorHome" />
    </Stack>
  );
}
