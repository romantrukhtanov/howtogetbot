const { NODE_ENV, WATCH_MODE, BUNDLE_ANALYZER } = process.env;

const isProduction = NODE_ENV === 'production';
const isBundleAnalyzer = BUNDLE_ANALYZER === 'true';
const isWatchMode = WATCH_MODE === 'true';

export { isBundleAnalyzer, isProduction, isWatchMode };
