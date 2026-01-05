import { getPublicNav, getPublicFooter } from '../components/public-nav';

export function getProductsPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Products - MeauxCLOUD</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
  <style>
    :root {
      --primary-teal: #4AECDC;
      --primary-cyan: #00D4FF;
      --bg-base: #f0f4f9;
      --clay-outer: 20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff;
      --clay-inner: inset 6px 6px 12px rgba(0,0,0,0.05), inset -6px -6px 12px rgba(255,255,255,0.8);
      --glass-bg: rgba(255, 255, 255, 0.4);
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-base);
      background-image: 
        radial-gradient(at 0% 0%, rgba(74, 236, 220, 0.2) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(0, 212, 255, 0.1) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(255, 107, 53, 0.1) 0px, transparent 50%);
    }
    
    .search-input {
      width: 100%;
      max-width: 500px;
      padding: 18px 30px;
      border-radius: 30px;
      border: none;
      background: white;
      box-shadow: var(--clay-outer), var(--clay-inner);
      font-size: 1rem;
      outline: none;
    }
    
    .filter-pill {
      padding: 10px 20px;
      background: white;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: var(--clay-outer);
      transition: 0.3s;
      border: 2px solid transparent;
    }
    
    .filter-pill.active {
      background: var(--primary-teal);
      color: white;
      box-shadow: 4px 4px 12px rgba(74, 236, 220, 0.4);
    }
    
    .app-card {
      background: var(--glass-bg);
      border-radius: 40px;
      padding: 30px 20px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: var(--clay-outer);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      position: relative;
    }
    
    .app-card:hover {
      transform: translateY(-10px) scale(1.02);
      background: rgba(255, 255, 255, 0.7);
      box-shadow: 30px 30px 60px rgba(0,0,0,0.1);
    }
    
    .app-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 40px;
      box-shadow: var(--clay-inner);
      pointer-events: none;
    }
    
    .app-icon-container {
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
      border-radius: 30px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      box-shadow: 10px 10px 20px rgba(0,0,0,0.05), -5px -5px 15px rgba(255,255,255,0.8);
      position: relative;
      overflow: hidden;
    }
    
    .app-icon-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .badge-3d {
      position: absolute;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #FF6B35, #FF9F43);
      color: white;
      font-size: 0.7rem;
      font-weight: 900;
      padding: 5px 12px;
      border-radius: 12px;
      box-shadow: 4px 4px 10px rgba(255, 107, 53, 0.3);
    }
    
    .featured-ring {
      position: absolute;
      inset: -2px;
      border: 3px solid var(--primary-teal);
      border-radius: 42px;
      opacity: 0.3;
    }
  </style>
</head>
<body class="font-sans antialiased">
  ${getPublicNav('products', 'light')}
  
  <main class="pt-32 pb-20 px-6 max-w-7xl mx-auto">
    <div class="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
      <div>
        <h1 class="text-5xl font-bold text-gray-900 mb-2">MeauxOS Products</h1>
        <p class="text-xl text-gray-600">AI-powered tools for modern teams</p>
      </div>
      <input type="text" id="searchBox" class="search-input" placeholder="Search products...">
    </div>
    
    <div class="flex gap-3 mb-8 flex-wrap" id="filterRow">
      <div class="filter-pill active" data-cat="all">All Products</div>
      <div class="filter-pill" data-cat="AI Tools">AI Tools</div>
      <div class="filter-pill" data-cat="Infrastructure">Infrastructure</div>
      <div class="filter-pill" data-cat="Creative">Creative</div>
      <div class="filter-pill" data-cat="Productivity">Productivity</div>
    </div>
    
    <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
      <svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      Featured Products
    </h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" id="featuredGrid"></div>
    
    <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
      <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
      </svg>
      All Products
    </h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" id="appsGrid"></div>
  </main>
  
  ${getPublicFooter('light')}
  
  <script>
    const products = [
      {id: "meauxcad", name: "MeauxCAD", description: "AI 3D Model Generation", color: "#4AECDC", icon: "cube", category: "AI Tools", featured: true, has3D: true},
      {id: "meauxdoc", name: "MeauxDOC", description: "Intelligent Document Gen", color: "#3498DB", icon: "document", category: "AI Tools", featured: true},
      {id: "meauxsafe", name: "MeauxSAFE", description: "Brand Compliance Guardian", color: "#9B59B6", icon: "shield", category: "AI Tools", featured: true},
      {id: "meauxgrants", name: "MeauxGrants", description: "AI Grant Writing", color: "#2ECC71", icon: "cash", category: "AI Tools"},
      {id: "meauxcreate", name: "MeauxCreate", description: "Creative Suite", color: "#E74C3C", icon: "sparkles", category: "Creative"},
      {id: "meauxcloud", name: "MeauxCloud", description: "Cloud Storage & Hosting", color: "#FF6B35", icon: "cloud", category: "Infrastructure"},
      {id: "meauxconnected", name: "MeauxConnected", description: "Database SQL Platform", color: "#00FF88", icon: "database", category: "Infrastructure"},
      {id: "meauxpower", name: "MeauxPower", description: "DevOps Automation", color: "#3498DB", icon: "lightning", category: "Infrastructure"},
      {id: "meauxaccess", name: "MeauxAccess", description: "Team Dashboard", color: "#4AECDC", icon: "users", category: "Productivity"},
      {id: "meauxtalk", name: "MeauxTalk", description: "Team Communication", color: "#2ECC71", icon: "chat", category: "Productivity"},
      {id: "meauxai", name: "MeauxAI", description: "AI Assistant Platform", color: "#9B59B6", icon: "cpu", category: "AI Tools"}
    ];
    
    const iconSVGs = {
      cube: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      document: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      shield: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
      cash: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      sparkles: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
      cloud: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>',
      database: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>',
      lightning: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      users: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      chat: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
      cpu: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>'
    };
    
    function renderProducts(filter = 'all', search = '') {
      const fGrid = document.getElementById('featuredGrid');
      const aGrid = document.getElementById('appsGrid');
      fGrid.innerHTML = '';
      aGrid.innerHTML = '';
      
      products.forEach(app => {
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                             app.description.toLowerCase().includes(search.toLowerCase());
        const matchesCat = filter === 'all' || app.category === filter;
        
        if (!matchesSearch || !matchesCat) return;
        
        const cardHtml = \`
          <div class="app-card" onclick="window.location.href='/dashboard'">
            \${app.featured ? '<div class="featured-ring"></div>' : ''}
            \${app.has3D ? '<div class="badge-3d">3D</div>' : ''}
            <div class="app-icon-container" style="background: linear-gradient(135deg, \${app.color}11, \${app.color}33); color: \${app.color}">
              \${app.iconUrl ? \`<img src="\${app.iconUrl}">\` : iconSVGs[app.icon] || ''}
            </div>
            <div class="text-xl font-bold text-gray-900 mb-2">\${app.name}</div>
            <div class="text-sm text-gray-600">\${app.description}</div>
          </div>
        \`;
        
        if (app.featured && filter === 'all' && search === '') {
          fGrid.innerHTML += cardHtml;
        } else {
          aGrid.innerHTML += cardHtml;
        }
      });
    }
    
    document.getElementById('searchBox').addEventListener('input', (e) => {
      const activePill = document.querySelector('.filter-pill.active');
      renderProducts(activePill.dataset.cat, e.target.value);
    });
    
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelector('.filter-pill.active').classList.remove('active');
        pill.classList.add('active');
        const search = document.getElementById('searchBox').value;
        renderProducts(pill.dataset.cat, search);
      });
    });
    
    renderProducts();
  </script>
</body>
</html>`;
}
