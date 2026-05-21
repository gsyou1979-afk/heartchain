<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">广告管理中心</h1>
          <div class="flex gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="tabClass(tab.key)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- ==================== 广告位管理 ==================== -->
      <div v-if="activeTab === 'placements'" class="space-y-6">
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b flex justify-between items-center">
            <h2 class="text-lg font-semibold">广告位配置</h2>
            <button @click="openPlacementModal(null)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
              添加广告位
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">代码</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">位置</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">图片尺寸</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="p in sortedPlacements" :key="p.code">
                  <td class="px-4 py-3 font-mono font-semibold text-red-600">{{ p.code }}</td>
                  <td class="px-4 py-3">{{ p.name }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ getPositionText(p) }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ p.width }}×{{ p.height }}</td>
                  <td class="px-4 py-3">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        :checked="!!p.isActive"
                        @change="togglePlacementActive(p, $event)"
                        class="sr-only peer"
                      />
                      <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      <span class="ml-2 text-xs font-semibold" :class="p.isActive ? 'text-green-600' : 'text-gray-400'">
                        {{ p.isActive ? '启用' : '禁用' }}
                      </span>
                    </label>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button @click="openPlacementModal(p)" class="text-blue-600 hover:text-blue-800 text-sm mr-3">编辑</button>
                    <button @click="deletePlacement(p.id)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
                  </td>
                </tr>
                <tr v-if="sortedPlacements.length === 0">
                  <td colspan="6" class="px-4 py-8 text-center text-gray-400">暂无广告位，点击上方按钮添加</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ==================== 我的广告 ==================== -->
      <div v-if="activeTab === 'my-ads'" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold">我的广告</h2>
          <NuxtLink to="/admin/ads/publish" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
            + 发布广告
          </NuxtLink>
        </div>

        <div v-if="myCampaigns.length > 0" class="space-y-3">
          <div v-for="c in myCampaigns" :key="c.id" class="bg-white rounded-lg shadow p-4">
            <div class="flex items-start justify-between">
              <div class="flex gap-4">
                <div class="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img v-if="getCampaignThumb(c)" :src="getCampaignThumb(c)" class="w-full h-full object-cover" />
                  <span v-else class="text-gray-300 text-2xl">📷</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-900">{{ c.name }}</h3>
                    <span class="text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(c.status)">{{ getStatusText(c.status) }}</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ getAdTypeLabel(c.adType) }} · {{ c.placements?.join(', ') || '未设置位置' }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ formatDate(c.createdAt) }}
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button v-if="c.status === 'pending' && auth.user?.role === 'admin'" @click="updateCampaignStatus(c.id, 'active')" class="px-3 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100">审核通过</button>
                <button v-if="c.status === 'paused'" @click="updateCampaignStatus(c.id, 'active')" class="px-3 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100">启用</button>
                <button v-if="c.status === 'active'" @click="updateCampaignStatus(c.id, 'paused')" class="px-3 py-1 bg-yellow-50 text-yellow-600 rounded text-xs hover:bg-yellow-100">暂停</button>
                <button @click="deleteCampaign(c.id)" class="px-3 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">删除</button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          <div class="text-4xl mb-2">📢</div>
          <p>暂无广告，请先创建广告计划</p>
        </div>
      </div>

      <!-- ==================== 审核管理（仅管理员） ==================== -->
      <div v-if="activeTab === 'review' && auth.user?.role === 'admin'" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold">待审核广告</h2>
          <span class="text-sm text-gray-500">共 {{ pendingCampaigns.length }} 条待审核</span>
        </div>

        <div v-if="pendingCampaigns.length > 0" class="space-y-3">
          <div v-for="c in pendingCampaigns" :key="c.id" class="bg-white rounded-lg shadow p-4">
            <div class="flex items-start justify-between">
              <div class="flex gap-4">
                <div class="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img v-if="getCampaignThumb(c)" :src="getCampaignThumb(c)" class="w-full h-full object-cover" />
                  <span v-else class="text-gray-300 text-2xl">📷</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-900">{{ c.name }}</h3>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">待审核</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ getAdTypeLabel(c.adType) }} · {{ c.placements?.join(', ') || '未设置位置' }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    提交时间: {{ formatDate(c.createdAt) }}
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="reviewCampaign(c.id, 'approve')" class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">通过</button>
                <button @click="reviewCampaign(c.id, 'reject')" class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">拒绝</button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          <div class="text-4xl mb-2">✅</div>
          <p>暂无待审核广告</p>
        </div>
      </div>

      <!-- ==================== 广告计划 ==================== -->
      <div v-if="activeTab === 'campaigns'" class="space-y-6">
        <!-- 创建按钮 -->
        <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold">广告计划列表</h2>
          <button @click="openCampaignModal(null)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
            创建广告计划
          </button>
        </div>

        <!-- 计划列表 -->
        <div v-if="campaigns.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="c in campaigns" :key="c.id" class="bg-white rounded-lg shadow p-4">
            <div class="flex gap-4">
              <!-- 缩略图 -->
              <div class="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img v-if="getCampaignThumb(c)" :src="getCampaignThumb(c)" class="w-full h-full object-cover" />
                <span v-else class="text-gray-300 text-2xl">📷</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <h3 class="font-semibold text-gray-900 truncate">{{ c.name }}</h3>
                  <span class="ml-2 text-xs px-2 py-0.5 rounded-full" :class="getStatusClass(c.status)">
                    {{ getStatusText(c.status) }}
                  </span>
                </div>
                <div class="mt-1 text-xs text-gray-500">
                  <span v-if="c.placements?.length">投放位置: {{ c.placements.join(', ') }}</span>
                  <span v-else>未设置投放位置</span>
                </div>
                <div class="mt-2 flex gap-2">
                  <button @click="openCampaignModal(c)" class="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100">编辑</button>
                  <button @click="deleteCampaign(c.id)" class="px-3 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          暂无广告计划，点击上方按钮创建
        </div>
      </div>

      <!-- ==================== 素材库 ==================== -->
      <div v-if="activeTab === 'media'" class="space-y-6">
        <!-- 上传区域 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">素材库</h2>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-500">共 {{ mediaAssets.length }} 个素材</span>
              <button @click="triggerMediaUpload" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                + 上传素材
              </button>
              <input ref="mediaFileInput" type="file" accept="image/*" multiple class="hidden" @change="handleMediaFileSelect" />
            </div>
          </div>

          <!-- 拖拽上传区 -->
          <div
            @click="triggerMediaUpload"
            @dragover.prevent="mediaDragOver = true"
            @dragleave="mediaDragOver = false"
            @drop.prevent="handleMediaDrop"
            class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
            :class="mediaDragOver ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'"
          >
            <div class="text-4xl mb-2">📁</div>
            <div class="text-gray-600">拖拽图片到此处，或点击上传</div>
            <div class="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF，单张最大 5MB</div>
          </div>
        </div>

        <!-- 素材列表 -->
        <div v-if="mediaAssets.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div v-for="asset in mediaAssets" :key="asset.id" class="bg-white rounded-lg shadow overflow-hidden group relative">
            <div class="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              <img :src="getAssetUrl(asset.url)" :alt="asset.fileName" class="w-full h-full object-cover" />
            </div>
            <div class="p-2">
              <div class="text-xs text-gray-600 truncate" :title="asset.fileName">{{ asset.fileName }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ formatFileSize(asset.size) }}</div>
            </div>
            <!-- 悬停操作 -->
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button @click="copyAssetUrl(asset.url)" class="px-3 py-1 bg-white text-gray-700 rounded text-xs hover:bg-gray-100">复制链接</button>
              <button @click="deleteAsset(asset.id)" class="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">删除</button>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          <div class="text-4xl mb-2">🖼️</div>
          <p>暂无素材，请先上传图片</p>
        </div>
      </div>

      <!-- ==================== 数据统计 ==================== -->
      <div v-if="activeTab === 'statistics'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-sm text-gray-500">广告总数</div>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalAds }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-sm text-gray-500">曝光次数</div>
            <div class="text-3xl font-bold text-blue-600 mt-2">{{ stats.totalImpressions }}</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-sm text-gray-500">点击次数</div>
            <div class="text-3xl font-bold text-green-600 mt-2">{{ stats.totalClicks }}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- ==================== 广告位弹窗 ==================== -->
    <div v-if="showPlacementModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto" style="max-height:88vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold">{{ editingPlacement ? '编辑广告位' : '添加广告位' }}</h3>
        </div>
        <form @submit.prevent="savePlacement" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告位代码</label>
            <input v-model="placementForm.code" type="text" class="w-full border rounded-lg px-3 py-2" placeholder="如: A1, B1" required :disabled="!!editingPlacement" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
            <input v-model="placementForm.name" type="text" class="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">位置</label>
            <select v-model="placementForm.location" class="w-full border rounded-lg px-3 py-2">
              <optgroup label="中间广告位">
                <option value="center-top">中间-上 / Hero横幅 (1200×400)</option>
                <option value="center-middle">中间-中 / 信息流 (600×400)</option>
                <option value="center-bottom">中间-下 / 底部通栏 (1200×150)</option>
              </optgroup>
              <optgroup label="左侧广告位">
                <option value="left-top">左侧-上 / A2 (300×250)</option>
                <option value="left-bottom">左侧-下 / A3 (300×250)</option>
              </optgroup>
              <optgroup label="右侧广告位">
                <option value="right-top">右侧-上 (300×250)</option>
                <option value="right-middle">右侧-中 (300×250)</option>
                <option value="right-bottom">右侧-下 (300×250)</option>
              </optgroup>
              <optgroup label="其他">
                <option value="splash">App开屏全屏 (1080×1920)</option>
              </optgroup>
            </select>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-xs text-gray-500">尺寸</div>
            <div class="font-mono font-semibold text-gray-700">{{ placementForm.width }}×{{ placementForm.height }}</div>
          </div>
          <div class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <div>
              <div class="text-sm font-medium text-gray-700">广告位状态</div>
              <div class="text-xs text-gray-400 mt-0.5">关闭后该广告位不会展示</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="placementForm.isActive" type="checkbox" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span class="ml-2 text-sm font-semibold" :class="placementForm.isActive ? 'text-green-600' : 'text-gray-400'">
                {{ placementForm.isActive ? '启用' : '禁用' }}
              </span>
            </label>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">保存</button>
            <button type="button" @click="showPlacementModal = false" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== 广告计划弹窗 ==================== -->
    <div v-if="showCampaignModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" style="max-height:88vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
        <div class="p-4 border-b sticky top-0 bg-white">
          <h3 class="text-lg font-semibold">{{ editingCampaign ? '编辑广告计划' : '创建广告计划' }}</h3>
        </div>
        <form @submit.prevent="saveCampaign" class="p-4 space-y-5">
          <!-- 广告名称 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告名称</label>
            <input v-model="campaignForm.name" type="text" class="w-full border rounded-lg px-3 py-2" placeholder="输入广告名称" required />
          </div>

          <!-- 轮播图片列表 -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700">轮播图片</label>
              <button type="button" @click="addCampaignImage" class="text-xs px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">+ 添加图片</button>
            </div>
            <div class="space-y-3">
              <div v-for="(img, idx) in campaignForm.items" :key="idx" class="border rounded-lg p-3">
                <div class="flex items-start gap-3">
                  <!-- 图片预览 -->
                  <div class="w-20 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img v-if="img.imageUrl" :src="img.imageUrl" class="w-full h-full object-cover" />
                    <span v-else class="text-gray-300 text-xl">📷</span>
                  </div>
                  <div class="flex-1 space-y-2">
                    <!-- 本地上传 -->
                    <input type="file" accept="image/*" @change="handleImageUpload(idx, $event)" class="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-red-50 file:text-red-500" />
                    <!-- URL输入 -->
                    <input v-model="img.imageUrl" type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="或输入图片URL" />
                  </div>
                  <button type="button" @click="removeCampaignImage(idx)" class="text-red-400 hover:text-red-600 text-lg flex-shrink-0">×</button>
                </div>
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs text-gray-500">跳转链接</label>
                    <input v-model="img.landingUrl" type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="https://（可留空）" />
                  </div>
                  <div>
                    <label class="text-xs text-gray-500">关联任务ID</label>
                    <input v-model="img.taskId" type="text" class="w-full border rounded px-2 py-1 text-xs" placeholder="选填（点击跳转任务）" />
                  </div>
                  <div class="col-span-2">
                    <label class="text-xs text-gray-500">轮播显示秒数</label>
                    <div class="flex items-center gap-2">
                      <input v-model.number="img.rotationSeconds" type="number" min="1" max="60" class="w-20 border rounded px-2 py-1 text-xs" />
                      <span class="text-xs text-gray-400">秒</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="campaignForm.items.length === 0" class="text-center py-4 text-gray-400 text-sm">
              暂无图片，点击上方「添加图片」上传
            </div>
          </div>

          <!-- 广告位置 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">投放广告位（单选）</label>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="p in placements"
                :key="p.code"
                @click="campaignForm.placementCode = p.code"
                class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                :class="campaignForm.placementCode === p.code ? 'border-red-500 bg-red-50' : 'border-gray-200'"
              >
                <input type="radio" :checked="campaignForm.placementCode === p.code" readonly class="rounded" />
                <div class="min-w-0">
                  <div class="text-xs font-mono font-semibold text-red-600">{{ p.code }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ p.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 状态 -->
          <div class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <div>
              <div class="text-sm font-medium text-gray-700">启用状态</div>
              <div class="text-xs text-gray-400 mt-0.5">关闭后该广告计划不会展示</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="campaignForm.isActive" type="checkbox" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span class="ml-2 text-sm font-semibold" :class="campaignForm.isActive ? 'text-green-600' : 'text-gray-400'">
                {{ campaignForm.isActive ? '启用' : '禁用' }}
              </span>
            </label>
          </div>

          <div class="flex gap-3">
            <button type="submit" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">保存</button>
            <button type="button" @click="showCampaignModal = false" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">取消</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { getApiUrl } from '~/utils/api'

const auth = useAuthStore()
const router = useRouter()
const API = getApiUrl() + '/ad'

// ========== 状态 ==========
const activeTab = ref('my-ads')
const tabs = computed(() => {
  const base = [
    { key: 'my-ads', label: '我的广告' },
    { key: 'placements', label: '广告位管理' },
    { key: 'media', label: '素材库' },
    { key: 'statistics', label: '数据统计' },
  ]
  // 只有管理员能看到审核管理
  if (auth.user?.role === 'admin') {
    base.splice(2, 0, { key: 'review', label: '审核管理' })
  }
  return base
})

const placements = ref<any[]>([])
const campaigns = ref<any[]>([])
const myCampaigns = ref<any[]>([])
const campaignItems = ref<Record<string, any[]>>({})
const stats = ref({ totalAds: 0, totalImpressions: 0, totalClicks: 0 })

// 广告位弹窗
const showPlacementModal = ref(false)
const editingPlacement = ref<any>(null)
const placementForm = ref({ code: '', name: '', location: 'center-top', isActive: true, width: 728, height: 90 })

// 广告计划弹窗
const showCampaignModal = ref(false)
const editingCampaign = ref<any>(null)
const campaignForm = ref({
  name: '',
  items: [] as any[],
  placementCode: '',  // 单选
  status: 'active',
  isActive: true,
})

// ========== 尺寸映射 ==========
const sizeMap: Record<string, { width: number; height: number }> = {
  // 左侧广告位
  'left-top':    { width: 300, height: 250 },
  'left-bottom': { width: 300, height: 250 },
  // 中间广告位
  'center-top':    { width: 1200, height: 400 },  // A1 Hero
  'center-middle': { width: 600, height: 400 },   // 信息流
  'center-bottom': { width: 1200, height: 150 },  // D1 底部通栏
  // 右侧广告位
  'right-top':    { width: 300, height: 250 },
  'right-middle': { width: 300, height: 250 },
  'right-bottom': { width: 300, height: 250 },
  // 兼容旧配置
  'homepage-top': { width: 1200, height: 400 },
  'homepage-middle': { width: 600, height: 400 },
  'homepage-bottom': { width: 1200, height: 150 },
  'sidebar': { width: 300, height: 250 },
  'sidebar-top': { width: 300, height: 250 },
  'sidebar-bottom': { width: 300, height: 250 },
  'feed': { width: 600, height: 400 },
  'splash': { width: 1080, height: 1920 },
};

// 监听 location 变化自动更新尺寸
watch(() => placementForm.value.location, (loc) => {
  const size = sizeMap[loc] || { width: 728, height: 90 }
  placementForm.value.width = size.width
  placementForm.value.height = size.height
}, { immediate: true })

// ========== 生命周期 ==========
onMounted(async () => {
  await auth.restore()
  if (!auth.isLoggedIn) {
    router.push('/')
    return
  }
  await Promise.all([loadPlacements(), loadCampaigns(), loadMyCampaigns(), loadStats(), loadMediaAssets()])
})

// ========== 数据加载 ==========
async function loadPlacements() {
  try {
    const res = await fetch(`${API}/placements/admin/all`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) placements.value = await res.json()
  } catch (e) { console.error('加载广告位失败', e) }
}

async function loadCampaigns() {
  try {
    const res = await fetch(`${API}/campaigns`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (!res.ok) return
    campaigns.value = await res.json()
    // 逐个加载每个计划的轮播图片
    for (const c of campaigns.value) {
      const r = await fetch(`${API}/items/campaign/${c.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      if (r.ok) {
        campaignItems.value[c.id] = await r.json()
      }
    }
  } catch (e) { console.error('加载广告计划失败', e) }
}

async function loadMyCampaigns() {
  try {
    const res = await fetch(`${API}/campaigns?advertiserId=${auth.user?.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (!res.ok) return
    myCampaigns.value = await res.json()
    for (const c of myCampaigns.value) {
      const r = await fetch(`${API}/items/campaign/${c.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      if (r.ok) campaignItems.value[c.id] = await r.json()
    }
  } catch (e) { console.error('加载我的广告失败', e) }
}

// 待审核广告列表
const pendingCampaigns = computed(() => {
  return campaigns.value.filter((c: any) => c.status === 'pending')
})

async function reviewCampaign(id: string, action: 'approve' | 'reject') {
  if (!confirm(action === 'approve' ? '确定通过该广告？' : '确定拒绝该广告？')) return
  try {
    const res = await fetch(`${API}/campaigns/${id}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ action }),
    })
    if (res.ok) {
      await loadCampaigns()
      alert(action === 'approve' ? '已通过' : '已拒绝')
    } else {
      const err = await res.json().catch(() => ({ message: '操作失败' }))
      alert(err.message || '操作失败')
    }
  } catch (e) {
    alert('网络错误，请重试')
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${API}/reports/summary`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) stats.value = await res.json()
  } catch (e) { console.error('加载统计失败', e) }
}

// ========== 素材库 ==========
const mediaAssets = ref<any[]>([])
const mediaDragOver = ref(false)
const mediaFileInput = ref<HTMLInputElement | null>(null)

async function loadMediaAssets() {
  try {
    const res = await fetch(`${API}/media`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) mediaAssets.value = await res.json()
  } catch (e) { console.error('加载素材库失败', e) }
}

function triggerMediaUpload() {
  mediaFileInput.value?.click()
}

function handleMediaFileSelect(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) addMediaFiles(Array.from(files))
}

function handleMediaDrop(e: DragEvent) {
  mediaDragOver.value = false
  const files = e.dataTransfer?.files
  if (files) addMediaFiles(Array.from(files))
}

async function addMediaFiles(files: File[]) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    if (file.size > 5 * 1024 * 1024) {
      alert(`文件 ${file.name} 超过5MB限制`)
      continue
    }
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string
      try {
        const res = await fetch(`${API}/media/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
          body: JSON.stringify({ imageData: base64Data, fileName: file.name }),
        })
        const data = await res.json()
        if (data.success) {
          await loadMediaAssets()
        } else {
          alert('上传失败：' + (data.message || '未知错误'))
        }
      } catch (err) {
        alert('上传失败，请重试')
      }
    }
    reader.readAsDataURL(file)
  }
}

function getAssetUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  // Database-stored images use /api/v1/ad/media/:id/data endpoint
  if (url.startsWith('/api/v1/')) return `${getApiUrl().replace('/api/v1', '')}${url}`
  // Prepend API base for local paths
  const base = getApiUrl().replace('/api/v1', '')
  return `${base}${url}`
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '未知'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function copyAssetUrl(url: string) {
  const fullUrl = url.startsWith('http') ? url : `${getApiUrl().replace('/api/v1', '')}${url}`
  navigator.clipboard.writeText(fullUrl).then(() => {
    alert('链接已复制')
  }).catch(() => {
    // Fallback
    const input = document.createElement('input')
    input.value = fullUrl
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    alert('链接已复制')
  })
}

async function deleteAsset(id: string) {
  if (!confirm('确定删除该素材？')) return
  try {
    const res = await fetch(`${API}/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (res.ok) {
      await loadMediaAssets()
    } else {
      alert('删除失败')
    }
  } catch (e) {
    alert('删除失败，请重试')
  }
}

// ========== 广告位 CRUD ==========
function openPlacementModal(p: any) {
  editingPlacement.value = p
  if (p) {
    const pos2loc: Record<string, string> = {
      hero: 'center-top', feed: 'center-middle', footer: 'center-bottom',
      sidebar: 'left-top', splash: 'splash',
      // 左侧广告位
      'left-top': 'left-top', 'left-bottom': 'left-bottom',
      // 中间广告位
      'center-top': 'center-top', 'center-middle': 'center-middle', 'center-bottom': 'center-bottom',
      // 右侧广告位
      'right-top': 'right-top', 'right-middle': 'right-middle', 'right-bottom': 'right-bottom',
    }
    const loc = pos2loc[p.position] || 'center-top'
    const size = sizeMap[loc] || { width: 728, height: 90 }
    placementForm.value = {
      code: p.code, name: p.name,
      location: loc,
      isActive: p.isActive ?? false,
      width: p.width || size.width,
      height: p.height || size.height,
    }
  } else {
    placementForm.value = { code: '', name: '', location: 'center-top', isActive: true }
  }
  showPlacementModal.value = true
}

async function savePlacement() {
  const loc = placementForm.value.location
  const size = sizeMap[loc] || { width: 728, height: 90 }
  const mapping: Record<string, any> = {
    // 左侧广告位
    'left-top':    { platform: 'web', page: 'home', position: 'left-top' },
    'left-bottom': { platform: 'web', page: 'home', position: 'left-bottom' },
    // 中间广告位
    'center-top':    { platform: 'web', page: 'home', position: 'hero' },
    'center-middle': { platform: 'web', page: 'home', position: 'feed' },
    'center-bottom': { platform: 'web', page: 'home', position: 'footer' },
    // 右侧广告位
    'right-top':    { platform: 'web', page: 'home', position: 'right-top' },
    'right-middle': { platform: 'web', page: 'home', position: 'right-middle' },
    'right-bottom': { platform: 'web', page: 'home', position: 'right-bottom' },
    // 兼容旧配置
    'homepage-top': { platform: 'web', page: 'home', position: 'hero' },
    'homepage-middle': { platform: 'web', page: 'home', position: 'feed' },
    'homepage-bottom': { platform: 'web', page: 'home', position: 'footer' },
    'sidebar': { platform: 'web', page: 'home', position: 'sidebar' },
    'sidebar-top': { platform: 'web', page: 'home', position: 'sidebar' },
    'sidebar-bottom': { platform: 'web', page: 'home', position: 'sidebar' },
    'feed': { platform: 'web', page: 'home', position: 'feed' },
    'splash': { platform: 'android', page: 'splash', position: 'splash' },
  }
  const m = mapping[loc] || mapping['center-top']
  const payload = {
    code: placementForm.value.code,
    name: placementForm.value.name,
    description: placementForm.value.name,
    platform: m.platform, page: m.page, position: m.position,
    width: size.width, height: size.height,
    supportedTypes: ['commercial', 'public_service', 'project'],
    floorCpm: 0,
    isActive: !!placementForm.value.isActive,
  }
  const url = editingPlacement.value
    ? `${API}/placements/${editingPlacement.value.id}`
    : `${API}/placements`
  const res = await fetch(url, {
    method: editingPlacement.value ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
    body: JSON.stringify(payload),
  })
  if (res.ok) {
    showPlacementModal.value = false
    await loadPlacements()
    alert(editingPlacement.value ? '更新成功' : '添加成功')
  } else {
    const err = await res.json().catch(() => ({ message: '操作失败' }))
    alert(err.message || `错误 (${res.status})`)
  }
}

async function togglePlacementActive(p: any, event: Event) {
  const target = event.target as HTMLInputElement
  const newVal = target.checked
  // Optimistic update
  p.isActive = newVal
  const res = await fetch(`${API}/placements/${p.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
    body: JSON.stringify({ isActive: newVal }),
  })
  if (!res.ok) {
    p.isActive = !newVal // Rollback
    const err = await res.json().catch(() => ({}))
    alert('状态更新失败: ' + (err.message || `HTTP ${res.status}`))
  }
}

async function deletePlacement(id: string) {
  if (!confirm('确定删除该广告位？')) return
  const res = await fetch(`${API}/placements/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${auth.token}` },
  })
  if (res.ok) {
    await loadPlacements()
  } else {
    alert('删除失败')
  }
}

// ========== 广告计划 CRUD ==========
function openCampaignModal(c: any) {
  editingCampaign.value = c
  if (c) {
    campaignForm.value = {
      name: c.name,
      items: campaignItems.value[c.id] ? [...campaignItems.value[c.id]] : [],
      placementCode: c.placements?.[0] || '',
      status: c.status || 'active',
      isActive: c.status === 'active',
    }
  } else {
    campaignForm.value = { name: '', items: [], placementCode: '', status: 'active', isActive: true }
  }
  showCampaignModal.value = true
}

function addCampaignImage() {
  campaignForm.value.items.push({
    imageUrl: '', landingUrl: '', taskId: '', rotationSeconds: 5, sortOrder: campaignForm.value.items.length,
  })
}

function removeCampaignImage(idx: number) {
  campaignForm.value.items.splice(idx, 1)
}

function handleImageUpload(idx: number, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Data = e.target?.result as string;
    try {
      // Upload to server to get a real URL (same pattern as publish.vue)
      const uploadRes = await fetch(`${API}/items/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Data, fileName: file.name }),
      });
      const uploadData = await uploadRes.json();
      if (uploadData.success && uploadData.url) {
        // Build full URL from relative path
        const fullUrl = uploadData.url.startsWith('http')
          ? uploadData.url
          : `${getApiUrl().replace('/api/v1', '')}${uploadData.url}`;
        campaignForm.value.items[idx].imageUrl = fullUrl;
      } else {
        // Fallback: use base64 if upload fails (not ideal but won't block user)
        campaignForm.value.items[idx].imageUrl = base64Data;
        console.warn('Server upload failed, using base64 fallback');
      }
    } catch (err) {
      // Fallback to base64 preview
      campaignForm.value.items[idx].imageUrl = base64Data;
      console.warn('Upload failed, using base64 fallback:', err);
    }
  };
  reader.readAsDataURL(file);
}

async function saveCampaign() {
  if (!campaignForm.value.name.trim()) { alert('请输入广告名称'); return }
  if (campaignForm.value.items.length === 0) { alert('请至少添加一张图片'); return }

  // 1. 保存/更新广告计划基本信息
  const payload = {
    advertiserId: auth.user?.id || '',
    name: campaignForm.value.name,
    adType: 'commercial',
    pricingModel: 'cpm',
    startDate: new Date().toISOString().split('T')[0],
    placements: campaignForm.value.placementCode ? [campaignForm.value.placementCode] : [],
    // New campaigns always go to 'pending' for review; editing preserves existing status
    status: isEditing ? (editingCampaign.value?.status || 'pending') : 'pending',
  }
  const isEditing = !!editingCampaign.value
  const url = isEditing ? `${API}/campaigns/${editingCampaign.value.id}` : `${API}/campaigns`
  const method = isEditing ? 'PUT' : 'POST'

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: '创建失败' }))
    alert(err.message || `错误 (${res.status})`)
    return
  }
  const savedCampaign = await res.json()

  // 2. 批量保存轮播图片
  const itemsPayload = campaignForm.value.items.map((item: any, idx: number) => ({
    campaignId: savedCampaign.id,
    imageUrl: item.imageUrl,
    landingUrl: item.landingUrl || '',
    taskId: item.taskId || null,
    rotationSeconds: item.rotationSeconds || 5,
    sortOrder: idx,
  }))
  await fetch(`${API}/items/campaign/${savedCampaign.id}/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
    body: JSON.stringify(itemsPayload),
  })

  showCampaignModal.value = false
  await loadCampaigns()
  await loadStats()
  alert(isEditing ? '更新成功' : '创建成功')
}

async function deleteCampaign(id: string) {
  if (!confirm('确定删除该广告计划？')) return
  const res = await fetch(`${API}/campaigns/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${auth.token}` },
  })
  if (res.ok) {
    await loadCampaigns()
    await loadStats()
  } else {
    const err = await res.json().catch(() => ({}))
    alert('删除失败: ' + (err.message || `HTTP ${res.status}`))
  }
}

// ========== 工具函数 ==========
const sortedPlacements = computed(() =>
  [...placements.value].sort((a, b) => (a.code > b.code ? 1 : -1)),
)

function getPositionText(p: any): string {
  const map: Record<string, string> = {
    // 原始位置
    hero: '首页顶部(A1)', feed: '首页中部(C1/C2)', footer: '首页底部(D1)',
    sidebar: '左侧边栏', splash: '开屏',
    // 左侧广告位
    'left-top': '左侧-上(A2)',
    'left-bottom': '左侧-下(A3)',
    // 中间广告位
    'center-top': '中间-上',
    'center-middle': '中间-中',
    'center-bottom': '中间-下',
    // 右侧广告位
    'right-top': '右侧-上',
    'right-middle': '右侧-中',
    'right-bottom': '右侧-下',
  }
  return map[p.position] || p.position || p.page || '未知'
}

function getCampaignThumb(c: any): string {
  return campaignItems.value[c.id]?.[0]?.imageUrl || ''
}

function getStatusText(status: string): string {
  const map: Record<string, string> = {
    active: '投放中', draft: '草稿', pending: '待审核',
    paused: '已暂停', completed: '已完成',
  }
  return map[status] || status
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    paused: 'bg-gray-100 text-gray-500',
    completed: 'bg-blue-100 text-blue-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

function getAdTypeLabel(type: string): string {
  const map: Record<string, string> = {
    commercial: '商业广告',
    public_service: '公益广告',
    recruitment: '招聘广告',
    school: '学校广告',
    project: '项目求助',
  }
  return map[type] || type
}

function formatDate(date: string): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('zh-CN');
}

async function updateCampaignStatus(id: string, status: string) {
  try {
    // Use /review endpoint for admin actions (PUT /status requires admin guard)
    const action = status === 'active' ? 'approve' : 'reject'
    const res = await fetch(`${API}/campaigns/${id}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      await loadMyCampaigns();
    } else {
      const err = await res.json().catch(() => ({ message: '操作失败' }));
      alert(err.message || '操作失败');
    }
  } catch (e) {
    console.error('更新状态失败', e);
  }
}

const tabClass = (key: string) =>
  activeTab.value === key
    ? 'px-4 py-2 bg-red-500 text-white rounded-lg'
    : 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
</script>
