// Paul Graham Essays - Interactive Website
// Main JavaScript

let allEssays = [];
let filteredEssays = [];
let currentCategory = 'all';

// Load essays data
function loadEssays() {
    try {
        // Use global essayData loaded from essays.js
        if (typeof window.essayData !== 'undefined') {
            allEssays = window.essayData;
            filteredEssays = [...allEssays];
            renderEssays();
            updateResultsCount();
        } else {
            throw new Error('Essay data not loaded');
        }
    } catch (error) {
        console.error('Error loading essays:', error);
        document.getElementById('essay-grid').innerHTML =
            '<p style="text-align: center; color: var(--text-secondary);">Error loading essays. Please refresh the page.</p>';
    }
}

// Render essays to the grid
function renderEssays() {
    const grid = document.getElementById('essay-grid');

    if (filteredEssays.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1 / -1;">No essays found matching your search.</p>';
        return;
    }

    grid.innerHTML = filteredEssays.map(essay => `
        <div class="essay-card" onclick="openEssay(${essay.id})">
            <div class="essay-card-header">
                <span class="category-badge" style="background-color: ${essay.categoryColor}">
                    ${essay.category}
                </span>
            </div>
            <h3 class="essay-title">${escapeHtml(essay.title)}</h3>
            <div class="essay-meta">
                <span>📖 ${essay.readingTime} min read</span>
                <span>📝 ${essay.wordCount.toLocaleString()} words</span>
            </div>
            <p class="essay-preview">${getPreview(essay.content)}</p>
        </div>
    `).join('');
}

// Get preview text
function getPreview(content) {
    const text = content.replace(/\n+/g, ' ').trim();
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open essay in modal
function openEssay(essayId) {
    const essay = allEssays.find(e => e.id === essayId);
    if (!essay) return;

    document.getElementById('modal-title').textContent = essay.title;
    document.getElementById('modal-category').textContent = essay.category;
    document.getElementById('modal-category').style.backgroundColor = essay.categoryColor;
    document.getElementById('modal-reading-time').textContent = `📖 ${essay.readingTime} min read`;
    document.getElementById('modal-source').href = essay.url;
    document.getElementById('modal-content').textContent = essay.content;

    const modal = document.getElementById('essay-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('essay-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Search functionality
function handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
        filteredEssays = currentCategory === 'all'
            ? [...allEssays]
            : allEssays.filter(e => e.categoryId === currentCategory);
    } else {
        const baseEssays = currentCategory === 'all'
            ? allEssays
            : allEssays.filter(e => e.categoryId === currentCategory);

        filteredEssays = baseEssays.filter(essay =>
            essay.title.toLowerCase().includes(searchTerm) ||
            essay.content.toLowerCase().includes(searchTerm) ||
            essay.category.toLowerCase().includes(searchTerm)
        );
    }

    renderEssays();
    updateResultsCount();
}

// Filter by category
function filterByCategory(category) {
    currentCategory = category;
    const searchQuery = document.getElementById('search-input').value;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Apply filter
    if (category === 'all') {
        filteredEssays = [...allEssays];
    } else {
        filteredEssays = allEssays.filter(e => e.categoryId === category);
    }

    // Re-apply search if there's a query
    if (searchQuery) {
        handleSearch(searchQuery);
    } else {
        renderEssays();
        updateResultsCount();
    }
}

// Update results count
function updateResultsCount() {
    const count = filteredEssays.length;
    const total = allEssays.length;
    document.getElementById('results-count').textContent =
        count === total ? `${total} essays` : `${count} of ${total} essays`;
    document.getElementById('essay-count').textContent = total;
}

// Random essay
function showRandomEssay() {
    const randomIndex = Math.floor(Math.random() * allEssays.length);
    const randomEssay = allEssays[randomIndex];
    openEssay(randomEssay.id);
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('theme-toggle').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('darkMode', isDark);
}

// Initialize dark mode from localStorage
function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').textContent = '☀️ Light Mode';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadEssays();
    initDarkMode();

    // Search input
    const searchInput = document.getElementById('search-input');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(e.target.value), 300);
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterByCategory(btn.dataset.category));
    });

    // Random button
    document.getElementById('random-btn').addEventListener('click', showRandomEssay);

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);

    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('essay-modal').addEventListener('click', (e) => {
        if (e.target.id === 'essay-modal') {
            closeModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
});
