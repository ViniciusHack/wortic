import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";


export default async function token(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const token = await getToken({
        req,
        raw: true
      })
      if(token) {
        return res.json({token})
      } else {
        return res.status(401)
      }
    default:
      return res.status(405)
  }
}