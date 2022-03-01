import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import * as React from 'react'
import useSWR from 'swr'

import { fetchLeaderboardData } from './api/leaderboard'

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const NumberFormatter = Intl.NumberFormat('en-US', {
  compactDisplay: 'short',
  notation: 'standard'
})

interface LeaderboardData {
  username: string
  bonkCount: number
}

interface LeaderboardPageProps {
  fallback: { '/api/leaderboard': LeaderboardData[] }
}

export const getStaticProps: GetStaticProps<LeaderboardPageProps> = async () => {
  const data = await fetchLeaderboardData()

  return {
    props: {
      fallback: {
        '/api/leaderboard': data.map((u) => ({ username: u.userName, bonkCount: u.count }))
      }
    },
    notFound: false,
    revalidate: 60
  }
}

const BonkTable = ({ fallbackData }: { fallbackData: LeaderboardData[] }) => {
  const { data } = useSWR<LeaderboardData[]>('/api/leaderboard', fetcher, {
    fallback: { '/api/leaderboard': fallbackData }
  })

  return (
    <table className='border w-full rounded'>
      <thead>
        <tr className='sticky top-0 bg-neutral-300 z-10'>
          <th className='px-1 w-8'>#</th>
          <th className='px-1'>Username</th>
          <th className='px-1 w-12'>Bonks</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((data, index) => (
          <tr key={index}>
            <td className='px-1 text-center'>{index + 1}</td>
            <td className='px-1'>
              <Link href={`https://twitch.tv/${data.username}`} passHref>
                <a
                  className='hover:underline hover:font-medium hover:text-blue-600'
                  target='_blank'
                >
                  {data.username}
                </a>
              </Link>
            </td>
            <td className='px-1 text-right font-mono font-medium'>
              {NumberFormatter.format(data.bonkCount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const PanelPage: NextPage<LeaderboardPageProps> = (props) => {
  return (
    <div className='p-2 flex flex-col justify-center gap-2 min-h-screen'>
      <header className='flex-shrink-0 '>
        <div className='uppercase flex flex-col items-center text-4xl font-extrabold'>Bonk!</div>
        <div className='flex flex-col items-center font-light text-sm'>
          Your trusty Bonk™️ leaderboard
        </div>
      </header>

      <main className='flex-shrink basis-0 flex-1 overflow-y-auto'>
        <BonkTable fallbackData={props.fallback['/api/leaderboard']} />
      </main>

      <footer className='text-xs font-light flex-shrink-0'>
        🏳‍⚧ 🏳️‍🌈 Made by{' '}
        <Link href='https://angeloanan.xyz' passHref>
          <a className='hover:text-blue-600 hover:underline' target='_blank'>
            Angelo!
          </a>
        </Link>
      </footer>
    </div>
  )
}

export default PanelPage
