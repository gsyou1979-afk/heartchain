import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * 部署脚本 - Polygon zkEVM 测试网
 * 
 * 使用方法:
 *   npx hardhat run scripts/deploy-testnet.ts --network polygonZkEvmTestnet
 * 
 * 部署前确保:
 *   1. .env 文件配置了 ADMIN_PRIVATE_KEY
 *   2. 测试账户有足够的 MATIC (从水龙头领取)
 */
async function main() {
  console.log("===========================================");
  console.log("  HeartChain 合约部署 - Polygon zkEVM Testnet");
  console.log("===========================================\n");

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log(`部署者地址: ${deployer.address}`);
  
  // 检查余额
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`账户余额: ${ethers.formatEther(balance)} MATIC\n`);

  // 1. 部署 HRT 代币合约
  console.log("📦 部署 HRT 代币合约...");
  const HRTFactory = await ethers.getContractFactory("HRT");
  const hrtToken = await HRTFactory.deploy(deployer.address);
  await hrtToken.waitForDeployment();
  const hrtAddress = await hrtToken.getAddress();
  console.log(`✅ HRT 代币部署成功!`);
  console.log(`   合约地址: ${hrtAddress}`);
  console.log(`   部署时间戳: ${(await hrtToken.deploymentTimestamp()).toString()}`);
  console.log(`   浏览器链接: https://testnet.polygonscan.com/address/${hrtAddress}\n`);

  // 2. 部署 TaskRegistry 合约
  console.log("📦 部署 TaskRegistry 合约...");
  const TaskRegistryFactory = await ethers.getContractFactory("TaskRegistry");
  const taskRegistry = await TaskRegistryFactory.deploy(hrtAddress);
  await taskRegistry.waitForDeployment();
  const taskAddress = await taskRegistry.getAddress();
  console.log(`✅ TaskRegistry 部署成功!`);
  console.log(`   合约地址: ${taskAddress}`);
  console.log(`   浏览器链接: https://testnet.polygonscan.com/address/${taskAddress}\n`);

  // 3. 授权 TaskRegistry 可以铸造 HRT
  console.log("🔐 配置权限...");
  const mintTx = await hrtToken.setMinter(taskAddress, true);
  await mintTx.wait();
  console.log(`✅ TaskRegistry 已授权为铸造者\n`);

  // 4. 验证合约信息
  console.log("📋 验证合约信息...");
  const hrtInfo = await hrtToken.getContractInfo();
  console.log(`   HRT 版本: ${hrtInfo[1]}`);
  console.log(`   HRT 总供应量: ${ethers.formatEther(hrtInfo[2])} HRT`);
  console.log(`   HRT 管理员: ${hrtInfo[3]}`);
  
  const taskStats = await taskRegistry.getStats();
  console.log(`   TaskRegistry HRT地址: ${taskStats[2]}\n`);

  // 5. 保存部署信息
  const deploymentInfo = {
    network: "polygonZkEvmTestnet",
    chainId: 1442,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      HRT: {
        address: hrtAddress,
        deploymentTimestamp: hrtInfo[0].toString(),
        explorerUrl: `https://testnet.polygonscan.com/address/${hrtAddress}`,
        totalSupply: ethers.formatEther(hrtInfo[2]),
        version: hrtInfo[1]
      },
      TaskRegistry: {
        address: taskAddress,
        explorerUrl: `https://testnet.polygonscan.com/address/${taskAddress}`,
        hrtAddress: hrtAddress
      }
    }
  };

  // 保存到文件
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, "testnet-deployment.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 部署信息已保存到: ${deploymentFile}\n`);

  // 6. 打印后续步骤
  console.log("===========================================");
  console.log("  部署完成!");
  console.log("===========================================");
  console.log("\n📌 后续步骤:");
  console.log("1. 更新后端 .env 文件:");
  console.log(`   HRT_CONTRACT_ADDRESS=${hrtAddress}`);
  console.log(`   TASK_CONTRACT_ADDRESS=${taskAddress}`);
  console.log(`   ADMIN_PRIVATE_KEY=<your_key>`);
  console.log("\n2. 验证合约源码（可选）:");
  console.log(`   npx hardhat verify --network polygonZkEvmTestnet ${hrtAddress} "${deployer.address}"`);
  console.log(`   npx hardhat verify --network polygonZkEvmTestnet ${taskAddress} "${hrtAddress}"`);
  console.log("\n3. 从水龙头领取测试 MATIC:");
  console.log("   https://faucet.polygon.technology/");
  console.log("\n===========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });
