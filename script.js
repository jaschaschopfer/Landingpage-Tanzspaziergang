document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.checkbox-dropdown-container');
    const toggleButton = container.querySelector('.dropdown-toggle');
    const dropdownList = container.querySelector('.dropdown-list');
    const checkboxes = dropdownList.querySelectorAll('input[type="checkbox"]');
    const form = document.querySelector('.newsletter-form');
    
    // NEW ELEMENTS TO MANAGE VISIBILITY
    const newsletterSection = document.querySelector('.newsletter-section');
    const thankYouSection = document.querySelector('.thank-you-section');

    // ----------------------------------------------------
    // 1. Dropdown Toggle Functionality (No change needed)
    // ----------------------------------------------------
    
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

    toggleButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown();
    });
    
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.checkbox-dropdown-container')) {
            toggleDropdown(false);
        }
    });

    // ----------------------------------------------------
    // 2. Button Text Update (No change needed)
    // ----------------------------------------------------

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

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateButtonText);
    });

    updateButtonText();


    // ----------------------------------------------------
    // 3. Form Submission and Transition Logic (NEW)
    // ----------------------------------------------------

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // STOP the default form submission immediately

        // 1. COLLECT DATA
        const formData = new FormData(form);
        const selectedDates = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Append selected dates to the FormData object
        selectedDates.forEach(dateValue => {
            formData.append('dates[]', dateValue);
        });

        // 2. APPLY TRANSITION (Hide Newsletter, Show Thank You)
        // Ensure the transition starts by applying the 'hidden' class
        newsletterSection.classList.add('hidden');

        // Wait for the newsletter section to start hiding (a small delay)
        setTimeout(() => {
            // Apply the 'visible' class to start the Thank You transition
            thankYouSection.classList.add('visible');
        }, 300); // 300ms is a good point to start the next animation

        // 3. SEND DATA TO SERVER (Asynchronously)
        try {
            // NOTE: Replace 'https://example.com/subscribe' with your actual server endpoint
            const response = await fetch(form.action, {
                method: form.method,
                body: formData
            });

            if (!response.ok) {
                // Handle server error if submission fails
                console.error("Submission failed on server:", response.statusText);
                // Optionally, reverse the animation or show an error message
                // newsletterSection.classList.remove('hidden');
                // thankYouSection.classList.remove('visible');
            }
            // If response is successful, the user sees the thank you message.

        } catch (error) {
            console.error("Network or Fetch Error:", error);
            // Handle network/client-side error
        }

    });
});