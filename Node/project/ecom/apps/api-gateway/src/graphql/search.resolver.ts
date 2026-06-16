import { Args, Query, Resolver } from '@nestjs/graphql';
import { HttpClientService } from '../clients/http-client.service';
import { SearchHit } from './models';

@Resolver(() => SearchHit)
export class SearchResolver {
  constructor(private readonly http: HttpClientService) {}

  /** Fuzzy product search (typo-tolerant) backed by Elasticsearch. */
  @Query(() => [SearchHit])
  async search(@Args('q') q: string): Promise<SearchHit[]> {
    return this.http.request<SearchHit[]>(
      'search',
      `/search?q=${encodeURIComponent(q)}`,
    );
  }

  /** Autocomplete suggestions (edge-ngram). */
  @Query(() => [String])
  async autocomplete(@Args('q') q: string): Promise<string[]> {
    return this.http.request<string[]>(
      'search',
      `/search/autocomplete?q=${encodeURIComponent(q)}`,
    );
  }
}
