import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="App" />
            <Stack.Screen name="Login" />
            <Stack.Screen name="Home"/>

        </Stack>
    );
}