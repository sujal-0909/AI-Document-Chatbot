// ===== DOM Elements =====
const fileInput = document.getElementById('fileInput');
const inlineFileInput = document.getElementById('inlineFileInput');
const uploadZone = document.getElementById('uploadZone');
const inlineUploadBtn = document.getElementById('inlineUploadBtn');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const documentList = document.getElementById('documentList');
const messagesContainer = document.getElementById('messagesContainer');
const messagesList = document.getElementById('messagesList');
const welcomeScreen = document.getElementById('welcomeScreen');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearChat = document.getElementById('clearChat');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

const API_BASE = 'http://127.0.0.1:8000';

// ===== State =====
let isProcessing = false;
let uploadedDocuments = [];

// ===== Background Particles =====
function createParticles() {
    const container = document.getElementById('bgParticles');
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 300 + 100;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
}
createParticles();

// ===== File Upload =====
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        uploadFile(files[0]);
    } else {
        showToast('Please upload a PDF file', 'error');
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        uploadFile(fileInput.files[0]);
    }
});

async function uploadFile(file) {
    if (isProcessing) {
        showToast('Please wait for the current upload to finish', 'info');
        return;
    }

    isProcessing = true;
    setStatus('processing', 'Processing...');

    // Show progress
    uploadProgress.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Uploading document...';

    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 85) progress = 85;
        progressFill.style.width = `${progress}%`;
    }, 300);

    const formData = new FormData();
    formData.append('file', file);

    try {
        progressText.textContent = 'Processing document...';

        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });

        clearInterval(progressInterval);

        if (response.ok) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Document processed!';

            // Add to document list
            addDocumentToList(file.name);
            uploadedDocuments.push(file.name);

            showToast('Document uploaded successfully!', 'success');

            setTimeout(() => {
                uploadProgress.style.display = 'none';
            }, 2000);
        } else {
            const error = await response.json();
            throw new Error(error.detail || 'Upload failed');
        }
    } catch (error) {
        clearInterval(progressInterval);
        progressFill.style.width = '0%';
        progressText.textContent = 'Upload failed';
        showToast(`Error: ${error.message}`, 'error');

        setTimeout(() => {
            uploadProgress.style.display = 'none';
        }, 3000);
    } finally {
        isProcessing = false;
        setStatus('ready', 'Ready');
        fileInput.value = '';
    }
}

function addDocumentToList(filename) {
    const item = document.createElement('div');
    item.className = 'document-item';
    item.innerHTML = `
        <div class="doc-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
        </div>
        <div class="doc-info">
            <div class="doc-name" title="${filename}">${filename}</div>
            <div class="doc-status">Indexed</div>
        </div>
    `;
    documentList.appendChild(item);
}

// ===== Chat =====
messageInput.addEventListener('input', () => {
    // Auto-resize textarea
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';

    // Toggle send button
    if (messageInput.value.trim()) {
        sendBtn.classList.add('active');
        sendBtn.disabled = false;
    } else {
        sendBtn.classList.remove('active');
        sendBtn.disabled = true;
    }
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (messageInput.value.trim()) {
            sendMessage();
        }
    }
});

sendBtn.addEventListener('click', () => {
    if (messageInput.value.trim()) {
        sendMessage();
    }
});

// Suggestion chips
document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        messageInput.value = chip.dataset.query;
        messageInput.dispatchEvent(new Event('input'));
        sendMessage();
    });
});

async function sendMessage() {
    const query = messageInput.value.trim();
    if (!query || isProcessing) return;

    // Hide welcome screen
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }

    // Add user message
    appendMessage(query, 'user');

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.classList.remove('active');
    sendBtn.disabled = true;

    // Show typing indicator
    const typingEl = showTypingIndicator();

    isProcessing = true;
    setStatus('processing', 'Thinking...');

    try {
        const response = await fetch(`${API_BASE}/chat?query=${encodeURIComponent(query)}`);

        if (response.ok) {
            const data = await response.json();
            removeTypingIndicator(typingEl);
            appendMessage(data.response, 'bot');
        } else {
            throw new Error('Failed to get response');
        }
    } catch (error) {
        removeTypingIndicator(typingEl);
        appendMessage("Sorry, I couldn't process your question. Please make sure you've uploaded a document first.", 'bot');
        showToast('Error getting response', 'error');
    } finally {
        isProcessing = false;
        setStatus('ready', 'Ready');
    }
}

function appendMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const avatarContent = type === 'bot' ? 'AI' : 'U';

    // Format text: convert newlines to <br> and handle basic formatting
    const formattedText = text
        .split('\n')
        .map(line => `<p>${line || '&nbsp;'}</p>`)
        .join('');

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarContent}</div>
        <div>
            <div class="message-content">${formattedText}</div>
            <div class="message-time">${timeStr}</div>
        </div>
    `;

    messagesList.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar" style="background: var(--accent-gradient); color: white; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 600; flex-shrink: 0;">AI</div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    messagesList.appendChild(typingDiv);
    scrollToBottom();
    return typingDiv;
}

function removeTypingIndicator(el) {
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

function scrollToBottom() {
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });
}

// ===== Clear Chat =====
clearChat.addEventListener('click', () => {
    messagesList.innerHTML = '';
    if (welcomeScreen) {
        welcomeScreen.style.display = 'flex';
    }
});

// ===== Sidebar Toggle (Mobile) =====
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggleOverlay();
});

function toggleOverlay() {
    let overlay = document.querySelector('.sidebar-overlay');
    if (sidebar.classList.contains('open')) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay active';
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.remove();
            });
            document.body.appendChild(overlay);
        }
    } else if (overlay) {
        overlay.remove();
    }
}

// ===== Status =====
function setStatus(type, text) {
    statusText.textContent = text;
    statusDot.style.background = type === 'ready'
        ? 'var(--success)'
        : 'var(--warning)';
    statusDot.style.animation = type === 'ready'
        ? 'pulse 2s ease-in-out infinite'
        : 'pulse 0.8s ease-in-out infinite';
}

// ===== Toast =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 4000);
}
