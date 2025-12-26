/**
 * Theme Module - 主题管理
 * 负责主题切换和偏好存储
 */
const Theme = (function() {
    const STORAGE_KEY = 'docs-theme';
    const THEMES = ['light', 'dark'];
    let currentTheme = 'light';
    let toggleEl = null;
    let styleEl = null;
    
    /**
     * 初始化主题
     * @param {Object} options - 配置选项
     */
    function init(options = {}) {
        toggleEl = options.toggleEl || document.getElementById('themeToggle');
        styleEl = options.styleEl || document.getElementById('theme-style');
        
        // 读取用户偏好
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        
        // 检查系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // 优先使用保存的偏好，否则使用系统偏好
        if (savedTheme && THEMES.includes(savedTheme)) {
            currentTheme = savedTheme;
        } else if (prefersDark) {
            currentTheme = 'dark';
        }
        
        // 应用主题
        apply(currentTheme);
        
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
        localStorage.setItem(STORAGE_KEY, themeName);
        
        // 应用主题
        apply(themeName);
    }
    
    /**
     * 应用主题
     * @param {string} themeName - 主题名称
     */
    function apply(themeName) {
        // 更新样式表
        if (styleEl) {
            styleEl.href = `assets/css/theme-${themeName}.css`;
        }
        
        // 更新 body 类
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${themeName}`);
        
        // 更新切换按钮图标
        if (toggleEl) {
            toggleEl.textContent = themeName === 'light' ? '🌙' : '☀️';
            toggleEl.setAttribute('aria-label', 
                themeName === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
            );
        }
        
        // 更新 highlight.js 主题
        updateCodeTheme(themeName);
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
