import { Controller, Post, Body, Request, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
     

    @Post("register")
    async register(@Body() dto: RegisterDto) {
        await this.authService.create(dto.email, dto.password);
        return ;
    }

    @Post("login")
    async login(@Body() dto: LoginDto) {
        return await this.authService.loginFunction(dto.email, dto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Request() req: {user: {userId: string}}) {
        return req.user;
    }
    
}
