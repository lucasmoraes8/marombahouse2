// WhatsApp Integration
document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp para Planos
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const planName = this.getAttribute('data-plano');
            const message = `Olá! Gostaria de saber mais sobre o plano ${planName} da Academia Maromba House.`;
            const whatsappURL = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');
        });
    });
    
    // Formulário de Aula Experimental
    const trialForm = document.getElementById('trialForm');
    
    trialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Capturar dados do formulário
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const cpf = document.getElementById('cpf').value;
        
        // Validar CPF (formato básico)
        if (!validateCPF(cpf)) {
            alert('Por favor, insira um CPF válido.');
            return;
        }
        
        // Mensagem para WhatsApp
        const message = `Tenho interesse em fazer uma aula experimental na Academia Maromba House.\n\nNome: ${name}\nE-mail: ${email}\nTelefone: ${phone}\nCPF: ${cpf}`;
        const whatsappURL = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
        
        // Redirecionar para WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Limpar formulário
        trialForm.reset();
        
        // Feedback para o usuário
        alert('Obrigado pelo seu interesse! Você será redirecionado para o WhatsApp para finalizar o agendamento.');
    });
    
    // Validação básica de CPF
    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        
        // Cálculo de validação do CPF (simplificado)
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }
    
    // Navegação suave
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Fechar menu mobile se estiver aberto
            const navUl = document.querySelector('nav ul');
            if (navUl.classList.contains('show')) {
                navUl.classList.remove('show');
            }
        });
    });
    
    // Menu mobile
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');
    
    mobileMenu.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });
    
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        
        e.target.value = value;
    });
    
    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
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
});
// Função para carregar feed do Instagram automaticamente
async function loadInstagramFeed() {
    const instagramFeed = document.querySelector('.instagram-feed');
    
    // Substitua pelo username real da academia
    const username = 'academia_marombahouse';
    
    try {
        // Esta é uma solução simplificada - pode não funcionar sempre
        const response = await fetch(`https://www.instagram.com/${academia_marombahouse}/?__a=1`);
        const data = await response.json();
        
        const posts = data.graphql.user.edge_owner_to_timeline_media.edges;
        
        instagramFeed.innerHTML = '';
        
        posts.slice(0, 6).forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'instagram-post';
            postElement.innerHTML = `
                <img src="${post.node.display_url}" alt="Post do Instagram" 
                     onerror="this.src='https://www.instagram.com/p/DLINx1GOhdl/?utm_source=ig_web_copy_link'">
                <div class="instagram-overlay">
                    <a href="https://instagram.com/p/${post.node.shortcode}/" target="_blank">
                        <i class="fab fa-instagram"></i>
                    </a>
                </div>
            `;
            instagramFeed.appendChild(postElement);
        });
        
    } catch (error) {
        console.log('Não foi possível carregar o feed automaticamente');
        // Mantém o conteúdo padrão
    }
}

// Chame a função quando a página carregar
document.addEventListener('DOMContentLoaded', loadInstagramFeed);

// Sistema de Aula Experimental - WhatsApp + Local Storage
document.addEventListener('DOMContentLoaded', function() {
    const trialForm = document.getElementById('trialForm');
    
    // Número do WhatsApp da academia (ATUALIZE AQUI)
    const WHATSAPP_NUMBER = '8398843-2176'; // Substitua pelo seu número
    
    trialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar loading no botão
        const submitBtn = trialForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
        submitBtn.disabled = true;
        
        // Capturar dados do formulário
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            cpf: document.getElementById('cpf').value.trim(),
            timestamp: new Date().toLocaleString('pt-BR'),
            source: 'Site Academia Maromba House'
        };
        
        // Validar dados
        if (!validateForm(formData)) {
            resetButton(submitBtn, originalText);
            return;
        }
        
        // 1. Salvar no Local Storage
        saveLeadLocally(formData);
        
        // 2. Redirecionar para WhatsApp
        setTimeout(() => {
            redirectToWhatsApp(formData);
            resetButton(submitBtn, originalText);
            showSuccessMessage();
            trialForm.reset();
        }, 1000);
    });
    
    function validateForm(data) {
        // Validar nome
        if (data.name.length < 2) {
            showMessage('Por favor, insira um nome válido.', 'error');
            return false;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('Por favor, insira um email válido.', 'error');
            return false;
        }
        
        // Validar telefone (mínimo 10 dígitos)
        const phoneDigits = data.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            showMessage('Por favor, insira um telefone válido.', 'error');
            return false;
        }
        
        // Validar CPF
        if (!validateCPF(data.cpf)) {
            showMessage('Por favor, insira um CPF válido.', 'error');
            return false;
        }
        
        return true;
    }
    
    function validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11) return false;
        
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Validar primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        // Validar segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }
    
    function saveLeadLocally(formData) {
        try {
            const leads = JSON.parse(localStorage.getItem('marombahouse_leads') || '[]');
            
            // Verificar se o CPF já existe (evitar duplicatas)
            const existingLead = leads.find(lead => lead.cpf === formData.cpf);
            if (!existingLead) {
                leads.push(formData);
                localStorage.setItem('marombahouse_leads', JSON.stringify(leads));
                console.log('✅ Lead salvo localmente. Total:', leads.length);
            } else {
                console.log('⚠️ Lead já existe no sistema');
            }
            
        } catch (error) {
            console.error('❌ Erro ao salvar lead:', error);
        }
    }
    
    function redirectToWhatsApp(formData) {
        const message = `🏋️‍♂️ *NOVA SOLICITAÇÃO - AULA EXPERIMENTAL* 🏋️‍♂️\n\n` +
                       `👤 *Nome:* ${formData.name}\n` +
                       `📧 *Email:* ${formData.email}\n` +
                       `📞 *Telefone:* ${formData.phone}\n` +
                       `🆔 *CPF:* ${formData.cpf}\n` +
                       `⏰ *Data:* ${formData.timestamp}\n` +
                       `🌐 *Fonte:* ${formData.source}\n\n` +
                       `💪 _Pronto para transformar este lead em um novo aluno!_`;
        
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }
    
    function showSuccessMessage() {
        showMessage('✅ Agendamento enviado com sucesso! Você será redirecionado para o WhatsApp.', 'success');
        
        // Estatísticas
        const leads = JSON.parse(localStorage.getItem('marombahouse_leads') || '[]');
        console.log(`📊 Total de leads capturados: ${leads.length}`);
    }
    
    function showMessage(message, type) {
        // Remove mensagens anteriores
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        trialForm.parentNode.insertBefore(messageDiv, trialForm);
        
        // Remove a mensagem após 5 segundos
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
    
    // Máscaras para os campos
    initializeMasks();
});

// Sistema de Máscaras
function initializeMasks() {
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

// Painel Admin para Ver Leads (Acesso com Ctrl+Shift+L)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        showLeadsPanel();
    }
});

function showLeadsPanel() {
    const leads = JSON.parse(localStorage.getItem('marombahouse_leads') || '[]');
    
    // Criar ou atualizar o painel
    let panel = document.getElementById('adminLeadsPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'adminLeadsPanel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(0,0,0,0.5);
            z-index: 10000;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(panel);
    }
    
    if (leads.length === 0) {
        panel.innerHTML = `
            <h3 style="color: #ff6b00; margin-bottom: 15px;">📊 Painel de Leads - Academia Maromba House</h3>
            <p>Nenhum lead capturado ainda.</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 15px; background: #ff6b00; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Fechar
            </button>
        `;
    } else {
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="color: #ff6b00; margin: 0;">📊 Painel de Leads (${leads.length})</h3>
                <div>
                    <button onclick="exportLeads()" style="padding: 5px 10px; margin-right: 10px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">
                        📥 Exportar
                    </button>
                    <button onclick="clearLeads()" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">
                        🗑️ Limpar
                    </button>
                </div>
            </div>
            <div style="max-height: 400px; overflow-y: auto;">
                ${leads.map((lead, index) => `
                    <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 5px; background: #f9f9f9;">
                        <strong>#${index + 1} - ${lead.name}</strong><br>
                        📞 ${lead.phone} | 📧 ${lead.email}<br>
                        🆔 ${lead.cpf} | ⏰ ${lead.timestamp}
                    </div>
                `).join('')}
            </div>
            <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 15px; background: #ff6b00; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Fechar
            </button>
        `;
    }
}

function exportLeads() {
    const leads = JSON.parse(localStorage.getItem('marombahouse_leads') || '[]');
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Nome,Email,Telefone,CPF,Data\n"
        + leads.map(lead => 
            `"${lead.name}","${lead.email}","${lead.phone}","${lead.cpf}","${lead.timestamp}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_academia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearLeads() {
    if (confirm('Tem certeza que deseja limpar todos os leads?')) {
        localStorage.removeItem('marombahouse_leads');
        showLeadsPanel();
        alert('Leads limpos com sucesso!');
    }
}