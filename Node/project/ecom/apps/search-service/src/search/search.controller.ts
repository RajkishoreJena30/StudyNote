import { Controller, Get, Query } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';

@Controller('search')
export class SearchController {
  constructor(private readonly es: ElasticsearchService) {}

  @Get()
  search(@Query('q') q: string) {
    return this.es.search(q ?? '');
  }

  @Get('autocomplete')
  autocomplete(@Query('q') q: string) {
    return this.es.autocomplete(q ?? '');
  }
}
