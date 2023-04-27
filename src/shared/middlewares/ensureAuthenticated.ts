import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export interface EnsureAuthenticatedRequest extends NextApiRequest {
  player: {
    name: string,
    email: string,
    image: string
  };
}

export function ensureAuthenticated(handler: (req: EnsureAuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse<any>>) {
  return async (req: EnsureAuthenticatedRequest, res: NextApiResponse) => {
    const session = await getSession({
      req
    })

    if(!session) {
      return res.status(401).json({ message: "Session not found." })
    }

    req.player = session.user as any
    return handler(req, res)
  }
}