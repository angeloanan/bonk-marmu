import type { NextApiHandler } from 'next'

const Callback: NextApiHandler = async (req, res) => {
  try {
    await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
      method: 'POST',
      headers: {
        'Client-Id': 'sohzczuav4izhywl7yprw5lxubtfqn',
        Authorization: `Bearer ${encodeURIComponent(req.query['code'] as string)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'channel.channel_points_custom_reward_redemption.add',
        version: '1',
        condition: {
          broadcaster_user_id: '251278698',
          reward_id: '96959d22-f18c-43cc-93dc-0b18e2774f1a'
        },
        transport: {
          method: 'webhook',
          callback: 'https://bonkmarmu-leaderboard.vercel.app/api/eventsub',
          secret: process.env.TWITCH_SECRET
        }
      })
    })

    return res.status(200).send('OK')
  } catch (e) {
    return res.status(500).send(e)
  }
}

export default Callback
