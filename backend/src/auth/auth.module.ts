import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

const jwt = process.env.JWT_SECRET
if (!jwt) {
  throw new Error("JWT_SECRET not found")
}

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [PrismaModule, JwtModule.register({ secret: jwt, signOptions: {expiresIn: '60s'} })]
})
export class AuthModule {}
