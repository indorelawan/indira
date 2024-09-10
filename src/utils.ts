import { Request } from "express"
import GeoipLite from 'geoip-lite'
import crypto from 'node:crypto'

function getFingerprint(req: Request<{}, any, any, Record<string, any>>) {
  // Get data for fingerprinting
  const ip = (((req.headers["x-forwarded-for"] || "")) as string).split(",").pop() ||
    req.socket?.remoteAddress ||
    req.ip;
  const fingerprintData = {
    accept: req.headers['accept'],
    acceptLanguage: req.headers['accept-language'],
    ip,
    country: GeoipLite.lookup(ip as string) || '',
    userAgent: req.headers['user-agent'],
  };

  const fingerprint = crypto.createHash('sha256').update(JSON.stringify(fingerprintData)).digest('hex');

  return fingerprint
}

export { getFingerprint }