<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-bold text-gray-900">管理后台</h1>
            <span class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">Admin</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ auth.user?.nickname }}</span>
            <button @click="handleLogout" class="text-sm text-gray-500 hover:text-red-500">
              退出
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tab 导航 -->
      <div class="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="tab.isLink ? router.push(tab.key === 'ads' ? '/admin/ads' : '/' + tab.key) : activeTab = tab.key"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="!tab.isLink && activeTab === tab.key
            ? 'bg-white text-red-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- ========== 仪表盘 ========== -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <h2 class="text-lg font-semibold">数据概览</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="text-3xl font-bold text-red-500">{{ stats.users?.total || 0 }}</div>
            <div class="text-gray-500 mt-1">总用户数</div>
            <div class="text-sm text-green-500 mt-2">活跃 {{ stats.users?.active || 0 }}</div>
            <div class="text-sm text-blue-500">管理员 {{ stats.users?.admins || 0 }}</div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="text-3xl font-bold text-blue-500">{{ stats.tasks?.total || 0 }}</div>
            <div class="text-gray-500 mt-1">总任务数</div>
            <div class="text-sm text-orange-500 mt-2">
              进行中 {{ stats.tasks?.byStatus?.in_progress || 0 }}
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="text-3xl font-bold text-green-500">{{ stats.teams?.total || 0 }}</div>
            <div class="text-gray-500 mt-1">团队数量</div>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="text-3xl font-bold text-purple-500">{{ stats.transactions?.total || 0 }}</div>
            <div class="text-gray-500 mt-1">交易记录</div>
          </div>
        </div>

        <!-- 积分统计卡片 -->
        <h2 class="text-lg font-semibold mt-8">积分统计</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm">
            <div class="text-2xl font-bold text-green-600">{{ stats.points?.totalIssued || 0 }}</div>
            <div class="text-sm text-green-700 mt-1">总发放积分</div>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm">
            <div class="text-2xl font-bold text-blue-600">{{ stats.points?.totalTransferred || 0 }}</div>
            <div class="text-sm text-blue-700 mt-1">总转账积分</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm">
            <div class="text-2xl font-bold text-purple-600">
              {{ stats.points?.byType?.reward?.count || 0 }}
            </div>
            <div class="text-sm text-purple-700 mt-1">奖励次数</div>
          </div>
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 shadow-sm">
            <div class="text-2xl font-bold text-yellow-600">
              {{ stats.points?.byType?.bonus?.count || 0 }}
            </div>
            <div class="text-sm text-yellow-700 mt-1">bonus次数</div>
          </div>
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 shadow-sm">
            <div class="text-2xl font-bold text-red-600">
              {{ stats.pointRules?.hourlyRate || 0 }}
            </div>
            <div class="text-sm text-red-700 mt-1">时薪标准</div>
          </div>
        </div>

        <!-- 积分规则预览 -->
        <div v-if="stats.pointRules" class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">当前积分规则</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="type in stats.pointRules.laborTypes" :key="type.type"
              class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-lg font-bold text-gray-700">{{ type.type }}</div>
              <div class="text-2xl font-bold text-red-500">{{ type.multiplier * 100 }}%</div>
              <div class="text-xs text-gray-500">
                {{ stats.pointRules.hourlyRate * type.multiplier }} 分/小时
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 用户管理 ========== -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">用户管理</h2>
          <div class="flex space-x-2">
            <button @click="showBatchModal = true" class="btn-primary bg-green-600 hover:bg-green-700">
              批量添加用户
            </button>
            <input
              v-model="userSearch"
              type="text"
              placeholder="搜索用户..."
              class="input-field"
              @keyup.enter="fetchUsers"
            />
            <select v-model="filterRole" class="input-field" @change="fetchUsers">
              <option value="">全部角色</option>
              <option value="volunteer">志愿者</option>
              <option value="organization">组织</option>
              <option value="skill_provider">技能者</option>
              <option value="donor">捐赠者</option>
              <option value="admin">管理员</option>
            </select>
            <button @click="fetchUsers" class="btn-primary">搜索</button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium text-red-500">{{ user.nickname?.charAt(0) || 'U' }}</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ user.nickname || '未设置' }}</div>
                      <div class="text-sm text-gray-500">{{ user.phone }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="badge" :class="getRoleBadgeClass(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="badge" :class="getStatusBadgeClass(user.status)">
                    {{ user.status === 'active' ? '正常' : user.status === 'banned' ? '禁用' : '未激活' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.pointBalance || 0 }} HRT
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <!-- 管理员权限按钮 -->
                  <button
                    v-if="user.role !== 'admin'"
                    @click="setAdmin(user, 'promote')"
                    class="text-blue-500 hover:text-blue-700"
                    title="设为管理员"
                  >
                    升级为管理员
                  </button>
                  <button
                    v-else
                    @click="setAdmin(user, 'demote')"
                    class="text-orange-500 hover:text-orange-700"
                    title="取消管理员"
                  >
                    降级为管理员
                  </button>
                  <!-- 禁用/解禁 -->
                  <button
                    v-if="user.status !== 'banned'"
                    @click="banUser(user)"
                    class="text-red-500 hover:text-red-700"
                  >
                    禁用
                  </button>
                  <button
                    v-else
                    @click="unbanUser(user)"
                    class="text-green-500 hover:text-green-700"
                  >
                    解禁
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex justify-center space-x-2">
          <button @click="userPage--; fetchUsers()" :disabled="userPage <= 1" class="btn-secondary disabled:opacity-50">
            上一页
          </button>
          <span class="px-4 py-2 text-sm text-gray-600">第 {{ userPage }} 页</span>
          <button @click="userPage++; fetchUsers()" class="btn-secondary">下一页</button>
        </div>
      </div>

      <!-- ========== 任务管理 ========== -->
      <div v-if="activeTab === 'tasks'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">任务管理</h2>
          <div class="flex space-x-2">
            <select v-model="taskStatus" class="input-field" @change="fetchTasks">
              <option value="">全部状态</option>
              <option value="open">开放</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">奖励</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发布者</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                  <div class="text-sm text-gray-500 truncate max-w-xs">{{ task.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="badge badge-default">{{ task.taskType }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="badge" :class="getTaskStatusBadge(task.status)">{{ task.status }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500">{{ task.pointsReward }} HRT</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ task.publisher?.nickname || task.publisher?.phone || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button v-if="task.status === 'in_progress'" @click="confirmComplete(task)"
                    class="text-green-500 hover:text-green-700">确认完成</button>
                  <button @click="deleteTask(task)" class="text-red-500 hover:text-red-700">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-center space-x-2">
          <button @click="taskPage--; fetchTasks()" :disabled="taskPage <= 1" class="btn-secondary disabled:opacity-50">上一页</button>
          <span class="px-4 py-2 text-sm text-gray-600">第 {{ taskPage }} 页</span>
          <button @click="taskPage++; fetchTasks()" class="btn-secondary">下一页</button>
        </div>
      </div>

      <!-- ========== 积分管理 ========== -->
      <div v-if="activeTab === 'points'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">积分规则配置</h2>
          <button @click="savePointRules" class="btn-primary bg-green-600 hover:bg-green-700">保存规则</button>
        </div>

        <!-- 标准工时积分 -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">标准工时积分设置</h3>
          <div class="flex items-center space-x-4">
            <label class="text-gray-700">每小时基础积分：</label>
            <input v-model.number="pointRules.hourlyRate" type="number" min="1" class="input-field w-32" />
            <span class="text-gray-500">HRT/小时</span>
          </div>
        </div>

        <!-- 技能类型系数 -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">技能类型积分系数</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(type, index) in pointRules.laborTypes" :key="type.type" class="border rounded-lg p-4">
              <div class="mb-2">
                <label class="text-sm text-gray-600">技能名称</label>
                <input v-model="type.type" type="text" class="input-field w-full mt-1" readonly />
              </div>
              <div>
                <label class="text-sm text-gray-600">系数 (%)</label>
                <input v-model.number="type.multiplier" type="number" min="0.1" max="5" step="0.1" class="input-field w-full mt-1" />
              </div>
              <div class="mt-2 text-sm text-gray-500">
                = {{ (pointRules.hourlyRate * type.multiplier).toFixed(1) }} 分/小时
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 团队管理 ========== -->
      <div v-if="activeTab === 'teams'" class="space-y-6">
        <h2 class="text-lg font-semibold">团队管理</h2>
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">团队名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">队长</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">成员数</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">总积分</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="team in teams" :key="team.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ team.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ team.leader?.nickname || team.leader?.phone || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ team.memberCount }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500">{{ team.totalPoints }} HRT</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button @click="dissolveTeam(team)" class="text-red-500 hover:text-red-700">解散</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========== 批量添加用户 Modal ========== -->
    <div v-if="showBatchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">批量添加用户</h3>
          <button @click="showBatchModal = false" class="text-gray-500 hover:text-gray-700">关闭</button>
        </div>

        <div class="space-y-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p class="font-medium text-yellow-800">格式说明：</p>
            <p class="text-yellow-700 mt-1">每行一个用户，格式：手机号,昵称,密码,角色(可选)</p>
            <p class="text-yellow-700">示例：+821012345678,张三,pass123,volunteer</p>
          </div>

          <textarea v-model="batchInput" rows="10" class="input-field w-full font-mono text-sm"
            placeholder="+821012345678,张三,123456,volunteer
+821098765432,李四,abcdef,organization
+821055555555,王五,pass1234"></textarea>

          <div class="flex space-x-2">
            <button @click="parseBatchInput" class="btn-secondary">解析预览</button>
            <button @click="submitBatchUsers" class="btn-primary bg-green-600 hover:bg-green-700" :disabled="batchUsers.length === 0">
              确认添加 ({{ batchUsers.length }} 人)
            </button>
          </div>

          <!-- 预览列表 -->
          <div v-if="batchUsers.length > 0" class="mt-4">
            <h4 class="font-medium mb-2">预览：</h4>
            <div class="max-h-48 overflow-y-auto border rounded-lg">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left">手机号</th>
                    <th class="px-4 py-2 text-left">昵称</th>
                    <th class="px-4 py-2 text-left">角色</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, i) in batchUsers" :key="i" class="border-t">
                    <td class="px-4 py-2">{{ u.phone }}</td>
                    <td class="px-4 py-2">{{ u.nickname }}</td>
                    <td class="px-4 py-2">{{ u.role }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()
const API_BASE = 'http://localhost:3002/api/v1'

// 状态
const activeTab = ref('dashboard')
const tabs = [
  { key: 'dashboard', label: '仪表盘' },
  { key: 'users', label: '用户管理' },
  { key: 'tasks', label: '任务管理' },
  { key: 'points', label: '积分规则' },
  { key: 'teams', label: '团队管理' },
  { key: 'ads', label: '广告管理', isLink: true },
]

// 统计数据
const stats = ref<any>({})

// 用户列表
const users = ref<any[]>([])
const userPage = ref(1)
const userSearch = ref('')
const filterRole = ref('')

// 任务列表
const tasks = ref<any[]>([])
const taskPage = ref(1)
const taskStatus = ref('')

// 团队列表
const teams = ref<any[]>([])

// 交易记录
const transactions = ref<any[]>([])

// 积分规则 - 默认15种技能，与任务大厅一致
const pointRules = ref({
  hourlyRate: 10,
  laborTypes: [
    { type: '医疗护理', multiplier: 1.0 },
    { type: '法律咨询', multiplier: 1.0 },
    { type: '教育培训', multiplier: 1.0 },
    { type: '技术开发', multiplier: 1.0 },
    { type: '设计创意', multiplier: 1.0 },
    { type: '翻译', multiplier: 1.0 },
    { type: '驾驶运输', multiplier: 1.0 },
    { type: '烹饪', multiplier: 1.0 },
    { type: '保洁', multiplier: 1.0 },
    { type: '维修', multiplier: 1.0 },
    { type: '安保', multiplier: 1.0 },
    { type: '养老护理', multiplier: 1.0 },
    { type: '育儿', multiplier: 1.0 },
    { type: '活动策划', multiplier: 1.0 },
    { type: '媒体宣传', multiplier: 1.0 },
  ],
})

// 计算器
const calcHours = ref(1)
const calcLaborType = ref('normal')
const calculatedReward = computed(() => {
  const type = pointRules.value.laborTypes.find(t => t.type === calcLaborType.value)
  const multiplier = type?.multiplier || 1
  return Math.round(pointRules.value.hourlyRate * calcHours.value * multiplier)
})

// 批量添加
const showBatchModal = ref(false)
const batchInput = ref('')
const batchUsers = ref<any[]>([])

// 生命周期
onMounted(async () => {
  // 先恢复登录状态
  await auth.restore();
  
  // 延迟检查，确保状态恢复完成
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!auth.isLoggedIn || auth.user?.role !== 'admin') {
    alert('您没有管理员权限')
    router.push('/')
    return
  }
  await fetchDashboard()
})

// 方法
async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    if (res.ok) {
      stats.value = await res.json()
      // 同步积分规则
      if (stats.value.pointRules) {
        pointRules.value = {
          hourlyRate: stats.value.pointRules.hourlyRate || 10,
          laborTypes: stats.value.pointRules.laborTypes || pointRules.value.laborTypes,
        }
      }
    }
  } catch (e) {
    console.error('获取统计数据失败', e)
  }
}

async function fetchUsers() {
  try {
    const params = new URLSearchParams({
      page: String(userPage.value),
      pageSize: '20',
    })
    if (userSearch.value) params.set('keyword', userSearch.value)
    if (filterRole.value) params.set('role', filterRole.value)

    const res = await fetch(`${API_BASE}/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    if (res.ok) {
      const data = await res.json()
      users.value = data.data
    }
  } catch (e) {
    console.error('获取用户列表失败', e)
  }
}

async function setAdmin(user: any, action: 'promote' | 'demote') {
  const msg = action === 'promote'
    ? `确定将 ${user.nickname || user.phone} 升级为管理员？`
    : `确定将 ${user.nickname || user.phone} 降级为普通用户？`
  if (!confirm(msg)) return

  try {
    const res = await fetch(`${API_BASE}/admin/users/${user.id}/set-admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({ action })
    })
    
    if (res.ok) {
      const data = await res.json()
      alert(data.message || '操作成功')
      fetchUsers()
    } else {
      const data = await res.json()
      alert(data.message || '操作失败')
    }
  } catch (e) {
    console.error('设置管理员失败', e)
    alert('网络错误，请重试')
  }
}

async function banUser(user: any) {
  if (!confirm(`确定禁用用户 ${user.nickname || user.phone}？`)) return
  try {
    const res = await fetch(`${API_BASE}/admin/users/${user.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({ status: 'banned' })
    })
    if (res.ok) { alert('用户已禁用'); fetchUsers() }
  } catch (e) { console.error(e) }
}

async function unbanUser(user: any) {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${user.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({ status: 'active' })
    })
    if (res.ok) { alert('用户已解禁'); fetchUsers() }
  } catch (e) { console.error(e) }
}

async function fetchTasks() {
  try {
    const params = new URLSearchParams({ page: String(taskPage.value), pageSize: '20' })
    if (taskStatus.value) params.set('status', taskStatus.value)
    const res = await fetch(`${API_BASE}/admin/tasks?${params}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    if (res.ok) {
      const data = await res.json()
      tasks.value = data.data
    }
  } catch (e) { console.error(e) }
}

async function confirmComplete(task: any) {
  if (!confirm(`确定确认完成任务「${task.title}」？\n确认后积分将发放给任务参与者。`)) return
  try {
    const res = await fetch(`${API_BASE}/admin/tasks/${task.id}/force-complete`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    if (res.ok) { alert('任务已完成确认'); fetchTasks() }
  } catch (e) { console.error(e) }
}

async function deleteTask(task: any) {
  if (!confirm(`确定删除任务「${task.title}」？此操作不可撤销！`)) return
  try {
    const res = await fetch(`${API_BASE}/admin/tasks/${task.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    if (res.ok) { alert('任务已删除'); fetchTasks() }
  } catch (e) { console.error(e) }
}

async function fetchTeams() {
  try {
    const res = await fetch(`${API_BASE}/admin/teams`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    if (res.ok) {
      const data = await res.json()
      teams.value = data.data
    }
  } catch (e) { console.error(e) }
}

async function dissolveTeam(team: any) {
  if (!confirm(`确定解散团队「${team.name}」？此操作不可撤销！`)) return
  try {
    const res = await fetch(`${API_BASE}/admin/teams/${team.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    if (res.ok) { alert('团队已解散'); fetchTeams() }
  } catch (e) { console.error(e) }
}

async function fetchTransactions() {
  try {
    const res = await fetch(`${API_BASE}/admin/transactions?pageSize=50`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    if (res.ok) {
      const data = await res.json()
      transactions.value = data.data
    }
  } catch (e) { console.error(e) }
}

async function savePointRules() {
  try {
    const res = await fetch(`${API_BASE}/admin/points/rules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify(pointRules.value)
    })
    if (res.ok) {
      alert('积分规则已保存！')
      fetchDashboard()
    }
  } catch (e) { console.error(e) }
}

// 批量添加用户
function parseBatchInput() {
  const lines = batchInput.value.trim().split('\n').filter(l => l.trim())
  batchUsers.value = lines.map(line => {
    const parts = line.split(',').map(p => p.trim())
    return {
      phone: parts[0] || '',
      nickname: parts[1] || `用户${parts[0]?.slice(-4) || '新'}`,
      password: parts[2] || '123456',
      role: parts[3] || 'volunteer',
    }
  }).filter(u => u.phone)
}

async function submitBatchUsers() {
  if (batchUsers.value.length === 0) return
  try {
    const res = await fetch(`${API_BASE}/admin/users/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({ users: batchUsers.value })
    })
    const result = await res.json()
    alert(`成功 ${result.success?.length || 0} 人，失败 ${result.failed?.length || 0} 人`)
    if (result.failed?.length > 0) {
      console.log('失败列表:', result.failed)
    }
    showBatchModal.value = false
    batchInput.value = ''
    batchUsers.value = []
    fetchUsers()
  } catch (e) { console.error(e) }
}

function handleLogout() {
  auth.logout()
  router.push('/')
}

function formatDate(date: string) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    volunteer: '志愿者', organization: '组织', skill_provider: '技能者',
    donor: '捐赠者', admin: '管理员',
  }
  return labels[role] || role
}

function getRoleBadgeClass(role: string) {
  const classes: Record<string, string> = {
    volunteer: 'bg-blue-100 text-blue-600',
    organization: 'bg-purple-100 text-purple-600',
    skill_provider: 'bg-green-100 text-green-600',
    donor: 'bg-yellow-100 text-yellow-600',
    admin: 'bg-red-100 text-red-600',
  }
  return classes[role] || 'bg-gray-100 text-gray-600'
}

function getStatusBadgeClass(status: string) {
  return status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
}

function getTaskStatusBadge(status: string) {
  const classes: Record<string, string> = {
    open: 'bg-blue-100 text-blue-600',
    in_progress: 'bg-yellow-100 text-yellow-600',
    completed: 'bg-green-100 text-green-600',
    cancelled: 'bg-gray-100 text-gray-600',
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

// 监听 Tab 切换
watch(activeTab, (tab) => {
  if (tab === 'users') fetchUsers()
  if (tab === 'tasks') fetchTasks()
  if (tab === 'teams') fetchTeams()
  if (tab === 'points') { fetchTransactions(); fetchDashboard() }
})

useHead({ title: '管理后台 - HeartChain' })
</script>

<style scoped>
.input-field {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
}
.btn-primary {
  @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors;
}
.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors;
}
.badge {
  @apply px-2 py-1 text-xs rounded-full font-medium;
}
</style>
