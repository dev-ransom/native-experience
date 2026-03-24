import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";
interface Props {
  placeholder: string;
  value?: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
}
const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
  return (
    <View className="flex-row items-center rounded-full px-5 py-4 bg-dark-200">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#ab8bff"
      />
    </View>
  );
};

export default SearchBar;
