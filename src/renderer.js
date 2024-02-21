// Your existing code...

document.addEventListener("DOMContentLoaded", function() {
    const bigPreviewContainer = document.getElementById("big-preview-container");
    const snippetBlocks = document.querySelectorAll(".snippet-block");

    snippetBlocks.forEach(function(snippetBlock) {
        snippetBlock.addEventListener("click", function() {
            const snippetCodeContent = snippetBlock.querySelector(".snippet-code p").textContent;
            const bigPreviewHeading = bigPreviewContainer.querySelector("h1");
            bigPreviewHeading.textContent = snippetCodeContent;
        });

        const snippetCode = snippetBlock.querySelector(".snippet-code");
        snippetCode.addEventListener("click", function(event) {
            event.stopPropagation();
            const snippetCodeContent = snippetCode.querySelector("p").textContent;
            const bigPreviewHeading = bigPreviewContainer.querySelector("h1");
            bigPreviewHeading.textContent = snippetCodeContent;

            // Use the exposed API to copy to clipboard
            electronAPI.clipboardWriteText(snippetCodeContent);
        });

        const snippetName = snippetBlock.querySelector(".snippet-name");
        snippetName.addEventListener("click", function(event) {
            event.stopPropagation();
            const snippetCodeContent = snippetBlock.querySelector(".snippet-code p").textContent;
            const bigPreviewHeading = bigPreviewContainer.querySelector("h1");
            bigPreviewHeading.textContent = snippetCodeContent;
        });

        // Add context menu event listener
        snippetName.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            showContextMenu(event);
        });
    });
});

function showContextMenu(event) {
    const snippetName = event.target.closest('.snippet-name');
    
    if (snippetName) {
        const contextMenu = snippetName.querySelector('.context-menu');
        contextMenu.style.display = "flex";

        // Calculate the left position based on the event position
        const contextMenuWidth = contextMenu.offsetWidth;
        const leftPosition = event.clientX - contextMenuWidth;

        contextMenu.style.left = leftPosition + "px";
        contextMenu.style.top = event.clientY + "px";
        contextMenu.classList.add("show");

        document.addEventListener("click", hideContextMenu);
    }
}


function hideContextMenu() {
    const contextMenus = document.querySelectorAll(".context-menu");

    contextMenus.forEach((contextMenu) => {
        contextMenu.classList.remove("show");
    });

    document.removeEventListener("click", hideContextMenu);

    setTimeout(() => {
        contextMenus.forEach((contextMenu) => {
            contextMenu.style.display = "none";
        });
    }, 200);
}


function editOption() {
    console.log("Edit option selected");
    hideContextMenu();
}

function copyOption(event) {
    // Get the parent snippet block of the context menu
    const snippetBlock = event.target.closest('.snippet-block');

    if (snippetBlock) {
        // Get the text from the big preview h1 element
        const bigPreviewHeading = document.getElementById('big-preview-container').querySelector('h1');
        const textToCopy = bigPreviewHeading.textContent || bigPreviewHeading.innerText;

        // Use the exposed API to copy to clipboard
        electronAPI.clipboardWriteText(textToCopy);
    }

    hideContextMenu();
}



function deleteOption() {
    console.log("Delete option selected");
    hideContextMenu();
}

