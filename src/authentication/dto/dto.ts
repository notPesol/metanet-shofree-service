import { IsString } from 'class-validator';

export class AuthenticationDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
