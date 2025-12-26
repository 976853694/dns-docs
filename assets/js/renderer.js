/**
 * Renderer Module - Markdown 渲染
 * 负责加载和渲染 Markdown 文件
 */
const Renderer = (function() {
    let contentEl = null;
    let tocEl = null;
    
    /**
     * 初始化渲染器
     * @param {Object} options - 配置选项
     */
    function init(options = {}) {
        contentEl = options.contentEl || document.getElementById('docContent');
        tocEl = options.tocEl || document.getElementById('toc');
        
        // 配置 marked
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                highlight: function(code, lang) {
                    if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (e) {
                            console.error('Highlight error:', e);
                        }
                    }
                    return code;
                },
                breaks: false,
                gfm: true
            });
        }
    }
    
    /**
     * 将标题文本转换为锚点 ID
     * @param {string} text - 标题文本
     * @returns {string} 锚点 ID
     */
    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[\s]+/g, '-')
            .replace(/[^\w\u4e00-\u9fa5-]/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    /**
     * 为标题添加锚点链接
     * @param {string} html - HTML 内容
     * @returns {{html: string, headings: Array}} 处理后的 HTML 和标题列表
     */
    function addAnchors(html) {
        const headings = [];
        const processedHtml = html.replace(
            /<h([1-3])>([^<]+)<\/h[1-3]>/gi,
            (match, level, text) => {
                const id = slugify(text);
                headings.push({ level: parseInt(level), text, id });
                return `<h${level} id="${id}">${text}<a href="#${id}" class="anchor-link">#</a></h${level}>`;
            }
        );
        return { html: processedHtml, headings };
    }

    /**
     * 生成目录 TOC
     * @param {Array} headings - 标题列表
     * @returns {string} TOC HTML
     */
    function generateTOC(headings) {
        if (!headings || headings.length === 0) {
            return '';
        }
        
        let html = '<div class="toc-title">目录</div>';
        headings.forEach(h => {
            if (h.level <= 3) {
                html += `<a href="#${h.id}" class="toc-h${h.level}">${h.text}</a>`;
            }
        });
        
        return html;
    }
    
    /**
     * 加载并渲染 Markdown 文件
     * @param {string} filePath - 文件路径
     * @returns {Promise<boolean>} 是否成功
     */
    async function render(filePath) {
        if (!contentEl) {
            console.error('Content element not found');
            return false;
        }
        
        // 显示加载状态
        contentEl.innerHTML = '<div class="loading">加载中...</div>';
        
        try {
            const response = await fetch(filePath);
            
            if (!response.ok) {
                if (response.status === 404) {
                    show404();
                    return false;
                }
                throw new Error(`HTTP ${response.status}`);
            }
            
            const markdown = await response.text();
            
            // 检查是否是 Markdown 内容
            if (markdown.trim().startsWith('<!DOCTYPE') || markdown.trim().startsWith('<html')) {
                show404();
                return false;
            }
            
            // 渲染 Markdown
            let html = '';
            if (typeof marked !== 'undefined') {
                html = marked.parse(markdown);
            } else {
                // 降级：显示原始文本
                html = `<pre>${escapeHtml(markdown)}</pre>`;
            }
            
            // 添加锚点
            const result = addAnchors(html);
            
            // 更新内容
            contentEl.innerHTML = result.html;
            
            // 更新 TOC
            if (tocEl) {
                tocEl.innerHTML = generateTOC(result.headings);
            }
            
            // 代码高亮（如果 marked 没有处理）
            if (typeof hljs !== 'undefined') {
                contentEl.querySelectorAll('pre code').forEach(block => {
                    if (!block.classList.contains('hljs')) {
                        hljs.highlightElement(block);
                    }
                });
            }
            
            // 滚动到顶部或锚点
            scrollToAnchor();
            
            return true;
        } catch (error) {
            console.error('Render error:', error);
            showError(error.message);
            return false;
        }
    }
    
    /**
     * 显示 404 页面
     */
    function show404() {
        if (!contentEl) return;
        
        const template = document.getElementById('notFoundTemplate');
        if (template) {
            contentEl.innerHTML = template.innerHTML;
        } else {
            contentEl.innerHTML = `
                <div class="not-found">
                    <h1>404</h1>
                    <p>页面未找到</p>
                    <a href="#/zh/guide/getting-started">返回首页</a>
                </div>
            `;
        }
        
        if (tocEl) {
            tocEl.innerHTML = '';
        }
    }
    
    /**
     * 显示错误信息
     * @param {string} message - 错误信息
     */
    function showError(message) {
        if (!contentEl) return;
        
        contentEl.innerHTML = `
            <div class="error">
                <h2>加载失败</h2>
                <p>${escapeHtml(message)}</p>
                <button onclick="location.reload()">重试</button>
            </div>
        `;
        
        if (tocEl) {
            tocEl.innerHTML = '';
        }
    }
    
    /**
     * 滚动到锚点位置
     */
    function scrollToAnchor() {
        const hash = window.location.hash;
        const anchorMatch = hash.match(/#[^#]+#(.+)$/);
        
        if (anchorMatch) {
            const anchor = anchorMatch[1];
            const el = document.getElementById(anchor);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }
    
    /**
     * HTML 转义
     * @param {string} text - 原始文本
     * @returns {string} 转义后的文本
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 公开接口
    return {
        init,
        render,
        show404,
        showError,
        slugify,
        addAnchors,
        generateTOC
    };
})();

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}
