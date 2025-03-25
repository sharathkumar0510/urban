/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Disable Babel and use SWC exclusively
  experimental: {
    forceSwcTransforms: true,
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig.experimental = {
    ...nextConfig.experimental,
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],
  };
}

// Add support for both App Router and Pages Router
nextConfig.pageExtensions = ["tsx", "ts", "jsx", "js"];

// Configure webpack to properly handle lodash
nextConfig.webpack = (config, { isServer }) => {
  // Ensure lodash is properly bundled
  if (!config.resolve) {
    config.resolve = {};
  }

  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  // Use path.resolve to get the absolute path to lodash
  config.resolve.alias = {
    ...config.resolve.alias,
    lodash: require.resolve("lodash"),
  };

  // Add fallback for node modules
  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }

  // Explicitly tell webpack how to handle lodash
  config.module = config.module || {};
  config.module.rules = config.module.rules || [];
  config.module.rules.push({
    test: /\.m?js$/,
    include: /node_modules\/lodash/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-transform-runtime"],
      },
    },
  });

  return config;
};

module.exports = nextConfig;
