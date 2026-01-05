import { getLayout, html } from '../../layout';

export const meauxCreateTemplate = (content: string, user: any) => html`
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Meaux<span class="text-pink-500">Create</span></h1>
        <p class="text-gray-500 mt-1">Omnichannel Content Repurposing Engine</p>
      </div>
      <div>
         <span class="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-medium border border-pink-100 flex items-center gap-2">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            Multimodal AI Active
         </span>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Input Source (Left) -->
      <div class="space-y-6">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-pink-100/50">
            <h3 class="text-lg font-bold text-gray-900 mb-4">1. Input Source</h3>
            
            <div class="space-y-4">
                 <!-- Tabs -->
                <div class="flex space-x-1 bg-gray-100/50 p-1 rounded-xl">
                    <button class="flex-1 py-2 text-xs font-semibold rounded-lg bg-white shadow text-pink-600">YouTube URL</button>
                    <button class="flex-1 py-2 text-xs font-semibold rounded-lg text-gray-500 hover:text-gray-700">Audio File</button>
                    <button class="flex-1 py-2 text-xs font-semibold rounded-lg text-gray-500 hover:text-gray-700">Text Blob</button>
                </div>

                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </div>
                    <input type="text" id="sourceUrl" class="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 sm:text-sm" placeholder="Paste YouTube Link here...">
                </div>

                <div class="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-3 items-start">
                    <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p class="text-xs text-yellow-800 leading-relaxed">
                        MeauxCreate will convert this media to audio, then analyze it to generate the assets below.
                    </p>
                </div>
            </div>
             <button onclick="repurposeContent()" id="processBtn" class="mt-6 w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                Processing Magic
            </button>
        </div>

      </div>

      <!-- Generated Assets (Right) -->
      <div class="space-y-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4 px-2">2. Generated Assets</h3>
        
        <div id="resultsArea" class="space-y-4 opacity-50 pointer-events-none transition-all duration-500">
            
            <!-- Tweet Thread -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                <div class="px-6 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center cursor-pointer" onclick="toggleAccordion(this)">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </div>
                        <span class="font-medium text-gray-900">Twitter Thread</span>
                    </div>
                     <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform transition-transform" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
                <div class="p-6 hidden">
                   <textarea id="tweetOutput" class="w-full text-sm text-gray-600 border-none resize-none focus:ring-0 h-32" readonly>Analysis pending...</textarea>
                </div>
            </div>

             <!-- LinkedIn Post -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                <div class="px-6 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center cursor-pointer" onclick="toggleAccordion(this)">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center">
                            <span class="font-bold text-xs">in</span>
                        </div>
                        <span class="font-medium text-gray-900">LinkedIn Article</span>
                    </div>
                     <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform transition-transform" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
                <div class="p-6 hidden">
                   <textarea id="linkedinOutput" class="w-full text-sm text-gray-600 border-none resize-none focus:ring-0 h-32" readonly>Analysis pending...</textarea>
                </div>
            </div>

            <!-- Blog Post -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                 <div class="px-6 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center cursor-pointer" onclick="toggleAccordion(this)">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                        </div>
                        <span class="font-medium text-gray-900">Blog Post (Markdown)</span>
                    </div>
                     <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform transition-transform" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
                <div class="p-6 hidden">
                   <textarea id="blogOutput" class="w-full text-sm font-mono text-gray-600 border-none resize-none focus:ring-0 h-40" readonly>Analysis pending...</textarea>
                </div>
            </div>

        </div>

      </div>

    </div>
  </div>

  <script>
    function toggleAccordion(element) {
        const content = element.nextElementSibling;
        const icon = element.querySelector('svg:last-child');
        
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
        } else {
            content.classList.add('hidden');
            icon.classList.remove('rotate-180');
        }
    }

    async function repurposeContent() {
        const url = document.getElementById('sourceUrl').value;
        if(!url) return alert('Please provide a source URL');

        const btn = document.getElementById('processBtn');
        const results = document.getElementById('resultsArea');
        
        btn.disabled = true;
        btn.innerHTML = \`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing & Generating...\`;

        try {
            // 1. Start Job
            const initRes = await fetch('/api/apps/meauxcreate/repurpose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if(!initRes.ok) throw new Error("Failed to start media job");

            const initData = await initRes.json();
            const jobId = initData.jobId;

            // 2. Poll Status
            let status = 'PENDING';
            let retries = 0;
            const maxRetries = 60; 

            while(status !== 'SUCCEEDED' && status !== 'FAILED' && retries < maxRetries) {
                await new Promise(r => setTimeout(r, 2000));
                
                const statusRes = await fetch('/api/apps/meauxcreate/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobId })
                });
                const statusData = await statusRes.json();
                status = statusData.status;
                
                if(status === 'IN_PROGRESS') {
                    btn.innerHTML = \`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Converting... \${statusData.progress || ''}%\`;
                }
                retries++;
            }

            if(status !== 'SUCCEEDED') throw new Error("Job failed or timed out.");

            // 3. Get Result
            // We re-fetch status to ensure we have the latest data including result if loop exited on SUCCEEDED
             const resultRes = await fetch('/api/apps/meauxcreate/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobId })
            });
            const data = await resultRes.json();

            // Populate Fields
            document.getElementById('tweetOutput').value = data.tweet_thread.join('\\n\\n');
            document.getElementById('linkedinOutput').value = data.linkedin_post;
            document.getElementById('blogOutput').value = data.blog_post;

            // Unlock UI
            results.classList.remove('opacity-50', 'pointer-events-none');
            
            // Open first accordion
            toggleAccordion(document.querySelector('.group .cursor-pointer'));
            btn.innerHTML = "Processing Complete";

        } catch (e) {
            alert(e.message);
            btn.innerHTML = \`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg> Processing Magic\`;
        } finally {
            if(btn.innerHTML !== "Processing Complete") btn.disabled = false;
        }
    }
  </script>
`;
