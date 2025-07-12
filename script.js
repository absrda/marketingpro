// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGAÇÃO MOBILE =====
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fecha o menu mobile ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== EFEITO DE SCROLL NO HEADER =====
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // ===== ANIMAÇÕES DE ENTRADA =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplica animação aos elementos
    document.querySelectorAll('.service-card, .testimonial-card, .benefit-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== VALIDAÇÃO DO FORMULÁRIO =====
    const contactForm = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');
    
    // Função para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Função para validar telefone
    function isValidPhone(phone) {
        const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    // Função para mostrar erro
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const field = document.getElementById(fieldId);
        
        errorElement.textContent = message;
        field.style.borderColor = '#ef4444';
        
        // Remove o erro após 3 segundos
        setTimeout(() => {
            errorElement.textContent = '';
            field.style.borderColor = '#e5e7eb';
        }, 3000);
    }
    
    // Função para limpar erros
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
        document.querySelectorAll('input, textarea').forEach(field => {
            field.style.borderColor = '#e5e7eb';
        });
    }
    
    // Validação em tempo real
    document.getElementById('email').addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            showError('email', 'Por favor, insira um e-mail válido');
        }
    });
    
    document.getElementById('phone').addEventListener('blur', function() {
        if (this.value && !isValidPhone(this.value)) {
            showError('phone', 'Por favor, insira um telefone válido');
        }
    });
    
    // Submissão do formulário
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearErrors();
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            budget: document.getElementById('budget').value,
            message: document.getElementById('message').value.trim()
        };
        
        let hasErrors = false;
        
        // Validações
        if (!formData.name) {
            showError('name', 'Nome é obrigatório');
            hasErrors = true;
        } else if (formData.name.length < 2) {
            showError('name', 'Nome deve ter pelo menos 2 caracteres');
            hasErrors = true;
        }
        
        if (!formData.email) {
            showError('email', 'E-mail é obrigatório');
            hasErrors = true;
        } else if (!isValidEmail(formData.email)) {
            showError('email', 'Por favor, insira um e-mail válido');
            hasErrors = true;
        }
        
        if (!formData.phone) {
            showError('phone', 'Telefone é obrigatório');
            hasErrors = true;
        } else if (!isValidPhone(formData.phone)) {
            showError('phone', 'Por favor, insira um telefone válido');
            hasErrors = true;
        }
        
        if (!formData.message) {
            showError('message', 'Mensagem é obrigatória');
            hasErrors = true;
        } else if (formData.message.length < 10) {
            showError('message', 'Mensagem deve ter pelo menos 10 caracteres');
            hasErrors = true;
        }
        
        if (formData.budget && formData.budget < 1000) {
            showError('budget', 'Orçamento mínimo é R$ 1.000');
            hasErrors = true;
        }
        
        // Se não há erros, simula envio
        if (!hasErrors) {
            // Simula delay de envio
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Reset do formulário
                contactForm.reset();
                
                // Restaura botão
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Mostra modal de sucesso
                modal.style.display = 'block';
                
                // Log dos dados (em produção, enviaria para servidor)
                console.log('Dados do formulário:', formData);
                
            }, 2000);
        }
    });
    
    // ===== CALCULADORA DE DESCONTO =====
    const calculateButton = document.getElementById('calculateDiscount');
    const calculatorBudget = document.getElementById('calculatorBudget');
    const discountResult = document.getElementById('discountResult');
    const originalValue = document.getElementById('originalValue');
    const discountValue = document.getElementById('discountValue');
    const finalValue = document.getElementById('finalValue');
    
    calculateButton.addEventListener('click', function() {
        const budget = parseFloat(calculatorBudget.value);
        
        if (!budget || budget < 1000) {
            alert('Por favor, insira um orçamento válido (mínimo R$ 1.000)');
            return;
        }
        
        // Calcula desconto de 15%
        const discountPercentage = 15;
        const discountAmount = budget * (discountPercentage / 100);
        const finalAmount = budget - discountAmount;
        
        // Formata valores para moeda brasileira
        const formatCurrency = (value) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        };
        
        // Atualiza os valores na interface
        originalValue.textContent = formatCurrency(budget);
        discountValue.textContent = formatCurrency(discountAmount);
        finalValue.textContent = formatCurrency(finalAmount);
        
        // Mostra o resultado com animação
        discountResult.style.display = 'block';
        discountResult.style.opacity = '0';
        discountResult.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            discountResult.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            discountResult.style.opacity = '1';
            discountResult.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Permite calcular pressionando Enter no campo de orçamento
    calculatorBudget.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateButton.click();
        }
    });
    
    // ===== MODAL DE SUCESSO =====
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ===== FUNCIONALIDADE INTERATIVA: CONTADOR ANIMADO =====
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // ===== EFEITO PARALLAX SUAVE =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ===== FUNCIONALIDADE ADICIONAL: TEMA ESCURO (OPCIONAL) =====
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = this.querySelector('i');
        
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Carrega tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
    
    // ===== LOADING INICIAL =====
    window.addEventListener('load', function() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p style="color: var(--text-secondary);">Carregando...</p>
            </div>
        `;
        
        // Adiciona animação de rotação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loader);
        
        // Remove loader após 1 segundo
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
    
    // ===== FUNCIONALIDADE DE BUSCA (SIMULADA) =====
    const searchButton = document.createElement('button');
    searchButton.innerHTML = '<i class="fas fa-search"></i>';
    searchButton.className = 'search-toggle';
    searchButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--secondary-color);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(searchButton);
    
    searchButton.addEventListener('click', function() {
        const searchTerm = prompt('O que você está procurando?');
        if (searchTerm) {
            // Simula busca destacando elementos que contêm o termo
            const elements = document.querySelectorAll('h1, h2, h3, p');
            elements.forEach(el => {
                if (el.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                    el.style.background = 'yellow';
                    el.style.padding = '5px';
                    el.style.borderRadius = '5px';
                    
                    // Remove destaque após 3 segundos
                    setTimeout(() => {
                        el.style.background = '';
                        el.style.padding = '';
                        el.style.borderRadius = '';
                    }, 3000);
                }
            });
        }
    });
    
    // ===== ESTATÍSTICAS ANIMADAS =====
    const statsSection = document.createElement('section');
    statsSection.className = 'stats';
    statsSection.style.cssText = `
        background: var(--gradient-primary);
        color: white;
        padding: 60px 0;
        text-align: center;
    `;
    
    statsSection.innerHTML = `
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
                <div class="stat-item">
                    <div class="stat-number" data-target="150">0</div>
                    <div class="stat-label">Clientes Atendidos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" data-target="300">0</div>
                    <div class="stat-label">% Aumento Médio</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" data-target="5">0</div>
                    <div class="stat-label">Anos de Experiência</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" data-target="98">0</div>
                    <div class="stat-label">% Satisfação</div>
                </div>
            </div>
        </div>
    `;
    
    // Insere as estatísticas antes da seção de contato
    const contactSection = document.getElementById('contato');
    contactSection.parentNode.insertBefore(statsSection, contactSection);
    
    // Anima os números quando a seção entra na tela
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, 0, target, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
    
    console.log('🚀 MarketingPro - Página carregada com sucesso!');
    console.log('📊 Todas as funcionalidades JavaScript estão ativas.');
});

