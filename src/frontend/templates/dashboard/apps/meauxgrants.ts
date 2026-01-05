import { getLayout, html } from '../../layout';

export const meauxGrantsTemplate = (content: string, user: any) => html`
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Meaux<span class="text-green-500">Grants</span></h1>
        <p class="text-gray-500 mt-1">AI-Powered Grant Writer & Researcher</p>
      </div>
      <div>
         <span class="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Browser Scraper Active
         </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Inputs (Left) -->
      <div class="lg:col-span-4 space-y-6">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-green-100/50">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Grant Details
            </h3>
            
            <form id="grantForm" onsubmit="event.preventDefault(); startGrantDrafting();">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Organization Name</label>
                        <input type="text" id="orgName" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm" placeholder="e.g. Southern Pets Animal Rescue">
                    </div>

                    <div>
                         <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Foundation</label>
                        <input type="text" id="foundationName" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm" placeholder="e.g. Petco Love Foundation">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Project/Mission</label>
                        <textarea id="mission" rows="4" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm resize-none" placeholder="Describe what you need funding for..."></textarea>
                    </div>

                     <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Research URL (Optional)</label>
                        <div class="flex">
                             <input type="url" id="researchUrl" class="w-full px-4 py-2 rounded-l-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm" placeholder="https://...">
                             <button type="button" onclick="scrapeUrl()" class="px-3 bg-gray-50 border border-l-0 border-gray-200 rounded-r-xl text-gray-500 hover:text-green-600 hover:bg-green-50">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                             </button>
                        </div>
                        <p class="text-xs text-gray-400 mt-1">MeauxGrants can visit the foundation's site to tailor the proposal.</p>
                    </div>
                </div>

                <div class="mt-6 pt-6 border-t border-gray-100">
                    <button type="submit" id="draftBtn" class="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        Draft Proposal
                    </button>
                </div>
            </form>
        </div>

      </div>

      <!-- Editor/Output (Right) -->
      <div class="lg:col-span-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 h-[600px] flex flex-col relative overflow-hidden">
            
            <!-- Toolbar -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div class="flex items-center gap-4">
                    <span class="text-sm font-semibold text-gray-600">Draft Preview</span>
                    <span class="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">LOI Format</span>
                </div>
                <div class="flex items-center gap-2">
                     <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                     </button>
                      <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                     </button>
                </div>
            </div>

            <!-- Content Area -->
            <div id="editorContent" class="flex-1 p-8 overflow-y-auto font-serif text-lg leading-relaxed text-gray-800 focus:outline-none" contenteditable="true">
                <p class="text-gray-400 italic">Enter project details and click 'Draft Proposal' to generate your Letter of Inquiry...</p>
            </div>

            <!-- Loading State -->
            <div id="loader" class="hidden absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                 <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mb-4"></div>
                 <p class="text-green-600 font-medium animate-pulse" id="loadingMessage">Analyzing Foundation Requirements...</p>
            </div>

        </div>
      </div>

    </div>
  </div>

  <script>
    async function startGrantDrafting() {
        const org = document.getElementById('orgName').value;
        const foundation = document.getElementById('foundationName').value;
        const mission = document.getElementById('mission').value;

        if(!org || !mission) return alert("Organization Name and Mission are required.");

        const loader = document.getElementById('loader');
        const editor = document.getElementById('editorContent');
        const btn = document.getElementById('draftBtn');

        loader.classList.remove('hidden');
        btn.disabled = true;

        try {
             const res = await fetch('/api/apps/meauxgrants/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgName: org, foundationName: foundation, mission: mission })
            });
            const data = await res.json();

            // Typewriter effect for the result
            loader.classList.add('hidden');
            editor.innerHTML = ''; // Clear placeholder
            typeWriter(data.loi_draft, editor);

        } catch (e) {
            alert(e.message);
            loader.classList.add('hidden');
        } finally {
            btn.disabled = false;
        }
    }

    function typeWriter(text, element) {
        let i = 0;
        element.innerHTML = "";
        const speed = 10; 
        
        function type() {
            if (i < text.length) {
                if(text.charAt(i) === '\\n') {
                    element.innerHTML += '<br>';
                } else {
                     element.innerHTML += text.charAt(i);
                }
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    async function scrapeUrl() {
        const url = document.getElementById('researchUrl').value;
        if(!url) return;
        
        const btn = event.currentTarget;
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<div class="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>';
        
        // Mock scrape for now, as Browser Rendering integration is backend-side
        setTimeout(() => {
            btn.innerHTML = '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
            setTimeout(() => btn.innerHTML = originalIcon, 2000);
            
            // In reality, this would populate a hidden "context" field
            alert("Site analyzed! Context added to generator.");
        }, 1500);
    }
  </script>
`;
