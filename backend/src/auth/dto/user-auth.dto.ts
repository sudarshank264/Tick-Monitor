import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UserAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 4,
  })
  password: string;

  @IsNotEmpty()
  domainId?: string;

  sub?: string;
  name?: string;
}
