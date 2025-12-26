/**
 * Sidebar Module - 侧边栏导航
 * 负责渲染和管理侧边栏
 */
const Sidebar = (function() {
    let navEl = null;
    let sidebarEl = null;
    let overlayEl = null;
    let menuToggleEl = null;
    let navConfig = null;
    let currentLang = 'zh';
    let currentPath = '';
    
    /**
     * 初始化侧边栏
     * @param {Object} options - 配置选项
     */
    function init(options = {}) {
        navEl = options.navEl || document.getElementById('sidebarNav');
        sidebarEl = options.sidebarEl || document.getElementById('sidebar');
        overlayEl = options.overlayEl || document.getElementById('sidebarOverlay');
        menuToggleEl = options.menuToggleEl || document.getElementById('menuToggle');
        
        // 绑定移动端菜单事件
        if (menuToggleEl) {
            menuToggleEl.addEventListener('click', toggle);
        }
        
        if (overlayEl) {
            overlayEl.addEventListener('click', close);
        }
        
        // 触摸滑动关闭
        setupTouchEvents();
    }
    
    /**
     * 加载导航配置
     * @param {string} configPath - 配置文件路径
     * @returns {Promise<Object>}
     */
    async function loadConfig(configPath = 'config/nav.json') {
        try {
            const response = await fetch(configPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            navConfig = await response.json();
            return navConfig;
        } catch (error) {
            console.error('Failed to load nav config:', error);
            return null;
        }
    }
    
    /**
     * 渲染侧边栏
     * @param {string} lang - 当前语言
     * @param {string} path - 当前路径
     */
    function render(lang, path) {
        if (!navEl || !navConfig) return;
        
        currentLang = lang;
        currentPath = path;
        
        const langNav = navConfig[lang];
        if (!langNav) {
            navEl.innerHTML = '<p class="nav-error">导航配置未找到</p>';
            return;
        }
        
        navEl.innerHTML = renderItems(langNav.items, path);
        
        // 绑定折叠事件
        bindFolderEvents();
    }

    /**
     * 渲染导航项
     * @param {Array} items - 导航项数组
     * @param {string} currentPath - 当前路径
     * @returns {string} HTML
     */
    function renderItems(items, currentPath) {
        if (!items || items.length === 0) return '';
        
        let html = '';
        
        items.forEach((item, index) => {
            if (item.children && item.children.length > 0) {
                // 文件夹
                const folderId = `folder-${index}`;
                const hasActiveChild = item.children.some(child => child.link === currentPath);
                const isCollapsed = !hasActiveChild;
                
                html += `
                    <div class="folder ${isCollapsed ? 'collapsed' : ''}" data-folder-id="${folderId}">
                        <div class="folder-title">${escapeHtml(item.text)}</div>
                        <div class="folder-children" style="max-height: ${isCollapsed ? '0' : '500px'}">
                            ${renderItems(item.children, currentPath)}
                        </div>
                    </div>
                `;
            } else if (item.link) {
                // 链接
                const isActive = item.link === currentPath;
                html += `
                    <a href="#/${currentLang}${item.link}" 
                       class="${isActive ? 'active' : ''}"
                       data-path="${item.link}">
                        ${escapeHtml(item.text)}
                    </a>
                `;
            }
        });
        
        return html;
    }
    
    /**
     * 绑定文件夹折叠事件
     */
    function bindFolderEvents() {
        if (!navEl) return;
        
        navEl.querySelectorAll('.folder-title').forEach(title => {
            title.addEventListener('click', (e) => {
                const folder = e.target.closest('.folder');
                if (folder) {
                    toggleFolder(folder);
                }
            });
        });
        
        // 点击链接时关闭移动端侧边栏
        navEl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    close();
                }
            });
        });
    }
    
    /**
     * 切换文件夹折叠状态
     * @param {HTMLElement|string} folder - 文件夹元素或 ID
     */
    function toggleFolder(folder) {
        if (typeof folder === 'string') {
            folder = navEl.querySelector(`[data-folder-id="${folder}"]`);
        }
        
        if (!folder) return;
        
        const children = folder.querySelector('.folder-children');
        const isCollapsed = folder.classList.contains('collapsed');
        
        if (isCollapsed) {
            folder.classList.remove('collapsed');
            if (children) {
                children.style.maxHeight = children.scrollHeight + 'px';
            }
        } else {
            folder.classList.add('collapsed');
            if (children) {
                children.style.maxHeight = '0';
            }
        }
    }
    
    /**
     * 高亮当前页面
     * @param {string} path - 当前路径
     */
    function highlightCurrent(path) {
        if (!navEl) return;
        
        currentPath = path;
        
        // 移除所有 active 类
        navEl.querySelectorAll('a.active').forEach(a => {
            a.classList.remove('active');
        });
        
        // 添加 active 类到当前链接
        const activeLink = navEl.querySelector(`a[data-path="${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // 展开父文件夹
            const parentFolder = activeLink.closest('.folder');
            if (parentFolder && parentFolder.classList.contains('collapsed')) {
                toggleFolder(parentFolder);
            }
        }
    }
    
    /**
     * 切换侧边栏显示/隐藏（移动端）
     */
    function toggle() {
        if (!sidebarEl) return;
        
        const isOpen = sidebarEl.classList.contains('open');
        if (isOpen) {
            close();
        } else {
            open();
        }
    }
    
    /**
     * 打开侧边栏
     */
    function open() {
        if (sidebarEl) {
            sidebarEl.classList.add('open');
        }
        if (overlayEl) {
            overlayEl.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * 关闭侧边栏
     */
    function close() {
        if (sidebarEl) {
            sidebarEl.classList.remove('open');
        }
        if (overlayEl) {
            overlayEl.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    
    /**
     * 设置触摸滑动事件
     */
    function setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!sidebarEl || !sidebarEl.classList.contains('open')) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = endX - startX;
            const diffY = Math.abs(endY - startY);
            
            // 向左滑动超过 50px 且水平滑动大于垂直滑动
            if (diffX < -50 && diffX < -diffY) {
                close();
            }
        }, { passive: true });
    }
    
    /**
     * HTML 转义
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 公开接口
    return {
        init,
        loadConfig,
        render,
        toggleFolder,
        highlightCurrent,
        toggle,
        open,
        close
    };
})();

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sidebar;
}
