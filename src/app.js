/**
 * script: app.js
 * 目的  : Fortnite shop data表示
 * 入力  : shop.json
 * 出力  : DOM操作によるUI更新
 */

async function loadShopData() {
    try {
        const response = await fetch('../public/shop.json');
        const data = await response.json();
        
        displayFeaturedItems(data.featured?.entries || []);
        displayDailyItems(data.daily?.entries || []);
        updateLastUpdateTime(data.date);
        
    } catch (error) {
        console.error('Error loading shop data:', error);
        showErrorMessage();
    }
}

function displayFeaturedItems(items) {
    const featuredGrid = document.getElementById('featured-grid');
    featuredGrid.innerHTML = '';
    
    items.forEach(item => {
        const card = createItemCard(item);
        featuredGrid.appendChild(card);
    });
}

function displayDailyItems(items) {
    const dailyGrid = document.getElementById('daily-grid');
    dailyGrid.innerHTML = '';
    
    items.forEach(item => {
        const card = createItemCard(item);
        dailyGrid.appendChild(card);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const mainItem = item.items[0];
    const imageUrl = mainItem.images?.icon || mainItem.images?.featured || '';
    const price = item.finalPrice || 0;
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${mainItem.name}" class="item-image" onerror="this.src='https://via.placeholder.com/200'">
        <div class="item-name">${mainItem.name}</div>
        <div class="item-price">${price} V-Bucks</div>
    `;
    
    return card;
}

function updateLastUpdateTime(dateString) {
    const lastUpdateSpan = document.querySelector('#last-update span');
    if (dateString) {
        const date = new Date(dateString);
        lastUpdateSpan.textContent = date.toLocaleString('ja-JP');
    }
}

function showErrorMessage() {
    const main = document.querySelector('main');
    main.innerHTML = '<p style="text-align: center; padding: 2rem;">Shop data could not be loaded. Please try again later.</p>';
}

document.addEventListener('DOMContentLoaded', loadShopData);