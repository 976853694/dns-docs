/**
 * App Module - 主应用控制器
 * 整合所有模块，管理应用生命周期
 */
const App = (function() {
    let config = null;
    let currentLang = 'zh';
    
    /**
     * 初始化应用
     */
    async function init() {
        try {
            // 加载站点配置
            config = await loadConfig();
            
            // 初始化主题（最先，避免闪烁）
            Theme.init();
            
            // 初始化路由
            Router.init({
                defaultLang: config.defaultLang,
                languages: config.languages,
                defaultPath: '/guide/getting-started'
            });
            
            // 初始化渲染器
            Renderer.init();
            
            // 初始化侧边栏
            Sidebar.init();
            await Sidebar.loadConfig();
            
            // 初始化搜索
            Search.init();
            await Search.loadIndex();
            
            // 监听路由变化
            Router.onRouteChange(handleRouteChange);
            
            // 初始化语言选择器
            initLangSelect();
            
            // 触发初始路由
            const route = Router.getCurrentRoute();
            handleRouteChange(route);
            
            console.log('App initialized');
        } catch (error) {
            console.error('App init error:', error);
        }
    }
    
    /**
     * 加载站点配置
     * @returns {Promise<Object>}
     */
    async function loadConfig() {
        try {
            const response = await fetch('config/config.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('Failed to load config, using defaults:', error);
            return {
                title: 'My Docs',
                defaultLang: 'zh',
                languages: ['zh', 'en']
            };
        }
    }

    /**
     * 处理路由变化
     * @param {{lang: string, path: string}} route - 路由信息
     */
    async function handleRouteChange(route) {
        currentLang = route.lang;
        
        // 更新语言选择器
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.value = route.lang;
        }
        
        // 更新搜索语言
        Search.setLang(route.lang);
        
        // 更新侧边栏
        Sidebar.render(route.lang, route.path);
        
        // 加载文档
        const filePath = Router.buildFilePath(route.lang, route.path);
        const success = await Renderer.render(filePath);
        
        // 如果加载失败且不是默认语言，尝试加载默认语言
        if (!success && route.lang !== config.defaultLang) {
            const fallbackPath = Router.buildFilePath(config.defaultLang, route.path);
            const fallbackSuccess = await Renderer.render(fallbackPath);
            
            if (fallbackSuccess) {
                showLangFallbackNotice(route.lang, config.defaultLang);
            }
        }
        
        // 更新页面标题
        updateTitle(route.path);
    }
    
    /**
     * 初始化语言选择器
     */
    function initLangSelect() {
        const langSelect = document.getElementById('langSelect');
        if (!langSelect) return;
        
        // 清空并重新填充选项
        langSelect.innerHTML = '';
        config.languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang === 'zh' ? '中文' : 'English';
            langSelect.appendChild(option);
        });
        
        // 设置当前语言
        langSelect.value = currentLang;
        
        // 监听变化
        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            const route = Router.getCurrentRoute();
            
            // 保存语言偏好
            localStorage.setItem('docs-lang', newLang);
            
            // 导航到新语言
            Router.navigate(newLang, route.path);
        });
    }
    
    /**
     * 显示语言降级提示
     * @param {string} requestedLang - 请求的语言
     * @param {string} fallbackLang - 降级语言
     */
    function showLangFallbackNotice(requestedLang, fallbackLang) {
        // 移除已有的提示
        const existing = document.querySelector('.lang-fallback-notice');
        if (existing) {
            existing.remove();
        }
        
        const notice = document.createElement('div');
        notice.className = 'lang-fallback-notice';
        notice.innerHTML = `
            <span>此页面暂无 ${getLangName(requestedLang)} 版本，显示 ${getLangName(fallbackLang)} 版本</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        notice.style.cssText = `
            position: fixed;
            top: var(--header-height);
            left: 0;
            right: 0;
            padding: 0.5rem 1rem;
            background: var(--mark-bg, #fff8c5);
            color: var(--text-color, #24292f);
            text-align: center;
            z-index: 90;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
        `;
        
        document.body.appendChild(notice);
        
        // 5秒后自动消失
        setTimeout(() => {
            if (notice.parentElement) {
                notice.remove();
            }
        }, 5000);
    }
    
    /**
     * 获取语言名称
     * @param {string} lang - 语言代码
     * @returns {string}
     */
    function getLangName(lang) {
        const names = {
            'zh': '中文',
            'en': 'English'
        };
        return names[lang] || lang;
    }
    
    /**
     * 更新页面标题
     * @param {string} path - 当前路径
     */
    function updateTitle(path) {
        const baseTitle = config?.title || 'My Docs';
        const pathParts = path.split('/').filter(p => p);
        
        if (pathParts.length > 0) {
            const pageName = pathParts[pathParts.length - 1]
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
            document.title = `${pageName} | ${baseTitle}`;
        } else {
            document.title = baseTitle;
        }
    }
    
    // 公开接口
    return {
        init
    };
})();

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
