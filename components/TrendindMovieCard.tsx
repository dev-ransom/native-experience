import { images } from "@/constants/images";
import { TrendingCardProps } from "@/interfaces/interfaces";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const TrendindMovieCard = ({
  movie: { movie_id, searchTerm, poster_url, title },
  index,
}: TrendingCardProps) => {
  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity className="w-32 relative ">
        <Image
          className="w-32 h-48 rounded-lg"
          source={{
            uri: poster_url,
          }}
        />
        <View className="absolute -left-3.5 bottom-9 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-14"
              resizeMode="cover"
            />
          </MaskedView>
        </View>
        <Text
          className="text-sm text-light-200 mt-2 font-bold"
          numberOfLines={2}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendindMovieCard;
