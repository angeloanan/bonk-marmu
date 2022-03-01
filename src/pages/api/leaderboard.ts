import type { NextApiHandler } from 'next'

import { prisma } from '../../lib/prisma'

const Leaderboard: NextApiHandler = async (req, res) => {
  const data = await fetchLeaderboardData()

  res.status(200).json(data.map((u) => ({ username: u.userName, bonkCount: u.count })))
}

export const fetchLeaderboardData = async () => {
  return prisma.user.findMany({
    take: 25,
    orderBy: {
      count: 'desc'
    }
  })
}

export default Leaderboard
