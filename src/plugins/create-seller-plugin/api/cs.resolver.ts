import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext, Transaction } from '@vendure/core';

import { CreateSellerService } from '../service/cs.service';
import { CreateSellerInput } from '../types';

@Resolver()
export class CreateSellerResolver {
    constructor(private createSellerService: CreateSellerService) {}

    @Mutation()
    @Transaction()
    @Allow(Permission.Public)
    registerNewSeller(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: { shopName: string; seller: CreateSellerInput } },
    ) {
        return this.createSellerService.registerNewSeller(ctx, args.input);
    }
}
