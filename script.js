<<<<<<< Updated upstream
<<<<<<< Updated upstream
// --- NEW: Function to handle the actual backend call via fetch ---
async function submitFormData(data, url) {
    // We expect the PHP script to return HTTP 200 for success, and a non-200 for failure.
    const response = await fetch(url, {
        method: 'POST',
        // Fetch API automatically sets the correct headers for FormData
        body: data
    });

    if (!response.ok) {
        // Log error and throw it to be caught by the calling function's .catch()
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}`, errorText);
        throw new Error("Form submission failed on the server.");
    }
    
    // PHP doesn't need to return anything specific, just success.
    // We return true on response.ok.
    return true; 
}

=======
// Checkbox Dropdown Logic
>>>>>>> Stashed changes
=======
// Checkbox Dropdown Logic
>>>>>>> Stashed changes

document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References (same as before)
    const container = document.querySelector('.checkbox-dropdown-container');
    const toggleButton = container.querySelector('.dropdown-toggle');
    const dropdownList = container.querySelector('.dropdown-list');
    const checkboxes = dropdownList.querySelectorAll('input[type="checkbox"]');
    const form = document.querySelector('.newsletter-form');
    
    const newsletterSection = document.querySelector('.newsletter-section');
    const thankYouSection = document.querySelector('.thank-you-section');
    const submitButton = form.querySelector('button[type="submit"]');

    // Utility: Show/Hide Dropdown (same as before)
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

    // Utility: Update Button Text (same as before)
    function updateButtonText() {
        const checkedCount = dropdownList.querySelectorAll('input[type="checkbox"]:checked').length;
        
        if (checkedCount === 0) {
            toggleButton.textContent = 'Termine auswählen';
        } else if (checkedCount === 1) {
            toggleButton.textContent = '1 Termin ausgewählt';
        } else {
            toggleButton.textContent = `${checkedCount} Termine ausgewählt`;
        }
    }

    // Initialize Dropdown Listeners (same as before)
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream

    // ----------------------------------------------------
    // ASYNCHRONOUS FORM SUBMISSION AND CONFIRMED TRANSITION
    // ----------------------------------------------------

    form.addEventListener('submit', async (event) => { // *** ADDED 'async' ***
        event.preventDefault();

        if (!form.reportValidity()) {
            return; 
        }

        // 1. --- PREPARE UI AND DATA ---
        
        // Disable the button and show loading text (user feedback)
        submitButton.disabled = true;
        submitButton.textContent = 'Sende...'; 
        
        const formData = new FormData(form);
        // NOTE: We rely on the HTML being correctly named (name="event_dates[]") 
        // for FormData to handle the multiple date selection automatically.

        // 2. --- START ASYNC SUBMISSION AND WAIT FOR CONFIRMATION ---
        try {
            // The function waits here for the PHP script to finish and return success (response.ok)
            const submissionSuccess = await submitFormData(formData, form.action);
            
            if (submissionSuccess) {
                // 3. --- SUCCESS: START UI TRANSITION ---
                
                // Start the CSS transition: Hide Newsletter
                newsletterSection.classList.add('hidden');

                // Wait a short time for CSS transition of the old section to start
                setTimeout(() => {
                    // Show Thank You
                    thankYouSection.classList.add('visible');
                    
                    // Prevent the forward/back history issue
                    history.replaceState(null, '', window.location.pathname + '#subscribed');
=======
=======
>>>>>>> Stashed changes
    
    
    // -----------------------------------------------------------------
    // --- SCROLL ANIMATION LOGIC (PORTED) ---
    // -----------------------------------------------------------------
>>>>>>> Stashed changes

                }, 400); // Wait for half the transition duration (0.4s of the 0.8s CSS transition)

            } else {
                 // This block should ideally not be hit if submitFormData throws errors as designed
                 throw new Error("Submission did not return success.");
            }
        } catch (error) {
            // 4. --- FAILURE: REVERT UI AND SHOW ERROR ---
            console.error("Final submission failed, reverting UI:", error);
            alert("Fehler bei der Anmeldung. Bitte versuchen Sie es erneut. (Prüfen Sie die Konsole für Details)"); // Display a visible error
            
            submitButton.disabled = false;
            submitButton.textContent = 'Anmelden'; // Revert button text
            
            // Optionally, remove 'hidden' class if you want the form to reappear
            newsletterSection.classList.remove('hidden');
        }
    });
    
    
    // -----------------------------------------------------------------
    // --- SCROLL ANIMATION LOGIC & MUTATION OBSERVER (SAME AS BEFORE) ---
    // -----------------------------------------------------------------
    
    // ... [Intersection Observer logic remains unchanged] ...
    const selectorList = [
        // Target major sections (skip the first one, which is the newsletter form)
        'section:not(:first-child)',
        // Target common block elements inside the main content
        'main h1', 
        'main h2', 
        'main p', 
        'main blockquote',
        // Target specific containers/items for the slide-in effect
        'section.hanging-pictures .image',
        'main form'
    ];

    const animatedElements = document.querySelectorAll(selectorList.join(', '));
    
    if (animatedElements.length > 0) {

        const observerOptions = {
            root: null,
            threshold: 0.05, 
            rootMargin: "0px 0px -30px 0px" 
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); 
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Mutation Observer logic (same as before)
    const thankYouSectionExternal = document.querySelector('.thank-you-section');
    const newsletterBottomSection = document.querySelector('.newsletter-section-bottom');
    const observerExternal = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                if (thankYouSectionExternal.classList.contains('visible')) {
                    newsletterBottomSection.style.display = 'none';
                } else {
                    newsletterBottomSection.style.display = 'flex';
                }
            }
        });
    });

    if (thankYouSectionExternal) {
        observerExternal.observe(thankYouSectionExternal, { attributes: true });
    }


    // Scroll logic (same as before)
    const topNewsletterSection = document.getElementById('top');
    if (topNewsletterSection) {
        topNewsletterSection.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ID 'bottom' was not in the HTML, but including the listener if you add the ID later.
    const bottomNewsletterSection = document.getElementById('bottom');
    if (bottomNewsletterSection) {
        bottomNewsletterSection.addEventListener('click', () => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
    }
});