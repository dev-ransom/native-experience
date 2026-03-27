import { useAuth } from "@/context/AuthContext";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return Alert.alert("Fill in all fields");
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message || "Check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-2">Welcome back</Text>
      <Text className="text-gray-400 mb-8">Sign in to continue</Text>

      <TextInput
        className="bg-dark-100 text-white rounded-xl px-4 py-4 mb-4"
        placeholder="Email"
        placeholderTextColor="#A8B5DB"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="bg-dark-100 text-white rounded-xl px-4 py-4 mb-6"
        placeholder="Password"
        placeholderTextColor="#A8B5DB"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-accent rounded-xl py-4 items-center mb-4"
        onPress={handleSignIn}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-base">
          {loading ? "Signing in..." : "Sign in"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-400">Don't have an account? </Text>
        <Link href="/(auth)/sign-up">
          <Text className="text-accent">Sign up</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
