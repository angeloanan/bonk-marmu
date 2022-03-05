import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import * as React from 'react'
import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch('https://bonkmarmu-leaderboard.vercel.app' + url).then((r) => r.json())
const NumberFormatter = Intl.NumberFormat('en-US', {
  compactDisplay: 'short',
  notation: 'standard'
})

interface LeaderboardData {
  username: string
  bonkCount: number
}

const _SampleData: LeaderboardData[] = [
  { username: 'FumazDev', bonkCount: 99999 },
  { username: 'Foo-bar', bonkCount: 42069 },
  { username: 'OxTrtle', bonkCount: 1325 },
  { username: 'boof', bonkCount: 1325 },
  { username: 'AngeloPogU', bonkCount: 739 },
  { username: 'OmarOurWoofWoof', bonkCount: 694 },
  { username: 'OmarSmells', bonkCount: 537 },
  { username: 'FleebenWhoop', bonkCount: 442 },
  { username: 'DaddyWhoop', bonkCount: 422 },
  { username: 'UwUmyOwO', bonkCount: 391 },
  { username: 'DoughnoughtJack', bonkCount: 368 },
  { username: 'Someone', bonkCount: 368 },
  { username: 'Somebody', bonkCount: 368 },
  { username: 'Once', bonkCount: 368 },
  { username: 'Told', bonkCount: 368 },
  { username: 'Me', bonkCount: 368 },
  { username: 'DutchMTC', bonkCount: 1 }
]

const BonkTable = () => {
  const { data } = useSWR<LeaderboardData[]>('/api/leaderboard', fetcher, {
    refreshInterval: 60000
  })

  if (!data) {
    return <div className='mt-16 text-xl font-semibold'>🥁 Drumroll please...</div>
  }

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

const PanelPage: NextPage = (props) => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-2 p-2'>
      <header className='flex-shrink-0 '>
        <div className='flex flex-col items-center text-4xl font-extrabold uppercase'>Bonk!</div>
        <div className='flex flex-col items-center text-center text-sm font-light'>
          Your trusty Bonk™️ leaderboard
        </div>
      </header>

      <main className='flex w-full flex-1 flex-shrink basis-0 flex-col items-center overflow-y-auto '>
        <BonkTable />
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
