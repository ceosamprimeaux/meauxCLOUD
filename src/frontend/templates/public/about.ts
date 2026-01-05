import { getPublicNav, getPublicFooter } from '../components/public-nav';

const boxIcons = {
    speed: `<svg class="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
    brain: `<svg class="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>`,
    globe: `<svg class="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    check: `<svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`
};

export function getAboutPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About MeauxCLOUD - The Engine</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
  <style>
    :root {
      --clay-bg: #1e293b;
      --clay-surface: #334155;
      --clay-shadow-out: 8px 8px 16px rgba(0,0,0,0.4), -8px -8px 16px rgba(255,255,255,0.05);
      --clay-shadow-in: inset 6px 6px 12px rgba(0,0,0,0.3), inset -6px -6px 12px rgba(255,255,255,0.05);
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--clay-bg);
      color: #f8fafc;
      overflow-x: hidden;
    }

    /* Premium Clay Card */
    .clay-card {
      background: var(--clay-surface);
      border-radius: 30px;
      box-shadow: var(--clay-shadow-out);
      border: 1px solid rgba(255,255,255,0.02);
      transition: transform 0.3s ease;
    }
    
    .clay-card:hover {
        transform: translateY(-5px);
    }

    /* Recessed Area (Inset Clay) */
    .clay-well {
      border-radius: 20px;
      background: #253045;
      box-shadow: var(--clay-shadow-in);
    }

    /* Hero Model Container - The "Showcase Viewport" */
    .model-viewport {
      position: relative;
      width: 100%;
      height: 600px; /* Tall and imposing */
      border-radius: 40px;
      background: radial-gradient(circle at center, #334155 0%, #1e293b 70%);
      box-shadow: var(--clay-shadow-in);
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.05);
    }

    /* Stats Grid */
    .stat-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-radius: 20px;
        background: var(--clay-surface);
        box-shadow: var(--clay-shadow-out);
        text-align: center;
    }

    /* Utility */
    .text-glow {
        text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }
  </style>
</head>
<body class="antialiased selection:bg-blue-500 selection:text-white">
  ${getPublicNav('about', 'dark')}

  <main class="pt-32 pb-20 px-6 max-w-7xl mx-auto">
    
    <!-- Split Layout: Info vs. Hardware Showcase -->
    <div class="grid lg:grid-cols-2 gap-16 items-center mb-32">
        
        <!-- Left: The Narrative -->
        <div class="space-y-10">
            <div>
                <span class="inline-flex items-center px-4 py-2 rounded-full bg-[#253045] shadow-inner text-blue-400 font-semibold text-sm tracking-wide mb-6">
                   ${boxIcons.check} <span class="ml-2">Meauxbility Ecosystem V1.0</span>
                </span>
                <h1 class="text-6xl font-extrabold tracking-tight leading-none mb-6">
                    <span class="block">Propulsion</span>
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">For Humanity.</span>
                </h1>
                <p class="text-xl text-gray-400 leading-relaxed font-light">
                    MeauxCLOUD isn't just infrastructure; it's the kinetic energy behind the Meauxbility mission.
                    We engineering adaptive systems—from AI agents to edge networks—that act as a force multiplier for human potential.
                </p>
            </div>

            <!-- Key Specs Clay Grid -->
            <div class="grid grid-cols-2 gap-6">
                <div class="stat-box">
                    <span class="text-3xl font-bold text-white mb-1">0ms</span>
                    <span class="text-xs text-blue-300 uppercase tracking-widest">Latency Goal</span>
                </div>
                <div class="stat-box">
                    <span class="text-3xl font-bold text-white mb-1">100%</span>
                    <span class="text-xs text-blue-300 uppercase tracking-widest">Uptime</span>
                </div>
                <div class="stat-box">
                    <span class="text-3xl font-bold text-white mb-1">Global</span>
                    <span class="text-xs text-blue-300 uppercase tracking-widest">Edge Network</span>
                </div>
                <div class="stat-box">
                    <span class="text-3xl font-bold text-white mb-1">Secure</span>
                    <span class="text-xs text-blue-300 uppercase tracking-widest">End-to-End</span>
                </div>
            </div>

            <div class="flex gap-6 pt-4">
                 <a href="/services" class="flex-1 py-4 clay-card flex items-center justify-center font-bold text-lg text-white hover:text-blue-300">
                    Explore Services
                 </a>
                 <a href="/contact" class="flex-1 py-4 clay-well flex items-center justify-center font-bold text-lg text-gray-400 hover:text-white transition-colors">
                    Contact Engineering
                 </a>
            </div>
        </div>

        <!-- Right: The Hardware Showcase (3D Model) -->
        <div class="relative">
            <div class="model-viewport">
                <!-- R2 Model Loading -->
                <model-viewer 
                    src="/api/proxy/jet.glb"
                    alt="Meauxbility Propulsion Unit" 
                    auto-rotate 
                    camera-controls 
                    shadow-intensity="1" 
                    exposure="1.0"
                    loading="eager"
                    camera-orbit="45deg 55deg 105%"
                    min-camera-orbit="auto auto 5%"
                    max-camera-orbit="auto auto 100%"
                    interaction-prompt="none"
                    style="width: 100%; height: 100%;">
                </model-viewer>
                
                <!-- Overlay badge -->
                <div class="absolute bottom-8 left-8 bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                    <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Model ID</p>
                    <p class="font-mono text-blue-400 font-bold">MX-JET-V2</p>
                </div>
            </div>
            
            <!-- Decorative Elements behind viewport -->
            <div class="absolute -z-10 top-20 -right-20 w-72 h-72 bg-blue-600/20 blur-[100px] rounded-full"></div>
            <div class="absolute -z-10 -bottom-10 -left-10 w-72 h-72 bg-purple-600/20 blur-[100px] rounded-full"></div>
        </div>

    </div>

    <!-- Feature Clay Strip -->
    <div class="grid md:grid-cols-3 gap-8">
        <div class="clay-card p-8 group">
            <div class="w-16 h-16 rounded-2xl bg-[#253045] shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                ${boxIcons.speed}
            </div>
            <h3 class="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Adaptive Speed</h3>
            <p class="text-gray-400 leading-relaxed">
                Infrastructure that learns and scales. Our edge computing nodes ensure that tools are available instantly, anywhere in the world.
            </p>
        </div>

        <div class="clay-card p-8 group">
            <div class="w-16 h-16 rounded-2xl bg-[#253045] shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                ${boxIcons.brain}
            </div>
            <h3 class="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Neural Core</h3>
            <p class="text-gray-400 leading-relaxed">
                Powered by MeauxAI. We integrate large language models directly into the routing layer for intelligent request handling.
            </p>
        </div>

        <div class="clay-card p-8 group">
             <div class="w-16 h-16 rounded-2xl bg-[#253045] shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                ${boxIcons.globe}
            </div>
            <h3 class="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">Universal Access</h3>
            <p class="text-gray-400 leading-relaxed">
                Accessibility is our kernel. Every interface, API, and tool is built with the highest WCAG standards from day one.
            </p>
        </div>
    </div>

  </main>
  
  ${getPublicFooter('dark')}
</body>
</html>`;
}
