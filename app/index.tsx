// pages/index.js

import styles from '../styles/Home.module.css'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'

const Index = ({ user }) => {
  return (
    <div className={styles.container}>
      <p>
        Welcome {user.name}!{' '}
        <Link href="/api/auth/logout">
          <a>Logout</a>
        </Link>
      </p>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default Index
