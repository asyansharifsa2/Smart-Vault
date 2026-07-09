/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 👈 Tambahkan baris ini untuk ekspor statis ke GitHub Pages
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
