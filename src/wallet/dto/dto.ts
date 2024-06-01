import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';
import { TransactionType } from 'src/transaction/enum';

export class WalletDTO extends BaseDTO {
  @IsNumber()
  userId: number;

  @IsNumber()
  balance: number;
}

export class UpdateWalletDTO {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  transactionType: TransactionType;
}
