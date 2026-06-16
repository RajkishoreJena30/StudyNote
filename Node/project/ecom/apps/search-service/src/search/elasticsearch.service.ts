import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

export const PRODUCT_INDEX = 'products';

interface ProductDoc {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
}

/**
 * Elasticsearch wrapper for product search.
 *
 * - On boot, ensures the index exists with a mapping that supports:
 *     * fuzzy full-text search (standard analyzer)
 *     * autocomplete via an edge_ngram "search_as_you_type"-style field
 * - Exposes index/search/suggest helpers.
 *
 * See LLD: "Elasticsearch for fuzzy search & autocomplete".
 */
@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);
  private readonly client: Client;

  constructor(private readonly config: ConfigService) {
    this.client = new Client({
      node: this.config.get<string>('elasticsearch.node', 'http://localhost:9200'),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.ensureIndex().catch((e) =>
      this.logger.error(`Index init failed: ${e.message}`),
    );
  }

  private async ensureIndex(): Promise<void> {
    const exists = await this.client.indices.exists({ index: PRODUCT_INDEX });
    if (exists) return;

    await this.client.indices.create({
      index: PRODUCT_INDEX,
      settings: {
        analysis: {
          filter: {
            autocomplete_filter: {
              type: 'edge_ngram',
              min_gram: 2,
              max_gram: 20,
            },
          },
          analyzer: {
            autocomplete: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'autocomplete_filter'],
            },
          },
        },
      },
      mappings: {
        properties: {
          name: {
            type: 'text',
            // Index for autocomplete, but search with the standard analyzer
            // so query terms aren't themselves ngram-tokenized.
            analyzer: 'autocomplete',
            search_analyzer: 'standard',
            fields: { keyword: { type: 'keyword' } },
          },
          description: { type: 'text' },
          category: { type: 'keyword' },
          tags: { type: 'keyword' },
          price: { type: 'float' },
        },
      },
    });
    this.logger.log(`Created index "${PRODUCT_INDEX}"`);
  }

  async index(doc: ProductDoc): Promise<void> {
    await this.client.index({
      index: PRODUCT_INDEX,
      id: doc.id,
      document: doc,
      refresh: 'wait_for',
    });
  }

  async remove(id: string): Promise<void> {
    await this.client
      .delete({ index: PRODUCT_INDEX, id })
      .catch(() => undefined);
  }

  /** Typo-tolerant full text search across name + description. */
  async search(query: string) {
    const res = await this.client.search<ProductDoc>({
      index: PRODUCT_INDEX,
      query: {
        multi_match: {
          query,
          fields: ['name^3', 'description', 'tags'],
          fuzziness: 'AUTO', // tolerates typos (Levenshtein distance)
        },
      },
    });
    return res.hits.hits.map((h) => ({
      id: h._id,
      name: h._source?.name,
      category: h._source?.category,
      score: h._score ?? 0,
    }));
  }

  /** Prefix-based suggestions for search-as-you-type. */
  async autocomplete(prefix: string): Promise<string[]> {
    const res = await this.client.search<ProductDoc>({
      index: PRODUCT_INDEX,
      size: 8,
      query: { match: { name: { query: prefix, operator: 'and' } } },
    });
    return res.hits.hits
      .map((h) => h._source?.name)
      .filter((n): n is string => Boolean(n));
  }
}
