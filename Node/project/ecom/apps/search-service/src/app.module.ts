import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController, configuration } from '@app/common';
import { ElasticsearchService } from './search/elasticsearch.service';
import { SearchController } from './search/search.controller';
import { SearchConsumer } from './search/search.consumer';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
  controllers: [HealthController, SearchController, SearchConsumer],
  providers: [ElasticsearchService],
})
export class AppModule {}
