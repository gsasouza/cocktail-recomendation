import { useRouter } from "next/router";
import Link from 'next/link'
import Image from 'next/image'
import Head from "next/head";
import { ArrowLeftOutlined } from '@ant-design/icons'
import client, { COCKTAIL_COLLECTIONS, DB_NAME } from "../../lib/db";
import styles from "../../styles/Recommend.module.css";

const RecommendPage = (props) => {
  const cocktail = JSON.parse(props.cocktail)
  const recommendedCocktails = JSON.parse(props.recommendedCocktails)
  return (
    <div>
      <Head>
        <title>Recommendations for {cocktail.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <div className={styles.backBar}>
          <Link href="/">
            <ArrowLeftOutlined/>
          </Link>
        </div>
        <h1 className={styles.title}>
          Cocktails similar to <br/>{cocktail.name}
        </h1>
        <span className={styles.resultIndicator}>
          6 Results
        </span>
        <div className={styles.recommendationGrid}>
          {recommendedCocktails.map(({ name, image, cocktailDbId }) => (
            <Link key={name} href={`/recipe/${cocktailDbId}`} passHref>
              <div className={styles.card}>
                <Image
                  className={styles.image}
                  src={image}
                  alt={name}
                  width={500}
                  height={500}
                />
                <span className={styles.cocktailName}>{name}</span>
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