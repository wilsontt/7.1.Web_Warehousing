/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 支援深色模式
  images: {
    domains: [],
  },
  // 安全標頭設定
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 生產環境應啟用 HTTPS
          // {
          //   key: "Strict-Transport-Security",
          //   value: "max-age=31536000; includeSubDomains",
          // },
        ],
      },
    ];
  },
}

module.exports = nextConfig

