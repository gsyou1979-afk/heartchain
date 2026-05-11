<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">广告管理中心</h1>
          <div class="flex gap-2">
            <button
              @click="activeTab = 'placements'"
              :class="tabClass('placements')"
            >
              广告位管理
            </button>
            <button
              @click="activeTab = 'campaigns'"
              :class="tabClass('campaigns')"
            >
              广告计划
            </button>
            <button
              @click="activeTab = 'projects'"
              :class="tabClass('projects')"
            >
              项目广告审核
            </button>
            <button
              @click="activeTab = 'statistics'"
              :class="tabClass('statistics')"
            >
              数据统计
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Ad Placements Tab -->
      <div v-if="activeTab === 'placements'" class="space-y-6">
        <!-- 位置说明地图 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">广告位位置说明</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border rounded-lg p-4">
              <div class="font-bold text-red-500 mb-2">首页 (Homepage)</div>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center space-x-2">
                  <span class="inline-block w-8 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-mono">A1</span>
                  <span>首页顶部横幅 (728×90) - 全站曝光最高</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-block w-8 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-mono">A2</span>
                  <span>首页中部推荐 (600×400) - 信息流插入</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-block w-8 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-mono">A3</span>
                  <span>首页底部 (728×90) - 页脚上方</span>
                </div>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <div class="font-bold text-blue-500 mb-2">侧边栏 (Sidebar)</div>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center space-x-2">
                  <span class="inline-block w-8 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono">S1</span>
                  <span>右侧边栏上 (300×250)</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-block w-8 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono">S2</span>
                  <span>右侧边栏下 (300×250)</span>
                </div>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <div class="font-bold text-green-500 mb-2">信息流 (Feed)</div>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center space-x-2">
                  <span class="inline-block w-8 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-mono">F1</span>
                  <span>信息流插入 (600×400)</span>
                </div>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <div class="font-bold text-purple-500 mb-2">开屏 (Splash)</div>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center space-x-2">
                  <span class="inline-block w-8 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-mono">H1</span>
                  <span>App开屏全屏 (1080×1920)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">广告位配置</h2>
            <button
              @click="openCreatePlacement"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              添加广告位
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">代码</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">位置</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">尺寸</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">底价(积分)</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="placement in placements" :key="placement.code">
                  <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">{{ placement.code }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ placement.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ placement.location }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ placement.width }}x{{ placement.height }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ placement.floorPrice }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="placement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 rounded-full text-xs">
                      {{ placement.status === 'active' ? '启用' : '禁用' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button @click="openEditPlacement(placement)" class="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                    <button @click="deletePlacement(placement.id)" class="text-red-600 hover:text-red-800">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Campaigns Tab -->
      <div v-if="activeTab === 'campaigns'" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">商业广告计划</h2>
            <button
              @click="openCampaignModal"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              创建广告计划
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div class="text-sm opacity-80">进行中</div>
              <div class="text-3xl font-bold mt-2">{{ stats.activeCampaigns }}</div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div class="text-sm opacity-80">今日消耗</div>
              <div class="text-3xl font-bold mt-2">{{ stats.todaySpend }}</div>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div class="text-sm opacity-80">今日点击</div>
              <div class="text-3xl font-bold mt-2">{{ stats.todayClicks }}</div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">计划名称</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">广告主</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">预算</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">已消耗</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">曝光</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">点击</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="campaign in campaigns" :key="campaign.id">
                  <td class="px-6 py-4">{{ campaign.name }}</td>
                  <td class="px-6 py-4">{{ campaign.advertiserName }}</td>
                  <td class="px-6 py-4">{{ campaign.budget }}</td>
                  <td class="px-6 py-4">{{ campaign.spent }}</td>
                  <td class="px-6 py-4">{{ campaign.impressions }}</td>
                  <td class="px-6 py-4">{{ campaign.clicks }}</td>
                  <td class="px-6 py-4">
                    <span :class="{
                      'bg-green-100 text-green-800': campaign.status === 'active',
                      'bg-yellow-100 text-yellow-800': campaign.status === 'pending',
                      'bg-gray-100 text-gray-800': campaign.status === 'paused'
                    }" class="px-2 py-1 rounded-full text-xs">
                      {{ getStatusText(campaign.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Project Ads Review Tab -->
      <div v-if="activeTab === 'projects'" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">项目广告审核</h2>
            <div class="flex gap-2">
              <select v-model="projectFilter" class="px-4 py-2 border rounded-lg">
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
                <option value="all">全部</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-semibold text-lg">{{ project.title }}</h3>
                  <p class="text-sm text-gray-500">申请人: {{ project.applicantName }}</p>
                </div>
                <span :class="{
                  'bg-yellow-100 text-yellow-800': project.status === 'pending',
                  'bg-green-100 text-green-800': project.status === 'active',
                  'bg-red-100 text-red-800': project.status === 'rejected'
                }" class="px-2 py-1 rounded-full text-xs">
                  {{ getProjectStatusText(project.status) }}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <div class="text-gray-500">目标金额</div>
                  <div class="font-semibold">{{ project.targetAmount }}元</div>
                </div>
                <div>
                  <div class="text-gray-500">紧急程度</div>
                  <div class="font-semibold">{{ project.urgencyLevel }}级</div>
                </div>
                <div>
                  <div class="text-gray-500">剩余天数</div>
                  <div class="font-semibold">{{ project.daysRemaining }}天</div>
                </div>
              </div>

              <div v-if="project.status === 'pending'" class="flex gap-2">
                <button
                  @click="approveProject(project.id)"
                  class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  通过
                </button>
                <button
                  @click="rejectProject(project.id)"
                  class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  拒绝
                </button>
              </div>

              <div v-else-if="project.status === 'active'" class="flex gap-2">
                <button
                  @click="boostProject(project.id)"
                  class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  置顶推广
                </button>
                <button
                  @click="pauseProject(project.id)"
                  class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  暂停
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Tab -->
      <div v-if="activeTab === 'statistics'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-500">今日总曝光</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalImpressions }}</div>
            <div class="text-sm text-green-600 mt-1">+{{ stats.impressionsGrowth }}%</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-500">今日总点击</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalClicks }}</div>
            <div class="text-sm text-green-600 mt-1">+{{ stats.clicksGrowth }}%</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-500">今日总收入</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ stats.todayRevenue }}</div>
            <div class="text-sm text-green-600 mt-1">+{{ stats.revenueGrowth }}%</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-sm text-gray-500">活跃项目</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ stats.activeProjects }}</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">广告类型分布</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>项目广告（求助）</span>
                <span>{{ stats.projectAdPercentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full" :style="{ width: stats.projectAdPercentage + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>公益广告</span>
                <span>{{ stats.charityAdPercentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" :style="{ width: stats.charityAdPercentage + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>商业广告</span>
                <span>{{ stats.commercialAdPercentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" :style="{ width: stats.commercialAdPercentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Placement Modal -->
    <div v-if="showPlacementModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">{{ editingCode ? '编辑广告位' : '添加广告位' }}</h3>
        <form @submit.prevent="savePlacement">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">广告位代码</label>
              <input v-model="newPlacement.code" type="text" class="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="如: A1, S1" required :disabled="!!editingCode" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">名称</label>
              <input v-model="newPlacement.name" type="text" class="mt-1 block w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">位置（尺寸自动匹配）</label>
              <select v-model="newPlacement.location" class="mt-1 block w-full border rounded-lg px-3 py-2">
                <option value="homepage-top">首页顶部横幅 (728×90)</option>
                <option value="homepage-middle">首页中部推荐 (600×400)</option>
                <option value="homepage-bottom">首页底部 (728×90)</option>
                <option value="sidebar-top">右侧边栏上 (300×250)</option>
                <option value="sidebar-bottom">右侧边栏下 (300×250)</option>
                <option value="feed">信息流插入 (600×400)</option>
                <option value="splash">App开屏全屏 (1080×1920)</option>
              </select>
            </div>
            <!-- 尺寸预览 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-500 mb-2">预览框</div>
              <div 
                class="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
                :style="previewStyle"
              >
                <template v-if="newPlacement.imageUrl">
                  <img :src="newPlacement.imageUrl" class="w-full h-full object-cover" />
                </template>
                <template v-else>
                  <span class="text-gray-400 text-sm">点击下方上传图片</span>
                </template>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">广告图片</label>
              <input 
                type="file" 
                accept="image/*" 
                @change="handleImageUpload" 
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-500 hover:file:bg-red-100"
              />
              <input
                v-model="newPlacement.imageUrl"
                type="text"
                class="mt-2 block w-full border rounded-lg px-3 py-2"
                placeholder="或直接输入图片URL"
              />
            </div>
            <!-- 已上传图片选择 -->
            <div v-if="availableImages.length > 0" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">📁 选择已上传的图片</label>
              <div class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                <div
                  v-for="(img, idx) in availableImages"
                  :key="idx"
                  @click="selectImage(img.url)"
                  class="cursor-pointer border-2 rounded overflow-hidden hover:border-red-500 transition"
                  :class="newPlacement.imageUrl === img.url ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'"
                >
                  <img :src="img.url" class="w-full h-20 object-cover" :alt="img.description" />
                  <div class="text-xs text-gray-500 truncate px-1">{{ img.description }}</div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">目标链接</label>
              <input v-model="newPlacement.targetUrl" type="url" class="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="https://" />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">保存</button>
            <button type="button" @click="showPlacementModal = false" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Campaign Modal -->
    <div v-if="showCampaignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-semibold mb-4">创建广告计划</h3>
        <form @submit.prevent="createCampaign">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">计划名称</label>
              <input v-model="newCampaign.name" type="text" class="mt-1 block w-full border rounded-lg px-3 py-2" required />
            </div>
            <!-- 广告图片 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">广告图片</label>
              <div v-if="newCampaign.imageUrl" class="mt-1 mb-2 relative inline-block">
                <img :src="newCampaign.imageUrl" class="max-w-full max-h-40 rounded-lg border" />
                <button type="button" @click="newCampaign.imageUrl = ''" class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs hover:bg-black/80">×</button>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                @change="handleCampaignImageUpload" 
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-500 hover:file:bg-red-100"
              />
              <input
                v-model="newCampaign.imageUrl"
                type="text"
                class="mt-2 block w-full border rounded-lg px-3 py-2"
                placeholder="或直接输入图片URL"
              />
            </div>
            <!-- 已上传图片选择 -->
            <div v-if="availableImages.length > 0" class="mt-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">📁 从素材库选择图片</label>
              <div class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                <div
                  v-for="(img, idx) in availableImages"
                  :key="idx"
                  @click="newCampaign.imageUrl = img.url"
                  class="cursor-pointer border-2 rounded overflow-hidden hover:border-red-500 transition"
                  :class="newCampaign.imageUrl === img.url ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'"
                >
                  <img :src="img.url" class="w-full h-20 object-cover" :alt="img.description" />
                  <div class="text-xs text-gray-500 truncate px-1">{{ img.description }}</div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">目标URL</label>
              <input v-model="newCampaign.targetUrl" type="url" class="mt-1 block w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">广告类型</label>
              <select v-model="newCampaign.type" class="mt-1 block w-full border rounded-lg px-3 py-2">
                <option value="commercial">商业广告</option>
                <option value="charity">公益广告</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">每日预算(积分)</label>
              <input v-model.number="newCampaign.dailyBudget" type="number" class="mt-1 block w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">出价(积分/曝光)</label>
              <input v-model.number="newCampaign.bidAmount" type="number" step="0.01" class="mt-1 block w-full border rounded-lg px-3 py-2" required />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">创建</button>
            <button type="button" @click="showCampaignModal = false" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()
const API_BASE = useRuntimeConfig().public.apiBase || 'https://heartchain-backend.onrender.com/api/v1/ad'

const activeTab = ref('placements')
const projectFilter = ref('pending')
const showPlacementModal = ref(false)
const showCampaignModal = ref(false)
const editingCode = ref<string | null>(null)

// 广告位列表（从API加载）
const placements = ref<any[]>([])

const campaigns = ref<any[]>([])
const projects = ref<any[]>([])

const stats = ref({
  activeCampaigns: 0, todaySpend: 0, todayClicks: 0,
  totalImpressions: 0, impressionsGrowth: 0,
  totalClicks: 0, clicksGrowth: 0,
  todayRevenue: 0, revenueGrowth: 0,
  activeProjects: 0,
  projectAdPercentage: 55, charityAdPercentage: 30, commercialAdPercentage: 15,
})

const newPlacement = ref({
  code: '', name: '', location: 'homepage-top',
  imageUrl: '', targetUrl: '',
})
const availableImages = ref<any[]>([])

const newCampaign = ref({
  name: '', targetUrl: '', type: 'commercial',
  dailyBudget: 100, bidAmount: 0.1, imageUrl: '',
})

// 生命周期
onMounted(async () => {
  await auth.restore()
  if (!auth.isLoggedIn || auth.user?.role !== 'admin') {
    router.push('/')
    return
  }
  await loadPlacements()
  await loadProjects()
  await loadStats()
})

// ========== 广告位 CRUD ==========
async function loadPlacements() {
  try {
    const res = await fetch(`${API_BASE}/placements`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      placements.value = await res.json()
    }
  } catch (e) { console.error('加载广告位失败', e) }
}

function openCreatePlacement() {
  editingCode.value = null
  newPlacement.value = { code: '', name: '', location: 'homepage-top', imageUrl: '', targetUrl: '' }
  showPlacementModal.value = true
  loadAvailableImages()
}

function openEditPlacement(p: any) {
  editingCode.value = p.id
  newPlacement.value = { ...p, location: 'homepage-top' }
  showPlacementModal.value = true
  loadAvailableImages()
}

async function savePlacement() {
  try {
    const loc = newPlacement.value.location || 'homepage-top'
    const size = sizeMap[loc] || { width: 728, height: 90 }

    // 前端 location 值 → 后端 platform/page/position 映射
    const locationMapping: Record<string, { platform: string; page: string; position: string }> = {
      'homepage-top': { platform: 'web', page: 'home', position: 'hero' },
      'homepage-middle': { platform: 'web', page: 'home', position: 'feed' },
      'homepage-bottom': { platform: 'web', page: 'home', position: 'footer' },
      'sidebar-top': { platform: 'web', page: 'home', position: 'sidebar' },
      'sidebar-bottom': { platform: 'web', page: 'home', position: 'sidebar' },
      'feed': { platform: 'web', page: 'home', position: 'feed' },
      'splash': { platform: 'android', page: 'splash', position: 'splash' },
    }
    const mapping = locationMapping[loc] || { platform: 'web', page: 'home', position: 'hero' }

    // 构造后端 DTO 格式
    const payload = {
      code: newPlacement.value.code,
      name: newPlacement.value.name,
      description: `${newPlacement.value.name} - ${loc}`,
      platform: mapping.platform,
      page: mapping.page,
      position: mapping.position,
      width: size.width,
      height: size.height,
      supportedTypes: ['commercial', 'public_service', 'project'],
      floorCpm: 0,
      isActive: true,
    }

    const url = editingCode.value
      ? `${API_BASE}/placements/${editingCode.value}`
      : `${API_BASE}/placements`
    const method = editingCode.value ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      showPlacementModal.value = false
      await loadPlacements()
      alert(editingCode.value ? '更新成功' : '添加成功')
    } else {
      const err = await res.json().catch(() => ({ message: '操作失败' }))
      alert(err.message || `错误 (${res.status})`)
    }
  } catch (e: any) {
    console.error('保存广告位失败', e)
    alert('网络错误: ' + (e?.message || '请检查后端服务是否运行'))
  }
}

async function deletePlacement(id: string) {
  if (!confirm('确定删除该广告位？此操作不可撤销！')) return
  try {
    const res = await fetch(`${API_BASE}/placements/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      await loadPlacements()
    } else {
      const err = await res.json()
      alert(err.message || '删除失败')
    }
  } catch (e) {
    console.error('删除广告位失败', e)
    alert('网络错误')
  }
}

// ========== 广告计划 ==========
async function loadCampaigns() {
  try {
    const res = await fetch(`${API_BASE}/campaigns`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) campaigns.value = await res.json()
  } catch (e) { console.error(e) }
}

async function createCampaign() {
  try {
    // 构造后端 CreateAdCampaignDto 格式
    const payload = {
      advertiserId: auth.user?.id || '',
      name: newCampaign.value.name,
      adType: newCampaign.value.type === 'charity' ? 'public_service' : 'commercial',
      imageUrl: newCampaign.value.imageUrl,
      pricingModel: 'cpm',
      budgetDaily: newCampaign.value.dailyBudget,
      budgetTotal: newCampaign.value.dailyBudget * 30,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targeting: {
        interests: [],
        frequency: { daily: 10 },
      },
      placements: ['A1', 'B1', 'C1'],
    }
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      showCampaignModal.value = false
      alert('广告计划创建成功')
      await loadCampaigns()
    } else {
      const err = await res.json().catch(() => ({ message: '创建失败' }))
      alert(err.message || `错误 (${res.status})`)
    }
  } catch (e: any) {
    console.error('创建广告计划失败', e)
    alert('网络错误: ' + (e?.message || '请检查后端服务'))
  }
}

// 打开 Campaign 模态框时加载素材库
function openCampaignModal() {
  newCampaign.value = { name: '', targetUrl: '', type: 'commercial', dailyBudget: 100, bidAmount: 0.1, imageUrl: '' }
  showCampaignModal.value = true
  loadAvailableImages()
}

// ========== 项目广告审核 ==========
async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/project-ads`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) projects.value = await res.json()
  } catch (e) { console.error(e) }
}

const filteredProjects = computed(() => {
  if (projectFilter.value === 'all') return projects.value
  return projects.value.filter(p => p.status === projectFilter.value)
})

async function approveProject(id: number) {
  try {
    const res = await fetch(`${API_BASE}/project-ads/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      alert('审核已通过')
      await loadProjects()  // 重新加载，刷新列表
    } else {
      const err = await res.json()
      alert(err.message || '操作失败')
    }
  } catch (e) {
    console.error('审核失败', e)
    alert('网络错误')
  }
}

async function rejectProject(id: number) {
  try {
    const res = await fetch(`${API_BASE}/project-ads/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      alert('已拒绝')
      await loadProjects()
    }
  } catch (e) { console.error(e) }
}

// ========== 统计 ==========
async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/reports/summary`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) stats.value = await res.json()
  } catch (e) { console.error(e) }
}

// ========== 图片上传 ==========
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  // 简单的Base64预览（生产环境应该上传到服务器）
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      newPlacement.value.imageUrl = result
    }
  }
  reader.readAsDataURL(file)
}

// 加载已上传图片列表
async function loadAvailableImages() {
  try {
    const res = await fetch('/ads/images.json')
    if (res.ok) {
      availableImages.value = await res.json()
    }
  } catch (e) {
    console.error('加载图片列表失败', e)
  }
}

// 选择图片
function selectImage(url: string) {
  newPlacement.value.imageUrl = url
}

// Campaign 图片上传
function handleCampaignImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      newCampaign.value.imageUrl = result
    }
  }
  reader.readAsDataURL(file)
}

// 尺寸映射
const sizeMap: Record<string, {width: number, height: number}> = {
  'homepage-top': { width: 728, height: 90 },
  'homepage-middle': { width: 600, height: 400 },
  'homepage-bottom': { width: 728, height: 90 },
  'sidebar-top': { width: 300, height: 250 },
  'sidebar-bottom': { width: 300, height: 250 },
  'feed': { width: 600, height: 400 },
  'splash': { width: 1080, height: 1920 },
}

const previewStyle = computed(() => {
  const size = sizeMap[newPlacement.value.location] || { width: 300, height: 250 }
  const scale = Math.min(200 / size.width, 100 / size.height)
  return {
    width: `${Math.round(size.width * scale)}px`,
    height: `${Math.round(size.height * scale)}px`,
    minWidth: '200px',
    minHeight: '60px',
  }
})

// ========== 工具函数 ==========
const tabClass = (tab: string) => {
  return activeTab.value === tab
    ? 'px-4 py-2 bg-red-500 text-white rounded-lg'
    : 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = { active: '进行中', pending: '待审核', paused: '已暂停', completed: '已完成' }
  return map[status] || status
}

const getProjectStatusText = (status: string) => {
  const map: Record<string, string> = { pending: '待审核', active: '已通过', rejected: '已拒绝', paused: '已暂停', completed: '已完成' }
  return map[status] || status
}

async function boostProject(id: string) {
  try {
    // 通过提高 priorityScore 来实现置顶推广
    const res = await fetch(`${API_BASE}/project-ads/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ priorityScore: 100 }),
    })
    if (res.ok) {
      alert('已置顶推广')
      await loadProjects()
    } else {
      const err = await res.json()
      alert(err.message || '操作失败')
    }
  } catch (e) {
    console.error('置顶推广失败', e)
    alert('网络错误')
  }
}

async function pauseProject(id: string) {
  try {
    const res = await fetch(`${API_BASE}/project-ads/${id}/pause`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      alert('已暂停')
      await loadProjects()
    } else {
      const err = await res.json()
      alert(err.message || '操作失败')
    }
  } catch (e) {
    console.error('暂停失败', e)
    alert('网络错误')
  }
}
</script>
