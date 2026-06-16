import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpClientService } from '../clients/http-client.service';
import { RegisterUserInput, User } from './models';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly http: HttpClientService) {}

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | null> {
    return this.http.request<User>('user', `/users/${id}`);
  }

  @Mutation(() => User)
  async registerUser(
    @Args('input') input: RegisterUserInput,
  ): Promise<User> {
    return this.http.request<User>('user', '/users', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }
}
