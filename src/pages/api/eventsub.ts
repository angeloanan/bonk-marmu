import type { NextApiHandler, NextApiRequest } from 'next'
import crypto from 'node:crypto'

import { prisma } from '../../lib/prisma'

// ---- Utils below

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase()
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase()
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase()
const HMAC_PREFIX = 'sha256='

// Build the message used to get the HMAC.
function getHmacMessage(request: NextApiRequest) {
  return (
    (((request.headers[TWITCH_MESSAGE_ID] as string) +
      request.headers[TWITCH_MESSAGE_TIMESTAMP]) as string) + JSON.stringify(request.body)
  )
}

// Get the HMAC.
function getHmac(secret: string, message: string) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex')
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac: string, verifySignature: string) {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature))
}

//
// Actual code starts below
//

const TwitchHandler: NextApiHandler = async (req, res) => {
  let secret = process.env.TWITCH_SECRET
  let message = getHmacMessage(req)
  console.log(message)
  let hmac = HMAC_PREFIX + getHmac(secret, message)

  if (!verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE] as string)) {
    return res.status(403).send('')
  }

  // Verivied onwards
  const messageType = req.headers['twitch-eventsub-message-type']
  console.log(`Recived event ${messageType} from Twitch`, req.body)

  switch (messageType) {
    case 'webhook_callback_verification': {
      return res.status(200).send(req.body.challenge)
    }

    case 'revocation': {
      console.error('Revocation received from Twitch')

      return res.status(200).send('OK')
    }

    // Actual stuff below

    case 'channel.channel_points_custom_reward_redemption.add': {
      const data = req.body

      await prisma.user.upsert({
        where: {
          userId: data.user_id
        },
        create: {
          userId: data.user_id,
          userName: data.user_id,
          count: 1
        },
        update: {
          count: {
            increment: 1
          }
        }
      })

      return res.status(200).send('OK')
    }

    default: {
      return res.status(200).send('OK')
    }
  }
}

export default TwitchHandler
