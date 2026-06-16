import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS, ProductUpsertedEvent } from '@app/common';
import { ElasticsearchService } from './elasticsearch.service';

/**
 * Kafka consumer that keeps the search index in sync with the catalog.
 * This is the read-model side of CQRS: writes happen elsewhere, the search
 * service materializes a query-optimized projection in Elasticsearch.
 */
@Controller()
export class SearchConsumer {
  private readonly logger = new Logger(SearchConsumer.name);

  constructor(private readonly es: ElasticsearchService) {}

  @EventPattern(KAFKA_TOPICS.PRODUCT_UPSERTED)
  async onProductUpserted(@Payload() event: ProductUpsertedEvent): Promise<void> {
    this.logger.debug(`Indexing product ${event.productId}`);
    await this.es.index({
      id: event.productId,
      name: event.name,
      description: event.description,
      category: event.category,
      tags: event.tags,
      price: event.price,
    });
  }

  @EventPattern(KAFKA_TOPICS.PRODUCT_DELETED)
  async onProductDeleted(@Payload() event: { productId: string }): Promise<void> {
    await this.es.remove(event.productId);
  }
}
