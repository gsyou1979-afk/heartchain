<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">任务大厅</h1>
      <button @click="openPublishModal" class="btn-primary text-sm">发布任务</button>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input v-model="searchQuery" type="text" placeholder="搜索任务..." class="input-field flex-1" />
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="type in taskTypes"
          :key="type.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="activeType === type.value ? 'bg-red-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
          @click="activeType = type.value"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- Main Content + Sidebar -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left: Task List -->
      <div class="flex-1">
        <div v-if="loading" class="text-center py-12 text-gray-500">加载中...</div>
        <div v-else-if="filteredTasks.length === 0" class="text-center py-12 text-gray-400">
          暂无任务，发布第一个任务吧！
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <template v-for="(task, index) in filteredTasks" :key="task.id">
            <div class="card hover:shadow-md transition-shadow cursor-pointer" @click="viewTask(task)">
              <!-- 时间标签 -->
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded">
                  {{ formatTaskSchedule(task.schedule) }}
                </span>
                <span class="badge" :class="'badge-' + task.taskType">{{ getTaskTypeLabel(task.taskType) }}</span>
              </div>
              
              <h3 class="font-semibold mb-2">{{ task.title }}</h3>
              
              <!-- 技能标签 -->
              <div class="flex flex-wrap gap-1 mb-2">
                <span v-for="skill in task.requiredSkills?.slice(0, 3)" :key="skill" 
                      class="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {{ getSkillLabel(skill) }}
                </span>
                <span v-if="task.requiredSkills?.length > 3" class="text-xs text-gray-400">
                  +{{ task.requiredSkills.length - 3 }}
                </span>
              </div>
              
              <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ task.description }}</p>
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>{{ task.location || '不限地点' }}</span>
                <span class="text-red-500 font-medium">{{ task.pointsReward }} HRT</span>
              </div>
            </div>
            
            <!-- 每6个任务插入一个信息流广告 -->
            <div v-if="(index + 1) % 6 === 0" :key="'ad-' + index" class="md:col-span-2">
              <AdNativeFeed />
            </div>
          </template>
        </div>
      </div>

      <!-- Right: Sidebar Ad -->
      <div class="w-full lg:w-80 flex-shrink-0">
        <div class="sticky top-24">
          <AdSidebar />
        </div>
      </div>
    </div>

    <!-- Publish Task Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">📝 发布爱心任务</h2>
            <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <form @submit.prevent="publishTask" class="space-y-6">
            
            <!-- 1. 发布人信息 -->
            <div class="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
              <h3 class="font-semibold mb-3 flex items-center gap-2 text-red-700">
                <span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                发布人信息
              </h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">昵称：</span>
                  <span class="font-medium">{{ auth.user?.nickname || auth.user?.phone }}</span>
                </div>
                <div>
                  <span class="text-gray-500">联系方式：</span>
                  <span class="font-medium">{{ auth.user?.phone }}</span>
                </div>
              </div>
            </div>

            <!-- 2. 任务标题 -->
            <div>
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                任务标题 *
              </h3>
              <input v-model="form.title" type="text" class="input-field" 
                     placeholder="如：陪伴社区独居老人聊天" required 
                     minlength="5" maxlength="50" />
            </div>

            <!-- 3. 为什么要发布这个任务 -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <h3 class="font-semibold mb-3 flex items-center gap-2 text-blue-700">
                <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                💭 为什么要发布这个任务？
              </h3>
              <textarea v-model="form.whyPublish" class="input-field" rows="3" 
                        placeholder="请描述发布这个任务的初衷和目的，让志愿者了解任务背后的故事..."
                        maxlength="500"></textarea>
              <p class="text-xs text-gray-400 mt-1">{{ form.whyPublish?.length || 0 }}/500 字</p>
              <div class="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                💡 提示：分享您的故事，如"社区里有很多独居老人，他们的孩子都在外地工作..."
              </div>
            </div>

            <!-- 4. 受益人是谁 -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <h3 class="font-semibold mb-3 flex items-center gap-2 text-green-700">
                <span class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
                ❤️ 受益人是谁？与您/受益人的关系
              </h3>
              <div class="space-y-3">
                <div>
                  <label class="text-sm text-gray-600">受益人类型</label>
                  <select v-model="form.beneficiaryType" class="input-field mt-1">
                    <option value="">请选择</option>
                    <option value="elderly">独居老人</option>
                    <option value="children">留守儿童</option>
                    <option value="disabled">残障人士</option>
                    <option value="patients">病患家庭</option>
                    <option value="community">社区公共</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label class="text-sm text-gray-600">与受益人关系</label>
                  <input v-model="form.relationship" type="text" class="input-field mt-1" 
                         placeholder="如：我是社区志愿者负责人 / 这是我的邻居 / 公益组织合作" />
                </div>
                <div>
                  <label class="text-sm text-gray-600">受益人简介</label>
                  <textarea v-model="form.beneficiaryDesc" class="input-field mt-1" rows="2" 
                            placeholder="简要描述受益人的情况，让志愿者更了解帮助对象..."
                            maxlength="300"></textarea>
                </div>
              </div>
            </div>

            <!-- 5. 具体工作内容 -->
            <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
              <h3 class="font-semibold mb-3 flex items-center gap-2 text-purple-700">
                <span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">5</span>
                📋 具体工作内容 *
              </h3>
              <textarea v-model="form.description" class="input-field" rows="4" 
                        placeholder="详细描述志愿者需要做什么：&#10;- 具体任务步骤&#10;- 需要的工具或准备&#10;- 注意事项"
                        required maxlength="800"></textarea>
              <p class="text-xs text-gray-400 mt-1">{{ form.description?.length || 0 }}/800 字</p>
            </div>

            <!-- 6. 志愿者能得到什么 -->
            <div class="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-100">
              <h3 class="font-semibold mb-3 flex items-center gap-2 text-yellow-700">
                <span class="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm">6</span>
                🎁 志愿者将获得
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <label v-for="benefit in benefitOptions" :key="benefit.value"
                       class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors"
                       :class="form.benefits.includes(benefit.value)
                         ? 'bg-yellow-100 border border-yellow-300 text-yellow-700'
                         : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'">
                  <input type="checkbox" :value="benefit.value" v-model="form.benefits" class="hidden" />
                  <span>{{ benefit.icon }}</span>
                  <span class="text-sm">{{ benefit.label }}</span>
                </label>
              </div>
              <div class="mt-3">
                <label class="text-sm text-gray-600">其他承诺（可选）</label>
                <input v-model="form.otherBenefits" type="text" class="input-field mt-1" 
                       placeholder="如：提供午餐、交通补贴、专业培训等" />
              </div>
            </div>

            <!-- 7. 发布人的承诺 -->
            <div class="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-lg border border-cyan-100">
              <h3 class="font-semibold mb-3 flex items-center gap-2 text-cyan-700">
                <span class="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm">7</span>
                🤝 发布人承诺
              </h3>
              <div class="space-y-2">
                <label v-for="promise in promiseOptions" :key="promise.value"
                       class="flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors"
                       :class="form.promises.includes(promise.value)
                         ? 'bg-cyan-100 border border-cyan-300 text-cyan-700'
                         : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'">
                  <input type="checkbox" :value="promise.value" v-model="form.promises" class="mt-0.5" />
                  <span class="text-sm">{{ promise.label }}</span>
                </label>
              </div>
              <div class="mt-3">
                <label class="text-sm text-gray-600">其他承诺（可选）</label>
                <input v-model="form.otherPromises" type="text" class="input-field mt-1" 
                       placeholder="如：活动结束后提供证书、优先参与其他活动等" />
              </div>
            </div>

            <!-- 8. 任务类型 -->
            <div>
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">8</span>
                任务类型 *
              </h3>
              <select v-model="form.taskType" class="input-field" required>
                <option value="">选择任务类型</option>
                <option value="single_once">🧑 单人单次任务</option>
                <option value="single_multi">🧑 单人多次任务</option>
                <option value="team_once">👥 团队单次任务</option>
                <option value="team_multi">👥 团队多次任务</option>
              </select>
              <!-- 团队任务人数输入 -->
              <div v-if="form.taskType === 'team_once' || form.taskType === 'team_multi'" class="mt-3 flex items-center gap-2">
                <label class="text-sm text-gray-600">需要人数：</label>
                <input v-model.number="form.teamSize" type="number" min="2" max="50" class="input-field w-24" placeholder="2-50" />
                <span class="text-sm text-gray-500">人</span>
              </div>
            </div>

            <!-- 9. 所需技能 -->
            <div>
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">9</span>
                所需技能 *
              </h3>
              
              <div class="flex flex-wrap gap-2">
                <label v-for="skill in allSkills" :key="skill.value"
                       class="flex items-center gap-1 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                       :class="form.requiredSkills.includes(skill.value)
                         ? 'bg-red-100 text-red-600 border border-red-300'
                         : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'">
                  <input type="checkbox" :value="skill.value" v-model="form.requiredSkills" class="hidden" />
                  {{ skill.label }}
                  <span v-if="skill.multiplier !== 1" class="text-xs opacity-70">(×{{ skill.multiplier }})</span>
                </label>
              </div>
            </div>

            <!-- 10. 任务时间 -->
            <div>
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">10</span>
                任务时间
              </h3>
              <div class="space-y-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.scheduleType" value="once" class="text-red-500" />
                  <span>指定日期和时间段</span>
                </label>
                <div v-if="form.scheduleType === 'once'" class="ml-6 space-y-3">
                  <input v-model="form.date" type="date" class="input-field" :min="minDate" />
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm text-gray-500">从</span>
                    <select v-model="form.startHour" class="input-field w-20 text-center">
                      <option v-for="h in 12" :key="h" :value="h">{{ h }}</option>
                    </select>
                    <span>:</span>
                    <select v-model="form.startMinute" class="input-field w-20 text-center">
                      <option v-for="m in [0,5,10,15,20,25,30,35,40,45,50,55]" :key="m" :value="m">{{ m.toString().padStart(2,'0') }}</option>
                    </select>
                    <select v-model="form.startAmPm" class="input-field w-20 text-center">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <span class="text-sm text-gray-500 mx-2">到</span>
                    <select v-model="form.endHour" class="input-field w-20 text-center">
                      <option v-for="h in 12" :key="h" :value="h">{{ h }}</option>
                    </select>
                    <span>:</span>
                    <select v-model="form.endMinute" class="input-field w-20 text-center">
                      <option v-for="m in [0,5,10,15,20,25,30,35,40,45,50,55]" :key="m" :value="m">{{ m.toString().padStart(2,'0') }}</option>
                    </select>
                    <select v-model="form.endAmPm" class="input-field w-20 text-center">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="form.scheduleType" value="range" class="text-red-500" />
                  <span>时间区间</span>
                </label>
                <div v-if="form.scheduleType === 'range'" class="ml-6 space-y-3">
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-500 w-12">开始</span>
                    <input v-model="form.startDate" type="date" class="input-field flex-1" :min="minDate" />
                    <select v-model="form.startHourR" class="input-field w-20 text-center">\
                      <option v-for="h in 12" :key="'s'+h" :value="h">{{ h }}</option>\
                    </select>\
                    <span>:</span>\
                    <select v-model="form.startMinuteR" class="input-field w-20 text-center">\
                      <option v-for="m in [0,5,10,15,20,25,30,35,40,45,50,55]" :key="'sm'+m" :value="m">{{ m.toString().padStart(2,'0') }}</option>\
                    </select>\
                    <select v-model="form.startAmPmR" class="input-field w-20 text-center">\
                      <option value="AM">AM</option>\
                      <option value="PM">PM</option>\
                    </select>\
                  </div>\
                  <div class="flex items-center gap-3">\
                    <span class="text-sm text-gray-500 w-12">结束</span>\
                    <input v-model="form.endDate" type="date" class="input-field flex-1" :min="form.startDate || minDate" />\
                    <select v-model="form.endHourR" class="input-field w-20 text-center">\
                      <option v-for="h in 12" :key="'e'+h" :value="h">{{ h }}</option>\
                    </select>\
                    <span>:</span>\
                    <select v-model="form.endMinuteR" class="input-field w-20 text-center">\
                      <option v-for="m in [0,5,10,15,20,25,30,35,40,45,50,55]" :key="'em'+m" :value="m">{{ m.toString().padStart(2,'0') }}</option>\
                    </select>\
                    <select v-model="form.endAmPmR" class="input-field w-20 text-center">\
                      <option value="AM">AM</option>\
                      <option value="PM">PM</option>\
                    </select>\
                  </div>\
                </div>
              </div>
            </div>

            <!-- 11. 任务地点 -->
            <div>
              <h3 class="font-semibold mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">11</span>
                任务地点
              </h3>
              <input v-model="form.location" type="text" class="input-field" 
                     placeholder="如：首尔市江西区xxx养老院" />
              <p class="text-xs text-gray-400 mt-1">📍 详细地址或附近地标</p>
            </div>

            <!-- 12. 积分奖励 -->
            <div class="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
              <h3 class="font-semibold mb-3 flex items-center gap-2 text-red-700">
                <span class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">12</span>
                任务积分
              </h3>
              <div class="flex items-center gap-4 mb-3">
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">预计工时：</label>
                  <input v-model.number="estimatedHours" type="number" min="0.5" max="24" step="0.5" 
                         class="input-field w-20" @input="updatePointsPreview" />
                  <span class="text-sm text-gray-500">小时</span>
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">基础积分/小时：</label>
                  <span class="font-medium text-red-500">{{ baseHourlyRate }} HRT</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">奖励积分 = Σ(技能系数) × 基础积分 × 工时</span>
                <span class="text-2xl font-bold text-red-500">{{ calculatedPoints }} HRT</span>
              </div>
              <div v-if="form.requiredSkills.length > 0" class="mt-2 text-sm text-gray-500 flex flex-wrap gap-2">
                <span v-for="skill in form.requiredSkills" :key="skill" class="bg-red-100 px-2 py-0.5 rounded">
                  {{ getSkillLabel(skill) }} × {{ skillTypes.find(s => s.type === skill)?.multiplier || 1 }}
                </span>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{{ error }}</div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-4">
              <button type="button" @click="showModal = false" class="btn-secondary flex-1">取消</button>
              <button type="submit" class="btn-primary flex-1" :disabled="publishing || form.requiredSkills.length === 0">
                {{ publishing ? '发布中...' : '🌟 发布爱心任务' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-8 text-center max-w-sm">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">❤️</span>
        </div>
        <h3 class="text-xl font-bold mb-2">发布成功！</h3>
        <p class="text-gray-500 mb-4">感谢您发布爱心任务，您的善举将温暖更多人</p>
        <button @click="showSuccess = false" class="btn-primary">确定</button>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <div v-if="showTaskDetail && selectedTask" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showTaskDetail = false">
      <div class="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold">{{ selectedTask.title }}</h2>
            <button @click="showTaskDetail = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          
          <!-- Task Info -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2">
              <span class="badge" :class="'badge-' + selectedTask.taskType">{{ getTaskTypeLabel(selectedTask.taskType) }}</span>
              <span v-if="selectedTask.teamSize" class="text-sm text-gray-500">需要 {{ selectedTask.teamSize }} 人</span>
            </div>
            
            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-500">📅</span>
              <span>{{ formatTaskSchedule(selectedTask.schedule) }}</span>
            </div>
            
            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-500">📍</span>
              <span>{{ selectedTask.location || '不限地点' }}</span>
            </div>
            
            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-500">💰</span>
              <span class="text-red-500 font-medium">{{ selectedTask.pointsReward }} HRT</span>
            </div>
            
            <div class="flex flex-wrap gap-1">
              <span v-for="skill in selectedTask.requiredSkills" :key="skill"
                    class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                {{ getSkillLabel(skill) }}
              </span>
            </div>
            
            <div v-if="selectedTask.description" class="text-sm text-gray-600 mt-3">
              {{ selectedTask.description }}
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button v-if="auth.isLoggedIn && !isOwnTask(selectedTask) && !hasJoined(selectedTask)" 
                    @click="joinTask"
                    :disabled="joiningTask"
                    class="btn-primary flex-1">
              {{ joiningTask ? '参加中...' : '我要参加' }}
            </button>
            <button v-if="auth.isLoggedIn && hasJoined(selectedTask)"
                    class="btn-secondary flex-1 cursor-not-allowed opacity-50">
              已参加
            </button>
            <button v-if="auth.isLoggedIn && isOwnTask(selectedTask)"
                    class="btn-secondary flex-1 cursor-not-allowed opacity-50">
              我的任务
            </button>
            <button v-if="!auth.isLoggedIn"
                    @click="router.push('/auth/login')"
                    class="btn-primary flex-1">
              登录后参加
            </button>
            <button @click="showTaskDetail = false" class="btn-secondary flex-1">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getApiUrl } from '~/utils/api';
const auth = useAuthStore();
const router = useRouter();
const API_BASE = getApiUrl();

const showModal = ref(false);
const showSuccess = ref(false);
const showTaskDetail = ref(false);
const selectedTask = ref<any>(null);
const loading = ref(false);
const publishing = ref(false);
const error = ref('');
const tasks = ref<any[]>([]);
const searchQuery = ref('');
const activeType = ref('all');
const joiningTask = ref(false);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// 技能积分映射 - 默认值，会从后端加载
const SKILL_LABELS: Record<string, string> = {
  medical: '医疗护理',
  legal: '法律咨询',
  teaching: '教育培训',
  tech: '技术开发',
  design: '设计创意',
  translation: '翻译',
  driving: '驾驶运输',
  cooking: '烹饪',
  cleaning: '保洁',
  repair: '维修',
  security: '安保',
  elderly_care: '养老护理',
  childcare: '育儿',
  event: '活动策划',
  media: '媒体宣传',
};

// 技能列表 - 从后端加载
const skillTypes = ref<{ type: string; label: string; multiplier: number }[]>([]);

const allSkills = computed(() => skillTypes.value.map(s => ({
  value: s.type,
  label: s.label || s.type,
  multiplier: s.multiplier,
})));

// 基础积分和工时
const baseHourlyRate = ref(10);
const estimatedHours = ref(1);

// 积分计算：技能系数 × 基础积分 × 工时
const calculatedPoints = computed(() => {
  if (form.requiredSkills.length === 0) return 0;
  let totalMultiplier = 0;
  form.requiredSkills.forEach(skill => {
    const skillConfig = skillTypes.value.find(s => s.type === skill);
    totalMultiplier += skillConfig?.multiplier || 1;
  });
  return Math.round(baseHourlyRate.value * totalMultiplier * estimatedHours.value);
});

// 志愿者获得选项
const benefitOptions = [
  { value: 'experience', label: '志愿服务经验', icon: '📚' },
  { value: 'certificate', label: '志愿证明证书', icon: '📜' },
  { value: 'meal', label: '免费工作餐', icon: '🍽️' },
  { value: 'transport', label: '交通补贴', icon: '🚌' },
  { value: 'training', label: '专业技能培训', icon: '🎓' },
  { value: 'friendship', label: '结识新朋友', icon: '🤝' },
  { value: 'skill', label: '提升专业技能', icon: '💪' },
  { value: 'happiness', label: '帮助他人的快乐', icon: '😊' },
];

// 发布人承诺选项
const promiseOptions = [
  { value: 'safe', label: '提供安全保障措施' },
  { value: 'guide', label: '现场全程指导' },
  { value: 'materials', label: '提供所需材料工具' },
  { value: 'feedback', label: '及时反馈服务效果' },
  { value: 'recommend', label: '优先参与其他活动' },
  { value: 'respect', label: '尊重每一位志愿者' },
];

const form = reactive({
  title: '',
  taskType: '',
  requiredSkills: [] as string[],
  description: '',
  whyPublish: '',
  beneficiaryType: '',
  relationship: '',
  beneficiaryDesc: '',
  benefits: [] as string[],
  otherBenefits: '',
  promises: [] as string[],
  otherPromises: '',
  scheduleType: 'once',
  date: '',
  startHour: 9,
  startMinute: 0,
  startAmPm: 'AM',
  endHour: 5,
  endMinute: 0,
  endAmPm: 'PM',
  startDate: '',
  endDate: '',
  startHourR: 9,
  startMinuteR: 0,
  startAmPmR: 'AM',
  endHourR: 5,
  endMinuteR: 0,
  endAmPmR: 'PM',
  location: '',
  teamSize: 2,
});

function to24Hour(hour: number, ampm: string) {
  if (ampm === 'AM') {
    return hour === 12 ? 0 : hour;
  } else {
    return hour === 12 ? 12 : hour + 12;
  }
}

const taskTypes = [
  { value: 'all', label: '全部' },
  { value: 'single_once', label: '单人单次' },
  { value: 'single_multi', label: '单人多次' },
  { value: 'team_once', label: '团队单次' },
  { value: 'team_multi', label: '团队多次' },
];

function getTaskTypeLabel(type: string) {
  const labels: Record<string, string> = {
    single_once: '单人单次',
    single_multi: '单人多次',
    team_once: '团队单次',
    team_multi: '团队多次',
  };
  return labels[type] || type;
}

function getSkillLabel(skill: string) {
  // 优先从 skillTypes 获取标签
  const found = skillTypes.value.find(s => s.type === skill);
  if (found?.label) return found.label;
  // 回退到默认标签
  return SKILL_LABELS[skill] || skill;
}

function getSkillPoints(skill: string) {
  const skillConfig = skillTypes.value.find(s => s.type === skill);
  const multiplier = skillConfig?.multiplier || 1;
  return Math.round(baseHourlyRate.value * multiplier * estimatedHours.value);
}

function formatTaskSchedule(schedule: any) {
  if (!schedule) return '时间待定';
  let scheduleObj = schedule;
  if (typeof schedule === 'string') {
    try {
      scheduleObj = JSON.parse(schedule);
    } catch {
      return '时间待定';
    }
  }
  if (scheduleObj.type === 'once' && scheduleObj.date) {
    const date = new Date(scheduleObj.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    if (scheduleObj.startTime && scheduleObj.endTime) {
      return `${date} ${scheduleObj.startTime}-${scheduleObj.endTime}`;
    }
    return date;
  }
  if (scheduleObj.type === 'range' && scheduleObj.startDate && scheduleObj.endDate) {
    const start = new Date(scheduleObj.startDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    const end = new Date(scheduleObj.endDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    let result = `${start} 至 ${end}`;
    if (scheduleObj.startTime && scheduleObj.endTime) {
      result += ` ${scheduleObj.startTime}-${scheduleObj.endTime}`;
    }
    return result;
  }
  return '时间待定';
}

const filteredTasks = computed(() => {
  let result = tasks.value;
  result = result.filter(t => {
    if (t.status !== 'open') return false;
    if ((t.taskType === 'single_once' || t.taskType === 'single_multi') && t.assigneeId) {
      return false;
    }
    if ((t.taskType === 'team_once' || t.taskType === 'team_multi') && t.teamSize) {
      if (t.currentParticipants >= t.teamSize) {
        return false;
      }
    }
    return true;
  });
  
  if (activeType.value !== 'all') {
    result = result.filter(t => t.taskType === activeType.value);
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.requiredSkills?.some((s: string) => getSkillLabel(s).toLowerCase().includes(query))
    );
  }
  return result;
});

function viewTask(task: any) {
  selectedTask.value = task;
  showTaskDetail.value = true;
}

async function joinTask() {
  if (!auth.isLoggedIn || !selectedTask.value) return;
  
  joiningTask.value = true;
  try {
    const res = await fetch(`${API_BASE}/tasks/${selectedTask.value.id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    });
    
    if (res.ok) {
      alert('参加成功！可在"我的任务"中查看');
      showTaskDetail.value = false;
      fetchTasks();
    } else {
      const data = await res.json();
      alert(data.message || '参加失败');
    }
  } catch (e) {
    alert('网络错误，请重试');
  } finally {
    joiningTask.value = false;
  }
}

function isOwnTask(task: any) {
  return auth.user?.id === task.publisherId;
}

function hasJoined(task: any) {
  return task.assigneeId === auth.user?.id;
}

async function fetchTasks() {
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (res.ok) {
      const data = await res.json();
      tasks.value = data.items || data || [];
    }
  } catch (e) {
    console.error('获取任务失败', e);
  } finally {
    loading.value = false;
  }
}

function openPublishModal() {
  if (!auth.isLoggedIn) {
    router.push('/auth/login');
    return;
  }
  showModal.value = true;
}

async function publishTask() {
  if (!form.title || !form.taskType || form.requiredSkills.length === 0) {
    error.value = '请填写必填项（任务类型、所需技能、任务标题）';
    return;
  }

  publishing.value = true;
  error.value = '';

  try {
    let schedule = null;
    if (form.scheduleType === 'once' && form.date) {
      const startH = to24Hour(form.startHour, form.startAmPm);
      const endH = to24Hour(form.endHour, form.endAmPm);
      const startTimeStr = `${startH.toString().padStart(2,'0')}:${form.startMinute.toString().padStart(2,'0')}`;
      const endTimeStr = `${endH.toString().padStart(2,'0')}:${form.endMinute.toString().padStart(2,'0')}`;
      schedule = {
        type: 'once',
        date: form.date,
        startTime: startTimeStr,
        endTime: endTimeStr,
      };
    } else if (form.scheduleType === 'range' && form.startDate && form.endDate) {
      const startH = to24Hour(form.startHourR, form.startAmPmR);
      const endH = to24Hour(form.endHourR, form.endAmPmR);
      const startTimeStr = `${startH.toString().padStart(2,'0')}:${form.startMinuteR.toString().padStart(2,'0')}`;
      const endTimeStr = `${endH.toString().padStart(2,'0')}:${form.endMinuteR.toString().padStart(2,'0')}`;
      schedule = {
        type: 'range',
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
      };
    }

    // 构建扩展描述（包含所有新字段）
    let extendedDescription = form.description || '';
    if (form.whyPublish) {
      extendedDescription += '\n\n💭 发布缘由：' + form.whyPublish;
    }
    if (form.beneficiaryType || form.relationship || form.beneficiaryDesc) {
      extendedDescription += '\n\n❤️ 受益人信息：';
      if (form.beneficiaryType) {
        const beneficiaryLabels: Record<string, string> = {
          elderly: '独居老人', children: '留守儿童', disabled: '残障人士',
          patients: '病患家庭', community: '社区公共', other: '其他'
        };
        extendedDescription += '\n类型：' + (beneficiaryLabels[form.beneficiaryType] || form.beneficiaryType);
      }
      if (form.relationship) {
        extendedDescription += '\n关系：' + form.relationship;
      }
      if (form.beneficiaryDesc) {
        extendedDescription += '\n简介：' + form.beneficiaryDesc;
      }
    }
    if (form.benefits.length > 0 || form.otherBenefits) {
      extendedDescription += '\n\n🎁 志愿者获得：' + form.benefits.map(b => {
        const labels: Record<string, string> = {
          experience: '志愿服务经验', certificate: '志愿证明证书', meal: '免费工作餐',
          transport: '交通补贴', training: '专业技能培训', friendship: '结识新朋友',
          skill: '提升专业技能', happiness: '帮助他人的快乐'
        };
        return labels[b] || b;
      }).join('、');
      if (form.otherBenefits) extendedDescription += '；' + form.otherBenefits;
    }
    if (form.promises.length > 0 || form.otherPromises) {
      extendedDescription += '\n\n🤝 发布人承诺：' + form.promises.map(p => {
        const labels: Record<string, string> = {
          safe: '提供安全保障措施', guide: '现场全程指导', materials: '提供所需材料工具',
          feedback: '及时反馈服务效果', recommend: '优先参与其他活动', respect: '尊重每一位志愿者'
        };
        return labels[p] || p;
      }).join('、');
      if (form.otherPromises) extendedDescription += '；' + form.otherPromises;
    }

    const taskData: any = {
      title: form.title,
      taskType: form.taskType,
      requiredSkills: form.requiredSkills,
      description: extendedDescription || undefined,
      location: form.location || undefined,
      schedule,
      pointsReward: calculatedPoints.value,
    };

    if ((form.taskType === 'team_once' || form.taskType === 'team_multi') && form.teamSize) {
      taskData.teamSize = form.teamSize;
    }

    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (res.ok) {
      const newTask = await res.json();
      tasks.value.unshift(newTask);
      showModal.value = false;
      showSuccess.value = true;
      resetForm();
    } else {
      const data = await res.json();
      error.value = data.message || '发布失败';
    }
  } catch (e) {
    error.value = '网络错误，请重试';
  } finally {
    publishing.value = false;
  }
}

function resetForm() {
  form.title = '';
  form.taskType = '';
  form.requiredSkills = [];
  form.description = '';
  form.whyPublish = '';
  form.beneficiaryType = '';
  form.relationship = '';
  form.beneficiaryDesc = '';
  form.benefits = [];
  form.otherBenefits = '';
  form.promises = [];
  form.otherPromises = '';
  form.scheduleType = 'once';
  form.date = '';
  form.startHour = 9;
  form.startMinute = 0;
  form.startAmPm = 'AM';
  form.endHour = 5;
  form.endMinute = 0;
  form.endAmPm = 'PM';
  form.startDate = '';
  form.endDate = '';
  form.startHourR = 9;
  form.startMinuteR = 0;
  form.startAmPmR = 'AM';
  form.endHourR = 5;
  form.endMinuteR = 0;
  form.endAmPmR = 'PM';
  form.location = '';
  form.teamSize = 2;
}

// 从后端加载积分规则
async function fetchPointRules() {
  try {
    const res = await fetch(`${API_BASE}/admin/points/rules`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    if (res.ok) {
      const rules = await res.json();
      if (rules.hourlyRate) {
        baseHourlyRate.value = rules.hourlyRate;
      }
      if (rules.laborTypes && rules.laborTypes.length > 0) {
        skillTypes.value = rules.laborTypes.map((lt: any) => {
          // 尝试匹配中文名称
          const labelMap: Record<string, string> = {
            '医疗护理': '医疗护理', 'medical': '医疗护理',
            '法律咨询': '法律咨询', 'legal': '法律咨询',
            '教育培训': '教育培训', 'teaching': '教育培训',
            '技术开发': '技术开发', 'tech': '技术开发',
            '设计创意': '设计创意', 'design': '设计创意',
            '翻译': '翻译', 'translation': '翻译',
            '驾驶运输': '驾驶运输', 'driving': '驾驶运输',
            '烹饪': '烹饪', 'cooking': '烹饪',
            '保洁': '保洁', 'cleaning': '保洁',
            '维修': '维修', 'repair': '维修',
            '安保': '安保', 'security': '安保',
            '养老护理': '养老护理', 'elderly_care': '养老护理',
            '育儿': '育儿', 'childcare': '育儿',
            '活动策划': '活动策划', 'event': '活动策划',
            '媒体宣传': '媒体宣传', 'media': '媒体宣传',
          };
          return {
            type: lt.type,
            label: labelMap[lt.type] || lt.type,
            multiplier: lt.multiplier,
          };
        });
      } else {
        // 使用默认技能列表
        initDefaultSkills();
      }
    } else {
      initDefaultSkills();
    }
  } catch (e) {
    console.error('加载积分规则失败', e);
    initDefaultSkills();
  }
}

function initDefaultSkills() {
  skillTypes.value = Object.keys(SKILL_LABELS).map(key => ({
    type: key,
    label: SKILL_LABELS[key],
    multiplier: 1.0,
  }));
}

import AdNativeFeed from '~/components/ad/AdNativeFeed.vue'
import AdSidebar from '~/components/ad/AdSidebar.vue'

onMounted(() => {
  fetchTasks();
  fetchPointRules();
});

useHead({ title: '任务大厅 - HeartChain' });
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
