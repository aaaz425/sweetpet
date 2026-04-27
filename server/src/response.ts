import type { Response } from "express";

export function ok(res: Response, message: string, data: unknown, status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function fail(res: Response, status: number, message: string, errors: string[] = [message]) {
  return res.status(status).json({ success: false, message, data: null, errors });
}
