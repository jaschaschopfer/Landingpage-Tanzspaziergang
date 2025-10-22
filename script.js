// Global utility for simulating backend call
function simulateBackendCall(data, delayMs = 1500) {
    // This function runs asynchronously in the background.
    // Replace this with your actual fetch request later (e.g., fetch(form.action, { method: 'POST', body: data }))
    return new Promise(resolve => {
        console.log("Starting asynchronous backend submission for:", Object.fromEntries(data));
        
        // TEMPORARY SIMULATION: Wait for the network delay
        setTimeout(() => {
            console.log("Backend submission placeholder complete.");
            resolve(true); // Assuming success for the simulation
        }, delayMs);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const container = document.querySelector('.checkbox-dropdown-container');
    const toggleButton = container.querySelector('.dropdown-toggle');
    const dropdownList = container.querySelector('.dropdown-list');
    const checkboxes = dropdownList.querySelectorAll('input[type="checkbox"]');
    const form = document.querySelector('.newsletter-form');
    
    const newsletterSection = document.querySelector('.newsletter-section');
    const thankYouSection = document.querySelector('.thank-you-section');
    const submitButton = form.querySelector('button[type="submit"]');

    // Utility: Show/Hide Dropdown
    function toggleDropdown(show) {
        const shouldShow = (show === undefined) ? !dropdownList.classList.contains('active') : show;
        
        if (shouldShow) {
            dropdownList.classList.add('active');
            toggleButton.setAttribute('aria-expanded', 'true');
        } else {
            dropdownList.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
        }
    }

    // Utility: Update Button Text
    function updateButtonText() {
        const checkedCount = dropdownList.querySelectorAll('input[type="checkbox"]:checked').length;
        
        if (checkedCount === 0) {
            toggleButton.textContent = 'Termine Auswählen';
        } else if (checkedCount === 1) {
            toggleButton.textContent = '1 Termin Ausgewählt';
        } else {
            toggleButton.textContent = `${checkedCount} Termine Ausgewählt`;
        }
    }

    // Initialize Dropdown Listeners
    toggleButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown();
    });
    
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.checkbox-dropdown-container')) {
            toggleDropdown(false);
        }
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateButtonText);
    });

    updateButtonText(); // Set initial button text

    // ----------------------------------------------------
    // ASYNCHRONOUS FORM SUBMISSION AND IMMEDIATE TRANSITION
    // ----------------------------------------------------

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Stop default browser submission

        // Check if browser validation passed (required inputs filled)
        if (!form.reportValidity()) {
            return; 
        }

        // 1. --- START UI TRANSITION IMMEDIATELY ---
        
        // Disable the button and show loading text (feedback for the user)
        submitButton.disabled = true;
        submitButton.textContent = 'Sende...'; 
        
        // Start the transition: Hide Newsletter
        newsletterSection.classList.add('hidden');

        // Wait a short time, then show Thank You (creates the smooth slide effect)
        setTimeout(() => {
            thankYouSection.classList.add('visible');
            
            // *** NEW: Prevent the forward/back history issue ***
            // This replaces the current history entry with a new one 
            // (e.g., '/thanks' or just a clean version of the current URL)
            // so the back button is functional, but the forward button disappears.
            history.replaceState(null, '', window.location.pathname + '#subscribed');

        }, 400); 


        // 2. --- COLLECT DATA ---
        
        const formData = new FormData(form);
        const selectedDates = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Append selected dates to the FormData object
        selectedDates.forEach(dateValue => {
            formData.append('dates[]', dateValue);
        });

        // 3. --- START ASYNC SUBMISSION (WITHOUT AWAITING) ---
        // Submission runs in the background. The user sees the Thank You screen regardless.
        simulateBackendCall(formData, 1500)
            .catch(error => {
                console.error("Background submission failed:", error);
                // Optionally, handle error state here if needed
            });
    });
});


// When the thank you section is visible, add display:none to section.newsletter-section-bottom.
const thankYouSection = document.querySelector('.thank-you-section');
const newsletterBottomSection = document.querySelector('.newsletter-section-bottom');
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
            if (thankYouSection.classList.contains('visible')) {
                newsletterBottomSection.style.display = 'none';
            } else {
                newsletterBottomSection.style.display = 'flex';
            }
        }
    });
});

observer.observe(thankYouSection, { attributes: true });

// Smooth scroll to top when clicking on "Erinnerung erhalten" section
const topNewsletterSection = document.getElementById('top');
topNewsletterSection.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
const bottomNewsletterSection = document.getElementById('bottom');
bottomNewsletterSection.addEventListener('click', () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
});

