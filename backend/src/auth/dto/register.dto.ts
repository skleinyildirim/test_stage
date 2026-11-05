import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email!: string;

    @MinLength(8)
    @IsString()
   @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'password must contain an uppercase letter, a lowercase letter, a digit and a special character',
    })
    password!: string;

}