import { getPublicNav, getPublicFooter } from '../components/public-nav';

export function getServicesPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Services - MeauxCLOUD</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
  <style>
    :root {
      --clay-bg-dark: #0f172a;
      --clay-surface-dark: #1e293b;
      --clay-highlight: rgba(255, 255, 255, 0.05);
      --clay-shadow-dark: -5px -5px 10px rgba(255, 255, 255, 0.02), 5px 5px 15px rgba(0, 0, 0, 0.5);
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--clay-bg-dark);
      background-image: 
        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%);
      color: #f8fafc;
      overflow-x: hidden;
    }

    .clay-card {
      background: var(--clay-surface-dark);
      border-radius: 24px;
      box-shadow: var(--clay-shadow-dark);
      padding: 32px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.03);
      position: relative;
      overflow: hidden;
    }

    .clay-card:hover {
      transform: translateY(-8px);
      box-shadow: -8px -8px 20px rgba(255, 255, 255, 0.04), 8px 8px 30px rgba(0, 0, 0, 0.6);
      border-color: rgba(59, 130, 246, 0.3);
    }

    .clay-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    }

    .glow-icon {
      width: 64px; height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.2));
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
      box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2);
    }
    
    .glow-icon svg { width: 32px; height: 32px; color: #60a5fa; }
    
    .pricing-toggle {
        background: #1e293b;
        padding: 4px;
        border-radius: 12px;
        display: inline-flex;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .toggle-btn {
        padding: 8px 24px;
        border-radius: 8px;
        color: #94a3b8;
        font-weight: 500;
        transition: all 0.3s;
    }
    
    .toggle-btn.active {
        background: #3b82f6;
        color: white;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

  </style>
</head>
<body class="antialiased selection:bg-blue-500 selection:text-white">
  ${getPublicNav('services', 'dark')}
  
  <!-- Hero Section -->
  <section class="pt-40 pb-20 px-6 relative">
    <div class="max-w-7xl mx-auto text-center relative z-10">
      <span class="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-6 border border-blue-500/20">
        Enterprise-Grade Solutions
      </span>
      <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
        Build Faster.<br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Scale Smarter.</span>
      </h1>
      <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
        We provide the adaptive infrastructure you need to launch, grow, and dominate your niche. From AI pipelines to managed cloud deployment.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/contact" class="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
            Start a Project
        </a>
        <a href="#offerings" class="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-all backdrop-blur-md">
            View Capabilities
        </a>
      </div>
    </div>
    
    <!-- Hero 3D Background (Subtle) -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl opacity-30 pointer-events-none z-0">
        <!-- Optional 3D element or gradient blob -->
        <div class="w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] absolute top-1/2 left-1/4"></div>
        <div class="w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] absolute top-1/4 right-1/4"></div>
    </div>
  </section>

  <!-- Service Grid -->
  <section id="offerings" class="py-24 px-6 relative z-10">
    <div class="max-w-7xl mx-auto">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Cloud Infrastructure -->
        <div class="clay-card">
          <div class="glow-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">Cloud Architecture</h3>
          <p class="text-gray-400 mb-6 leading-relaxed">
            Scalable, serverless deployment on Cloudflare's edge network. We handle the complexity of distributed systems so you don't have to.
          </p>
          <ul class="text-sm text-gray-500 space-y-2">
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Zero-config deployment</li>
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> DDoS Protection included</li>
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Global CDNs</li>
          </ul>
        </div>

        <!-- AI Integration -->
        <div class="clay-card">
           <div class="glow-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">AI Integration</h3>
          <p class="text-gray-400 mb-6 leading-relaxed">
            Embed LLMs, vector search, and automated agents directly into your workflows. Powered by MeauxAI Engine.
          </p>
          <ul class="text-sm text-gray-500 space-y-2">
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> Custom RAG Pipelines</li>
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> Agentic Workflow Automation</li>
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> Voice & Image Gen</li>
          </ul>
        </div>

        <!-- Custom Dev -->
        <div class="clay-card">
           <div class="glow-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">Custom Development</h3>
          <p class="text-gray-400 mb-6 leading-relaxed">
            Full-stack engineering for bespoke applications. From database design to high-fidelity frontend implementation.
          </p>
          <ul class="text-sm text-gray-500 space-y-2">
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> React / Hono Stack</li>
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> Database Architecture</li>
            <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> Mobile-First Design</li>
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-24 px-6">
    <div class="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-900/50 to-slate-900 border border-blue-500/20 rounded-3xl p-12 relative overflow-hidden">
        <div class="relative z-10">
            <h2 class="text-3xl font-bold mb-4 text-white">Ready to elevate your infrastructure?</h2>
            <p class="text-gray-300 mb-8 text-lg">Join the ecosystem that powers the next generation of adaptive tech.</p>
            <a href="/contact" class="px-8 py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Get a Consultation
            </a>
        </div>
        <!-- Decorative Glow -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
    </div>
  </section>
  
  ${getPublicFooter('dark')}
</body>
</html>`;
}
