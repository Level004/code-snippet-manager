document.addEventListener("DOMContentLoaded", function() {
    // Get the big preview container
    const bigPreviewContainer = document.getElementById("big-preview-container");

    // Get all the snippet blocks
    const snippetBlocks = document.querySelectorAll(".snippet-block");

    // Add click event listeners to each snippet block
    snippetBlocks.forEach(function(snippetBlock) {
        // Add click event listener to the whole snippet block
        snippetBlock.addEventListener("click", function() {
            // Get the content of the snippet code inside the clicked snippet block
            const snippetCodeContent = snippetBlock.querySelector(".snippet-code p").textContent;

            // Select the h1 element inside the big preview container and update its text content
            const bigPreviewHeading = bigPreviewContainer.querySelector("h1");
            bigPreviewHeading.textContent = snippetCodeContent;
        });

        // Add click event listener to the snippet code element
        const snippetCode = snippetBlock.querySelector(".snippet-code");
        snippetCode.addEventListener("click", function(event) {
            // Stop event propagation to prevent the whole snippet block from triggering
            event.stopPropagation();

            // Get the content of the snippet code inside the clicked snippet block
            const snippetCodeContent = snippetCode.querySelector("p").textContent;

            // Select the h1 element inside the big preview container and update its text content
            const bigPreviewHeading = bigPreviewContainer.querySelector("h1");
            bigPreviewHeading.textContent = snippetCodeContent;
        });

        // Add click event listener to the snippet name element
        const snippetName = snippetBlock.querySelector(".snippet-name");
        snippetName.addEventListener("click", function(event) {
            // Stop event propagation to prevent the whole snippet block from triggering
            event.stopPropagation();

            // Get the content of the snippet code inside the clicked snippet block
            const snippetCodeContent = snippetBlock.querySelector(".snippet-code p").textContent;

            // Select the h1 element inside the big preview container and update its text content
            const bigPreviewHeading = bigPreviewContainer.querySelector("h1");
            bigPreviewHeading.textContent = snippetCodeContent;
        });
    });
});

