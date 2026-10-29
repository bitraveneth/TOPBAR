/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import geoip from 'geoip-lite'
import iso from 'iso-3166-2'

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })

const CHINA_REGIONS = {
  AH: 'Anhui',
  BJ: 'Beijing',
  CQ: 'Chongqing',
  FJ: 'Fujian',
  GD: 'Guangdong',
  GS: 'Gansu',
  GX: 'Guangxi',
  GZ: 'Guizhou',
  HA: 'Henan',
  HB: 'Hubei',
  HE: 'Hebei',
  HI: 'Hainan',
  HK: 'Hong Kong',
  HL: 'Heilongjiang',
  HN: 'Hunan',
  JL: 'Jilin',
  JS: 'Jiangsu',
  JX: 'Jiangxi',
  LN: 'Liaoning',
  MO: 'Macau',
  NM: 'Inner Mongolia',
  NX: 'Ningxia',
  QH: 'Qinghai',
  SC: 'Sichuan',
  SD: 'Shandong',
  SH: 'Shanghai',
  SN: 'Shaanxi',
  SX: 'Shanxi',
  TJ: 'Tianjin',
  TW: 'Taiwan',
  XJ: 'Xinjiang',
  XZ: 'Tibet',
  YN: 'Yunnan',
  ZJ: 'Zhejiang',
}

function isPrivate(ip) {
  return ip === 'unknown'
    || ip === '127.0.0.1'
    || ip === '::1'
    || ip.startsWith('10.')
    || ip.startsWith('192.168.')
    || ip.startsWith('169.254.')
    || /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
    || ip.toLowerCase().startsWith('fc')
    || ip.toLowerCase().startsWith('fd')
}

function countryName(code) {
  try {
    return countryNames.of(code) || code
  } catch {
    return code
  }
}

function regionName(country, region, city) {
  if (country === 'CN' && CHINA_REGIONS[region]) return CHINA_REGIONS[region]
  if (country && region) {
    const named = iso.subdivision(`${country}-${region}`)
    if (named?.name) return named.name
  }
  return city || region || null
}

export function placeFromIp(ip) {
  const value = String(ip || '').trim().replace(/^::ffff:/, '')
  if (!value || isPrivate(value)) return { country: null, region: null }
  const geo = geoip.lookup(value)
  if (!geo?.country) return { country: null, region: null }
  const country = countryName(geo.country)
  const region = regionName(geo.country, geo.region, geo.city)
  return {
    country: country ? String(country).slice(0, 80) : null,
    region: region ? String(region).slice(0, 80) : null,
  }
}
