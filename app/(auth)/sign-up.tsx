import { useAuth } from "@/context/AuthContext";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) return Alert.alert("Fill in all fields");
    if (password.length < 8)
      return Alert.alert("Password must be at least 8 characters");
    setLoading(true);
    try {
      await signUp(email, password, name);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-2">Create account</Text>
      <Text className="text-gray-400 mb-8">Join to start exploring movies</Text>

      <TextInput
        className="bg-dark-100 text-white rounded-xl px-4 py-4 mb-4"
        placeholder="Full name"
        placeholderTextColor="#A8B5DB"
        value={name}
        onChangeText={setName}
      />

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
        placeholder="Password (min. 8 characters)"
        placeholderTextColor="#A8B5DB"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-accent rounded-xl py-4 items-center mb-4"
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-base">
          {loading ? "Creating account..." : "Create account"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-400">Already have an account? </Text>
        <Link href="/(auth)/sign-in">
          <Text className="text-accent">Sign in</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
