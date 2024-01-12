// Type definitions

/**
 * @param input url or html
 */

export interface ParserOptions {
  /**
   * to estimate time to read.
   * Default: 300
   */
  wordsPerMinute?: number;
  /**
   * max num of chars generated for description
   * Default: 210
   */
  descriptionTruncateLen?: number;
  /**
   * min num of chars required for description
   * Default: 180
   */
  descriptionLengthThreshold?: number;
  /**
   * min num of chars required for content
   * Default: 200
   */
  contentLengthThreshold?: number;
}

export interface ProxyConfig {
  target?: string;
  headers?: Record<string, string>;
}

export interface FetchOptions {
  /**
   * list of request headers
   * default: null
   */
  headers?: Record<string, string>;
  /**
   * the values to configure proxy
   * default: null
   */
  proxy?: ProxyConfig;

  /**
   * http proxy agent
   * default: null
   */
  agent?: object;
  /**
   * signal to terminate request
   * default: null
   */
  signal?: object;
}

export interface ArticleData {
  url?: string;
  links?: string[];
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  author?: string;
  content?: string;
  source?: string;
  published?: string;
  ttr?: number;
  type?: string;
}

export type ArticleExtractor = (
  input: string,
  parserOptions?: ParserOptions,
  fetchOptions?: FetchOptions,
) => Promise<ArticleData | null>;
