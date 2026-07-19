# HeartChain 区块链积分系统架构设计

> 版本：v1.0 | 日期：2026-04-26 | 作者：大秘

## 一、设计目标

### 1.1 积分定位
- **代币名称**：HRT（Heart Token）
- **定位**：基于区块链的志愿者积分/功德币
- **标准**：ERC-20
- **目标网络**：Polygon zkEVM Testnet → Mainnet

### 1.2 核心特性
| 特性 | 说明 |
|------|------|
| 链上可转移 | 用户之间可直接转账积分 |
| 交易可追溯 | 所有交易记录公开可查 |
| 抗审查 | 没人能随意增发/销毁 |
| 跨平台流通 | 未来可对接其他DApp |
| 知识产权保护 | 智能合约部署即公证 |

---

## 二、技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户端 (Web/Mobile)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │  钱包抽象层   │  │   积分展示   │  │     交易签名        │   │
│  │ (MetaMask/  │  │  (余额/历史) │  │  (ERC-4337/EOA)    │   │
│  │  托管钱包)   │  │             │  │                     │   │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘   │
└─────────┼────────────────┼───────────────────┼───────────────┘
          │                │                   │
          └────────────────┼───────────────────┘
                           │ HTTPS + JSON-RPC
          ┌────────────────┴───────────────────┐
          │           后端服务 (NestJS)          │
          │  ┌────────────┐  ┌───────────────┐  │
          │  │  用户管理   │  │  业务逻辑层    │  │
          │  │ (链下存储)  │  │ 积分发放/核销  │  │
          │  └────────────┘  └───────┬───────┘  │
          │                           │           │
          │  ┌────────────────────────┴────────┐  │
          │  │         Web3 服务层              │  │
          │  │  (ethers.js / viem)              │  │
          │  │  - 签名请求转发                   │  │
          │  │  - Gas 代付 (Biconomy/Gelato)   │  │
          │  └─────────────────────────────────┘  │
          └────────────────────┬─────────────────┘
                               │ JSON-RPC
          ┌────────────────────┴─────────────────┐
          │           区块链层 (Polygon)         │
          │  ┌─────────────┐  ┌───────────────┐  │
          │  │ HRT代币合约 │  │  任务完成合约  │  │
          │  │ (ERC-20)   │  │  (业务逻辑)   │  │
          │  └─────────────┘  └───────────────┘  │
          │                                     │
          │  Polygon zkEVM Testnet              │
          │  Chain ID: 1442                      │
          └─────────────────────────────────────┘
```

---

## 三、智能合约设计

### 3.1 HRT 代币合约 (HRT.sol)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HRT (Heart Token)
 * @notice HeartChain 平台的积分代币
 * @dev 继承 ERC20 标准，支持燃烧机制
 * @author HeartChain Team
 * @custom:deployment-info
 *   - Testnet: Polygon zkEVM Cardona Testnet (1442)
 *   - Mainnet: Polygon zkEVM
 */
contract HRT is ERC20, ERC20Burnable, Ownable {

    // 合约部署时间（用于知识产权证明）
    uint256 public immutable deploymentTimestamp;
    // 合约版本
    string public constant VERSION = "1.0.0";

    // 白名单：允许调用 mint 的业务合约
    mapping(address => bool) public authorizedMinters;

    // 事件：用于链上活动追踪
    event PointsMinted(address indexed to, uint256 amount, string taskId);
    event PointsBurned(address indexed from, uint256 amount, string reason);
    event MinterUpdated(address indexed minter, bool status);

    modifier onlyAuthorizedMinter() {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "HRT: Not authorized minter"
        );
        _;
    }

    constructor(address initialOwner) 
        ERC20("Heart Token", "HRT") 
        Ownable(initialOwner)
    {
        deploymentTimestamp = block.timestamp;
        
        // 初始铸币（给平台金库）
        // 注意：主网部署时应设为 0 或很小数量
        _mint(initialOwner, 1_000_000 * 10 ** decimals()); // 100万 HRT
    }

    /**
     * @notice 授权的合约才能调用此方法铸币
     * @param to 接收地址
     * @param amount 数量
     * @param taskId 关联任务ID（用于溯源）
     */
    function mint(
        address to, 
        uint256 amount,
        string calldata taskId
    ) external onlyAuthorizedMinter {
        _mint(to, amount);
        emit PointsMinted(to, amount, taskId);
    }

    /**
     * @notice 允许用户自主燃烧积分（如放弃任务惩罚）
     * @param amount 燃烧数量
     * @param reason 原因
     */
    function burnWithReason(
        uint256 amount,
        string calldata reason
    ) external {
        _burn(msg.sender, amount);
        emit PointsBurned(msg.sender, amount, reason);
    }

    /**
     * @notice 更新授权的铸币者（仅管理员）
     */
    function setMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
        emit MinterUpdated(minter, status);
    }

    /**
     * @notice 获取合约信息（用于验证）
     */
    function getContractInfo() external view returns (
        uint256 _deploymentTimestamp,
        string memory _version,
        uint256 _totalSupply,
        address _owner
    ) {
        return (
            deploymentTimestamp,
            VERSION,
            totalSupply(),
            owner()
        );
    }
}
```

### 3.2 任务完成验证合约 (TaskRegistry.sol)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HRT.sol";

/**
 * @title TaskRegistry
 * @notice 任务完成注册合约
 * @dev 记录任务完成时间戳，用于触发积分发放
 */
contract TaskRegistry is Ownable {

    HRT public hrtToken;
    
    // 任务状态
    struct Task {
        string taskId;
        address publisher;
        address volunteer;
        uint256 pointsReward;
        bool completed;
        bool pointsClaimed;
        uint256 completedAt;
        string metadata; // IPFS hash 或其他元数据
    }
    
    // taskId => Task
    mapping(string => Task) public tasks;
    
    // 任务完成事件
    event TaskCompleted(
        string indexed taskId,
        address indexed volunteer,
        uint256 pointsReward,
        uint256 timestamp
    );
    
    // 积分领取事件
    event PointsClaimed(
        string indexed taskId,
        address indexed volunteer,
        uint256 points
    );

    constructor(address _hrtToken) Ownable(msg.sender) {
        hrtToken = HRT(_hrtToken);
    }

    /**
     * @notice 注册任务完成（由后端验证后调用）
     */
    function registerTaskCompletion(
        string calldata taskId,
        address volunteer,
        uint256 pointsReward,
        string calldata metadata
    ) external onlyOwner returns (bool) {
        require(!tasks[taskId].completed, "Task already completed");
        
        tasks[taskId] = Task({
            taskId: taskId,
            publisher: msg.sender,
            volunteer: volunteer,
            pointsReward: pointsReward,
            completed: true,
            pointsClaimed: false,
            completedAt: block.timestamp,
            metadata: metadata
        });
        
        emit TaskCompleted(taskId, volunteer, pointsReward, block.timestamp);
        return true;
    }

    /**
     * @notice 领取积分（志愿者触发）
     */
    function claimPoints(string calldata taskId) external {
        Task storage task = tasks[taskId];
        
        require(task.completed, "Task not completed");
        require(!task.pointsClaimed, "Points already claimed");
        require(task.volunteer == msg.sender, "Not the assigned volunteer");
        
        task.pointsClaimed = true;
        
        // 调用 HRT 合约的 mint
        hrtToken.mint(msg.sender, task.pointsReward, taskId);
        
        emit PointsClaimed(taskId, msg.sender, task.pointsReward);
    }

    /**
     * @notice 查询任务状态
     */
    function getTask(string calldata taskId) external view returns (Task memory) {
        return tasks[taskId];
    }
}
```

---

## 四、后端集成方案

### 4.1 依赖安装

```bash
cd backend
npm install ethers@6 @typechian/ethers-v6
```

### 4.2 Web3 服务模块

```typescript
// src/web3/web3.module.ts
import { Module, Global } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module {}
```

```typescript
// src/web3/web3.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private hrtContract: ethers.Contract;
  private taskContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    // Polygon zkEVM Testnet RPC
    const rpcUrl = this.configService.get('BLOCKCHAIN_RPC_URL');
    const privateKey = this.configService.get('ADMIN_PRIVATE_KEY');
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    // HRT 代币合约
    const hrtAddress = this.configService.get('HRT_CONTRACT_ADDRESS');
    const hrtAbi = [
      "function mint(address to, uint256 amount, string calldata taskId) external",
      "function balanceOf(address account) external view returns (uint256)",
      "function transfer(address to, uint256 amount) external returns (bool)",
      "function decimals() external view returns (uint8)",
    ];
    this.hrtContract = new ethers.Contract(hrtAddress, hrtAbi, this.wallet);

    // 任务注册合约
    const taskAddress = this.configService.get('TASK_CONTRACT_ADDRESS');
    const taskAbi = [
      "function registerTaskCompletion(string calldata taskId, address volunteer, uint256 pointsReward, string calldata metadata) external returns (bool)",
      "function claimPoints(string calldata taskId) external",
      "function getTask(string calldata taskId) external view returns (tuple(string taskId, address publisher, address volunteer, uint256 pointsReward, bool completed, bool pointsClaimed, uint256 completedAt, string metadata))",
    ];
    this.taskContract = new ethers.Contract(taskAddress, taskAbi, this.wallet);
  }

  /**
   * 发放积分给用户
   */
  async mintPoints(to: string, amount: number, taskId: string): Promise<string> {
    // 转换为最小单位（18位小数）
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    
    const tx = await this.hrtContract.mint(to, amountWei, taskId);
    const receipt = await tx.wait();
    
    return receipt.hash;
  }

  /**
   * 查询用户余额
   */
  async getBalance(address: string): Promise<number> {
    const balance = await this.hrtContract.balanceOf(address);
    return Number(ethers.formatUnits(balance, 18));
  }

  /**
   * 获取交易历史（需要索引服务或区块链浏览器API）
   */
  async getTransactionHistory(address: string): Promise<any[]> {
    // 可使用 PolygonScan API 或自建索引
    // 这里返回空数组，后续实现
    return [];
  }
}
```

### 4.3 积分发放服务

```typescript
// src/points/points.service.ts
import { Injectable } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';

@Injectable()
export class PointsService {
  constructor(private web3Service: Web3Service) {}

  async awardPoints(userId: string, walletAddress: string, amount: number, taskId: string) {
    // 1. 链上发放积分
    const txHash = await this.web3Service.mintPoints(walletAddress, amount, taskId);
    
    // 2. 链下记录（保持原有业务逻辑）
    // TODO: 更新数据库中的积分记录
    
    return {
      success: true,
      txHash,
      amount,
      taskId,
    };
  }
}
```

---

## 五、前端钱包方案

### 5.1 方案选型

**推荐：智能钱包 + 托管方案**

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| MetaMask | 成熟、安全 | 用户需安装插件 | 进阶用户 |
| 托管钱包 | 无门槛、简单 | 需信任平台 | 大多数用户 |

### 5.2 推荐实现：ERC-4337 智能钱包 + Biconomy

```typescript
// 前端集成 Biconomy SDK（托管钱包）
import Biconomy from "@biconomy/mexa"

// 初始化
const biconomy = new Biconomy(window.ethereum, {
  apiKey: BICONOMY_API_KEY,
  strictMode: false,
  debug: true
});

await biconomy.init();

// 登录时自动创建钱包（用户无感知）
// 发送交易时由 Biconomy 代付 Gas
```

---

## 六、开发路线图

### 阶段一：测试网搭建（1-2周）

| 任务 | 工具/网络 |
|------|-----------|
| 申请测试 MATIC 水龙头 | Polygon Faucet |
| 部署测试网合约 | Polygon zkEVM Cardona (1442) |
| 配置后端 Web3 服务 | ethers.js v6 |
| 联调积分发放流程 | - |
| 前端钱包集成 | MetaMask + Biconomy |

### 阶段二：功能开发（2-4周）

- 用户注册自动创建钱包
- 任务完成触发链上记录
- 积分转账功能
- 积分历史查询（链上+链下）
- Gas 代付配置

### 阶段三：测试与安全（1-2周）

- 智能合约审计
- 积分系统压力测试
- 安全漏洞排查
- 主网部署准备

### 阶段四：主网上线

- 部署到 Polygon zkEVM Mainnet
- 保留部署证明（时间戳公证）
- 申请软件著作权

---

## 七、知识产权保护策略

### 7.1 区块链部署作为先发证明

```
部署成功后获得：
1. 合约地址（唯一标识）
2. 部署时间戳（block.timestamp）
3. transaction hash（不可篡改）
4. 合约字节码（代码哈希）
```

### 7.2 软件著作权申请材料

1. **源代码** - HRT.sol, TaskRegistry.sol 及相关合约
2. **部署证明** - transaction hash + block number
3. **白皮书** - 本文档
4. **界面截图** - 前端页面

### 7.3 GitHub 时间戳公证

```bash
# 部署时记录 commit hash
git rev-parse HEAD
# 记录在合约的 metadata 中
```

---

## 八、成本估算

### 测试网阶段
| 项目 | 费用 |
|------|------|
| 测试 MATIC | 免费（水龙头） |
| 合约部署 | 免费 |
| 测试交易 | 免费 |

### 主网阶段（Polygon zkEVM）
| 项目 | 费用 |
|------|------|
| 合约部署 | ≈ 0.01 MATIC（≈ ¥0.05） |
| 每笔积分发放 | ≈ 0.0001 MATIC（≈ ¥0.0005） |
| 用户转账 | ≈ 0.00005 MATIC（≈ ¥0.00025） |

**总计**：上线成本 < ¥1，年度维护 < ¥10

---

## 九、风险与注意事项

1. **私钥安全**：管理员私钥必须离线存储或使用硬件钱包
2. **合约升级**：建议使用代理模式（但会增加复杂度）
3. **Gas 预测**：大流量时需考虑 Gas 价格波动
4. **监管合规**：积分/代币可能在某些国家被认定为证券

---

## 十、下一步行动

- [ ] 确认方案后，部署测试网合约
- [ ] 配置后端 Web3 服务
- [ ] 开发前端钱包集成
- [ ] 联调完整流程

---

*本文档由大秘（WorkBuddy AI）生成，可作为知识产权申请材料的一部分。*
