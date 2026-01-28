import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  clerkUserId: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  name: string
}
