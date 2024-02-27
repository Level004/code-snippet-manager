const fs = electronAPI.fs;
const path = electronAPI.path;


// add snippets and stuff

function showAddSnippetContextMenu(event) {
    const sideBar = document.getElementById('side-bar');

    if (sideBar) {
        const contextMenu = sideBar.querySelector('.context-menu');
        contextMenu.style.display = "flex";

        // Calculate the left position based on the event position
        const contextMenuWidth = contextMenu.offsetWidth;
        const leftPosition = event.clientX - contextMenuWidth;

        contextMenu.style.left = leftPosition + "px";
        contextMenu.style.top = event.clientY + "px";
        contextMenu.classList.add("show");

    }
}

function hideSnipContextMenu() {
    const contextMenu = document.getElementById("addSnippetContextMenu");

    contextMenu.classList.remove("show");

    document.removeEventListener("click", hideSnipContextMenu);

    setTimeout(() => {
        contextMenu.style.display = "none";
    }, 200);
}

function createNewSnippetGroupForm() {
    hideSnipContextMenu()

    const newSnippetGroupForm = document.createElement("div");
    newSnippetGroupForm.id = "newSnippetGroupForm";
    newSnippetGroupForm.classList.add("context-menu-form");

    const input = document.createElement("input");
    input.type = "text";
    input.id = "snippetGroupName";
    input.placeholder = "Enter group name";

    const button = document.createElement("button");
    button.textContent = "Create";
    button.onclick = function() {
        addSnippetGroup();
        newSnippetGroupForm.parentNode.removeChild(newSnippetGroupForm);
        location.reload();
    };

    newSnippetGroupForm.appendChild(input);
    newSnippetGroupForm.appendChild(button);

    document.getElementById("main-container").appendChild(newSnippetGroupForm);
}

function createNewSnippetForm() {
    hideSnipContextMenu();

    const newSnippetForm = document.createElement("div");
    newSnippetForm.id = "newSnippetForm";
    newSnippetForm.classList.add("context-menu-form");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "snippetName";
    nameInput.placeholder = "Enter Snippet Name";

    const codeTextarea = document.createElement("textarea");
    codeTextarea.id = "snippetCode";
    codeTextarea.placeholder = "Enter Snippet Code";

    const groupDropdown = document.createElement("select");
    groupDropdown.id = "snippetGroupDropdown";

    const jsonFilePath = path.join('snippetdata.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    const groups = jsonData.snippetgroups.split(',');
    groups.forEach(group => {
        const option = document.createElement("option");
        option.value = group.trim();
        option.text = group.trim();
        groupDropdown.appendChild(option);
    });

    const button = document.createElement("button");
    button.textContent = "Create";
    button.onclick = function() {
        addSnippet();
        newSnippetForm.parentNode.removeChild(newSnippetForm);
        location.reload();
    };

    newSnippetForm.appendChild(nameInput);
    newSnippetForm.appendChild(codeTextarea);
    newSnippetForm.appendChild(groupDropdown);
    newSnippetForm.appendChild(button);

    document.getElementById("main-container").appendChild(newSnippetForm);
}


function addSnippetGroup() {
    const snippetGroupName = document.getElementById("snippetGroupName").value.trim();

    if (snippetGroupName !== "") {
        const filePath = path.join('snippetdata.json');
        let data = fs.readFileSync(filePath, 'utf-8');
        let jsonData = JSON.parse(data);

        if (!jsonData.snippetgroups) {
            jsonData.snippetgroups = "";
        }

        if (jsonData.snippetgroups === "") {
            jsonData.snippetgroups = snippetGroupName;
        } else {
            jsonData.snippetgroups += `,${snippetGroupName}`;
        }

        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

        document.getElementById("snippetGroupName").value = "";
    }
}

function addSnippet() {
    const snippetName = document.getElementById("snippetName").value.trim();
    const snippetCode = document.getElementById("snippetCode").value;
    const snippetGroup = document.getElementById("snippetGroupDropdown").value;

    if (snippetName !== "" && snippetCode !== "") {
        const filePath = path.join('snippetdata.json');
        let data = fs.readFileSync(filePath, 'utf-8');
        let jsonData = JSON.parse(data);

        jsonData.snippets.snip.push({
            "name": snippetName,
            "code": snippetCode,
            "group": snippetGroup
        });

        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    }
}



// adding event listenrs to the snip blocks


function populateSnippetsContainer(callback) {
    const snippetsContainer = document.getElementById("snippets-container");

    const jsonFilePath = path.join('snippetdata.json');

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Reading JSON file:', err);
            return;
        }

        const jsonData = JSON.parse(data);

        if (jsonData && jsonData.snippets && jsonData.snippets.snip) {
            jsonData.snippets.snip.forEach(snippet => {
                const snippetBlock = document.createElement("div");
                snippetBlock.classList.add("snippet-block", "rounded");

                const snippetCode = document.createElement("div");
                snippetCode.classList.add("snippet-code");

                // Replace newline characters with <br> tags and wrap in <pre>
                snippetCode.innerHTML = `<pre>${snippet.code.replace(/\n/g, '<br>')}</pre>`;

                const snippetName = document.createElement("div");
                snippetName.classList.add("snippet-name", "d-flex", "align-items-center");
                snippetName.setAttribute("oncontextmenu", "showContextMenu(event)");
                snippetName.innerHTML = `
                    <p class="flex-grow-1">${snippet.name}</p>
                    <p class="snippet-group">${snippet.group}</p>
                    <div class="meatball-button">
                        <svg class="menu-button" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" onclick="showContextMenu(event)"
                            style="cursor: pointer;">
                            <circle cx="12" cy="12" r="2"></circle>
                            <circle cx="12" cy="5" r="2"></circle>
                            <circle cx="12" cy="19" r="2"></circle>
                        </svg>
                        <div id="contextMenu" class="context-menu">
                            <div onclick="editOption()">Edit</div>
                            <div onclick="copyOption(event)">Copy</div>
                            <div onclick="deleteOption(event)" style="color: red;">Delete</div>
                        </div>
                    </div>
                `;

                snippetBlock.appendChild(snippetCode);
                snippetBlock.appendChild(snippetName);
                snippetsContainer.appendChild(snippetBlock);
            });
        }

        if (typeof callback === 'function') {
            callback();
        }
    });
}


function populateGroupsContainer() {
    const groupsContainer = document.getElementById("groups-container");

    const jsonFilePath = path.join('snippetdata.json');


    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Reading JSON file:', err);
            return;
        }

        const jsonData = JSON.parse(data);
        const groups = jsonData.snippetgroups.split(',');

        if (groups.length === 0 || (groups.length === 1 && groups[0] === '')) {
            console.warn('Groups is empty.');
            return;
        }

        groups.forEach(group => {
            const div = document.createElement('div');
            div.classList.add('side-group-name', 'center-block', 'rounded', 'd-flex', 'justify-content-center');

            const p = document.createElement('p');
            p.textContent = group;

            div.appendChild(p);

            groupsContainer.appendChild(div);
        });

        //if (typeof callback === 'function') {
        //  callback();
        //}
    });
}


document.addEventListener("DOMContentLoaded", function() {
    populateSnippetsContainer(function() {
        const bigPreviewContainer = document.getElementById("big-preview-container");
        const snippetBlocks = document.querySelectorAll(".snippet-block");

        snippetBlocks.forEach(function(snippetBlock) {
            snippetBlock.addEventListener("click", function() {
                const snippetCodeContent = snippetBlock.querySelector(".snippet-code pre").innerHTML;
                const bigPreviewHeading = bigPreviewContainer.querySelector("pre");
                bigPreviewHeading.innerHTML = snippetCodeContent;
            });

            const snippetCode = snippetBlock.querySelector(".snippet-code");
            snippetCode.addEventListener("click", function(event) {
                event.stopPropagation();
                const snippetCodeContent = snippetCode.querySelector("pre").innerHTML;
                const bigPreviewHeading = bigPreviewContainer.querySelector("pre");
                bigPreviewHeading.innerHTML = snippetCodeContent;

                electronAPI.clipboardWriteText(snippetCodeContent);
            });

            const snippetName = snippetBlock.querySelector(".snippet-name");
            snippetName.addEventListener("click", function(event) {
                event.stopPropagation();
                const snippetCodeContent = snippetBlock.querySelector(".snippet-code pre").innerHTML;
                const bigPreviewHeading = bigPreviewContainer.querySelector("pre");
                bigPreviewHeading.innerHTML = snippetCodeContent;
            });

            snippetName.addEventListener("contextmenu", function(event) {
                event.preventDefault();
                showContextMenu(event);
            });
        });
    });

    populateGroupsContainer();
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
    const snippetBlock = event.target.closest('.snippet-block');

    if (snippetBlock) {
        const bigPreviewHeading = document.getElementById('big-preview-container').querySelector('p');
        const textToCopy = bigPreviewHeading.textContent || bigPreviewHeading.innerText;

        // Use the exposed API to copy to clipboard
        electronAPI.clipboardWriteText(textToCopy);
    }

    hideContextMenu();
}

function deleteOption(event) {
    const snippetBlock = event.target.closest('.snippet-block');

    if (snippetBlock) {
        const snippetName = snippetBlock.querySelector('.snippet-name p').textContent.trim();

        // Load the JSON file
        const jsonFilePath = path.join('snippetdata.json');
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        // Find the index of the snippet with the matching name
        const indexToDelete = jsonData.snippets.snip.findIndex(snippet => snippet.name === snippetName);

        // If found, delete the snippet
        if (indexToDelete !== -1) {
            jsonData.snippets.snip.splice(indexToDelete, 1);

            // Save the updated JSON back to the file
            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');

            console.log(`Snippet "${snippetName}" deleted from the JSON file.`);
        } else {
            console.warn(`Snippet "${snippetName}" not found in the JSON file.`);
        }
    }

    location.reload();

}

