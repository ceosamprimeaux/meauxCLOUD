import { getLayout, html } from '../../layout';

export const meauxCadTemplate = (content: string, user: any) => html`
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Meaux<span class="text-orange-500">CAD</span></h1>
        <p class="text-gray-500 mt-1">Generative 3D Modeling Engine</p>
      </div>
       <div class="flex items-center gap-3">
            <button onclick="switchTab('generate')" id="tab-generate" class="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-orange-50 text-orange-700 border border-orange-200">Generate</button>
            <button onclick="switchTab('library')" id="tab-library" class="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white text-gray-600 border border-gray-200 hover:bg-gray-50">Vault</button>
      </div>
    </div>

    <!-- VIEW: GENERATE -->
    <div id="view-generate" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Controls -->
      <div class="lg:col-span-1 space-y-6">
        
        <!-- Prompt Input -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-orange-100/50">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Describe your Object</label>
            <textarea 
                id="promptInput" 
                rows="4" 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none transition-all text-sm"
                placeholder="e.g. A futuristic ergonomic chair shaped like a peach, glossy finish, cyberpunk style..."
            ></textarea>
             <!-- Style Presets -->
            <div class="mt-4">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style</label>
                <div class="grid grid-cols-3 gap-2">
                    <button onclick="setStyle('realistic')" class="style-btn active px-3 py-2 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">Realistic</button>
                    <button onclick="setStyle('cartoon')" class="style-btn px-3 py-2 rounded-lg text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50">Cartoon</button>
                    <button onclick="setStyle('low-poly')" class="style-btn px-3 py-2 rounded-lg text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50">Low Poly</button>
                </div>
            </div>

            <button 
                onclick="generateModel()" 
                id="generateBtn"
                class="mt-6 w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
                Generate 3D Model
            </button>
        </div>

        <!-- History -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <h3 class="text-sm font-semibold text-gray-900 mb-3">Recent Generations</h3>
             <div class="space-y-3" id="historyList">
                <div class="text-sm text-gray-400 text-center py-4">No models generated yet.</div>
             </div>
        </div>

      </div>

      <!-- Preview Area -->
      <div class="lg:col-span-2">
        <div class="bg-gray-900 rounded-2xl shadow-inner border border-gray-800 p-1 h-[600px] relative overflow-hidden group">
            
            <!-- Viewer Placeholder -->
            <div id="modelViewer" class="w-full h-full rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                 <div class="text-center">
                    <div class="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-xl border border-gray-700">
                         <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                    <p class="text-gray-400 font-medium">Ready to Render</p>
                    <p class="text-gray-600 text-sm mt-1">Enter a prompt to start generating</p>
                 </div>
            </div>

            <!-- Loading Overlay -->
            <div id="loadingOverlay" class="hidden absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div class="relative w-24 h-24 mb-6">
                    <div class="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <svg class="w-8 h-8 text-orange-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    </div>
                </div>
                <div class="text-orange-400 font-medium text-lg animate-pulse" id="loadingText">Initializing Meshy Engine...</div>
                <div class="text-gray-500 text-sm mt-2">This may take up to 60 seconds</div>
            </div>

            <!-- Actions Bar (Bottom) -->
            <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="flex gap-2">
                     <button class="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 border border-white/10" title="Rotate">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                     </button>
                      <button class="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 border border-white/10" title="Zoom">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                     </button>
                </div>
                
                <button onclick="saveToVault()" id="saveBtn" class="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium shadow-lg hover:bg-gray-50 transform hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                    Save to MeauxCloud
                </button>
            </div>

        </div>
      </div>

    </div>

    <!-- VIEW: LIBRARY -->
    <div id="view-library" class="hidden">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>    
                Asset Vault
            </h2>
            <div id="libraryGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <!-- Loaded via JS -->
                <div class="col-span-full py-12 text-center text-gray-400 animate-pulse">Scanning R2 Bucket...</div>
            </div>
        </div>
    </div>

  </div>

  <script>
    let currentStyle = 'realistic';
    
    // Tab Switching
    function switchTab(tab) {
        document.getElementById('view-generate').classList.add('hidden');
        document.getElementById('view-library').classList.add('hidden');
        document.getElementById('tab-generate').classList.replace('bg-orange-50', 'bg-white');
        document.getElementById('tab-generate').classList.replace('text-orange-700', 'text-gray-600');
        document.getElementById('tab-library').classList.replace('bg-orange-50', 'bg-white');
        document.getElementById('tab-library').classList.replace('text-orange-700', 'text-gray-600');
        
        document.getElementById('view-' + tab).classList.remove('hidden');
        document.getElementById('tab-' + tab).classList.replace('bg-white', 'bg-orange-50');
        document.getElementById('tab-' + tab).classList.replace('text-gray-600', 'text-orange-700');

        if(tab === 'library') loadLibrary();
    }

    async function loadLibrary() {
        const grid = document.getElementById('libraryGrid');
        try {
            const res = await fetch('/api/assets/library');
            const data = await res.json();
            
            if(!data.assets || data.assets.length === 0) {
                 grid.innerHTML = '<div class="col-span-full py-12 text-center text-gray-400">Vault is empty.</div>';
                 return;
            }

            grid.innerHTML = data.assets.map(asset => {
                const isModel = asset.type === 'model';
                const isSpline = asset.type === 'spline';
                
                let preview = '';
                if(isModel) {
                    preview = \`<div class="w-full h-40 bg-gray-100 rounded-lg overflow-hidden relative group-hover:bg-gray-200 transition-colors">
                        <model-viewer src="\${asset.url}" auto-rotate camera-controls shadow-intensity="1" class="w-full h-full"></model-viewer>
                    </div>\`;
                } else {
                    // For now show placeholder or image if it's an image
                    preview = asset.type === 'image' 
                        ? \`<img src="\${asset.url}" class="w-full h-40 object-cover rounded-lg bg-gray-100">\`
                        : \`<div class="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors">
                              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
                          </div>\`;
                }

                return \`
                    <div class="group relative">
                        \${preview}
                        <div class="mt-3">
                            <p class="text-sm font-medium text-gray-900 truncate" title="\${asset.key}">\${asset.key}</p>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-xs text-gray-500">\${(asset.size / 1024 / 1024).toFixed(2)} MB</span>
                                <a href="\${asset.url}" download class="text-xs text-orange-600 hover:text-orange-800 font-medium hover:underline">Download</a>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');

        } catch(e) {
            grid.innerHTML = '<div class="col-span-full py-12 text-center text-red-500">Failed to load assets.</div>';
        }
    }

    function setStyle(style) {
        currentStyle = style;
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.classList.remove('bg-orange-50', 'text-orange-700', 'border-orange-200');
            btn.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
        });
        event.target.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
        event.target.classList.add('bg-orange-50', 'text-orange-700', 'border-orange-200');
    }

    async function generateModel() {
        const prompt = document.getElementById('promptInput').value;
        if(!prompt) return alert('Please describe your object first.');

        const btn = document.getElementById('generateBtn');
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        const viewer = document.getElementById('modelViewer');
        
        // Reset UI
        btn.disabled = true;
        btn.innerHTML = \`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Forging...\`;
        overlay.classList.remove('hidden');
        if(loadingText) loadingText.innerText = "Initializing Meshy Engine...";

        try {
            // 1. Initiate Generation
            const initRes = await fetch('/api/apps/meauxcad/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, style: currentStyle })
            });

            if (!initRes.ok) throw new Error('Failed to start generation');
            
            const initData = await initRes.json();
            const taskId = initData.taskId;

            if (!taskId) throw new Error('No Task ID received');

            // 2. Poll for Status
            let status = 'PENDING';
            let retries = 0;
            const maxRetries = 120; // 4 minutes max

            while (status !== 'SUCCEEDED' && status !== 'FAILED' && retries < maxRetries) {
                await new Promise(r => setTimeout(r, 2000)); // Wait 2s
                
                const statusRes = await fetch('/api/apps/meauxcad/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskId })
                });
                
                const statusData = await statusRes.json();
                status = statusData.status;

                // Update UI based on progress
                if (status === 'IN_PROGRESS' && loadingText) {
                    const progress = statusData.progress || 0;
                    loadingText.innerText = \`Forging Model... \${progress}%\`;
                } else if (status === 'PENDING' && loadingText) {
                     loadingText.innerText = "Queued for Generation...";
                }
                
                retries++;
            }

            if (status === 'FAILED') throw new Error('Generation Failed on Server');
            if (status !== 'SUCCEEDED') throw new Error('Timed out');

            // 3. Display Result (Fetch final data)
            const finalRes = await fetch('/api/apps/meauxcad/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskId })
            });
            const finalData = await finalRes.json();
            
            // Prefer GLB/GLTF viewer if available, else thumbnail
            const modelUrl = finalData.model_urls?.glb || finalData.model_urls?.obj;
            const thumbnail = finalData.thumbnail_url;
            
            overlay.classList.add('hidden');
            
            viewer.innerHTML = \`
                <div class="relative w-full h-full group">
                     \${modelUrl ? 
                        \`<model-viewer src="\${modelUrl}" auto-rotate camera-controls shadow-intensity="1" class="w-full h-full"></model-viewer>
                        <div class="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                             <a href="\${modelUrl}" target="_blank" class="pointer-events-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                Download
                             </a>
                        </div>\` 
                        : 
                       \`<img src="\${thumbnail}" class="w-full h-full object-cover" />\`
                     }
                </div>
            \`;

            document.getElementById('saveBtn').disabled = false;
            // Store result for saving
            window.lastGeneratedModel = { prompt, ...finalData };

        } catch (e) {
            console.error(e);
            if(loadingText) {
                loadingText.innerText = "Error: " + e.message;
                loadingText.classList.add('text-red-500');
            }
            setTimeout(() => {
                overlay.classList.add('hidden');
                if(loadingText) loadingText.classList.remove('text-red-500');
            }, 3000);
        } finally {
            btn.disabled = false;
            btn.innerHTML = \`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg> Generate 3D Model\`;
        }
    }

    async function saveToVault() {
        // Implement safe save logic later 
        alert("Coming soon: Save generated assets to Vault!");
    }
  </script>
`;
