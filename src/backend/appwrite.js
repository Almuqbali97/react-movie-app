import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_SERVER_ID;
const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_METRICS_COLLECTION_ID;

// Connection to Appwrite
const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);
const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listDocuments(DB_ID, COLLECTION_ID, [Query.equal("searchTerm", searchTerm)]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            // ✅ update the document if exists
            await database.updateDocument(DB_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1
            });
        } else {
            // ✅  create a new document
            await database.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1, // ✅ Initialize count as 1
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
    }
};


export const getTrendingMovies = async () => {
    try {
        const results = await database.listDocuments(DB_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ]);
        return results.documents;

    } catch (error) {
        console.log(error);
    }
};