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
    fallback: { '/api/leaderboard': fallbackData },
    refreshInterval: 60000
  })

  return (
    <table className='w-full max-w-prose rounded border'>
      <thead>
        <tr className='sticky top-0 z-10 bg-neutral-300'>
          <th className='w-8 px-1'>#</th>
          <th className='px-1'>Username</th>
          <th className='w-12 px-1'>Bonks</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((data, index) => (
          <tr key={index}>
            <td className='px-1 text-center'>{index + 1}</td>
            <td className='px-1'>
              <Link href={`https://twitch.tv/${data.username}`} passHref>
                <a
                  className='hover:font-medium hover:text-blue-600 hover:underline'
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
    <div className='flex min-h-screen flex-col items-center justify-center gap-2 p-2'>
      <header className='flex-shrink-0 '>
        <div className='flex flex-col items-center text-4xl font-extrabold uppercase'>Bonk!</div>
        <div className='flex flex-col items-center text-sm font-light'>
          Your trusty Bonk™️ leaderboard
        </div>
      </header>

      <main className='flex w-full flex-1 flex-shrink basis-0 flex-col items-center overflow-y-auto '>
        <BonkTable fallbackData={props.fallback['/api/leaderboard']} />
      </main>

      <footer className='w-full max-w-prose flex-shrink-0 font-light'>
        <span className='text-xs'>
          🏳‍⚧ 🏳️‍🌈 Made by{' '}
          <Link href='https://angeloanan.xyz' passHref>
            <a className='hover:text-blue-600 hover:underline' target='_blank'>
              Angelo!
            </a>
          </Link>
        </span>
      </footer>
    </div>
  )
}

export default PanelPage
