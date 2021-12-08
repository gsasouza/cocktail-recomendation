import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

if (!globalThis.fetch) {
  globalThis.fetch = fetch
}

const DB_NAME = 'ia';
const COCKTAIL_COLLECTIONS = 'cocktails'

dotenv.config()

const baseUrl = 'https://thecocktaildb.com/api/json/v2/9973533/search.php'

const delay = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const parseDrink = (drink) => {
  const {
    idDrink: cocktailDbId,
    strDrink: name,
    strCategory: type,
    strGlass: glass,
    strAlcoholic: alcoholic,
    strIngredient1,
    strIngredient2,
    strIngredient3,
    strIngredient4,
    strIngredient5,
    strIngredient6,
    strIngredient7,
    strIngredient8,
    strIngredient9,
    strIngredient10,
    strIngredient11,
    strIngredient12,
    strIngredient13,
    strIngredient14,
    strIngredient15,
    strIBA: IBA,
    strInstructions: instructions,
    strDrinkThumb: image,
  } = drink
  const ingredients = {
    [strIngredient1]: true,
    [strIngredient2]: true,
    [strIngredient3]: true,
    [strIngredient4]: true,
    [strIngredient5]: true,
    [strIngredient6]: true,
    [strIngredient7]: true,
    [strIngredient8]: true,
    [strIngredient9]: true,
    [strIngredient10]: true,
    [strIngredient11]: true,
    [strIngredient12]: true,
    [strIngredient13]: true,
    [strIngredient14]: true,
    [strIngredient15]: true,
  }

  const validIngredients = Object.fromEntries(Object.entries(ingredients).filter(([key]) => key !== 'null').map(([key, value]) => [key.toLowerCase(), value]))
  return {
    cocktailDbId,
    name,
    type,
    glass,
    IBA,
    instructions,
    image,
    alcoholic: alcoholic === 'Alcoholic',
    ...validIngredients,
  }
}

const extractCocktails = async () => {
  const cocktails = []
  await delay(2000)
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  for (const letter of alphabet) {
    const response = await fetch(`${baseUrl}?f=${letter}`)
    const json = await response.json()
    if (!json) continue
    const { drinks = [] } = json
    if (drinks) cocktails.push(...drinks.map(parseDrink))
  }
  return cocktails
}

( async () => {
  const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.sfizu.mongodb.net/?retryWrites=true&w=majority`);
  await client.connect();
  await client.db(DB_NAME).collection(COCKTAIL_COLLECTIONS).createIndex({ 'name': 1 }, { unique: true })
  const cocktails = await extractCocktails()
  await client.db(DB_NAME).collection(COCKTAIL_COLLECTIONS).insertMany(cocktails)
  await client.close();
} )()