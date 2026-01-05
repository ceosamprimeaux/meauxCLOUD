export function getAnalyticsPage(user: any = {}) {
    const userName = user.name || 'Admin User';
    const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics | Meauxbility Operations Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --meaux-blue: #0077FF;
      --meaux-cyan: #00D4FF;
      --meaux-teal: #1F97A9;
      --meaux-indigo: #4F46E5;
      --bg-dark: #0a0a1f;
      --text-primary: #FFFFFF;
      --text-secondary: #B4B4C8;
      --text-tertiary: #7E7E99;
      --success-green: #10B981;
      --error-red: #EF4444;
    }
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0a0a1f 0%, #0a1a2e 50%, #0a0a1f 100%);
      color: var(--text-primary);
      min-height: 100vh;
      overflow-x: hidden;
    }
    /* Starfield */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, rgba(0, 212, 255, 0.8), transparent),
        radial-gradient(2px 2px at 60px 70px, rgba(0, 119, 255, 0.6), transparent);
      background-size: 200px 200px;
      opacity: 0.4;
      pointer-events: none;
      z-index: 0;
    }
    .app-container { display: flex; position: relative; z-index: 1; min-height: 100vh; }
    
    /* Sidebar */
    .sidebar {
      width: 280px;
      background: rgba(10, 10, 31, 0.95);
      border-right: 1px solid rgba(255,255,255,0.08);
      position: fixed;
      inset: 0 auto 0 0;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      backdrop-filter: blur(20px);
    }
    .sidebar-header { padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .logo-icon {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, var(--meaux-blue), var(--meaux-cyan));
      border-radius: 12px;
      display: grid; place-items: center;
      font-weight: 800; color: white;
    }
    .logo-text {
      font-size: 20px; font-weight: 700;
      background: linear-gradient(135deg, #fff, var(--meaux-cyan));
      -webkit-background-clip: text; color: transparent;
    }

    .nav-section { padding: 12px 0; }
    .nav-section-title { padding: 0 20px 8px; font-size: 10px; text-transform: uppercase; color: var(--text-tertiary); letter-spacing: 0.1em; font-weight: 600; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 20px; margin: 2px 12px;
      color: var(--text-secondary); text-decoration: none;
      font-size: 14px; font-weight: 500; border-radius: 10px;
      transition: all 0.2s;
    }
    .nav-item:hover { background: rgba(0, 119, 255, 0.08); color: white; }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(0,119,255,0.2), rgba(0,212,255,0.15));
      color: white;
      border: 1px solid rgba(0,119,255,0.3);
    }
    .nav-item i { font-size: 20px; min-width: 20px; }

    /* Top Header (The Brand Dropdown Area) */
    .top-header {
      position: sticky; top: 0;
      background: rgba(10, 10, 31, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 16px 32px;
      display: flex; align-items: center; justify-content: space-between;
      z-index: 900;
      margin-left: 280px; /* Offset for sidebar */
    }
    
    /* Brand Dropdown */
    .brand-dropdown { position: relative; }
    .brand-btn {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 8px 16px; border-radius: 12px;
      color: white; cursor: pointer; font-weight: 500;
      transition: all 0.2s;
    }
    .brand-btn:hover { background: rgba(255,255,255,0.1); }
    .brand-menu {
      position: absolute; top: 100%; left: 0;
      margin-top: 8px; width: 240px;
      background: #1e293b;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 8px;
      display: none;
      flex-direction: column;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .brand-menu.show { display: flex; }
    .brand-item {
      padding: 10px 12px;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      display: flex; align-items: center; gap: 10px;
    }
    .brand-item:hover { background: rgba(255,255,255,0.05); color: white; }
    .brand-item i { color: var(--meaux-cyan); }

    /* Main Content */
    .main-content { margin-left: 280px; padding: 0; min-height: 100vh; }
    .content-wrapper { padding: 32px; }

    /* Cards & Stats */
    .stats-grid { 
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
      gap: 20px; margin-bottom: 32px; 
    }
    .stat-card {
      background: rgba(15, 15, 35, 0.7);
      border: 1px solid rgba(0, 119, 255, 0.2);
      border-radius: 20px; padding: 24px;
      transition: transform 0.2s;
    }
    .stat-card:hover { transform: translateY(-4px); border-color: var(--meaux-blue); }
    .stat-value { font-size: 32px; font-weight: 800; margin: 12px 0 4px; }
    .stat-header { display: flex; justify-content: space-between; align-items: center; }
    .trend { font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 12px; }
    .trend.up { background: rgba(16, 185, 129, 0.15); color: var(--success-green); }

    /* Charts */
    .chart-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px; }
    .chart-card {
      background: rgba(15, 15, 35, 0.7);
      border: 1px solid rgba(0, 119, 255, 0.2);
      border-radius: 24px; padding: 24px;
      height: 400px; position: relative;
    }

    /* Agent Sam Floating Button */
    .agent-fab {
      position: fixed; bottom: 30px; right: 30px;
      width: 60px; height: 60px;
      background: linear-gradient(135deg, var(--meaux-blue), var(--meaux-cyan));
      border-radius: 50%;
      display: grid; place-items: center;
      color: white; font-size: 28px;
      box-shadow: 0 8px 32px rgba(0,119,255,0.5);
      cursor: pointer; z-index: 2000;
      transition: transform 0.2s;
    }
    .agent-fab:hover { transform: scale(1.1); }
  </style>
</head>
<body>
  <div class="app-container">
    
    <!-- Unified Sidebar -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <a href="/dashboard" class="logo">
          <div class="logo-icon">M</div>
          <span class="logo-text">Meauxbility</span>
        </a>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Core</div>
        <a href="/dashboard" class="nav-item"><i class='bx bxs-dashboard'></i> Dashboard</a>
        <a href="/analytics" class="nav-item active"><i class='bx bx-bar-chart-alt-2'></i> Analytics</a>
        <a href="/projects" class="nav-item"><i class='bx bx-folder'></i> Projects</a>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Workspace</div>
        <a href="/documents" class="nav-item"><i class='bx bx-file'></i> Documents</a>
        <a href="/photos" class="nav-item"><i class='bx bx-image'></i> Photos</a>
        <a href="/media" class="nav-item"><i class='bx bx-play-circle'></i> Media</a>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">System</div>
        <a href="/settings" class="nav-item"><i class='bx bx-cog'></i> Settings</a>
      </div>

      <div class="nav-section" style="margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
         <div class="nav-item">
            <div class="logo-icon" style="width:32px; height:32px; font-size:14px;">${userInitials}</div>
            <div style="font-size:14px; font-weight:600;">${userName}</div>
         </div>
      </div>
    </nav>

    <!-- Content Area -->
    <div style="flex:1; display:flex; flex-direction:column;">
      
      <!-- Top Header with Brand Dropdown -->
      <header class="top-header">
        <div class="brand-dropdown">
          <div class="brand-btn" onclick="toggleBrandMenu()">
            <i class='bx bxs-cloud'></i> MeauxCLOUD Nonprofit <i class='bx bx-chevron-down'></i>
          </div>
          <div class="brand-menu" id="brandMenu">
            <a href="/meauxbility" class="brand-item"><i class='bx bxs-business'></i> Meauxbility</a>
            <a href="/iautodidact" class="brand-item"><i class='bx bxs-graduation'></i> IAutodidact</a>
            <a href="/inneranimal" class="brand-item"><i class='bx bxs-heart'></i> Inner Animal</a>
            <a href="/sandbox" class="brand-item"><i class='bx bxs-cube'></i> Sandbox</a>
          </div>
        </div>

        <div style="display:flex; gap:20px; align-items:center;">
           <button class="brand-btn" style="padding:8px;"><i class='bx bx-bell'></i></button>
           <button class="brand-btn" style="padding:8px;"><i class='bx bx-search'></i></button>
        </div>
      </header>

      <!-- Main Scrollable Content -->
      <main class="main-content" style="margin-left:0;"> 
        <div class="content-wrapper">
          <div style="margin-bottom:32px;">
            <h1 style="font-size:32px; font-weight:800; margin-bottom:8px;">Analytics Dashboard</h1>
            <p style="color:var(--text-secondary);">Real-time insights and performance metrics across all operations</p>
          </div>

          <!-- Stats -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-header">
                <i class='bx bx-folder' style="font-size:24px; color:var(--meaux-cyan);"></i>
                <span class="trend up">+18%</span>
              </div>
              <div class="stat-value">47</div>
              <div style="color:var(--text-secondary); font-size:14px;">Active Projects</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <i class='bx bx-target-lock' style="font-size:24px; color:var(--meaux-blue);"></i>
                <span class="trend up">+24%</span>
              </div>
              <div class="stat-value">8</div>
              <div style="color:var(--text-secondary); font-size:14px;">Active Campaigns</div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <i class='bx bx-group' style="font-size:24px; color:var(--meaux-teal);"></i>
                <span class="trend up">+32%</span>
              </div>
              <div class="stat-value">156</div>
              <div style="color:var(--text-secondary); font-size:14px;">Active Volunteers</div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <i class='bx bx-dollar-circle' style="font-size:24px; color:var(--success-green);"></i>
                <span class="trend up">+42%</span>
              </div>
              <div class="stat-value">$89.2K</div>
              <div style="color:var(--text-secondary); font-size:14px;">Total Donations</div>
            </div>
          </div>

          <!-- Charts -->
          <div class="chart-grid">
            <div class="chart-card">
              <h3 style="margin-bottom:20px;">Project Status</h3>
              <div style="position:relative; height:300px;"><canvas id="projectChart"></canvas></div>
            </div>
            <div class="chart-card">
              <h3 style="margin-bottom:20px;">Campaign Funding</h3>
              <div style="position:relative; height:300px;"><canvas id="campaignChart"></canvas></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>

  <!-- Agent Sam -->
  <div class="agent-fab"><i class='bx bx-bot'></i></div>

  <script>
    // Toggle Brand Dropdown
    function toggleBrandMenu() {
      const menu = document.getElementById('brandMenu');
      menu.classList.toggle('show');
    }

    // Close dropdown on outside click
    window.onclick = function(event) {
      if (!event.target.matches('.brand-btn') && !event.target.closest('.brand-btn')) {
        const menu = document.getElementById('brandMenu');
        if (menu.classList.contains('show')) menu.classList.remove('show');
      }
    }

    // Init Charts
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
    
    // Projects
    new Chart(document.getElementById('projectChart'), {
      type: 'doughnut',
      data: {
        labels: ['In Progress', 'Completed', 'On Hold', 'Planning'],
        datasets: [{
          data: [18, 22, 4, 3],
          backgroundColor: ['#0077FF', '#00D4FF', '#1F97A9', '#4F46E5'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Campaigns
    new Chart(document.getElementById('campaignChart'), {
      type: 'bar',
      data: {
        labels: ['Wheelchair', 'Equipment', 'Home Mods', 'Transport', 'Outreach'],
        datasets: [{
          label: 'Current',
          data: [42580, 28900, 31250, 19870, 12450],
          backgroundColor: '#0077FF',
          borderRadius: 8
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  </script>
</body>
</html>`;
}
