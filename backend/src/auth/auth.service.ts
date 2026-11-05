import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    saltOrRounds: number = 10;
    constructor(private readonly prisma_serv: PrismaService) {}
    async create(email: string, password: string) {
        const hashPass = await bcrypt.hash(password, this.saltOrRounds)
        try {
            await this.prisma_serv.user.create({
                data: {
                    email: email,
                    password: hashPass
                }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email already in use');
            }
            throw error;
        }
        return ;
    }
}
