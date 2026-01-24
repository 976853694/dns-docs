/**
 * Theme Module - 主题管理
 * 负责主题切换和偏好存储
 */
const Theme = (function() {
    const STORAGE_KEY = 'docs-theme';
    const THEMES = ['light', 'dark'];
    let currentTheme = 'light';
    let toggleEl = null;
    
    /**
     * 初始化主题（在页面渲染前调用）
     * 这个函数应该在 <head> 中内联调用以防止闪烁
     */
    function initEarly() {
        // 读取用户偏好
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        
        // 检查系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // 优先使用保存的偏好，否则使用系统偏好
        let theme = 'light';
        if (savedTheme && THEMES.includes(savedTheme)) {
            theme = savedTheme;
        } else if (prefersDark) {
            theme = 'dark';
        }
        
        // 立即应用到 html 元素，防止闪烁
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;
        
        return theme;
    }
    
    /**
     * 初始化主题（DOM 加载后调用）
     * @param {Object} options - 配置选项
     */
    function init(options = {}) {
        toggleEl = options.toggleEl || document.getElementById('themeToggle');
        
        // 确保主题已应用
        const theme = document.documentElement.getAttribute('data-theme') || currentTheme;
        currentTheme = theme;
        
        // 应用主题（更新UI元素）
        updateUI(theme);
        
        // 绑定切换按钮事件
        if (toggleEl) {
            toggleEl.addEventListener('click', toggle);
        }
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // 只有在用户没有手动设置时才跟随系统
            if (!localStorage.getItem(STORAGE_KEY)) {
                set(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    /**
     * 切换主题
     */
    function toggle() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set(newTheme);
    }
    
    /**
     * 设置指定主题
     * @param {string} themeName - 主题名称
     */
    function set(themeName) {
        if (!THEMES.includes(themeName)) {
            console.warn(`Invalid theme: ${themeName}`);
            return;
        }
        
        currentTheme = themeName;
        
        // 保存偏好
        try {
            localStorage.setItem(STORAGE_KEY, themeName);
        } catch (e) {
            console.warn('Failed to save theme preference:', e);
        }
        
        // 应用主题
        apply(themeName);
    }
    
    /**
     * 应用主题
     * @param {string} themeName - 主题名称
     */
    function apply(themeName) {
        // 更新 data-theme 属性
        document.documentElement.setAttribute('data-theme', themeName);
        
        // 更新UI元素
        updateUI(themeName);
        
        // 更新 highlight.js 主题
        updateCodeTheme(themeName);
    }
    
    /**
     * 更新UI元素
     * @param {string} themeName - 主题名称
     */
    function updateUI(themeName) {
        // 更新切换按钮
        if (toggleEl) {
            // 移除旧图标，添加新图标
            const iconHTML = themeName === 'light' 
                ? '<svg class="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
                : '<svg class="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
            
            toggleEl.innerHTML = iconHTML;
            toggleEl.setAttribute('aria-label', 
                themeName === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
            );
        }
    }
    
    /**
     * 更新代码高亮主题
     * @param {string} themeName - 主题名称
     */
    function updateCodeTheme(themeName) {
        const hljsLink = document.querySelector('link[href*="highlight.js"]');
        if (hljsLink) {
            const baseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/';
            hljsLink.href = themeName === 'dark' 
                ? baseUrl + 'github-dark.min.css'
                : baseUrl + 'github.min.css';
        }
    }
    
    /**
     * 获取当前主题
     * @returns {string}
     */
    function get() {
        return currentTheme;
    }
    
    // 公开接口
    return {
        initEarly,
        init,
        toggle,
        set,
        get
    };
})();

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Theme;
}
