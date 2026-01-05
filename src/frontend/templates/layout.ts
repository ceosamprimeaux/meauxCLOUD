import { modalStyles, getInquiryModal } from './components/modals';

// Simple helper for syntax highlighting
export const html = (strings: TemplateStringsArray, ...values: any[]) => String.raw({ raw: strings }, ...values);

export interface LayoutOptions {
  title: string;
  bodyContent: string;
  activeItem?: string;
  user?: any;
  isPublic?: boolean;
}

export function getLayout(opts: LayoutOptions) {
  // Extract user info
  const userName = opts.user?.name || 'Admin User';
  const userInitial = userName[0]?.toUpperCase() || 'A';
  const userPic = opts.user?.picture;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${opts.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        peach: {
                            50: 'var(--color-peach-50, #fef5f1)',
                            100: 'var(--color-peach-100, #fdeae0)',
                            200: 'var(--color-peach-200, #fbd4c1)',
                            300: 'var(--color-peach-300, #f8b99c)',
                            400: 'var(--color-peach-400, #f59870)',
                            500: 'var(--color-peach-500, #f27a4f)',
                            600: 'var(--color-peach-600, #e85d30)'
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { background: #faf8f6; }
        .sidebar-item {
            transition: all 0.2s ease;
        }
        .sidebar-item:hover {
            background: rgba(242, 122, 79, 0.1);
            color: #e85d30;
        }
        .sidebar-item.active {
            background: #f8b99c;
            color: #8b4513;
            font-weight: 600;
        }
        .stat-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid #f0ebe6;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        /* Scrollbar styling */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #f27a4f; border-radius: 10px; opacity: 0.5; }
        
        /* Modal Styles */
        ${modalStyles}
    </style>
</head>
<body class="font-sans antialiased">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-64 bg-gradient-to-b from-peach-50 to-peach-100 border-r border-peach-200 flex flex-col hidden md:flex">
            <!-- Logo -->
            <div class="p-6 border-b border-peach-200">
                <div class="flex items-center gap-2">
                    <svg class="w-8 h-8 text-peach-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                    </svg>
                    <span class="text-xl font-bold text-gray-800">MeauxCLOUD</span>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto p-4 space-y-6">
                ${getSidebarLinks(opts.activeItem, opts.isPublic)}
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden relative">
             <!-- Mobile Toggle -->
            <div class="md:hidden p-4 bg-white border-b flex justify-between items-center">
               <span class="font-bold text-lg">MeauxCLOUD</span>
               <button onclick="document.querySelector('aside').classList.toggle('hidden');" class="p-2 border rounded">
                 <svg class="w-6 h-6" fill="black" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2"/></svg>
               </button>
            </div>

            <!-- Top Bar -->
            <header class="bg-white border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <!-- Org Selector + Search -->
                    <div class="flex items-center gap-4 flex-1">
                        <div class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-peach-300">
                            <svg class="w-5 h-5 text-peach-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                            </svg>
                            <span class="font-medium text-gray-700 hidden sm:inline">MeauxCLOUD Nonprofit</span>
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>

                        <div class="flex-1 max-w-md hidden sm:block">
                            <div class="relative">
                                <input type="text" placeholder="Quick search..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent text-sm">
                                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                <kbd class="absolute right-3 top-2 px-2 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded text-gray-500">⌘ K</kbd>
                            </div>
                        </div>
                    </div>

                    <!-- User Profile -->
                    <div class="flex items-center gap-4">
                        <button class="p-2 text-gray-400 hover:text-gray-600 relative">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                            </svg>
                            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button onclick="openInquiryModal('Support')" class="p-2 text-gray-400 hover:text-gray-600 relative" title="Contact Support">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        <div class="flex items-center gap-3">
                             ${userPic
      ? `<img src="${userPic}" alt="User" class="w-10 h-10 rounded-full border-2 border-peach-200 object-cover">`
      : `<div class="w-10 h-10 rounded-full bg-peach-500 text-white flex items-center justify-center font-bold text-sm border-2 border-peach-200">${userInitial}</div>`
    }
                            <div class="text-sm hidden sm:block">
                                <div class="font-semibold text-gray-800">Hello, ${userName}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Dashboard Content -->
            <main class="flex-1 overflow-y-auto p-8 bg-gray-50">
                ${opts.bodyContent}
            </main>
            </main>
        </div>
    </div>
    
    <!-- Global Modals -->
    ${getInquiryModal()}
    
</body>
</html>`;
}

function getSidebarLinks(activeItem?: string, isPublic?: boolean) {
  const isActive = (id: string) => activeItem === id ? 'active' : '';

  if (isPublic) {
    return `
        <!-- Public Menu -->
        <div>
            <div class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</div>
            <div class="space-y-1">
                <a href="/" class="sidebar-item ${isActive('home')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    Home
                </a>
                <a href="/login" class="sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 font-semibold text-peach-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
                    Log In
                </a>
            </div>
        </div>
        `;
  }

  return `
    <!-- Core -->
    <div>
        <div class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Core</div>
        <div class="space-y-1">
            <a href="/dashboard" class="sidebar-item ${isActive('dashboard')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive('dashboard') ? '' : 'text-gray-600'}">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Projects
            </a>
            <a href="/dashboard/library" class="sidebar-item ${isActive('library')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                </svg>
                Library
            </a>
            <a href="/dashboard/tasks" class="sidebar-item ${isActive('tasks')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                </svg>
                Tasks
            </a>
        </div>
    </div>

    <!-- MEAUX APPS -->
    <div>
        <div class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Meaux Apps</div>
        <div class="space-y-1">
            <a href="/meauxphoto" class="sidebar-item ${isActive('meauxphoto')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                MeauxPHOTO
            </a>
            <a href="/meauxdoc" class="sidebar-item ${isActive('meauxdoc')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                </svg>
                MeauxDOC
            </a>
            <a href="/meauxcad" class="sidebar-item ${isActive('meauxcad')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
                MeauxCAD
            </a>
            <a href="/meauxcloud" class="sidebar-item ${isActive('meauxcloud')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
                MeauxCloud
            </a>
        </div>
    </div>

    <!-- ACCOUNT -->
    <div>
        <div class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</div>
        <div class="space-y-1">
            <a href="/dashboard/automations" class="sidebar-item ${isActive('automations')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Automations
            </a>
            <a href="/dashboard/pipelines" class="sidebar-item ${isActive('pipelines')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                </svg>
                Pipelines
                <span class="ml-auto text-xs bg-peach-200 text-peach-700 px-2 py-0.5 rounded-full font-semibold">NEW</span>
            </a>
            <a href="/dashboard/prompts" class="sidebar-item ${isActive('prompts')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                Prompts
                <span class="ml-auto text-xs bg-peach-200 text-peach-700 px-2 py-0.5 rounded-full font-semibold">NEW</span>
            </a>
        </div>
    </div>

    <!-- MEDIAKIT -->
    <div>
        <div class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">MediaKit</div>
        <div class="space-y-1">
            <a href="/dashboard/mail" class="sidebar-item ${isActive('mail')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Mail
            </a>
            <a href="/dashboard/calendar" class="sidebar-item ${isActive('calendar')} flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
                </svg>
                Calendar
            </a>
        </div>
    </div>

    <!-- Logout -->
    <div>
        <a href="/api/auth/logout" class="sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </svg>
            Log Out
        </a>
    </div>
    `;
}
