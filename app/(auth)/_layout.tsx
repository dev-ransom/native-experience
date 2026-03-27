import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) return <View className="flex-1 bg-primary" />;
  if (user) return <Redirect href="/(tabs)" />;

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
