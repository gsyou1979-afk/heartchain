import { Controller, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactionsService } from '../transactions/transactions.service';

@Controller('api/users/:userId/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  getWallet(@Param('userId') userId: string) {
    return this.walletService.getWallet(+userId);
  }

  @Get('transactions')
  getTransactions(@Param('userId') userId: string) {
    return this.transactionsService.findByUser(+userId);
  }
}
