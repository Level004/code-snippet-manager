

// adds event listeners

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



//context menu logic


function showContextMenu(event) {
    event.preventDefault();
    const contextMenu = document.getElementById("contextMenu");
    contextMenu.style.display = "block";
    contextMenu.style.left = event.clientX + "px";
    contextMenu.style.top = event.clientY + "px";
    document.addEventListener("click", hideContextMenu);
}

function hideContextMenu() {
    const contextMenu = document.getElementById("contextMenu");
    contextMenu.style.display = "none";
    document.removeEventListener("click", hideContextMenu);
}

function editOption() {
    console.log("Edit option selected");

    hideContextMenu();
}

function copyOption() {
    console.log("Copy option selected");
    // Add your copy logic here
    hideContextMenu();
}

function deleteOption() {
    console.log("Delete option selected");
    // Add your delete logic here
    hideContextMenu();
}
