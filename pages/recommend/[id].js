import { useRouter } from "next/router";
import Link from 'next/link'
import Image from 'next/image'
import client, { COCKTAIL_COLLECTIONS, DB_NAME } from "../../lib/db";
import styles from "../../styles/Home.module.css";
import Head from "next/head";

const RecommendPage = (props) => {
  const cocktail = JSON.parse(props.cocktail)
  const recommendedCocktails = JSON.parse(props.recommendedCocktails)
  return (
    <div className={styles.container}>
      <Head>
        <title>Suggestions for {cocktail.name}</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>
          Suggestions for {cocktail.name}
        </h2>
        <div>
          {recommendedCocktails.map(({ name, image, cocktailDbId }) => (
            <Link key={name} href={`/recipe/${cocktailDbId}`} passHref>
              <div>
                <Image
                  src={image}
                  alt={name}
                  width={500}
                  height={500}
                />
                <span>{name} </span>
              </div>
            </Link>

          ))}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  await client.connect()
  const { id } = query;
  const response = await fetch(`https://drinks-project.herokuapp.com/${id}`);
  const { recommendations } = await response.json();
  const [cocktail, recommendedCocktails] = await Promise.all([
    client.db(DB_NAME).collection(COCKTAIL_COLLECTIONS).findOne({ cocktailDbId: id }),
    client.db(DB_NAME).collection(COCKTAIL_COLLECTIONS).find({ cocktailDbId: { $in: recommendations } }).toArray()])

  return {
    props: {
      cocktail: JSON.stringify(cocktail),
      recommendedCocktails: JSON.stringify(recommendedCocktails)
    }
  }
}


export default RecommendPage