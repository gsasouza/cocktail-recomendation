import React from 'react'
import {useRouter} from 'next/router';
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import {Button, Select, Tooltip} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import client, {DB_NAME, COCKTAIL_COLLECTIONS} from "../lib/db";

const {Option} = Select;

export default function Home({cocktails}) {
  const router = useRouter();
  const [selected, setSelected] = React.useState(null);
  const options = JSON.parse(cocktails)
  const handleNavigate = () => {
    if (selected) router.push(`/recommend/${selected}`)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Cocktail Suggestion</title>
        <meta name="description" content="Generated by create next app"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>
          Choose a cocktail you like
        </h2>
        <div className="input-row">
          <Select
            showSearch
            style={{width: 200}}
            placeholder="Select a cocktail"
            optionFilterProp="children"
            onChange={setSelected}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {options.map(({name, cocktailDbId}) => (<Option key={cocktailDbId} value={cocktailDbId}>{name}</Option>))}
          </Select>
          <Tooltip title="search">
            <Button type="primary" shape="circle" icon={<SearchOutlined/>} onClick={handleNavigate}/>
          </Tooltip>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  await client.connect()
  const cocktails = await client.db(DB_NAME).collection(COCKTAIL_COLLECTIONS).find().toArray();
  return {
    props: {
      cocktails: JSON.stringify(cocktails.map(({name, cocktailDbId}) => ({name, cocktailDbId})))
    }
  }
}