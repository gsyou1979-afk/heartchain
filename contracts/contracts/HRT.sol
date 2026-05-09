// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HRT (Heart Token)
 * @notice HeartChain 平台的积分代币 - 区块链志愿者积分系统
 * @dev 继承 ERC20 标准，支持燃烧机制，用于志愿者服务积分奖励
 * 
 * @custom:deployment-info
 *   - Testnet: Polygon zkEVM Cardona Testnet (Chain ID: 1442)
 *   - Mainnet: Polygon zkEVM (Chain ID: 1101)
 * 
 * @custom:ip-info
 *   - 部署时间戳可作为知识产权公证
 *   - 代码哈希可验证合约未被篡改
 * 
 * @author HeartChain Team
 */
contract HRT is ERC20, ERC20Burnable, Ownable {

    // =============================================
    // Immutable Variables (部署后不可更改)
    // =============================================
    
    /// @notice 合约部署时间戳（用于知识产权证明）
    uint256 public immutable deploymentTimestamp;
    
    /// @notice 合约版本号
    string public constant VERSION = "1.0.0";
    
    /// @notice 代币精度（小数位数）
    uint8 public constant DECIMALS = 18;
    
    /// @notice 代币符号
    string public constant SYMBOL = "HRT";
    
    /// @notice 代币全称
    string public constant NAME = "Heart Token";

    // =============================================
    // Mutable Variables
    // =============================================
    
    /// @notice 白名单：允许调用 mint 的业务合约
    mapping(address => bool) public authorizedMinters;
    
    /// @notice 代币总发行量上限（防止无限增发）
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** DECIMALS; // 10亿 HRT

    // =============================================
    // Events (用于链上活动追踪)
    // =============================================
    
    /// @notice 积分铸造事件
    event PointsMinted(
        address indexed to, 
        uint256 amount, 
        string taskId,
        uint256 timestamp
    );
    
    /// @notice 积分燃烧事件
    event PointsBurned(
        address indexed from, 
        uint256 amount, 
        string reason,
        uint256 timestamp
    );
    
    /// @notice 授权铸造者更新事件
    event MinterUpdated(
        address indexed minter, 
        bool status,
        address indexed updater
    );
    
    /// @notice 跨合约转账事件（用于跨平台追踪）
    event TransferWithContext(
        address indexed from,
        address indexed to,
        uint256 amount,
        string context,
        uint256 timestamp
    );

    // =============================================
    // Modifiers
    // =============================================
    
    modifier onlyAuthorizedMinter() {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "HRT: Caller is not an authorized minter"
        );
        _;
    }

    // =============================================
    // Constructor
    // =============================================
    
    /**
     * @notice 构造函数
     * @param initialOwner 初始管理员地址
     */
    constructor(address initialOwner) 
        ERC20(NAME, SYMBOL) 
        Ownable()
    {
        require(initialOwner != address(0), "HRT: Invalid owner address");
        
        // 记录部署时间戳（不可篡改，用于知识产权证明）
        deploymentTimestamp = block.timestamp;
        
        // 转移所有权给初始管理员
        _transferOwnership(initialOwner);
        
        // 初始铸币给平台金库（仅用于初期运营）
        // 注意：主网部署时建议设为 0，先通过任务完成逐步发放
        uint256 initialSupply = 1_000_000 * 10 ** DECIMALS; // 100万 HRT
        _mint(initialOwner, initialSupply);
        
        // 自动授权部署者为铸造者
        authorizedMinters[initialOwner] = true;
    }

    // =============================================
    // External Functions
    // =============================================
    
    /**
     * @notice 铸造积分（仅授权的合约可调用）
     * @param to 接收地址
     * @param amount 铸造数量（自动乘以精度）
     * @param taskId 关联任务ID（用于溯源和审计）
     */
    function mint(
        address to, 
        uint256 amount,
        string calldata taskId
    ) external onlyAuthorizedMinter {
        require(to != address(0), "HRT: Cannot mint to zero address");
        require(amount > 0, "HRT: Amount must be greater than 0");
        
        // 检查不会超过总供应量上限
        uint256 newTotalSupply = totalSupply() + amount;
        require(
            newTotalSupply <= MAX_SUPPLY,
            "HRT: Exceeds maximum supply"
        );
        
        _mint(to, amount);
        emit PointsMinted(to, amount, taskId, block.timestamp);
    }

    /**
     * @notice 批量铸造积分
     * @param recipients 接收地址数组
     * @param amounts 铸造数量数组
     * @param taskId 关联任务ID
     */
    function batchMint(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string calldata taskId
    ) external onlyAuthorizedMinter {
        require(
            recipients.length == amounts.length,
            "HRT: Arrays length mismatch"
        );
        require(recipients.length > 0, "HRT: Empty arrays");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "HRT: Invalid recipient");
            
            uint256 newTotalSupply = totalSupply() + amounts[i];
            require(
                newTotalSupply <= MAX_SUPPLY,
                "HRT: Exceeds maximum supply"
            );
            
            _mint(recipients[i], amounts[i]);
            emit PointsMinted(recipients[i], amounts[i], taskId, block.timestamp);
        }
    }

    /**
     * @notice 带原因的燃烧（用户自愿燃烧，如放弃任务惩罚）
     * @param amount 燃烧数量
     * @param reason 燃烧原因
     */
    function burnWithReason(
        uint256 amount,
        string calldata reason
    ) external {
        require(amount > 0, "HRT: Amount must be greater than 0");
        require(bytes(reason).length > 0, "HRT: Reason required");
        
        _burn(msg.sender, amount);
        emit PointsBurned(msg.sender, amount, reason, block.timestamp);
    }

    /**
     * @notice 更新授权的铸造者（仅管理员）
     * @param minter 要更新的地址
     * @param status 授权状态
     */
    function setMinter(address minter, bool status) external onlyOwner {
        require(minter != address(0), "HRT: Invalid minter address");
        authorizedMinters[minter] = status;
        emit MinterUpdated(minter, status, msg.sender);
    }

    /**
     * @notice 检查是否授权
     * @param minter 要检查的地址
     * @return bool 是否授权
     */
    function isMinter(address minter) external view returns (bool) {
        return authorizedMinters[minter] || minter == owner();
    }

    /**
     * @notice 跨合约代币转移（带上下文）
     * @param to 接收地址
     * @param amount 数量
     * @param context 转移上下文说明
     */
    function transferWithContext(
        address to,
        uint256 amount,
        string calldata context
    ) external {
        require(to != address(0), "HRT: Invalid recipient");
        require(amount > 0, "HRT: Amount must be greater than 0");
        
        _transfer(msg.sender, to, amount);
        emit TransferWithContext(msg.sender, to, amount, context, block.timestamp);
    }

    // =============================================
    // View Functions
    // =============================================
    
    /**
     * @notice 获取合约完整信息（用于验证）
     */
    function getContractInfo() external view returns (
        uint256 _deploymentTimestamp,
        string memory _version,
        uint256 _currentSupply,
        address _contractOwner,
        uint256 _maxSupply,
        uint8 _decimals
    ) {
        return (
            deploymentTimestamp,
            VERSION,
            ERC20.totalSupply(),
            owner(),
            MAX_SUPPLY,
            DECIMALS
        );
    }

    /**
     * @notice 获取精度
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    // =============================================
    // Metadata Functions (用于代币展示)
    // =============================================
    
    /**
     * @notice 获取代币URI（用于钱包显示）
     */
    function tokenURI() external pure returns (string memory) {
        return "https://heartchain.example.com/api/token/HRT";
    }
}
