export const modalStyles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .modal-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
  .modal-content {
    background: white;
    width: 100%;
    max-width: 500px;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transform: scale(0.95) translateY(10px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }
  .modal-overlay.active .modal-content {
    transform: scale(1) translateY(0);
  }
`;

export const getInquiryModal = () => `
  <!-- Inquiry Modal -->
  <div id="inquiryModal" class="modal-overlay" onclick="handleModalClick(event)">
    <div class="modal-content">
      
      <!-- Modal Header -->
      <div class="relative bg-gradient-to-r from-peach-500 to-orange-500 px-6 py-6 overflow-hidden">
        <div class="absolute top-0 right-0 p-4">
            <button onclick="closeModal()" class="text-white/80 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="relative z-10">
            <h3 class="text-2xl font-bold text-white tracking-tight">Let's Connect</h3>
            <p class="text-peach-100 text-sm mt-1">Start your journey with MeauxCloud.</p>
        </div>
        
        <!-- Decorative Circle -->
        <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 bg-white">
        <form id="inquiryForm" onsubmit="submitInquiry(event)" class="space-y-4">
            <input type="hidden" id="inquiryType" value="General">
            
            <div class="grid grid-cols-2 gap-4">
                <button type="button" onclick="setInquiryType('Project')" class="type-btn p-3 rounded-xl border border-gray-200 hover:border-peach-400 hover:bg-peach-50 text-sm font-medium text-gray-600 transition-all text-center">
                    🚀 New Project
                </button>
                 <button type="button" onclick="setInquiryType('Support')" class="type-btn p-3 rounded-xl border border-gray-200 hover:border-peach-400 hover:bg-peach-50 text-sm font-medium text-gray-600 transition-all text-center">
                    🛠️ Support
                </button>
            </div>

            <div class="space-y-3">
                <input type="text" id="inquiryName" required placeholder="Your Name" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-peach-500 focus:bg-white outline-none transition-all">
                <input type="email" id="inquiryEmail" required placeholder="Email Address" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-peach-500 focus:bg-white outline-none transition-all">
                <textarea id="inquiryMessage" required rows="3" placeholder="Tell us about your needs..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-peach-500 focus:bg-white outline-none transition-all resize-none"></textarea>
            </div>

            <button type="submit" id="submitBtn" class="w-full py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20">
                <span>Send Message</span>
                <svg class="w-4 h-4 text-peach-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
        </form>
        
        <div id="successMessage" class="hidden text-center py-8">
             <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
             </div>
             <h4 class="text-xl font-bold text-gray-900">Message Sent!</h4>
             <p class="text-gray-500 mt-2">We'll get back to you shortly.</p>
             <button onclick="closeModal()" class="mt-6 text-sm font-medium text-peach-600 hover:text-peach-700">Close Window</button>
        </div>

      </div>
    </div>
  </div>

  <script>
    function openInquiryModal(type = 'General') {
        const modal = document.getElementById('inquiryModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        setInquiryType(type);
    }

    function closeModal() {
        const modal = document.getElementById('inquiryModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form after delay
        setTimeout(() => {
            document.getElementById('inquiryForm').classList.remove('hidden');
            document.getElementById('successMessage').classList.add('hidden');
            document.getElementById('inquiryForm').reset();
        }, 300);
    }

    function handleModalClick(e) {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }

    function setInquiryType(type) {
        document.getElementById('inquiryType').value = type;
        // Visual selection
        document.querySelectorAll('.type-btn').forEach(btn => {
            if(btn.innerText.includes(type)) {
                btn.classList.add('border-peach-500', 'bg-peach-50', 'text-peach-700');
                btn.classList.remove('border-gray-200', 'text-gray-600');
            } else {
                btn.classList.remove('border-peach-500', 'bg-peach-50', 'text-peach-700');
                btn.classList.add('border-gray-200', 'text-gray-600');
            }
        });
    }

    async function submitInquiry(e) {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const originalContent = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

        const formData = {
            type: document.getElementById('inquiryType').value,
            name: document.getElementById('inquiryName').value,
            email: document.getElementById('inquiryEmail').value,
            message: document.getElementById('inquiryMessage').value
        };

        try {
            const res = await fetch('/api/contact/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if(res.ok) {
                document.getElementById('inquiryForm').classList.add('hidden');
                document.getElementById('successMessage').classList.remove('hidden');
            } else {
                throw new Error('Failed to send');
            }
        } catch(err) {
            alert('Something went wrong. Please try again.');
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    }
  </script>
`;
