import { Text, TouchableOpacity, View } from "react-native";

const InfoRow = ({
  label,
  value,
  verified,
  onVerify,
}: {
  label: string;
  value: string;
  verified?: boolean;
  onVerify?: () => void;
}) => (
  <View className="flex-row justify-between items-center py-3 border-b border-gray-800">
    <Text className="text-gray-400 text-sm" style={{ paddingHorizontal: 4 }}>
      {label}
    </Text>
    <View className="flex-row items-center gap-2">
      <Text className="text-white text-sm">{value || "—"}</Text>
      {verified !== undefined && (
        <TouchableOpacity
          onPress={!verified ? onVerify : undefined}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 20,
            backgroundColor: verified ? "#14532d" : "#431407",
          }}
        >
          <Text
            style={{ fontSize: 12, color: verified ? "#4ade80" : "#fb923c", paddingHorizontal: 6, overflow: 'visible'}}
            className="w-full"
          >
            {verified ? "verified" : "tap to verify"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default InfoRow;
