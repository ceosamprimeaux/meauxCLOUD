export const getGalaxyLanding = () => `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeauxCLOUD | Unified Operations Hub - Enterprise Dashboard Platform</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="MeauxCLOUD is an enterprise-grade unified operations hub for projects, analytics, team management, and infrastructure. Built on Cloudflare's edge network with 99.9% uptime.">
    <meta name="keywords" content="MeauxCLOUD, operations hub, dashboard, Cloudflare, enterprise platform, project management, analytics, team collaboration, Meauxbility">
    <meta name="author" content="Meauxbility Foundation">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    },
                    colors: {
                        meaux: {
                            cyan: '#00D4FF',
                            blue: '#0077FF',
                            purple: '#8b5cf6',
                            pink: '#ec4899',
                            indigo: '#6366f1',
                        },
                        ice: {
                            50: '#F0F9FF',
                            100: '#E0F2FE',
                            200: '#BAE6FD',
                            300: '#7DD3FC',
                            400: '#38BDF8',
                            500: '#0EA5E9',
                            600: '#0284C7',
                            700: '#0369A1',
                            800: '#075985',
                            900: '#0C4A6E'
                        },
                        slate: {
                            850: '#151e2e',
                            900: '#0f172a',
                            950: '#020617',
                        }
                    },
                    animation: {
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'float': 'float 6s ease-in-out infinite',
                        'glow': 'glow 2s ease-in-out infinite alternate',
                    }
                }
            }
        }
    </script>

    <style>
        :root {
            --bg-primary: #020617;
            --bg-secondary: #0f172a;
            --text-primary: #E6EDF3;
            --text-secondary: #94a3b8;
            --glass-bg: rgba(0, 212, 255, 0.03);
            --glass-border: rgba(0, 212, 255, 0.15);
            --accent: #00D4FF;
        }

        [data-theme="light"] {
            --bg-primary: #FFFFFF;
            --bg-secondary: #F8FAFC;
            --text-primary: #0F172A;
            --text-secondary: #475569;
            --glass-bg: rgba(255, 255, 255, 0.8);
            --glass-border: rgba(0, 212, 255, 0.3);
        }

        body {
            background: var(--bg-primary);
            color: var(--text-secondary);
            font-family: 'Inter', sans-serif;
            overflow-x: hidden; 
        }

        /* Frosted Glass */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            transition: all 0.3s ease;
        }

        .glass-card:hover {
            background: rgba(0, 212, 255, 0.08);
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 212, 255, 0.15);
            border-color: rgba(0, 212, 255, 0.4);
        }

        /* Hero Glass */
        .hero-glass {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Gradient Text */
        .gradient-text {
            background: linear-gradient(135deg, #00D4FF 0%, #0077FF 50%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(0, 212, 255, 0.02);
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(0, 212, 255, 0.2);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 212, 255, 0.4);
        }
    </style>
</head>

<body class="antialiased selection:bg-meaux-cyan/30 selection:text-white">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style="background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(24px);">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a href="/" class="flex items-center gap-3 group">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-meaux-cyan to-meaux-blue flex items-center justify-center shadow-lg shadow-meaux-cyan/30 group-hover:shadow-meaux-cyan/50 transition-all">
                        <span class="text-white font-black text-lg">M</span>
                    </div>
                    <span class="font-bold text-lg text-white">Meaux<span class="text-meaux-cyan">OS</span></span>
                </a>

                <!-- Nav Links -->
                <div class="hidden md:flex items-center gap-2">
                    <a href="#features" class="nav-link text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors">Features</a>
                    <a href="#modules" class="nav-link text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors">Modules</a>
                    <a href="#analytics" class="nav-link text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors">Analytics</a>
                    <a href="#brands" class="nav-link text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors">Brands</a>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3">
                    <a href="/login" class="px-4 py-2 rounded-xl bg-gradient-to-r from-meaux-cyan to-meaux-blue text-white text-sm font-semibold shadow-lg shadow-meaux-cyan/25 hover:shadow-meaux-cyan/40 transition-all">
                        Launch Dashboard
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section with Interdimensional Planet -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <!-- Three.js Globe Container -->
        <div id="globeContainer" class="absolute inset-0 z-0"></div>

        <!-- Hero Content -->
        <div class="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
            <!-- Status Badge -->
            <div class="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full hero-glass border border-meaux-cyan/20">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-sm font-medium text-slate-300">All Systems Operational</span>
                <span class="text-xs text-meaux-cyan font-mono">v3.0</span>
            </div>

            <h1 class="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight text-white">
                Unified<br>
                <span class="gradient-text">Operations Hub</span>
            </h1>

            <p class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-slate-400">
                Enterprise dashboard for projects, analytics, team management, and infrastructure.
                <span class="text-meaux-cyan">Built on Cloudflare's edge network.</span>
            </p>

            <!-- CTA Buttons -->
            <div class="flex gap-4 justify-center flex-wrap mb-16">
                <a href="#modules" class="px-8 py-4 rounded-2xl bg-gradient-to-r from-meaux-cyan to-meaux-blue text-white font-bold shadow-lg shadow-meaux-cyan/30 hover:shadow-meaux-cyan/50 hover:scale-105 transition-all">
                    Explore Platform
                </a>
                <a href="/login" class="px-8 py-4 rounded-2xl hero-glass border border-white/10 text-white font-bold hover:border-meaux-cyan/30 hover:bg-meaux-cyan/5 transition-all">
                    View Dashboard →
                </a>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div class="hero-glass rounded-2xl p-6 border border-white/5">
                    <div class="text-3xl md:text-4xl font-black text-white mb-1">114</div>
                    <div class="text-sm text-slate-400">Active Workers</div>
                </div>
                <div class="hero-glass rounded-2xl p-6 border border-white/5">
                    <div class="text-3xl md:text-4xl font-black text-meaux-cyan mb-1">99.9%</div>
                    <div class="text-sm text-slate-400">Uptime SLA</div>
                </div>
                <div class="hero-glass rounded-2xl p-6 border border-white/5">
                    <div class="text-3xl md:text-4xl font-black text-white mb-1">&lt;42ms</div>
                    <div class="text-sm text-slate-400">Avg Latency</div>
                </div>
                <div class="hero-glass rounded-2xl p-6 border border-white/5">
                    <div class="text-3xl md:text-4xl font-black text-white mb-1">∞</div>
                    <div class="text-sm text-slate-400">Scalability</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Modules Section -->
    <section id="modules" class="py-32 px-6 relative">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-black text-white mb-4">Platform Modules</h2>
                <p class="text-xl text-slate-400">Complete operational suite for your organization</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6" id="modulesGrid">
                <!-- Dynamically populated by JS -->
            </div>
        </div>
    </section>

    <script>
        // ========================================
        // Three.js Interdimensional Planet
        // ========================================
        const container = document.getElementById('globeContainer');
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Create star field
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 8000;
        const starsPos = new Float32Array(starsCount * 3);
        const starsColors = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount; i++) {
            starsPos[i * 3] = (Math.random() - 0.5) * 250;
            starsPos[i * 3 + 1] = (Math.random() - 0.5) * 250;
            starsPos[i * 3 + 2] = (Math.random() - 0.5) * 250;

            const isCyan = Math.random() > 0.6;
            starsColors[i * 3] = isCyan ? 0 : 1;
            starsColors[i * 3 + 1] = isCyan ? 0.83 : 1;
            starsColors[i * 3 + 2] = 1;
        }

        starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
        starsGeo.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

        const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.9
        }));
        scene.add(stars);

        // Planet
        const planetGeo = new THREE.IcosahedronGeometry(8, 2);
        const planetMat = new THREE.MeshBasicMaterial({
            color: 0x00D4FF,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const planet = new THREE.Mesh(planetGeo, planetMat);
        scene.add(planet);

        // Animation Loop
        let mouseX = 0, mouseY = 0, scrollY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY * 0.001;
        });

        function animate() {
            requestAnimationFrame(animate);
            const time = Date.now() * 0.0003;
            stars.rotation.y += 0.00008;
            planet.rotation.y += 0.002 + scrollY * 0.008;
            planet.rotation.x = Math.sin(time * 0.5) * 0.1 + mouseY * 0.1;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
             camera.aspect = window.innerWidth / window.innerHeight;
             camera.updateProjectionMatrix();
             renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ========================================
        // Modules Grid
        // ========================================
        const modules = [
            { name: 'MeauxWork', code: 'MX-WK', icon: '📊', desc: 'Project Management', color: 'from-blue-400 to-blue-600' },
            { name: 'MeauxStats', code: 'MX-ST', icon: '📈', desc: 'Real-time Analytics', color: 'from-emerald-400 to-emerald-600' },
            { name: 'MeauxTeam', code: 'MX-TM', icon: '👥', desc: 'Team Portfolio', color: 'from-violet-400 to-violet-600' },
            { name: 'MeauxDOC', code: 'MX-DC', icon: '📁', desc: 'Document Storage', color: 'from-amber-400 to-amber-600' },
            { name: 'MeauxPHOTO', code: 'MX-PH', icon: '📷', desc: 'Editing Studio', color: 'from-pink-400 to-pink-600' },
            { name: 'MeauxMemories', code: 'MX-MM', icon: '🖼️', desc: 'Asset Library', color: 'from-rose-400 to-rose-600' },
            { name: 'MeauxCloud', code: 'MX-CL', icon: '☁️', desc: 'Unified Storage', color: 'from-cyan-400 to-cyan-600' },
            { name: 'MeauxCAD', code: 'MX-CD', icon: '🎨', desc: '3D Design', color: 'from-orange-400 to-orange-600' },
        ];

        document.getElementById('modulesGrid').innerHTML = modules.map(m => \`
            <div class="glass-card module-card p-6 cursor-pointer group block">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br \${m.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <span class="text-2xl">\${m.icon}</span>
                </div>
                <h3 class="text-xl font-bold text-white mb-1">\${m.name}</h3>
                <p class="text-sm text-slate-400 mb-3">\${m.desc}</p>
                <span class="text-xs font-mono text-meaux-cyan/70">/\${m.code}</span>
            </div>
        \`).join('');
    </script>
</body>
</html>`;
