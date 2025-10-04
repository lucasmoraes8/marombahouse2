// =============================================
// CONFIGURAÇÕES GLOBAIS
// =============================================
const CONFIG = {
    WHATSAPP_NUMBER: '5583988432176',
    WHATSAPP_PLANO: '5583988432176',
    INSTAGRAM_USER: 'academia_marombahouse'
};

// =============================================
// FUNÇÃO PRINCIPAL
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Site Academia Maromba House carregado!');
    
    initNavigation();
    initMobileMenu();
    initMasks();
    initAulaExperimental();
});

// =============================================
// 1. SISTEMA DE NAVEGAÇÃO
// =============================================
function initNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }
            
            closeMobileMenu();
        });
    });
}

// =============================================
// 2. MENU MOBILE
// =============================================
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');
    
    if (mobileMenu && navUl) {
        mobileMenu.addEventListener('click', function() {
            navUl.classList.toggle('show');
        });
    }
}

function closeMobileMenu() {
    const navUl = document.querySelector('nav ul');
    if (navUl && navUl.classList.contains('show')) {
        navUl.classList.remove('show');
    }
}

// =============================================
// 3. MÁSCARAS PARA FORMULÁRIOS
// =============================================
function initMasks() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para Telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
}

// =============================================
// 4. SISTEMA AULA EXPERIMENTAL
// =============================================
function initAulaExperimental() {
    const trialForm = document.getElementById('trialForm');
    
    if (!trialForm) {
        console.error('❌ Formulário não encontrado!');
        return;
    }
    
    trialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Formulário de aula experimental enviado!');
        
        const submitBtn = trialForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
        submitBtn.disabled = true;
        
        // Capturar dados
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            cpf: document.getElementById('cpf').value.trim()
        };
        
        console.log('📋 Dados capturados:', formData);
        
        // Validação básica
        if (!formData.name || !formData.email || !formData.phone || !formData.cpf) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            resetButton(submitBtn, originalText);
            return;
        }
        
        // Mensagem para WhatsApp
        const message = `Olá! Gostaria de agendar uma aula experimental na Academia Maromba House.\n\nNome: ${formData.name}\nEmail: ${formData.email}\nTelefone: ${formData.phone}\nCPF: ${formData.cpf}`;
        
        // URL do WhatsApp
        const whatsappURL = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
        
        console.log('📱 URL WhatsApp Aula:', whatsappURL);
        
        // Salva localmente
        saveLeadLocally({
            ...formData,
            timestamp: new Date().toLocaleString('pt-BR'),
            tipo: 'aula_experimental'
        });
        
        // Abre WhatsApp
        setTimeout(() => {
            window.open(whatsappURL, '_blank', 'noopener,noreferrer');
            
            // Feedback
            showMessage('✅ Redirecionando para o WhatsApp...', 'success');
            resetButton(submitBtn, originalText);
            trialForm.reset();
        }, 500);
    });
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================
function saveLeadLocally(formData) {
    try {
        const leads = JSON.parse(localStorage.getItem('marombahouse_leads') || '[]');
        leads.push(formData);
        localStorage.setItem('marombahouse_leads', JSON.stringify(leads));
        console.log('💾 Lead salvo localmente');
    } catch (error) {
        console.error('❌ Erro ao salvar lead:', error);
    }
}

function showMessage(message, type) {
    // Remove mensagens anteriores
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    const trialForm = document.getElementById('trialForm');
    if (trialForm) {
        trialForm.parentNode.insertBefore(messageDiv, trialForm);
    }
    
    // Remove após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function resetButton(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// =============================================
// VERIFICAÇÃO DE ELEMENTOS
// =============================================
console.log('🔧 Script carregado! Verificando elementos...');

setTimeout(() => {
    const assinarBtn = document.getElementById('btn-assinar-plano');
    const trialForm = document.getElementById('trialForm');
    
    console.log('🔍 Elementos encontrados:');
    console.log('- Botão Matricular:', assinarBtn ? '✅' : '❌');
    console.log('- Formulário Aula:', trialForm ? '✅' : '❌');
    
    if (assinarBtn) {
        console.log('🎯 Botão Matricular com URL direta do WhatsApp!');
    }
}, 1000);