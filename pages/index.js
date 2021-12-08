import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { Button, Select, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import client, { DB_NAME, COCKTAIL_COLLECTIONS } from "../lib/db";

const { Option } = Select;

export default function Home({ cocktails }) {
  const router = useRouter();
  const [selected, setSelected] = React.useState(null);
  const options = JSON.parse(cocktails)
  const handleNavigate = () => {
    if (selected) router.push(`/recommend/${selected}`)
  }
  return (
    <div style={{ overflow: 'hidden' }}>
      <Head>
        <title>Cocktail Recommendation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <h1>
            Tell me a<br/> cocktail you like
          </h1>
          <div className={styles.inputColumn}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a cocktail"
              optionFilterProp="children"
              onChange={setSelected}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {options.map(({ name, cocktailDbId }) => (
                <Option key={cocktailDbId} value={cocktailDbId}>{name}</Option> ))}
            </Select>
            <Button type="primary" onClick={handleNavigate}>
              Search
            </Button>

          </div>
        </section>
      </main>
      <div className={styles.imageContainer}>
        <Image src="/footer.png" layout='fill'
               objectFit='cover' alt='cocktail'/>
        

      </div>
    </div>
  )
}

export async function getStaticProps() {
  await client.connect()
  const cocktails = await client.db(DB_NAME).collection(COCKTAIL_COLLECTIONS).find().toArray();
  return {
    props: {
      cocktails: JSON.stringify(cocktails.map(({ name, cocktailDbId }) => ( { name, cocktailDbId } )))
    }
  }
}