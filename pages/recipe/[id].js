import styles from "../../styles/Recommend.module.css";
import Head from "next/head";
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeftOutlined, ShoppingCartOutlined, BookOutlined } from '@ant-design/icons'
import React from "react";

const Recipe = (props) => {
  const cocktail = JSON.parse(props.cocktail)
  console.log(cocktail)
  return (
    <div className={styles.container}>
      <Head>
        <title>Recipe for {cocktail.name}</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className={styles.main}>
        <div className={styles.backBar}>
          <Link href="/">
            <ArrowLeftOutlined/>
          </Link>
        </div>
        <div className={styles.titleHeader}>
          <div className={styles.titleRecipe}>
            <h1>{cocktail.name}</h1>
            <h4>{cocktail.glass}</h4>
            <div className={styles.divider}></div>
            <div className={styles.titleCategory}>{cocktail.alcoholic}</div>
            <div className={styles.titleCategory}>{cocktail.category}</div>
          </div>
          <div className={styles.titleImageRelative}>
            <div className={styles.titleImage}>
              <img src={cocktail.image} objectFit="cover" width={200} height={200} style={{ borderRadius: '50%' }}/>
            </div>
          </div>
        </div>
        <div className={styles.instructions}>
          <div className={styles.instructionsTitle}>
            <ShoppingCartOutlined style={{ fontSize: '18px', color: '#201F20' }}/>
            <h2>
              Ingredients
            </h2>
          </div>
          <ul>
            {cocktail.items.map(item => <li className={styles.instructionsList}>{item}</li>)}
          </ul>

          <div className={styles.instructionsTitle} style={{ marginTop: '2rem' }}>
            <BookOutlined style={{ fontSize: '18px', color: '#201F20' }}/>
            <h2>
              Instructions
            </h2>
          </div>
          <p className={styles.instructionsParagraph}>
            {cocktail.instructions}
          </p>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const { id } = query;
  const response = await fetch(`http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const json = await response.json();

  const {
    strDrink, strIBA, strDrinkThumb, strAlcoholic, strInstructions, strGlass, strCategory,
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

  console.log(json.drinks[0])
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

  ].filter(([_, ingredient]) => Boolean(ingredient)).map(i => i.join(' - '))
  const cocktail = {
    name: strDrink,
    IBA: strIBA,
    alcoholic: strAlcoholic,
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