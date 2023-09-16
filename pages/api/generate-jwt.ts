// pages/api/generate-jwt.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const {
    room,
    date, 
    hours, 
    minutes,
    domain,
    appId,
    secret
  } = req.body;

  const start_time = dayjs(date);  // Use the passed date from the client
  const durationValue = dayjs.duration({ hours: hours, minutes: minutes });
  const end_time = start_time.add(durationValue.asMilliseconds(), 'millisecond');

  const payload = {
    aud: appId,
    iss: appId,
    sub: domain,
    room: room,
    exp: end_time.unix(),
    nbf: start_time.unix(),
  };

  const token = jwt.sign(payload, secret, { algorithm: 'HS256' });

  const base_url = `https://${domain}/`;
  const jwt_url = `${base_url}${room}?jwt=${token}`;

  res.status(200).json({ jwt_url });
}
