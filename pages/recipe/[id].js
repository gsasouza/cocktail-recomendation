import styles from "../../styles/Home.module.css";
import Head from "next/head";
import React from "react";

const Recipe = (props) => {
  const cocktail = JSON.parse(props.cocktail)
  return (
    <div className={styles.container}>
      <Head>
        <title>Recipe for {cocktail.name}</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>
          Recipe for {cocktail.name}
        </h2>
      </main>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const { id } = query;
  const response = await fetch(`http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const json = await response.json();

  const {
    strDrink, strIBA, strDrinkThumb, strInstructions, strGlass, strCategory,
    strMeasure1, strIngredient1,
    strMeasure2, strIngredient2,
    strMeasure3, strIngredient3,
    strMeasure4, strIngredient4,
    strMeasure5, strIngredient5,
    strMeasure6, strIngredient6,
    strMeasure7, strIngredient7,
    strMeasure8, strIngredient8,
    strMeasure9, strIngredient9,
    strMeasure10, strIngredient10,
    strMeasure11, strIngredient11,
    strMeasure12, strIngredient12,
    strMeasure13, strIngredient13,
    strMeasure14, strIngredient14,
    strMeasure15, strIngredient15,
  } = json.drinks[0]
  const items = [
    [strMeasure1, strIngredient1],
    [strMeasure2, strIngredient2],
    [strMeasure3, strIngredient3],
    [strMeasure4, strIngredient4],
    [strMeasure5, strIngredient5],
    [strMeasure6, strIngredient6],
    [strMeasure7, strIngredient7],
    [strMeasure8, strIngredient8],
    [strMeasure9, strIngredient9],
    [strMeasure10, strIngredient10],
    [strMeasure11, strIngredient11],
    [strMeasure12, strIngredient12],
    [strMeasure13, strIngredient13],
    [strMeasure14, strIngredient14],
    [strMeasure15, strIngredient15],

  ].filter(([_, ingredient]) => Boolean(ingredient)).map(i => i.join(''))
  const cocktail = {
    name: strDrink,
    IBA: strIBA,
    image: strDrinkThumb,
    instructions: strInstructions,
    glass: strGlass,
    category: strCategory,
    items
  }

  console.log(cocktail)
  return {
    props: {
      cocktail: JSON.stringify(cocktail),
    }
  }
}


export default Recipe