class ChatBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.textInput = document.getElementById('textInput');
        this.sendButton = document.getElementById('sendButton');
        this.fileInput = document.getElementById('fileInput');
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.uploadedFiles = document.getElementById('uploadedFiles');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.uploadedFilesList = [];
        this.isProcessing = false;
        
        this.botResponses = [
            "I've received your request. Let me process your presentation...",
            "Working on enhancing your PowerPoint presentation...",
            "Almost done! Applying final touches to your slides...",
            "Your presentation is ready! Click the download button below to get your enhanced PowerPoint file."
        ];
        
        this.init();
    }
    
    init() {
        // Small delay to ensure DOM is fully loaded
        setTimeout(() => {
            this.setupEventListeners();
            this.showWelcomeMessage();
            this.updateSendButton();
        }, 100);
    }
    
    setupEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
        
        // Enter key in textarea
        this.textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Text input changes
        this.textInput.addEventListener('input', () => {
            this.adjustTextareaHeight();
            this.updateSendButton();
        });
        
        // File upload area click
        this.fileUploadArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.fileInput.click();
        });
        
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files);
            }
        });
        
        // Drag and drop events
        this.fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.fileUploadArea.classList.add('drag-over');
        });
        
        this.fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.fileUploadArea.contains(e.relatedTarget)) {
                this.fileUploadArea.classList.remove('drag-over');
            }
        });
        
        this.fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.fileUploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                this.handleFileSelect(e.dataTransfer.files);
            }
        });
        
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }
    
    showWelcomeMessage() {
        const welcomeMessage = "Hello! I'm your PowerPoint assistant. I can help you create or enhance presentations. You can upload an existing PPT file, provide text instructions, or both. How can I help you today?";
        this.addBotMessage(welcomeMessage);
    }
    
    adjustTextareaHeight() {
        this.textInput.style.height = 'auto';
        const newHeight = Math.min(this.textInput.scrollHeight, 120);
        this.textInput.style.height = newHeight + 'px';
    }
    
    updateSendButton() {
        const hasText = this.textInput.value.trim().length > 0;
        const hasFiles = this.uploadedFilesList.length > 0;
        const canSend = (hasText || hasFiles) && !this.isProcessing;
        
        this.sendButton.disabled = !canSend;
        
        if (canSend) {
            this.sendButton.style.opacity = '1';
            this.sendButton.style.cursor = 'pointer';
        } else {
            this.sendButton.style.opacity = '0.5';
            this.sendButton.style.cursor = 'not-allowed';
        }
    }
    
    handleFileSelect(files) {
        const validFiles = [];
        
        Array.from(files).forEach(file => {
            if (this.validateFile(file)) {
                validFiles.push(file);
            }
        });
        
        if (validFiles.length > 0) {
            validFiles.forEach(file => {
                this.uploadedFilesList.push(file);
                this.displayUploadedFile(file);
            });
            this.updateSendButton();
        }
        
        // Reset file input
        this.fileInput.value = '';
    }
    
    validateFile(file) {
        const validExtensions = ['.ppt', '.pptx'];
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        const hasValidExtension = validExtensions.some(ext => 
            file.name.toLowerCase().endsWith(ext)
        );
        
        if (!hasValidExtension) {
            this.showError('Please upload only PowerPoint files (.ppt, .pptx)');
            return false;
        }
        
        if (file.size > maxSize) {
            this.showError('File size must be less than 50MB');
            return false;
        }
        
        // Check for duplicates
        if (this.uploadedFilesList.some(f => f.name === file.name && f.size === file.size)) {
            this.showError('This file has already been uploaded');
            return false;
        }
        
        return true;
    }
    
    displayUploadedFile(file) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'uploaded-file';
        fileDiv.setAttribute('data-file-name', file.name);
        fileDiv.setAttribute('data-file-size', file.size);
        fileDiv.innerHTML = `
            <div class="file-details">
                <div class="file-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div>
                    <div class="file-name">${this.escapeHtml(file.name)}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="remove-file" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
        
        const removeButton = fileDiv.querySelector('.remove-file');
        removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeFile(file.name, file.size);
        });
        
        this.uploadedFiles.appendChild(fileDiv);
    }
    
    removeFile(fileName, fileSize) {
        this.uploadedFilesList = this.uploadedFilesList.filter(f => 
            !(f.name === fileName && f.size === fileSize)
        );
        
        const fileElement = this.uploadedFiles.querySelector(
            `[data-file-name="${fileName}"][data-file-size="${fileSize}"]`
        );
        if (fileElement) {
            fileElement.remove();
        }
        
        this.updateSendButton();
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    async sendMessage() {
        if (this.isProcessing) return;
        
        const text = this.textInput.value.trim();
        const hasFiles = this.uploadedFilesList.length > 0;
        
        if (!text && !hasFiles) return;
        
        this.isProcessing = true;
        this.updateSendButton();
        
        if (text) {
            this.addUserMessage(text);
        }
        
        if (hasFiles) {
            const fileMessage = `📎 Uploaded ${this.uploadedFilesList.length} file(s): ${
                this.uploadedFilesList.map(f => f.name).join(', ')
            }`;
            this.addUserMessage(fileMessage);
        }
        
        this.textInput.value = '';
        this.adjustTextareaHeight();
        
        await this.processRequest();
        
        this.isProcessing = false;
        this.updateSendButton();
    }
    
    async processRequest() {
        for (let i = 0; i < this.botResponses.length; i++) {
            this.showTypingIndicator();
            await this.delay(1500 + Math.random() * 1000);
            
            this.hideTypingIndicator();
            
            if (i === this.botResponses.length - 1) {
                this.addBotMessage(this.botResponses[i], true);
            } else {
                this.addBotMessage(this.botResponses[i]);
            }
            
            await this.delay(500);
        }
        
        this.clearUploadedFiles();
    }
    
    showTypingIndicator() {
        this.typingIndicator.classList.remove('hidden');
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.classList.add('hidden');
    }
    
    addUserMessage(text) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container user-message-container';
        
        messageContainer.innerHTML = `
            <div class="message-wrapper">
                <div class="message-avatar user-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="message user-message">${this.escapeHtml(text)}</div>
            </div>
            <div class="timestamp">${this.formatTime(new Date())}</div>
        `;
        
        this.chatMessages.appendChild(messageContainer);
        this.scrollToBottom();
    }
    
    addBotMessage(text, includeDownload = false) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container bot-message-container';
        
        let downloadButton = '';
        if (includeDownload) {
            downloadButton = `
                <button class="download-button" type="button" onclick="chatBot.downloadFile()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Download Enhanced PPT
                </button>
            `;
        }
        
        messageContainer.innerHTML = `
            <div class="message-wrapper">
                <div class="bot-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                        <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="message bot-message">
                    ${this.escapeHtml(text)}
                    ${downloadButton}
                </div>
            </div>
            <div class="timestamp">${this.formatTime(new Date())}</div>
        `;
        
        this.chatMessages.appendChild(messageContainer);
        this.scrollToBottom();
    }
    
    downloadFile() {
        const content = `This is a simulated PowerPoint file download.
        
Generated by PowerPoint AI Assistant
Date: ${new Date().toLocaleString()}

In a real implementation, this would be your processed PowerPoint file.
The backend would return the actual .pptx file for download.`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `Enhanced_Presentation_${Date.now()}.txt`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        setTimeout(() => {
            this.addBotMessage("Great! Your presentation has been downloaded successfully. Is there anything else you'd like me to help you with?");
        }, 1000);
    }
    
    clearUploadedFiles() {
        this.uploadedFilesList = [];
        this.uploadedFiles.innerHTML = '';
        this.fileInput.value = '';
    }
    
    showError(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'message-container bot-message-container';
        errorContainer.innerHTML = `
            <div class="message-wrapper">
                <div class="bot-avatar" style="background: var(--color-error);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                <div class="message bot-message" style="color: var(--color-error); border-color: rgba(var(--color-error-rgb), 0.3);">
                    ${this.escapeHtml(message)}
                </div>
            </div>
            <div class="timestamp">${this.formatTime(new Date())}</div>
        `;
        
        this.chatMessages.appendChild(errorContainer);
        this.scrollToBottom();
        
        setTimeout(() => {
            if (errorContainer.parentNode) {
                errorContainer.remove();
            }
        }, 5000);
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 50);
    }
    
    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let chatBot;
document.addEventListener('DOMContentLoaded', () => {
    chatBot = new ChatBot();
});