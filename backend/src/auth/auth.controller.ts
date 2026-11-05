import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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

    //@Get('me')
    
}
