import { getLayout } from '../layout';
import type { Env } from '../../../../types/env';

export function getProjectsPage(env: Env, user?: any) {
    const content = `
      <div class="p-8 h-full overflow-y-auto">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
            <p class="text-gray-500">Manage your ongoing initiatives</p>
          </div>
          <button onclick="openModal()" class="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 font-medium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Project
          </button>
        </div>

        <!-- Project Grid -->
        <div id="projectsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Projects will be loaded here -->
          <div class="h-48 bg-gray-100/50 rounded-2xl animate-pulse"></div>
          <div class="h-48 bg-gray-100/50 rounded-2xl animate-pulse"></div>
          <div class="h-48 bg-gray-100/50 rounded-2xl animate-pulse"></div>
        </div>

      </div>

  <!-- New Project Modal -->
  <div id="newProjectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm hidden text-left">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 class="text-lg font-bold text-gray-900">Create New Project</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
      </div>
      <form id="projectForm" onsubmit="createProject(event)" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
          <input type="text" name="name" required placeholder="e.g. Website Rebuild" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea name="description" rows="3" placeholder="Brief overview..." class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
            <div class="relative">
               <select name="priority" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none appearance-none bg-white">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Budget ($)</label>
            <input type="number" name="budget" placeholder="0" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all">
          </div>
        </div>
        <div class="pt-4 flex justify-end gap-3">
          <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
          <button type="submit" class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5">Create Project</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    async function loadProjects() {
      const grid = document.getElementById('projectsGrid');
      try {
        const res = await fetch('/api/projects');
        const projects = await res.json();
        
        if (projects.length === 0) {
          grid.innerHTML = \`<div class="col-span-full text-center py-20 text-gray-400">
            <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"></path></svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No Projects Found</h3>
            <p>Create your first project to get started.</p>
          </div>\`;
          return;
        }

        grid.innerHTML = projects.map(p => \`
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group flex flex-col h-full">
            <div class="flex-1 mb-6">
              <div class="flex justify-between items-start mb-4">
                 <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider \${getStatusColor(p.status)}">\${p.status}</span>
                 <button class="text-gray-300 hover:text-red-500 transition-colors" onclick="deleteProject('\${p.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                 </button>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">\${p.name}</h3>
              <p class="text-sm text-gray-500 leading-relaxed line-clamp-2">\${p.description || 'No description provided.'}</p>
            </div>
            <div class="pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-medium text-gray-400">
              <span class="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> \${p.budget ? '$'+p.budget : '0'}</span>
              <span>\${new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        \`).join('');
      } catch (e) {
        console.error(e);
        grid.innerHTML = '<p class="text-red-500">Failed to load projects</p>';
      }
    }

    function getStatusColor(status) {
        if(status === 'active') return 'bg-green-100 text-green-700';
        if(status === 'completed') return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-600';
    }

    async function createProject(e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (res.ok) {
          closeModal();
          form.reset();
          loadProjects(); 
        } else {
          alert('Failed to create project');
        }
      } catch (err) {
        alert('Error creating project');
      }
    }

    async function deleteProject(id) {
       if(!confirm('Delete this project?')) return;
       try {
         await fetch('/api/projects/'+id, { method: 'DELETE' });
         loadProjects();
       } catch(e) { alert('Failed to delete'); }
    }

    function openModal() { document.getElementById('newProjectModal').classList.remove('hidden'); }
    function closeModal() { document.getElementById('newProjectModal').classList.add('hidden'); }
    
    window.onclick = function(event) {
      const modal = document.getElementById('newProjectModal');
      if (event.target == modal) closeModal();
    }
    
    // Initial Load
    loadProjects();
  </script>`;

    return getLayout({
        title: 'MeauxCLOUD - Projects',
        bodyContent: content,
        activeItem: 'projects',
        user: user,
        isPublic: false
    });
}
