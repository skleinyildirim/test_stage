import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    
    constructor() {
        const env_var: string | undefined = process.env.DATABASE_URL;
        if (!env_var) {
            throw new Error("DATABASE_URL not found")
        }
        const adapter = new PrismaPg({ connectionString: env_var });
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}
