import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HealthController, configuration } from '@app/common';
import { HttpClientService } from './clients/http-client.service';
import { BookingResolver } from './graphql/booking.resolver';
import { UserResolver } from './graphql/user.resolver';
import { SearchResolver } from './graphql/search.resolver';

/**
 * API Gateway:
 *  - single GraphQL entry point for clients (code-first schema)
 *  - delegates to downstream microservices over HTTP/REST
 *  - terminates auth, rate limiting, request shaping (extend as needed)
 *
 * Behind nginx there are 2 replicas of this service -> horizontal scaling.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/api-gateway/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
  ],
  controllers: [HealthController],
  providers: [HttpClientService, BookingResolver, UserResolver, SearchResolver],
})
export class AppModule {}
