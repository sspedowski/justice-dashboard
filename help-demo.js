// Help Modal Functionality for Demo
function initializeHelpModal() {
    const helpButton = document.getElementById("helpButton");
    const helpModal = document.getElementById("helpModal");
    const closeHelpModal = document.getElementById("closeHelpModal");

    if (helpButton && helpModal && closeHelpModal) {
        // Open help modal
        helpButton.addEventListener("click", function() {
            helpModal.classList.remove("hidden");
            // Focus the modal for accessibility
            helpModal.focus();
        });

        // Close help modal
        closeHelpModal.addEventListener("click", function() {
            helpModal.classList.add("hidden");
        });

        // Close modal when clicking outside of it
        helpModal.addEventListener("click", function(event) {
            if (event.target === helpModal) {
                helpModal.classList.add("hidden");
            }
        });

        // Close modal with Escape key
        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape" && !helpModal.classList.contains("hidden")) {
                helpModal.classList.add("hidden");
            }
        });

        console.log("✅ Help modal initialized successfully");
    } else {
        console.warn("⚠️ Help modal elements not found");
    }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeHelpModal);
} else {
    initializeHelpModal();
}