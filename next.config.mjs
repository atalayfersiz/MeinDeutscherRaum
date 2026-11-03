/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  ...(isGithubPages && {
    output: "export",
    basePath: basePath,
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  }),
};

export default nextConfig;
