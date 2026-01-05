// Shared navigation component for public pages
export function getPublicNav(currentPage: string = 'home', theme: 'light' | 'dark' = 'light') {
  const isDark = theme === 'dark';

  return `
    <style>
      .nav-glass {
        background: ${isDark ? 'rgba(15, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
      }
      
      .mobile-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 320px;
        height: 100vh;
        background: ${isDark ? 'rgba(15, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        overflow-y: auto;
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
      }
      
      .mobile-menu.active {
        right: 0;
      }
      
      .nav-link {
        color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
        transition: all 0.2s;
      }
      
      .nav-link:hover, .nav-link.active {
        color: ${isDark ? '#fff' : '#3b82f6'};
      }
      
      .mobile-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        z-index: 999;
      }
      
      .mobile-overlay.active {
        opacity: 1;
        pointer-events: all;
      }
    </style>
    
    <!-- Navigation -->
    <nav class="nav-glass fixed top-0 w-full z-50 shadow-lg">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a href="/" class="flex items-center gap-2">
            <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
            <span class="text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}">MeauxCLOUD</span>
          </a>
          
          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <a href="/" class="nav-link ${currentPage === 'home' ? 'active font-semibold' : ''} text-sm">Home</a>
            <a href="/about" class="nav-link ${currentPage === 'about' ? 'active font-semibold' : ''} text-sm">About</a>
            <a href="/services" class="nav-link ${currentPage === 'services' ? 'active font-semibold' : ''} text-sm">Services</a>
            <a href="/products" class="nav-link ${currentPage === 'products' ? 'active font-semibold' : ''} text-sm">Products</a>
            <a href="/contact" class="nav-link ${currentPage === 'contact' ? 'active font-semibold' : ''} text-sm">Contact</a>
            <a href="/dashboard" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
              Dashboard
            </a>
          </div>
          
          <!-- Mobile Menu Button -->
          <button onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-lg ${isDark ? 'text-white' : 'text-gray-900'}">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
    
    <!-- Mobile Menu Overlay -->
    <div id="mobileOverlay" class="mobile-overlay" onclick="toggleMobileMenu()"></div>
    
    <!-- Mobile Menu -->
    <div id="mobileMenu" class="mobile-menu">
      <div class="p-6">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
            <span class="text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}">MeauxCLOUD</span>
          </div>
          <button onclick="toggleMobileMenu()" class="p-2 rounded-lg ${isDark ? 'text-white' : 'text-gray-900'}">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="space-y-2">
          <a href="/" class="block px-4 py-3 rounded-lg ${currentPage === 'home' ? 'bg-blue-100 text-blue-600 font-semibold' : isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors">
            Home
          </a>
          <a href="/about" class="block px-4 py-3 rounded-lg ${currentPage === 'about' ? 'bg-blue-100 text-blue-600 font-semibold' : isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors">
            About
          </a>
          <a href="/services" class="block px-4 py-3 rounded-lg ${currentPage === 'services' ? 'bg-blue-100 text-blue-600 font-semibold' : isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors">
            Services
          </a>
          <a href="/products" class="block px-4 py-3 rounded-lg ${currentPage === 'products' ? 'bg-blue-100 text-blue-600 font-semibold' : isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors">
            Products
          </a>
          <a href="/contact" class="block px-4 py-3 rounded-lg ${currentPage === 'contact' ? 'bg-blue-100 text-blue-600 font-semibold' : isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors">
            Contact
          </a>
          <a href="/dashboard" class="block px-4 py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center transition-colors">
            Dashboard
          </a>
        </div>
      </div>
    </div>
    
    <script>
      function toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
      }
    </script>
  `;
}

export function getPublicFooter(theme: 'light' | 'dark' = 'light') {
  const isDark = theme === 'dark';

  return `
    <style>
      .mbx-footer {
        position: relative;
        overflow: hidden;
        /* Claymorphic Backgrounds */
        background: ${isDark ? 'linear-gradient(135deg, #1a1b26 0%, #0f172a 100%)' : '#f0f4f8'};
        color: ${isDark ? '#e2e8f0' : '#334155'};
        padding-top: 80px;
        font-family: 'Inter', sans-serif;
        box-shadow: ${isDark ? 'inset 0 10px 30px rgba(0,0,0,0.5)' : 'inset 0 10px 30px rgba(255,255,255,0.8)'};
      }
      
      /* Depth container for 3D model */
      .mbx-footer-depth-layer {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 400px;
        height: 400px;
        opacity: 1; /* Max visibility */
        pointer-events: none;
        z-index: 10;
        /* No border (production) */
      }

      .mbx-footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 32px;
        position: relative;
        z-index: 10; /* Above the 3D model */
      }

      .mbx-footer-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 60px;
        margin-bottom: 80px;
      }

      /* Typography & Contrast Remaster */
      .mbx-footer-brand h4 {
        margin-top: 24px;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: ${isDark ? '#fff' : '#0f172a'}; /* High contrast */
      }

      .mbx-footer-column h4 {
        font-size: 1.1rem;
        font-weight: 700;
        color: ${isDark ? '#fff' : '#0f172a'}; /* High contrast */
        margin-bottom: 24px;
        letter-spacing: -0.01em;
      }
      
      .mbx-footer-links li { margin-bottom: 16px; }
      
      .mbx-footer-links a {
        color: ${isDark ? '#cbd5e1' : '#475569'}; /* Better readability */
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
        display: inline-block;
      }
      
      .mbx-footer-links a:hover {
        color: ${isDark ? '#60a5fa' : '#2563eb'};
        transform: translateX(4px);
      }

      /* Clay Button for Newsletter */
      .mbx-newsletter-input {
        flex: 1;
        padding: 14px 20px;
        border-radius: 16px;
        border: 2px solid transparent;
        background: ${isDark ? 'rgba(255,255,255,0.08)' : '#fff'};
        color: ${isDark ? '#fff' : '#1e293b'};
        box-shadow: ${isDark ? 'none' : 'inset 2px 2px 6px rgba(0,0,0,0.05)'};
        transition: all 0.3s;
      }
      
      .mbx-newsletter-input:focus {
        background: ${isDark ? 'rgba(255,255,255,0.12)' : '#fff'};
        border-color: #3b82f6;
        outline: none;
      }

      .mbx-newsletter-btn {
        padding: 14px 24px;
        background: #3b82f6;
        color: white;
        border-radius: 16px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); /* Soft Glow */
        transition: all 0.3s;
      }
      
      .mbx-newsletter-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
      }

      /* Social Icon Clay Tokens */
      .mbx-social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: ${isDark ? 'rgba(255,255,255,0.05)' : '#fff'};
        color: ${isDark ? '#cbd5e1' : '#64748b'};
        box-shadow: ${isDark ? 'none' : '4px 4px 10px rgba(0,0,0,0.05), -4px -4px 10px rgba(255,255,255,0.8)'};
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .mbx-social-link:hover {
        transform: translateY(-4px) scale(1.1);
        color: #3b82f6;
        background: ${isDark ? 'rgba(255,255,255,0.1)' : '#fff'};
      }

       @media (max-width: 900px) {
        .mbx-footer-grid {
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .mbx-footer-depth-layer {
            width: 300px;
            height: 300px;
            bottom: -20px;
            right: -50px;
        }
      }
    </style>

    <footer class="mbx-footer" id="mbx-footer" role="contentinfo">
        
        <!-- Embedded Depth Layer -->
        <div class="mbx-footer-depth-layer" aria-hidden="true">
             <model-viewer 
              src="https://pub-febda61713d64e768cd4a841fec58f63.r2.dev/Kinetic_Symmetry_0831084700_generate%20(1).glb" 
              alt="Meauxbility Kinetic Symmetry" 
              auto-rotate 
              rotation-per-second="12deg" 
              camera-controls="false" 
              disable-zoom 
              disable-pan 
              disable-tap 
              interaction-prompt="none" 
              shadow-intensity="0" 
              exposure="${isDark ? '1.5' : '1.0'}" 
              loading="lazy" 
              style="width:100%; height:100%; --poster-color: transparent;">
            </model-viewer>
        </div>

        <div class="mbx-footer-container">
            <div class="mbx-footer-grid">
                <!-- Brand Column -->
                <div class="mbx-footer-brand">
                    <a href="/" class="flex items-center gap-3 mb-6 group">
                         <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg transition-transform group-hover:scale-110">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
                         </div>
                        <span class="text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}">MeauxCLOUD</span>
                    </a>

                    <div class="mbx-footer-social" role="list">
                        <a class="mbx-social-link" href="https://facebook.com" aria-label="Facebook"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                        <a class="mbx-social-link" href="https://instagram.com" aria-label="Instagram"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 15.838a3.838 3.838 0 110-7.676 3.838 3.838 0 010 7.676zM18.406 5.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg></a>
                    </div>

                    <p style="line-height: 1.6; margin-bottom: 24px; opacity: 0.9; max-width: 320px;">
                        Transforming obstacles into pathways. We build adaptive infrastructure for the modern web and beyond.
                    </p>

                    <div class="mbx-newsletter">
                        <h4>Stay Connected</h4>
                        <form class="mbx-newsletter-form" id="mbx-newsletterForm" onsubmit="handleNewsletter(event)">
                            <input type="email" class="mbx-newsletter-input" placeholder="Enter your email" required aria-label="Email address">
                            <button type="submit" class="mbx-newsletter-btn">Subscribe</button>
                        </form>
                    </div>
                </div>

                <!-- Products Column -->
                <div class="mbx-footer-column">
                    <h4>Ecosystem</h4>
                    <ul class="mbx-footer-links" role="list">
                        <li><a href="/products">MeauxCLOUD</a></li>
                        <li><a href="/products">MeauxAI Engine</a></li>
                        <li><a href="/products">MeauxDOC</a></li>
                        <li><a href="/products">MeauxSAFE</a></li>
                        <li><a href="/products">MeauxPower</a></li>
                    </ul>
                </div>

                <!-- Company Column -->
                <div class="mbx-footer-column">
                    <h4>Company</h4>
                    <ul class="mbx-footer-links" role="list">
                        <li><a href="/about">Our Mission</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/contact">Partnerships</a></li>
                        <li><a href="https://meauxbility.org">Meauxbility Foundation</a></li>
                    </ul>
                </div>

                <!-- Support Column -->
                <div class="mbx-footer-column">
                    <h4>Support & Give</h4>
                    <ul class="mbx-footer-links" role="list">
                        <li><a href="/contact">Help Center</a></li>
                        <li><a href="#" onclick="openStripeModal()" style="color: #3b82f6; font-weight: 600;">♥ Donate Now</a></li>
                        <li><a href="/dashboard">Client Portal</a></li>
                        <li><a href="/contact">System Status</a></li>
                    </ul>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="mbx-footer-bottom" style="flex-direction: row; justify-content: space-between;">
                <div class="mbx-footer-copyright">
                    © ${new Date().getFullYear()} MeauxCLOUD. Part of the Meauxbility Ecosystem.
                </div>
                
                <div class="mbx-footer-legal">
                    <a href="/privacy">Privacy</a>
                    <span aria-hidden="true" style="opacity:0.3">•</span>
                    <a href="/terms">Terms</a>
                    <span aria-hidden="true" style="opacity:0.3">•</span>
                    <a href="/accessibility">Accessibility</a>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <a href="https://inneranimalmedia.com" target="_blank" rel="noopener noreferrer" style="text-decoration:none; opacity: 0.7; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: opacity 0.2s;">
                         <span>Designed by InnerAnimal</span>
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Stripe Modal Logic -->
    <script>
        function openStripeModal() {
            // Replace with actual Stripe payment link or checkout logic
            window.location.href = 'https://buy.stripe.com/5kA5mccm26i37O8288';
        }

        function handleNewsletter(e) {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            // Add newsletter subscription logic here
            alert('Thanks for subscribing! We will keep you posted.');
            e.target.reset();
        }
    </script>
    `;
}
