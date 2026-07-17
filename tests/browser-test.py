#!/usr/bin/env python3
"""
HeartChain 浏览器自动化测试脚本
通过 CDP 控制 Chrome 进行完整的网站测试
"""

import asyncio
import json
import time
from playwright.async_api import async_playwright

BASE_URL = "https://heartchain-backend.onrender.com"

async def test_homepage(page):
    """测试首页"""
    print("=" * 50)
    print("📱 测试 1: 首页加载")
    await page.goto(BASE_URL + "/")
    await page.wait_for_load_state("networkidle")
    
    # 检查关键元素
    logo = await page.query_selector(".logo")
    assert logo, "❌ Logo 未找到"
    print("✅ Logo 显示正常")
    
    # 检查登录按钮
    login_btn = await page.query_selector(".btn-login")
    assert login_btn, "❌ 登录按钮未找到"
    print("✅ 登录按钮显示（未登录状态）")
    
    # 检查成就卡片
    achievement = await page.query_selector(".achievement-card")
    assert achievement, "❌ 成就卡片未找到"
    print("✅ 成就卡片显示正常")
    
    # 检查任务列表
    tasks = await page.query_selector_all(".task-card")
    print(f"✅ 找到 {len(tasks)} 个任务卡片")
    assert len(tasks) > 0, "❌ 没有任务卡片"
    
    print("✅ 首页测试通过!")
    return True

async def test_login(page):
    """测试登录功能"""
    print("=" * 50)
    print("🔐 测试 2: 登录功能")
    
    # 点击登录按钮
    await page.click(".btn-login")
    await page.wait_for_url("**/auth/register**")
    print("✅ 跳转到登录页面")
    
    # 输入手机号
    phone_input = await page.query_selector("#login-phone")
    assert phone_input, "❌ 手机号输入框未找到"
    await phone_input.fill("+821022098999")
    print("✅ 输入手机号")
    
    # 输入密码
    pwd_input = await page.query_selector("#login-password")
    assert pwd_input, "❌ 密码输入框未找到"
    await pwd_input.fill("Admin@2026")
    print("✅ 输入密码")
    
    # 拦截登录请求，检查 API 调用
    async with page.expect_response(lambda r: "/auth/password-login" in r.url) as resp_info:
        await page.click("button[type='submit']")
        resp = await resp_info.value
        
    print(f"✅ API 响应状态: {resp.status}")
    assert resp.status == 200, f"❌ 登录 API 返回 {resp.status}"
    
    # 检查 localStorage
    await page.wait_for_timeout(1000)
    auth_data = await page.evaluate("localStorage.getItem('heartchain_auth')")
    assert auth_data, "❌ localStorage 中没有 auth 数据"
    print("✅ 登录状态已写入 localStorage")
    
    # 检查是否跳转回首页
    await page.wait_for_timeout(2000)
    current_url = page.url
    print(f"✅ 当前 URL: {current_url}")
    
    # 检查首页是否显示已登录状态
    avatar = await page.query_selector(".avatar")
    assert avatar, "❌ 未登录状态（头像未显示）"
    print("✅ 首页显示已登录状态（头像）")
    
    print("✅ 登录测试通过!")
    return True

async def test_side_menu(page):
    """测试侧边菜单"""
    print("=" * 50)
    print("📋 测试 3: 侧边菜单")
    
    # 点击头像打开侧边菜单
    await page.click(".avatar")
    await page.wait_for_selector(".side-menu-overlay.show", state="visible")
    print("✅ 侧边菜单打开")
    
    # 检查菜单项
    menu_items = await page.query_selector_all(".menu-item")
    print(f"✅ 找到 {len(menu_items)} 个菜单项")
    
    # 检查退出按钮
    logout_btn = await page.query_selector(".btn-logout")
    assert logout_btn, "❌ 退出登录按钮未找到"
    print("✅ 退出登录按钮存在")
    
    # 关闭侧边菜单
    await page.click(".side-menu-overlay .backdrop")
    await page.wait_for_selector(".side-menu-overlay", state="hidden")
    print("✅ 侧边菜单关闭")
    
    print("✅ 侧边菜单测试通过!")
    return True

async def test_logout(page):
    """测试退出登录"""
    print("=" * 50)
    print("🚪 测试 4: 退出登录")
    
    # 打开侧边菜单
    await page.click(".avatar")
    await page.wait_for_selector(".side-menu-overlay.show", state="visible")
    
    # 点击退出登录
    await page.click(".btn-logout")
    await page.wait_for_timeout(1000)
    
    # 检查 localStorage 是否被清除
    auth_data = await page.evaluate("localStorage.getItem('heartchain_auth')")
    assert not auth_data, "❌ localStorage 中仍有 auth 数据"
    print("✅ localStorage 已清除")
    
    # 检查是否显示登录按钮
    login_btn = await page.query_selector(".btn-login")
    assert login_btn, "❌ 未显示登录按钮（退出后应显示）"
    print("✅ 首页显示登录按钮（已退出）")
    
    print("✅ 退出登录测试通过!")
    return True

async def test_task_detail(page):
    """测试任务详情弹窗"""
    print("=" * 50)
    print("📌 测试 5: 任务详情弹窗")
    
    # 点击第一个任务卡片
    tasks = await page.query_selector_all(".task-card")
    if tasks:
        await tasks[0].click()
        await page.wait_for_selector(".task-detail-overlay.show", state="visible")
        print("✅ 任务详情弹窗打开")
        
        # 检查关键元素
        title = await page.query_selector(".task-detail-title")
        assert title, "❌ 任务标题未找到"
        title_text = await title.text_content()
        print(f"✅ 任务标题: {title_text.strip()}")
        
        # 检查帮助按钮
        help_btn = await page.query_selector(".btn-accept")
        assert help_btn, "❌ 我来帮助按钮未找到"
        print("✅ '我来帮助' 按钮存在")
        
        # 关闭弹窗
        await page.click(".task-detail-overlay .backdrop")
        await page.wait_for_selector(".task-detail-overlay", state="hidden")
        print("✅ 任务详情弹窗关闭")
    
    print("✅ 任务详情测试通过!")
    return True

async def run_all_tests():
    """运行所有测试"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=200)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
        )
        page = await context.new_page()
        
        results = []
        
        try:
            results.append(("首页加载", await test_homepage(page)))
        except Exception as e:
            print(f"❌ 首页测试失败: {e}")
            results.append(("首页加载", False))
        
        try:
            results.append(("登录功能", await test_login(page)))
        except Exception as e:
            print(f"❌ 登录测试失败: {e}")
            results.append(("登录功能", False))
        
        try:
            results.append(("侧边菜单", await test_side_menu(page)))
        except Exception as e:
            print(f"❌ 侧边菜单测试失败: {e}")
            results.append(("侧边菜单", False))
        
        try:
            results.append(("退出登录", await test_logout(page)))
        except Exception as e:
            print(f"❌ 退出测试失败: {e}")
            results.append(("退出登录", False))
        
        try:
            results.append(("任务详情", await test_task_detail(page)))
        except Exception as e:
            print(f"❌ 任务详情测试失败: {e}")
            results.append(("任务详情", False))
        
        # 输出测试报告
        print("\n" + "=" * 50)
        print("📊 测试报告")
        print("=" * 50)
        passed = sum(1 for _, v in results if v)
        total = len(results)
        for name, result in results:
            status = "✅ 通过" if result else "❌ 失败"
            print(f"  {status}: {name}")
        print(f"\n总计: {passed}/{total} 通过")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_all_tests())
