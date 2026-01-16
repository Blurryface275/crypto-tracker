const coinContainer = document.getElementById('coinContainer');
const searchInput = document.getElementById('searchInput');
const loading = document.getElementById('loading');

let coinsData = [];
let currentPage = 1;
const perPage = 20; 

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const apiKey = 'CG-HWqte9JdwYDE4yMCvUAMQyxP';

async function fetchCoins(page = 1) {
    try {
        // Memanggil key dari file config
        const apiKey = CONFIG.API_KEY; 

        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${page}`, {
            headers: {
                'accept': 'application/json',
                'x-cg-demo-api-key': apiKey 
            }
        });

        if (!response.ok) {
            if (response.status === 429) throw new Error('Rate limit (30 req/min) tercapai!');
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        renderCoins(data);
    } catch (error) {
        console.error("Audit Fail:", error.message);
    }
}
function updatePaginationUI(data, page){
    currentPage = page;
    pageIndicator.textContent = `Page ${currentPage}`;

    prevBtn.disabled = (currentPage === 1); // ini disable kalo currentPage adalah 1

    if (data.length < perPage) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

// Event Listeners
nextBtn.addEventListener('click', () => {
    fetchCoins(currentPage + 1);
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchCoins(currentPage - 1);
    }
});

function renderCoins(data){
    coinContainer.innerHTML = ''; // Clear container
    data.forEach(coin => {
        const isUp = coin.price_change_percentage_24h > 0;
        const card = document.createElement('div');
        card.className = 'coin-card';
        
        // Menggunakan textContent untuk keamanan (mencegah XSS)
        card.innerHTML = `
            <div class="coin-header">
                <img src="${coin.image}" alt="${coin.name}">
                <h3>${coin.name} <span>(${coin.symbol.toUpperCase()})</span></h3>
            </div>
            <div class="price">$${coin.current_price.toLocaleString()}</div>
            <div class="change ${isUp ? 'up' : 'down'}">
                ${isUp ? '▲' : '▼'} ${coin.price_change_percentage_24h.toFixed(2)}%
            </div>
        `;
        coinContainer.appendChild(card);
    });
}

searchInput.addEventListener('input', (e)=>{
    const searchTerm = e.target.value.toLowerCase();
    const filtered = coinsData.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm) ||
        coin.symbol.toLowerCase().includes(searchTerm)
    );
    renderCoins(filtered);
})

fetchCoins(currentPage);