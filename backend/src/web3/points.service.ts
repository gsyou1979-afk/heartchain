import { Injectable, Logger } from '@nestjs/common';
import { Web3Service } from './web3.service';

@Injectable()
export class PointsService {
  private readonly logger = new Logger(PointsService.name);

  constructor(private web3Service: Web3Service) {}

  /**
   * 发放任务积分奖励
   * @param userId 用户ID（数据库）
   * @param walletAddress 用户钱包地址
   * @param amount 积分数量
   * @param taskId 任务ID
   */
  async awardTaskPoints(
    userId: string,
    walletAddress: string,
    amount: number,
    taskId: string
  ): Promise<{
    success: boolean;
    txHash?: string;
    points?: number;
    error?: string;
  }> {
    this.logger.log(`🎁 发放积分: 用户 ${userId}, 地址 ${walletAddress}, 数量 ${amount}, 任务 ${taskId}`);
    
    // 调用区块链服务发放积分
    const result = await this.web3Service.mintPoints(walletAddress, amount, taskId);
    
    if (result.success) {
      return {
        success: true,
        txHash: result.txHash,
        points: amount,
      };
    } else {
      return {
        success: false,
        error: result.error,
      };
    }
  }

  /**
   * 查询用户积分余额
   */
  async getUserPoints(walletAddress: string): Promise<{
    balance: number;
    formatted: string;
  }> {
    return this.web3Service.getBalance(walletAddress);
  }

  /**
   * 获取合约信息（用于验证）
   */
  async getBlockchainInfo() {
    return this.web3Service.getContractInfo();
  }

  /**
   * 获取平台统计
   */
  async getStats() {
    return this.web3Service.getPlatformStats();
  }
}
