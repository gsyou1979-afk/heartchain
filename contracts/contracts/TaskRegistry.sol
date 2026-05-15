// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HRT.sol";

/**
 * @title TaskRegistry
 * @notice 任务完成注册合约 - HeartChain 业务逻辑核心
 * @dev 记录任务完成状态，触发链上积分发放
 * 
 * @custom:deployment-info
 *   - 与 HRT 合约配合使用
 *   - 部署时需传入 HRT 合约地址
 * 
 * @author HeartChain Team
 */
contract TaskRegistry is Ownable {

    // =============================================
    // Contracts
    // =============================================
    
    /// @notice HRT 代币合约引用
    HRT public immutable hrtToken;
    
    /// @notice HRT 合约部署时间（用于验证一致性）
    uint256 public immutable hrtDeploymentTimestamp;

    // =============================================
    // Data Structures
    // =============================================
    
    /// @notice 任务状态枚举
    enum TaskStatus {
        Created,
        InProgress,
        Completed,
        Cancelled,
        Disputed
    }
    
    /// @notice 任务结构体
    struct Task {
        string taskId;              // 业务系统任务ID
        address publisher;          // 发布者地址
        address volunteer;         // 接单者地址
        uint256 pointsReward;       // 积分奖励（原始值，如 100）
        bool completed;            // 是否已完成
        bool pointsClaimed;        // 积分是否已领取
        uint256 completedAt;        // 完成时间戳
        string metadata;           // 元数据（IPFS hash 或 JSON）
        TaskStatus status;          // 任务状态
    }

    // =============================================
    // State Variables
    // =============================================
    
    /// @notice 任务映射 (业务taskId => Task)
    mapping(string => Task) public tasks;
    
    /// @notice 用户任务列表 (address => taskId[])
    mapping(address => string[]) public userTasks;
    
    /// @notice 平台统计
    uint256 public totalTasksCompleted;
    uint256 public totalPointsAwarded;

    // =============================================
    // Events
    // =============================================
    
    /// @notice 任务完成事件
    event TaskCompleted(
        string indexed taskId,
        address indexed publisher,
        address indexed volunteer,
        uint256 pointsReward,
        uint256 timestamp
    );
    
    /// @notice 积分领取事件
    event PointsClaimed(
        string indexed taskId,
        address indexed volunteer,
        uint256 points,
        string txHash
    );
    
    /// @notice 任务创建事件
    event TaskCreated(
        string indexed taskId,
        address indexed publisher,
        uint256 pointsReward
    );
    
    /// @notice 任务取消事件
    event TaskCancelled(
        string indexed taskId,
        address indexed canceller,
        string reason
    );
    
    /// @notice 争议事件
    event TaskDisputed(
        string indexed taskId,
        address indexed raisedBy,
        string reason
    );

    // =============================================
    // Modifiers
    // =============================================
    
    modifier taskExists(string calldata taskId) {
        require(
            tasks[taskId].completed || tasks[taskId].status != TaskStatus.Created,
            "Task: Task does not exist"
        );
        _;
    }

    modifier taskNotClaimed(string calldata taskId) {
        require(
            !tasks[taskId].pointsClaimed,
            "Task: Points already claimed"
        );
        _;
    }

    // =============================================
    // Constructor
    // =============================================
    
    /**
     * @notice 构造函数
     * @param _hrtToken HRT 代币合约地址
     */
    constructor(address _hrtToken) Ownable() {
        require(_hrtToken != address(0), "TaskRegistry: Invalid HRT token address");
        
        hrtToken = HRT(_hrtToken);
        hrtDeploymentTimestamp = hrtToken.deploymentTimestamp();
    }

    // =============================================
    // External Functions - 任务管理
    // =============================================
    
    /**
     * @notice 注册新任务（后端验证后调用）
     * @param taskId 业务系统任务ID
     * @param publisher 任务发布者地址
     * @param volunteer 任务接单者地址
     * @param pointsReward 积分奖励
     * @param metadata 元数据
     */
    function registerTask(
        string calldata taskId,
        address publisher,
        address volunteer,
        uint256 pointsReward,
        string calldata metadata
    ) external onlyOwner {
        require(bytes(taskId).length > 0, "TaskRegistry: Empty taskId");
        require(publisher != address(0), "TaskRegistry: Invalid publisher");
        require(volunteer != address(0), "TaskRegistry: Invalid volunteer");
        require(pointsReward > 0, "TaskRegistry: Invalid points reward");
        
        // 检查任务是否已存在
        require(
            tasks[taskId].status == TaskStatus.Created && !tasks[taskId].completed,
            "TaskRegistry: Task already exists"
        );
        
        tasks[taskId] = Task({
            taskId: taskId,
            publisher: publisher,
            volunteer: volunteer,
            pointsReward: pointsReward,
            completed: false,
            pointsClaimed: false,
            completedAt: 0,
            metadata: metadata,
            status: TaskStatus.InProgress
        });
        
        // 记录用户任务
        userTasks[volunteer].push(taskId);
        
        emit TaskCreated(taskId, publisher, pointsReward);
    }

    /**
     * @notice 注册任务完成（由后端验证后调用）
     * @param taskId 业务系统任务ID
     * @param metadata 更新后的元数据
     */
    function registerTaskCompletion(
        string calldata taskId,
        string calldata metadata
    ) external onlyOwner taskNotClaimed(taskId) {
        Task storage task = tasks[taskId];
        
        require(
            task.status == TaskStatus.InProgress,
            "TaskRegistry: Task not in progress"
        );
        
        task.completed = true;
        task.completedAt = block.timestamp;
        task.status = TaskStatus.Completed;
        task.metadata = metadata;
        
        totalTasksCompleted++;
        
        emit TaskCompleted(
            taskId, 
            task.publisher, 
            task.volunteer, 
            task.pointsReward,
            block.timestamp
        );
    }

    /**
     * @notice 领取积分（志愿者触发）
     * @param taskId 业务系统任务ID
     * @return bool 领取是否成功
     */
    function claimPoints(string calldata taskId) 
        external 
        taskExists(taskId) 
        taskNotClaimed(taskId) 
        returns (bool) 
    {
        Task storage task = tasks[taskId];
        
        require(
            task.completed,
            "TaskRegistry: Task not completed"
        );
        require(
            task.volunteer == msg.sender,
            "TaskRegistry: Not the assigned volunteer"
        );
        
        task.pointsClaimed = true;
        
        // 调用 HRT 合约铸造积分
        // 转换为代币最小单位（18位精度）
        uint256 pointsInWei = task.pointsReward * 10 ** 18;
        
        hrtToken.mint(msg.sender, pointsInWei, taskId);
        
        totalPointsAwarded += task.pointsReward;
        
        emit PointsClaimed(
            taskId, 
            msg.sender, 
            task.pointsReward,
            ""
        );
        
        return true;
    }

    /**
     * @notice 批量领取积分
     * @param taskIds 任务ID数组
     */
    function batchClaimPoints(string[] calldata taskIds) external {
        require(taskIds.length > 0, "TaskRegistry: Empty taskIds");
        require(taskIds.length <= 50, "TaskRegistry: Too many tasks");
        
        uint256 totalPoints = 0;
        string[] memory successfulTasks = new string[](taskIds.length);
        uint256 successCount = 0;
        
        for (uint256 i = 0; i < taskIds.length; i++) {
            string calldata taskId = taskIds[i];
            
            // 跳过不符合条件的任务
            if (
                tasks[taskId].completed &&
                !tasks[taskId].pointsClaimed &&
                tasks[taskId].volunteer == msg.sender
            ) {
                tasks[taskId].pointsClaimed = true;
                totalPoints += tasks[taskId].pointsReward;
                successfulTasks[successCount] = taskId;
                successCount++;
            }
        }
        
        // 一次性铸造总积分
        if (totalPoints > 0) {
            uint256 totalWei = totalPoints * 10 ** 18;
            hrtToken.mint(msg.sender, totalWei, "batch_claim");
            
            for (uint256 i = 0; i < successCount; i++) {
                emit PointsClaimed(
                    successfulTasks[i], 
                    msg.sender, 
                    tasks[successfulTasks[i]].pointsReward,
                    ""
                );
            }
            
            totalPointsAwarded += totalPoints;
        }
    }

    /**
     * @notice 取消任务
     * @param taskId 任务ID
     * @param reason 取消原因
     */
    function cancelTask(
        string calldata taskId,
        string calldata reason
    ) external onlyOwner {
        Task storage task = tasks[taskId];
        
        require(
            task.status == TaskStatus.InProgress || task.status == TaskStatus.Created,
            "TaskRegistry: Cannot cancel completed task"
        );
        
        task.status = TaskStatus.Cancelled;
        
        emit TaskCancelled(taskId, msg.sender, reason);
    }

    /**
     * @notice 提出争议
     * @param taskId 任务ID
     * @param reason 争议原因
     */
    function raiseDispute(
        string calldata taskId,
        string calldata reason
    ) external {
        Task storage task = tasks[taskId];
        
        require(
            task.publisher == msg.sender || task.volunteer == msg.sender,
            "TaskRegistry: Not authorized to raise dispute"
        );
        require(
            task.status == TaskStatus.Completed,
            "TaskRegistry: Task not in disputeable state"
        );
        
        task.status = TaskStatus.Disputed;
        
        emit TaskDisputed(taskId, msg.sender, reason);
    }

    /**
     * @notice 解决争议（管理员）
     * @param taskId 任务ID
     * @param givePointsToPublisher 是否把积分给发布者（否则给志愿者）
     */
    function resolveDispute(
        string calldata taskId,
        bool givePointsToPublisher
    ) external onlyOwner {
        Task storage task = tasks[taskId];
        
        require(
            task.status == TaskStatus.Disputed,
            "TaskRegistry: Task not in disputed state"
        );
        require(
            !task.pointsClaimed,
            "TaskRegistry: Points already claimed"
        );
        
        task.pointsClaimed = true;
        
        address recipient = givePointsToPublisher ? task.publisher : task.volunteer;
        uint256 pointsWei = task.pointsReward * 10 ** 18;
        
        hrtToken.mint(recipient, pointsWei, taskId);
        totalPointsAwarded += task.pointsReward;
        
        emit PointsClaimed(taskId, recipient, task.pointsReward, "dispute_resolved");
    }

    // =============================================
    // View Functions
    // =============================================
    
    /**
     * @notice 查询任务详情
     * @param taskId 业务系统任务ID
     * @return Task 任务结构体
     */
    function getTask(string calldata taskId) external view returns (Task memory) {
        return tasks[taskId];
    }

    /**
     * @notice 查询用户已完成任务数
     * @param user 用户地址
     * @return uint256 任务数
     */
    function getUserCompletedTasksCount(address user) external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < userTasks[user].length; i++) {
            if (tasks[userTasks[user][i]].completed) {
                count++;
            }
        }
        return count;
    }

    /**
     * @notice 获取用户任务列表
     * @param user 用户地址
     * @return string[] 任务ID数组
     */
    function getUserTasks(address user) external view returns (string[] memory) {
        return userTasks[user];
    }

    /**
     * @notice 获取合约统计信息
     * @return _totalTasksCompleted 总完成任务数
     * @return _totalPointsAwarded 总发放积分
     * @return _hrtTokenAddress HRT合约地址
     * @return _hrtDeployTimestamp HRT部署时间戳
     */
    function getStats() external view returns (
        uint256 _totalTasksCompleted,
        uint256 _totalPointsAwarded,
        address _hrtTokenAddress,
        uint256 _hrtDeployTimestamp
    ) {
        return (
            totalTasksCompleted,
            totalPointsAwarded,
            address(hrtToken),
            hrtDeploymentTimestamp
        );
    }
}
