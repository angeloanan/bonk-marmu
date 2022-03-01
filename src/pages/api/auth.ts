import type { NextApiHandler } from 'next'

const Auth: NextApiHandler = async (req, res) => {
  res.redirect(
    `https://id.twitch.tv/oauth2/authorize?client_id=sohzczuav4izhywl7yprw5lxubtfqn&redirect_uri=${encodeURIComponent(
      'https://bonkmarmu-leaderboard.vercel.app/api/callback'
    )}&response_type=client_credentials&scope=channel:read:redemptions`
  )
}

export default Auth
