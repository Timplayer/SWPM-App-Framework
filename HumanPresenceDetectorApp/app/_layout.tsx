import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="code" options={{ headerShown: false }} />
    </Stack>
  );
}
