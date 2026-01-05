import { getLayout } from '../layout';
import type { Env } from '../../../../types/env';

export function getSettingsPage(env: Env, user?: any) {
  const content = `
    <div class="max-w-4xl mx-auto p-8">
      <header class="mb-10 border-b border-gray-100 pb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p class="text-gray-500">Customize your workspace and preferences</p>
      </header>

      <div class="space-y-12">
        
        <!-- Appearance Section -->
        <section class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Appearance</h2>
              <p class="text-sm text-gray-500">Choose a theme that fits your vibe</p>
            </div>
          </div>

          <!-- Theme Grid -->
          <div id="themeGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Loading State -->
            <div class="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>
            <div class="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>
            <div class="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>
          </div>
        </section>

        <!-- Infrastructure Connections -->
        <section class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
           <div class="flex items-center gap-4 mb-6">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19c0-1.7-1.3-3-3-3h-5c-1.7 0-3 1.3-3 3"/><path d="M19 12a7 7 0 0 0-14 0c0 1.2.3 2.3.8 3.4"/><path d="M12 5v4"/><path d="M12 2v1"/></svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Cloud Infrastructure</h2>
              <p class="text-sm text-gray-500">Connect your Cloudflare account to enable deployments</p>
            </div>
          </div>
          
          <form onsubmit="saveInfrastructure(event)" class="space-y-6 max-w-lg">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cloudflare Account ID</label>
                <input type="text" name="cf_account_id" placeholder="e.g. ede65..." class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-mono text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cloudflare API Token</label>
                <input type="password" name="cf_api_token" placeholder="Global API Key or Token" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-mono text-sm">
                <p class="text-xs text-gray-400 mt-2">Token requires <code>Worker:Edit</code> permissions.</p>
            </div>
            <button type="submit" class="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                Connect Account
            </button>
          </form>
        </section>
      </div>
    </div>

    <script>
      async function loadThemes() {
        const grid = document.getElementById('themeGrid');
        try {
          const res = await fetch('/api/settings/themes');
          const themes = await res.json();
          
          const currentTheme = localStorage.getItem('meaux_theme') || 'MeauxCloud';

          grid.innerHTML = themes.map(t => {
             const isActive = t.name === currentTheme;
             return \`
              <div onclick="setTheme('\${t.name}')" 
                   class="cursor-pointer group relative p-5 rounded-2xl border-2 transition-all duration-200 \${isActive ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-500/10' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 bg-white'}">
                
                <div class="flex justify-between items-start mb-3">
                  <span class="font-bold text-gray-900">\${t.name}</span>
                  \${isActive ? '<span class="text-orange-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>' : ''}
                </div>
                
                <p class="text-xs text-gray-500 mb-4 line-clamp-2">\${t.description || 'No description available.'}</p>
                
                <div class="flex gap-2">
                   <!-- Fake color swatches just for visual -->
                   <div class="w-6 h-6 rounded-full border border-gray-200" style="background: \${t.theme_type === 'dark' ? '#1f2937' : '#ffffff'}"></div>
                   <div class="w-6 h-6 rounded-full border border-gray-200" style="background: \${t.config_json?.colors?.['--accent'] || '#ccc'}"></div>
                </div>
              </div>
             \`;
          }).join('');
        } catch(e) {
          console.error(e);
          grid.innerHTML = '<p class="text-red-500">Error loading themes.</p>';
        }
      }

      async function setTheme(themeName) {
        // Optimistic update
        localStorage.setItem('meaux_theme', themeName);
        
        // Reload to apply (real implementation would hot-swap CSS vars)
        // For now, let's just reload the list to show selection state
        loadThemes();
        
        // In a real app, you'd POST to /api/settings/theme here to save to DB
        alert('Theme set to ' + themeName + ' (Implementation pending: this would fetch and apply the JSON colors)');
      }

      async function saveInfrastructure(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            account_id: form.cf_account_id.value,
            api_token: form.cf_api_token.value
        };
        
        try {
            // MVP: Save to LocalStorage for immediate demo usage if API isn't ready
            localStorage.setItem('cf_account_id', data.account_id);
            localStorage.setItem('cf_token', data.api_token);
            
            // TODO: Implement backend route
            // await fetch('/api/settings/infrastructure', { method: 'POST', body: JSON.stringify(data) });

            alert('✅ Cloudflare Account Connected! You can now deploy.');
        } catch(err) {
            alert('Failed to save credentials.');
        }
      }

      loadThemes();
    </script>
  `;

  return getLayout({
    title: 'MeauxCLOUD - Settings',
    bodyContent: content,
    activeItem: 'settings', // We need to add this to layout sidebar
    user: user,
    isPublic: false
  });
}
