import InfoRow from "@/components/InfoRow";
import { useAuth } from "@/context/AuthContext";
import {
  sendEmailVerification,
  sendPhoneVerification,
  verifyPhone,
} from "@/services/appwrite";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [verifyModal, setVerifyModal] = useState<"phone" | "email" | null>(
    null,
  );
  const [otpValue, setOtpValue] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { user, signOut, updateName, updatePhone, refreshUser } = useAuth();
  const [modalType, setModalType] = useState<"name" | "phone" | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const openModal = (type: "name" | "phone") => {
    setInputValue(type === "name" ? user?.name || "" : user?.phone || "");
    setPasswordValue("");
    setModalType(type);
  };

  const handleUpdate = async () => {
    if (!inputValue.trim()) return Alert.alert("Field cannot be empty");
    setLoading(true);
    try {
      if (modalType === "name") {
        await updateName(inputValue.trim());
      } else if (modalType === "phone") {
        if (!passwordValue)
          return Alert.alert("Password required to update phone");
        await updatePhone(inputValue.trim(), passwordValue);
      }
      setModalType(null);
    } catch (e: any) {
      Alert.alert("Update failed", e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneVerification = async () => {
    try {
      await sendPhoneVerification();
      setVerifyModal("phone");
    } catch (e: any) {
      Alert.alert("Failed to send OTP", e?.message);
    }
  };

  const handleSendEmailVerification = async () => {
    try {
      await sendEmailVerification();
      Alert.alert(
        "Email sent",
        "Check your inbox and click the verification link.",
      );
    } catch (e: any) {
      Alert.alert("Failed", e?.message);
    }
  };

  const handleConfirmPhone = async () => {
    if (!otpValue.trim()) return Alert.alert("Enter the OTP");
    setVerifying(true);
    try {
      await verifyPhone(user!.$id, otpValue.trim());
      refreshUser();
      setVerifyModal(null);
      setOtpValue("");
      Alert.alert("Phone verified!");
    } catch (e: any) {
      Alert.alert("Verification failed", e?.message);
    } finally {
      setVerifying(false);
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Avatar + name */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-accent items-center justify-center mb-3">
            <Text className="text-white text-2xl font-bold">{initials}</Text>
          </View>
          <Text className="text-white text-xl font-semibold">{user?.name}</Text>
          <Text className="text-gray-400 text-sm mt-1">{user?.email}</Text>
          <Text className="text-gray-600 text-xs mt-1">
            Member since{" "}
            {user?.registration ? formatDate(user.registration) : "—"}
          </Text>
        </View>

        {/* Account info */}
        <Text className="text-gray-500 text-xs uppercase mb-2 tracking-wider">
          Account
        </Text>
        <View className="bg-dark-100 rounded-xl px-4 mb-6">
          <InfoRow
            label="Email"
            value={user?.email || ""}
            verified={user?.emailVerification}
            onVerify={handleSendEmailVerification}
          />
          <InfoRow
            label="Phone"
            value={user?.phone || "Not set"}
            onVerify={handleSendPhoneVerification}
            verified={user?.phone ? user?.phoneVerification : undefined}
          />
          <InfoRow
            label="Last active"
            value={user?.accessedAt ? formatDate(user.accessedAt) : "—"}
          />
          <InfoRow
            label="Two-factor auth"
            value={user?.mfa ? "Enabled" : "Disabled"}
          />
        </View>

        {/* Edit options */}
        <Text className="text-gray-500 text-xs uppercase mb-2 tracking-wider">
          Edit profile
        </Text>
        <View className="bg-dark-100 rounded-xl overflow-hidden mb-6">
          <TouchableOpacity
            className="flex-row justify-between items-center px-4 py-4 border-b border-gray-800"
            onPress={() => openModal("name")}
          >
            <Text className="text-white">Update name</Text>
            <Text className="text-accent">›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row justify-between items-center px-4 py-4"
            onPress={() => openModal("phone")}
          >
            <Text className="text-white">Update phone</Text>
            <Text className="text-accent">›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="border border-red-800 rounded-xl py-4 items-center"
        >
          <Text className="text-red-400 font-semibold">Sign out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* otp modal */}
      <Modal
        visible={verifyModal === "phone"}
        transparent
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-dark-100 rounded-t-2xl p-6">
            <Text className="text-white text-lg font-semibold mb-2">
              Verify phone
            </Text>
            <Text className="text-gray-400 text-sm mb-4">
              Enter the OTP sent to {user?.phone}
            </Text>

            <TextInput
              className="bg-primary text-white rounded-xl px-4 py-4 mb-3"
              placeholderTextColor="#A8B5DB"
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otpValue}
              onChangeText={setOtpValue}
            />

            <TouchableOpacity
              className="bg-accent rounded-xl py-4 items-center mb-3"
              onPress={handleConfirmPhone}
              disabled={verifying}
            >
              <Text className="text-white font-semibold">
                {verifying ? "Verifying..." : "Confirm"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 items-center"
              onPress={() => {
                setVerifyModal(null);
                setOtpValue("");
              }}
            >
              <Text className="text-gray-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Edit modal */}

      <Modal visible={modalType !== null} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-dark-100 rounded-t-2xl p-6">
            <Text className="text-white text-lg font-semibold mb-4">
              {modalType === "name" ? "Update name" : "Update phone"}
            </Text>

            <TextInput
              className="bg-primary text-white rounded-xl px-4 py-4 mb-3"
              placeholderTextColor="#A8B5DB"
              placeholder={modalType === "name" ? "Full name" : "+1234567890"}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={modalType === "phone" ? "phone-pad" : "default"}
            />

            {modalType === "phone" && (
              <TextInput
                className="bg-primary text-white rounded-xl px-4 py-4 mb-3"
                placeholderTextColor="#A8B5DB"
                placeholder="Current password"
                secureTextEntry
                value={passwordValue}
                onChangeText={setPasswordValue}
              />
            )}

            <TouchableOpacity
              className="bg-accent rounded-xl py-4 items-center mb-3"
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text className="text-white font-semibold">
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 items-center"
              onPress={() => setModalType(null)}
            >
              <Text className="text-gray-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
