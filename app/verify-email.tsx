import { verifyEmail } from "@/services/appwrite";
import { useAuth } from "@/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";

export default function VerifyEmail() {
  const { userId, secret } = useLocalSearchParams<{
    userId: string;
    secret: string;
  }>();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("");

  const handleVerify = async (uid: string, sec: string) => {
    try {
      await verifyEmail(uid, sec);
      await refreshUser();
      setStatus("success");
      setTimeout(() => router.replace("/(tabs)/profile"), 2000);
    } catch (e: any) {
      setStatus("error");
      setMessage(e?.message || "Verification failed.");
    }
  };

  useEffect(() => {
    // params came directly via deep link into the screen
    if (userId && secret) {
      handleVerify(userId, secret);
      return;
    }

    // fallback: parse from the full URL manually
    Linking.getInitialURL().then((url) => {
      if (!url) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }
      const parsed = Linking.parse(url);
      const uid = parsed.queryParams?.userId as string;
      const sec = parsed.queryParams?.secret as string;

      if (!uid || !sec) {
        setStatus("error");
        setMessage("Missing verification params.");
        return;
      }

      handleVerify(uid, sec);
    });
  }, [userId, secret]);

  return (
    <SafeAreaView className="flex-1 bg-primary items-center justify-center px-6">
      {status === "verifying" && (
        <Text className="text-white text-base">Verifying your email...</Text>
      )}
      {status === "success" && (
        <View className="items-center gap-3">
          <Text className="text-green-400 text-xl font-semibold">
            Email verified!
          </Text>
          <Text className="text-gray-400 text-sm">
            Redirecting to profile...
          </Text>
        </View>
      )}
      {status === "error" && (
        <View className="items-center gap-3">
          <Text className="text-red-400 text-xl font-semibold">
            Verification failed
          </Text>
          <Text className="text-gray-400 text-sm text-center">{message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
