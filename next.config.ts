import withPWA from 'next-pwa'
import createNextIntlPlugin from 'next-intl/plugin'
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

async function setup() {
  if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform()
  }
}

setup()

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts')

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      }
    ],
  },
  // 自动接管所有 OPTIONS 请求
  async headers() {
    return [
      {
        // 匹配所有的 API 路由，包含所有动态 UUID 或多级路径
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS, PATCH" },
          // 允许携带前端插件发送的所有自定义 Header（如 X-API-Key）
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

const withPWAConfigured = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
}) as any

const configWithPWA = withPWAConfigured(nextConfig as any) as any

export default withNextIntl(configWithPWA)
