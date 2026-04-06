import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    BROWSERSLIST_IGNORE_OLD_DATA: 'true',
    BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA: 'true',
  },
};

export default nextConfig;
