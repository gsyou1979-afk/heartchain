import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, Contract, JsonRpcProvider, Wallet } from 'ethers';

@Injectable()
export class Web3Service implements OnModuleInit {
  private readonly logger = new Logger(Web3Service.name);
  
  private provider: JsonRpcProvider;
  private wallet: Wallet;
  private hrtContract: Contract;
  private taskContract: Contract;
  
  // 合约 ABI（只包含需要的函数）
  private readonly HRT_ABI = [
    'function mint(address to, uint256 amount, string calldata taskId) external',
    'function balanceOf(address account) external view returns (uint256)',
    'function transfer(address to, uint256 amount) external returns (bool)',
    'function decimals() external view returns (uint8)',
    'function totalSupply() external view returns (uint256)',
    'function deploymentTimestamp() external view returns (uint256)',
    'function version() external view returns (string)',
    'function owner() external view returns (address)',
    'event PointsMinted(address indexed to, uint256 amount, string taskId, uint256 timestamp)',
  ];
  
  private readonly TASK_REGISTRY_ABI = [
    'function registerTask(string calldata taskId, address publisher, address volunteer, uint256 pointsReward, string calldata metadata) external',
    'function registerTaskCompletion(string calldata taskId, string calldata metadata) external returns (bool)',
    'function claimPoints(string calldata taskId) external returns (bool)',
    'function getTask(string calldata taskId) external view returns (tuple(string taskId, address publisher, address volunteer, uint256 pointsReward, bool completed, bool pointsClaimed, uint256 completedAt, string metadata, uint8 status))',
    'function getStats() external view returns (uint256, uint256, address, uint256)',
    'event TaskCompleted(string indexed taskId, address indexed publisher, address indexed volunteer, uint256 pointsReward, uint256 timestamp)',
    'event PointsClaimed(string indexed taskId, address indexed volunteer, uint256 points, string txHash)',
  ];
  
  // 合约地址（从环境变量或配置文件读取）
  private hrtAddress: string;
  private taskAddress: string;
  
  // 是否启用区块链功能
  private blockchainEnabled = false;

  constructor(private configService: ConfigService) {
    this.hrtAddress = this.configService.get<string>('HRT_CONTRACT_ADDRESS') || '';
    this.taskAddress = this.configService.get<string>('TASK_CONTRACT_ADDRESS') || '';
  }

  async onModuleInit() {
    const rpcUrl = this.configService.get<string>('BLOCKCHAIN_RPC_URL');
    const privateKey = this.configService.get<string>('ADMIN_PRIVATE_KEY');
    
    if (!rpcUrl || !privateKey || !this.hrtAddress || !this.taskAddress) {
      this.logger.warn('⚠️ 区块链配置不完整，Web3 功能已禁用');
      this.logger.warn('请配置以下环境变量:');
      this.logger.warn('  - BLOCKCHAIN_RPC_URL');
      this.logger.warn('  - ADMIN_PRIVATE_KEY');
      this.logger.warn('  - HRT_CONTRACT_ADDRESS');
      this.logger.warn('  - TASK_CONTRACT_ADDRESS');
      this.blockchainEnabled = false;
      return;
    }
    
    try {
      this.provider = new JsonRpcProvider(rpcUrl);
      this.wallet = new Wallet(privateKey, this.provider);
      
      // 连接合约
      this.hrtContract = new Contract(this.hrtAddress, this.HRT_ABI, this.wallet);
      this.taskContract = new Contract(this.taskAddress, this.TASK_REGISTRY_ABI, this.wallet);
      
      // 验证连接
      const network = await this.provider.getNetwork();
      this.logger.log(`✅ 区块链连接成功 - 网络: ${network.name} (Chain ID: ${network.chainId})`);
      this.logger.log(`📍 HRT 合约: ${this.hrtAddress}`);
      this.logger.log(`📍 TaskRegistry 合约: ${this.taskAddress}`);
      
      this.blockchainEnabled = true;
    } catch (error) {
      this.logger.error('❌ 区块链连接失败', error);
      this.blockchainEnabled = false;
    }
  }

  /**
   * 检查区块链功能是否启用
   */
  isEnabled(): boolean {
    return this.blockchainEnabled;
  }

  /**
   * 获取提供商
   */
  getProvider(): JsonRpcProvider | null {
    return this.provider;
  }

  /**
   * 获取钱包
   */
  getWallet(): Wallet | null {
    return this.wallet;
  }

  /**
   * 获取 HRT 合约
   */
  getHrtContract(): Contract | null {
    return this.hrtContract;
  }

  /**
   * 获取 TaskRegistry 合约
   */
  getTaskContract(): Contract | null {
    return this.taskContract;
  }

  /**
   * 发放积分给用户（链上）
   * @param to 接收地址
   * @param amount 积分数量（人类可读格式，如 100）
   * @param taskId 关联任务ID
   */
  async mintPoints(to: string, amount: number, taskId: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.blockchainEnabled) {
      this.logger.warn('区块链功能未启用，积分发放仅记录到数据库');
      return { success: true, txHash: 'OFFLINE_MODE' };
    }
    
    try {
      // 转换为单位（18位精度）
      const amountWei = ethers.parseUnits(amount.toString(), 18);
      
      this.logger.log(`🪙 铸造 ${amount} HRT 给 ${to}, 任务ID: ${taskId}`);
      
      const tx = await this.hrtContract.mint(to, amountWei, taskId);
      this.logger.log(`⏳ 交易发送中... Hash: ${tx.hash}`);
      
      const receipt = await tx.wait();
      this.logger.log(`✅ 交易确认! Block: ${receipt.blockNumber}, Gas Used: ${receipt.gasUsed}`);
      
      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      this.logger.error(`❌ 铸造失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 查询用户余额
   */
  async getBalance(address: string): Promise<{ balance: number; formatted: string }> {
    if (!this.blockchainEnabled) {
      return { balance: 0, formatted: '0' };
    }
    
    try {
      const balanceWei = await this.hrtContract.balanceOf(address);
      const balance = Number(ethers.formatUnits(balanceWei, 18));
      return {
        balance,
        formatted: balance.toFixed(2) + ' HRT'
      };
    } catch (error: any) {
      this.logger.error(`❌ 查询余额失败: ${error.message}`);
      return { balance: 0, formatted: '0' };
    }
  }

  /**
   * 获取合约信息
   */
  async getContractInfo(): Promise<any> {
    if (!this.blockchainEnabled) {
      return null;
    }
    
    try {
      const [deploymentTimestamp, version, totalSupply, owner] = await Promise.all([
        this.hrtContract.deploymentTimestamp(),
        this.hrtContract.version(),
        this.hrtContract.totalSupply(),
        this.hrtContract.owner(),
      ]);
      
      return {
        deploymentTimestamp: Number(deploymentTimestamp),
        deploymentDate: new Date(Number(deploymentTimestamp) * 1000).toISOString(),
        version,
        totalSupply: ethers.formatUnits(totalSupply, 18),
        owner,
        hrtAddress: this.hrtAddress,
        taskAddress: this.taskAddress,
      };
    } catch (error: any) {
      this.logger.error(`❌ 获取合约信息失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 注册任务完成（链上）
   */
  async registerTaskCompletion(
    taskId: string,
    volunteer: string,
    pointsReward: number,
    metadata: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.blockchainEnabled) {
      return { success: true, txHash: 'OFFLINE_MODE' };
    }
    
    try {
      const tx = await this.taskContract.registerTaskCompletion(taskId, metadata);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      this.logger.error(`❌ 注册任务完成失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 领取积分（用户触发）
   */
  async claimPoints(taskId: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.blockchainEnabled) {
      return { success: false, error: 'Blockchain not enabled' };
    }
    
    try {
      const tx = await this.taskContract.claimPoints(taskId);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      this.logger.error(`❌ 领取积分失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 查询任务状态
   */
  async getTaskStatus(taskId: string): Promise<any> {
    if (!this.blockchainEnabled) {
      return null;
    }
    
    try {
      const task = await this.taskContract.getTask(taskId);
      return {
        taskId: task[0],
        publisher: task[1],
        volunteer: task[2],
        pointsReward: Number(task[3]),
        completed: task[4],
        pointsClaimed: task[5],
        completedAt: task[6] ? new Date(Number(task[6]) * 1000).toISOString() : null,
        metadata: task[7],
        status: ['Created', 'InProgress', 'Completed', 'Cancelled', 'Disputed'][task[8]],
      };
    } catch (error: any) {
      this.logger.error(`❌ 查询任务状态失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 获取平台统计
   */
  async getPlatformStats(): Promise<any> {
    if (!this.blockchainEnabled) {
      return null;
    }
    
    try {
      const [totalTasks, totalPoints, hrtAddress, hrtDeployTime] = await this.taskContract.getStats();
      return {
        totalTasksCompleted: Number(totalTasks),
        totalPointsAwarded: Number(ethers.formatUnits(totalPoints, 18)),
        hrtContractAddress: hrtAddress,
        hrtDeploymentTimestamp: Number(hrtDeployTime),
      };
    } catch (error: any) {
      this.logger.error(`❌ 获取平台统计失败: ${error.message}`);
      return null;
    }
  }
}
