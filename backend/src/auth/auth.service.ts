import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    saltOrRounds: number = 10;
    constructor(private readonly prisma_serv: PrismaService, private readonly jwt: JwtService) {}
    
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

    async loginFunction(email: string, password: string) {
        const user = await this.prisma_serv.user.findUnique({
            where: {email: email}
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        const pass = await bcrypt.compare(password, user.password)
        if (!pass) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id };
        const token = await this.jwt.signAsync(payload);
        return { access_token: token };

    }
}
