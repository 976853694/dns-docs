/**
 * Search Module - 搜索功能
 * 提供文档搜索和关键词高亮
 */
const Search = (function() {
    let searchIndex = null;
    let inputEl = null;
    let resultsEl = null;
    let currentLang = 'zh';
    let debounceTimer = null;
    
    /**
     * 初始化搜索
     * @param {Object} options - 配置选项
     */
    function init(options = {}) {
        inputEl = options.inputEl || document.getElementById('searchInput');
        resultsEl = options.resultsEl || document.getElementById('searchResults');
        
        if (inputEl) {
            inputEl.addEventListener('input', handleInput);
            inputEl.addEventListener('focus', () => {
                if (inputEl.value.trim()) {
                    showResults();
                }
            });
        }
        
        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                hideResults();
            }
        });
        
        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideResults();
                if (inputEl) inputEl.blur();
            }
        });
    }
    
    /**
     * 加载搜索索引
     * @param {string} indexPath - 索引文件路径
     * @returns {Promise<Object>}
     */
    async function loadIndex(indexPath = 'config/search-index.json') {
        try {
            const response = await fetch(indexPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            searchIndex = await response.json();
            return searchIndex;
        } catch (error) {
            console.error('Failed to load search index:', error);
            return null;
        }
    }
    
    /**
     * 设置当前语言
     * @param {string} lang - 语言代码
     */
    function setLang(lang) {
        currentLang = lang;
        // 更新 placeholder
        if (inputEl) {
            inputEl.placeholder = lang === 'zh' ? '搜索文档...' : 'Search docs...';
        }
    }
    
    /**
     * 处理输入事件
     */
    function handleInput() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const keyword = inputEl.value.trim();
            if (keyword.length >= 1) {
                const results = search(keyword);
                renderResults(results, keyword);
                showResults();
            } else {
                hideResults();
            }
        }, 200);
    }

    /**
     * 执行搜索
     * @param {string} keyword - 搜索关键词
     * @param {Array} [index] - 可选的搜索索引
     * @returns {Array} 搜索结果
     */
    function search(keyword, index) {
        const searchData = index || (searchIndex && searchIndex[currentLang]) || [];
        
        if (!keyword || !searchData.length) {
            return [];
        }
        
        const lowerKeyword = keyword.toLowerCase();
        
        return searchData.filter(item => {
            // 在标题中搜索
            if (item.title && item.title.toLowerCase().includes(lowerKeyword)) {
                return true;
            }
            // 在内容中搜索
            if (item.content && item.content.toLowerCase().includes(lowerKeyword)) {
                return true;
            }
            // 在关键词中搜索
            if (item.keywords && item.keywords.some(k => 
                k.toLowerCase().includes(lowerKeyword)
            )) {
                return true;
            }
            return false;
        }).map(item => ({
            ...item,
            // 计算相关度分数
            score: calculateScore(item, lowerKeyword)
        })).sort((a, b) => b.score - a.score);
    }
    
    /**
     * 计算相关度分数
     * @param {Object} item - 搜索项
     * @param {string} keyword - 关键词（小写）
     * @returns {number} 分数
     */
    function calculateScore(item, keyword) {
        let score = 0;
        
        // 标题匹配权重最高
        if (item.title && item.title.toLowerCase().includes(keyword)) {
            score += 10;
            // 完全匹配加分
            if (item.title.toLowerCase() === keyword) {
                score += 5;
            }
        }
        
        // 关键词匹配
        if (item.keywords) {
            item.keywords.forEach(k => {
                if (k.toLowerCase().includes(keyword)) {
                    score += 5;
                }
            });
        }
        
        // 内容匹配
        if (item.content && item.content.toLowerCase().includes(keyword)) {
            score += 1;
        }
        
        return score;
    }
    
    /**
     * 渲染搜索结果
     * @param {Array} results - 搜索结果
     * @param {string} keyword - 搜索关键词
     */
    function renderResults(results, keyword) {
        if (!resultsEl) return;
        
        if (results.length === 0) {
            resultsEl.innerHTML = `
                <div class="search-result-item no-results">
                    ${currentLang === 'zh' ? '未找到相关结果' : 'No results found'}
                </div>
            `;
            return;
        }
        
        resultsEl.innerHTML = results.slice(0, 10).map(item => `
            <div class="search-result-item" data-path="${item.path}">
                <div class="search-result-title">
                    ${highlightKeyword(escapeHtml(item.title), keyword)}
                </div>
                ${item.content ? `
                    <div class="search-result-content">
                        ${highlightKeyword(escapeHtml(truncate(item.content, 100)), keyword)}
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        // 绑定点击事件
        resultsEl.querySelectorAll('.search-result-item[data-path]').forEach(el => {
            el.addEventListener('click', () => {
                const path = el.dataset.path;
                if (path && typeof Router !== 'undefined') {
                    Router.navigate(currentLang, path);
                    hideResults();
                    if (inputEl) inputEl.value = '';
                }
            });
        });
    }
    
    /**
     * 高亮关键词
     * @param {string} text - 原始文本
     * @param {string} keyword - 关键词
     * @returns {string} 高亮后的文本
     */
    function highlightKeyword(text, keyword) {
        if (!keyword || !text) return text;
        
        const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    /**
     * 显示搜索结果
     */
    function showResults() {
        if (resultsEl) {
            resultsEl.classList.add('active');
        }
    }
    
    /**
     * 隐藏搜索结果
     */
    function hideResults() {
        if (resultsEl) {
            resultsEl.classList.remove('active');
        }
    }
    
    /**
     * 截断文本
     * @param {string} text - 原始文本
     * @param {number} maxLength - 最大长度
     * @returns {string}
     */
    function truncate(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    /**
     * 转义正则特殊字符
     * @param {string} str - 原始字符串
     * @returns {string}
     */
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * HTML 转义
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 公开接口
    return {
        init,
        loadIndex,
        setLang,
        search,
        highlightKeyword,
        renderResults,
        showResults,
        hideResults
    };
})();

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Search;
}
