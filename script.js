document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOpenIcon = document.getElementById('menu-open-icon');
    const menuCloseIcon = document.getElementById('menu-close-icon');

    // API URL - Your backend server
    const API_URL = 'http://localhost:3000';

    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuOpenIcon.classList.toggle('hidden');
        menuCloseIcon.classList.toggle('hidden');
    });

    // Smooth scroll navigation
    document.querySelectorAll('button[data-section]').forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    menuOpenIcon.classList.remove('hidden');
                    menuCloseIcon.classList.add('hidden');
                }
            }
        });
    });

    // Scrollspy
    const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
    const navButtons = document.querySelectorAll('#desktop-menu button');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-gray-900/95', 'backdrop-blur-md', 'shadow-lg');
        } else {
            navbar.classList.remove('bg-gray-900/95', 'backdrop-blur-md', 'shadow-lg');
        }

        let current = '';
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    current = sectionId;
                }
            }
        });

        navButtons.forEach(button => {
            const sectionId = button.getAttribute('data-section');
            if (sectionId === current) {
                button.classList.add('bg-[#888888]/20', 'text-white');
            } else {
                button.classList.remove('bg-[#888888]/20', 'text-white');
            }
        });
    });

    // DONATE BUTTON
    const donateButton = document.getElementById('donate-button');
    
    if (donateButton) {
        donateButton.addEventListener('click', async () => {
            try {
                donateButton.disabled = true;
                donateButton.innerHTML = '<span>Processing...</span>';

                // Get Razorpay key
                const keyResponse = await fetch(`${API_URL}/get-razorpay-key`);
                const keyData = await keyResponse.json();

                // Create order
                const orderResponse = await fetch(`${API_URL}/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: 100, currency: 'INR' })
                });
                const order = await orderResponse.json();

                // Razorpay options
                const options = {
                    key: keyData.key,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Tarun Mehra',
                    description: 'Support my learning journey',
                    order_id: order.id,
                    
                    handler: async function (response) {
                        try {
                            const verifyResponse = await fetch(`${API_URL}/verify-payment`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });
                            const verifyData = await verifyResponse.json();
                            if (verifyData.success) {
                                alert('🎉 Thank you for your support!\n\nPayment ID: ' + response.razorpay_payment_id);
                            }
                        } catch (error) {
                            alert('Payment received! ID: ' + response.razorpay_payment_id);
                        }
                    },
                    
                    theme: { color: '#888888' },
                    
                    modal: {
                        ondismiss: function() {
                            resetDonateButton();
                        }
                    }
                };

                const rzp = new Razorpay(options);
                rzp.on('payment.failed', function(response) {
                    alert('❌ Payment failed!\n\n' + response.error.description);
                    resetDonateButton();
                });
                rzp.open();
                resetDonateButton();

            } catch (error) {
                alert('⚠️ Error: ' + error.message);
                resetDonateButton();
            }
        });
    }

    function resetDonateButton() {
        donateButton.disabled = false;
        donateButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-5 h-5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <span>Support them</span>
        `;
    }
});