import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            style={{ width: "100%", height: 550 }}
            resizeMode="stretch"
          />
        </View>
        <View className="mt-5 px-5 justify-center flex-col items-start">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Release Date"
              value={movie?.release_date?.split("-")[0]}
            />
            <MovieInfo label="Movie Duration" value={`${movie?.runtime}m`} />
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm flex-1">
              ({movie?.vote_count} votes)
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview as string} />
          <MovieInfo
            label="Genres"
            value={
              movie?.genres?.map((genre) => genre.name).join(" - ") ||
              ("N/A" as string)
            }
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget as number) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(movie?.revenue as number) / 1_000_000}`}
            />
          </View>
            <MovieInfo
              label="Production Companies"
              value={
                movie?.production_companies?.map((c) => c.name).join(" • ") ||
                "N/A"
              }
            />
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieDetails;
