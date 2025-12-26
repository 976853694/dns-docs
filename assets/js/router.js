/**
 * Router Module - 路由管理
 * 负责 URL 解析和页面导航
 */
const Router = (function() {
    let config = {
        defaultLang: 'zh',
        languages: ['zh', 'en'],
        defaultPath: '/guide/index'
    };
    
    let callbacks = [];
    
    /**
     * 初始化路由
     * @param {Object} cfg - 配置对象
     */
    function init(cfg) {
        if (cfg) {
            config = { ...config, ...cfg };
        }
        
        // 监听 hashchange 事件
        window.addEventListener('hashchange', handleRouteChange);
        
        // 初始加载时检查 URL
        if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
            // 尝试从 localStorage 读取语言偏好
            const savedLang = localStorage.getItem('docs-lang') || config.defaultLang;
            navigate(savedLang, config.defaultPath);
        } else {
            handleRouteChange();
        }
    }
    
    /**
     * 解析当前 URL，返回 {lang, path}
     * URL 格式: #/{lang}/{path}
     * 例如: #/zh/guide/getting-started
     * @param {string} [hash] - 可选的 hash 字符串，默认使用当前 URL
     * @returns {{lang: string, path: string}}
     */
    function parseUrl(hash) {
        const hashStr = hash || window.location.hash;
        
        // 移除开头的 #/ 或 #
        let cleanHash = hashStr.replace(/^#\/?/, '');
        
        if (!cleanHash) {
            return {
                lang: config.defaultLang,
                path: config.defaultPath
            };
        }
        
        // 分割路径
        const parts = cleanHash.split('/').filter(p => p);
        
        // 检查第一部分是否是有效的语言代码
        let lang = config.defaultLang;
        let pathParts = parts;
        
        if (parts.length > 0 && config.languages.includes(parts[0])) {
            lang = parts[0];
            pathParts = parts.slice(1);
        }
        
        // 构建路径
        let path = '/' + pathParts.join('/');
        
        // 如果路径为空，使用默认路径
        if (path === '/') {
            path = config.defaultPath;
        }
        
        return { lang, path };
    }

    /**
     * 根据语言和路径构建 URL hash
     * @param {string} lang - 语言代码
     * @param {string} path - 文档路径
     * @returns {string} URL hash
     */
    function buildUrl(lang, path) {
        // 确保路径以 / 开头
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        return `#/${lang}${cleanPath}`;
    }
    
    /**
     * 根据语言和路径构建文件路径
     * @param {string} lang - 语言代码
     * @param {string} path - 文档路径
     * @returns {string} 文件路径
     */
    function buildFilePath(lang, path) {
        // 确保路径以 / 开头
        let cleanPath = path.startsWith('/') ? path : '/' + path;
        
        // 如果路径以 / 结尾，添加 index
        if (cleanPath.endsWith('/')) {
            cleanPath += 'index';
        }
        
        // 添加 .md 扩展名
        if (!cleanPath.endsWith('.md')) {
            cleanPath += '.md';
        }
        
        return `docs/${lang}${cleanPath}`;
    }
    
    /**
     * 导航到指定路径
     * @param {string} lang - 语言代码
     * @param {string} path - 文档路径
     */
    function navigate(lang, path) {
        // 验证语言代码
        if (!config.languages.includes(lang)) {
            lang = config.defaultLang;
        }
        
        const url = buildUrl(lang, path);
        
        // 如果 URL 没有变化，手动触发回调
        if (window.location.hash === url) {
            handleRouteChange();
        } else {
            window.location.hash = url;
        }
    }
    
    /**
     * 处理路由变化
     */
    function handleRouteChange() {
        const route = parseUrl();
        
        // 保存语言偏好
        localStorage.setItem('docs-lang', route.lang);
        
        // 触发所有回调
        callbacks.forEach(cb => cb(route));
    }
    
    /**
     * 监听路由变化
     * @param {Function} callback - 回调函数，接收 {lang, path} 参数
     */
    function onRouteChange(callback) {
        if (typeof callback === 'function') {
            callbacks.push(callback);
        }
    }
    
    /**
     * 获取当前路由
     * @returns {{lang: string, path: string}}
     */
    function getCurrentRoute() {
        return parseUrl();
    }
    
    /**
     * 获取配置
     * @returns {Object}
     */
    function getConfig() {
        return { ...config };
    }
    
    // 公开接口
    return {
        init,
        parseUrl,
        buildUrl,
        buildFilePath,
        navigate,
        onRouteChange,
        getCurrentRoute,
        getConfig
    };
})();

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
