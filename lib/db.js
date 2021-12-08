import { MongoClient } from 'mongodb'
export const COCKTAIL_COLLECTIONS = 'cocktails'
export const DB_NAME = 'ia'

const client = new MongoClient(`mongodb+srv://colab:colab123@cluster1.sfizu.mongodb.net/?retryWrites=true&w=majority`);

export default client;