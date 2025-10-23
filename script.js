// Checkbox Dropdown Logic

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