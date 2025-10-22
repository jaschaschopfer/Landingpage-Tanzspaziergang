document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.checkbox-dropdown-container');
    const toggleButton = container.querySelector('.dropdown-toggle');
    const dropdownList = container.querySelector('.dropdown-list');
    const checkboxes = dropdownList.querySelectorAll('input[type="checkbox"]');
    const form = document.querySelector('.newsletter-form');

    // ----------------------------------------------------
    // 1. Dropdown Toggle Functionality
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
        event.stopPropagation(); // Prevent document listener from closing immediately
        toggleDropdown();
    });
    
    // Close the dropdown when clicking anywhere else on the page
    document.addEventListener('click', (event) => {
        // Check if the click was OUTSIDE the container
        if (!event.target.closest('.checkbox-dropdown-container')) {
            toggleDropdown(false);
        }
    });

    // ----------------------------------------------------
    // 2. Button Text Update (Localization for German)
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

    // Attach listener to all checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateButtonText);
    });

    // Initial text update
    updateButtonText();


    // ----------------------------------------------------
    // 3. Form Submission Handling (CRITICAL for data collection)
    // ----------------------------------------------------
    // Since the checkboxes are OUTSIDE the main form, we must manually
    // collect the selected dates and append them as hidden inputs 
    // before the form is submitted.

    form.addEventListener('submit', (event) => {
        // Clear any previous hidden inputs to prevent duplicates on resubmission
        form.querySelectorAll('input[name="dates_selected"]').forEach(input => input.remove());

        const selectedDates = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedDates.length > 0) {
            // Append the selected dates as hidden inputs so they get submitted with the form
            selectedDates.forEach(dateValue => {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                // Use a different name to distinguish from the original checkbox name, 
                // but if your backend expects 'dates', use 'dates' here.
                hiddenInput.name = 'dates[]'; // Use 'dates[]' for array submission
                hiddenInput.value = dateValue;
                form.appendChild(hiddenInput);
            });
        }
        
        // Form will now submit with name, email, and selected dates
    });
});