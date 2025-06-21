// Start of Immediately Invoked Function Expression (IIFE) for global scope isolation
(function () {

    // Mobile Menu Logic
    const hamburgerButton = document.getElementById('hamburger-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const headerLogo = document.getElementById('header-logo');

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        mobileMenuOverlay.style.display = 'block';
        setTimeout(() => mobileMenuOverlay.style.opacity = '1', 10); // Fade in overlay
        headerLogo.src = './assets/img/logo.jpg'; // Change logo when menu opens
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        mobileMenuOverlay.style.opacity = '0';
        setTimeout(() => mobileMenuOverlay.style.display = 'none', 300); // Hide overlay after transition
        headerLogo.src = './assets/img/logo-apaisado.jpg'; // Revert logo when menu closes
    }

    hamburgerButton.addEventListener('click', openMobileMenu);
    mobileMenuCloseButton.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Basic form submission feedback for main contact form
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', async function (e) { // Changed to async
        e.preventDefault(); // Prevent actual form submission for this demo

        formMessage.textContent = 'Enviando mensaje...';
        formMessage.classList.remove('text-green-600', 'text-red-500');
        formMessage.classList.add('text-slate-600');

        // Simulate success for demonstration
        // In a real application, you would send this data to a server
        // using fetch() or XMLHttpRequest.
        // Example:
        // try {
        //     const response = await fetch('/api/contact', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             name: document.getElementById('name').value,
        //             email: document.getElementById('email').value,
        //             phone: document.getElementById('phone').value,
        //             message: document.getElementById('message').value,
        //         }),
        //     });
        //     const data = await response.json();
        //     if (data.success) {
        //         formMessage.textContent = '¡Gracias por su mensaje! Nos pondremos en contacto pronto.';
        //         formMessage.classList.remove('text-slate-600', 'text-red-500');
        //         formMessage.classList.add('text-green-600');
        //         contactForm.reset();
        //     } else {
        //         formMessage.textContent = 'Hubo un error al enviar su mensaje. Por favor, intente de nuevo.';
        //         formMessage.classList.remove('text-slate-600', 'text-green-600');
        //         formMessage.classList.add('text-red-500');
        //     }
        // } catch (error) {
        //     console.error('Error al enviar el formulario:', error);
        //     formMessage.textContent = 'Hubo un error de red. Por favor, intente de nuevo más tarde.';
        //     formMessage.classList.remove('text-slate-600', 'text-green-600');
        //     formMessage.classList.add('text-red-500');
        // }


        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        formMessage.textContent = '¡Gracias por su mensaje! Nos pondremos en contacto pronto.';
        formMessage.classList.remove('text-slate-600', 'text-red-500');
        formMessage.classList.add('text-green-600');
        contactForm.reset();

        // Clear message after a few seconds
        setTimeout(() => {
            formMessage.textContent = '';
        }, 5000);
    });

    // Textarea auto-resize
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }

    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', () => autoResizeTextarea(textarea));
        // Initial resize in case of pre-filled content
        autoResizeTextarea(textarea);
    });


    // Floating AI Panel Logic
    const aiConsultationPanel = document.getElementById('ai-consultation-panel');
    const openAiPanelButton = document.getElementById('open-ai-panel');
    const closeAiPanelButton = document.getElementById('close-ai-panel');

    openAiPanelButton.addEventListener('click', () => {
        aiConsultationPanel.classList.remove('ai-panel-hidden'); // Slide in
        aiConsultationPanel.style.right = '0'; // Ensure it's fully visible
    });

    closeAiPanelButton.addEventListener('click', () => {
        aiConsultationPanel.style.right = '-400px'; // Slide out
        // For mobile, ensure it goes off screen properly
        if (window.innerWidth <= 768) {
            aiConsultationPanel.style.right = '-100%';
        }

        // Optionally clear content or reset form when closing
        document.getElementById('ai-name').value = '';
        document.getElementById('ai-email').value = '';
        document.getElementById('ai-question').value = '';
        aiResponseArea.classList.add('hidden');
        aiResponseContent.textContent = '';
    });

    // Gemini API Integration for Ask an Expert
    const askAiButton = document.getElementById('ask-ai-button');
    const aiNameInput = document.getElementById('ai-name');
    const aiEmailInput = document.getElementById('ai-email');
    const aiQuestionInput = document.getElementById('ai-question');
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiResponseContent = document.getElementById('ai-response-content');
    const aiLoading = document.getElementById('ai-loading');

    askAiButton.addEventListener('click', async () => {
        const name = aiNameInput.value.trim();
        const email = aiEmailInput.value.trim();
        const question = aiQuestionInput.value.trim();

        if (!name || !email || !question) {
            aiResponseContent.textContent = 'Por favor, completa tu nombre, correo electrónico y tu pregunta.';
            aiResponseArea.classList.remove('hidden');
            return;
        }

        aiLoading.classList.remove('hidden');
        aiResponseArea.classList.add('hidden');
        aiResponseContent.textContent = '';

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: `El usuario ${name} (${email}) pregunta: Responde brevemente a esta pregunta sobre contabilidad, liquidación de sueldos o recursos humanos en Argentina. Si no sabes la respuesta o es muy específica, indica que se requiere una consulta profesional. Pregunta: "${question}"` }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will automatically provide it in runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                aiResponseContent.textContent = text;
            } else {
                aiResponseContent.textContent = 'Lo siento, no pude generar una respuesta en este momento. Por favor, intenta de nuevo o contáctanos para una consulta profesional.';
            }
        } catch (error) {
            console.error('Error al llamar a la API de Gemini:', error);
            aiResponseContent.textContent = 'Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.';
        } finally {
            aiLoading.classList.add('hidden');
            aiResponseArea.classList.remove('hidden');
        }
    });

})(); // End of IIFE