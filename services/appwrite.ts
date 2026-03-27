import { TrendingMovie } from "@/interfaces/interfaces";
import { Account, Client, ID, Query, TablesDB } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new TablesDB(client);
export const account = new Account(client);

// --- Auth ---
export const signUp = async (email: string, password: string, name: string) => {
  return await account.create({
    userId: ID.unique(),
    email,
    password,
    name,
  });
};

export const signIn = async (email: string, password: string) => {
  return await account.createEmailPasswordSession({
    password,
    email,
  });
};

export const signOut = async () => {
  return await account.deleteSession({ sessionId: "current" });
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const updateEmail = async (email: string, password: string) => {
  return await account.updateEmail({
    email,
    password,
  });
};

export const updateName = async (name: string) => {
  return await account.updateName({
    name,
  });
};

export const updatePhone = async (phone: string, password: string) => {
  return await account.updatePhone({
    phone,
    password,
  });
};
export const updatePrefs = async (prefs: Record<string, any>) => {
  return await account.updatePrefs({ prefs });
};

// email verification

export const verifyEmail = async (userId: string, secret: string) => {
  return await account.updateEmailVerification({
    userId, secret
  })
}

export const verifyPhone = async (userId: string, secret: string) => {
  return await account.updatePhoneVerification({
    userId, secret
  })
}

export const sendPhoneVerification = async() => {
  return await account.createPhoneVerification()
}

export const sendEmailVerification = async () => {
  return await account.createEmailVerification({
    url: 'exp://10.48.214.89:8081/--/verify-email'
  })
}
// @ts-ignore
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.equal("searchTerm", query)],
    });

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];
      await database.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: existingMovie?.$id,
        data: {
          count: existingMovie?.count + 1,
        },
      });
    } else {
      await database.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.limit(9), Query.orderDesc("count")],
    });

    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
