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

function createDeleteSnippetGroupForm() {
    hideSnipContextMenu();

    const deleteSnippetGroupForm = document.createElement("div");
    deleteSnippetGroupForm.id = "deleteSnippetGroupForm";
    deleteSnippetGroupForm.classList.add("context-menu-form");

    const select = document.createElement("select");
    select.id = "snippetGroupSelect";

    const filePath = path.join('snippetdata.json');
    let data = fs.readFileSync(filePath, 'utf-8');
    let jsonData = JSON.parse(data);

    if (jsonData.snippetgroups) {
        const groupsArray = jsonData.snippetgroups.split(",");
        groupsArray.forEach(group => {
            const option = document.createElement("option");
            option.value = group;
            option.textContent = group;
            select.appendChild(option);
        });
    }

    const button = document.createElement("button");
    button.textContent = "Delete";
    button.onclick = function() {
        const selectedGroup = select.value;
        if (selectedGroup) {
            deleteSnippetGroup(selectedGroup);
            deleteSnippetGroupForm.parentNode.removeChild(deleteSnippetGroupForm);
            location.reload();
        } else {
            alert("Please select a snippet group to delete.");
        }
    };

    deleteSnippetGroupForm.appendChild(select);
    deleteSnippetGroupForm.appendChild(button);

    document.getElementById("main-container").appendChild(deleteSnippetGroupForm);
}

function deleteSnippetGroup(groupName) {
    const filePath = path.join('snippetdata.json');
    let data = fs.readFileSync(filePath, 'utf-8');
    let jsonData = JSON.parse(data);

    if (jsonData.snippetgroups) {
        const groupsArray = jsonData.snippetgroups.split(",");
        const index = groupsArray.indexOf(groupName);
        if (index !== -1) {
            groupsArray.splice(index, 1);
            jsonData.snippetgroups = groupsArray.join(",");
        }
    }

    if (jsonData.snippets && jsonData.snippets.snip) {
        jsonData.snippets.snip = jsonData.snippets.snip.filter(snippet => snippet.group !== groupName);
    }

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
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

                const preElement = document.createElement("pre");
                preElement.textContent = snippet.code;
                snippetCode.appendChild(preElement);

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
                            <div onclick="editOption(event)">Edit</div>
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


function populateGroupsContainer(callback) {
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

        if (typeof callback === 'function') {
            callback();
        }
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

    populateGroupsContainer(function() {
        const sideGroupNames = document.querySelectorAll('.side-group-name');

        sideGroupNames.forEach(group => {
            group.addEventListener('click', function() {
                const isAlreadyActive = group.classList.contains('active-group');

                if (isAlreadyActive) {
                    sideGroupNames.forEach(otherGroup => {
                        otherGroup.classList.remove('active-group');
                    });

                    const snippetBlocks = document.querySelectorAll('.snippet-block');
                    snippetBlocks.forEach(block => {
                        block.classList.remove('invisible');
                        block.classList.remove('order-1');
                    });
                } else {
                    sideGroupNames.forEach(otherGroup => {
                        otherGroup.classList.remove('active-group');
                    });

                    group.classList.add('active-group');

                    const snippetBlocks = document.querySelectorAll('.snippet-block');
                    snippetBlocks.forEach(block => {
                        block.classList.remove('invisible');
                        block.classList.remove('order-1');
                    });

                    const clickedGroup = group.textContent.trim();

                    snippetBlocks.forEach(block => {
                        const snippetGroup = block.querySelector('.snippet-group').textContent.trim();
                        if (snippetGroup !== clickedGroup) {
                            block.classList.add('invisible');
                            block.classList.add('order-1');
                        }
                    });
                }
            });
        });

    }


    );
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


function editOption(event) {
    const snippetBlock = event.target.closest('.snippet-block');
    const snippetCode = snippetBlock.querySelector('.snippet-code pre');
    const snippetName = snippetBlock.querySelector('.snippet-name p');

    const originalName = snippetName.innerText.trim();
    const originalClasses = snippetName.className;

    const codeTextarea = document.createElement('textarea');
    codeTextarea.value = snippetCode.innerText.trim();
    snippetCode.replaceWith(codeTextarea);

    const nameInput = document.createElement('input');
    nameInput.value = originalName;
    snippetName.replaceWith(nameInput);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';

    saveButton.onclick = function() {
        handleSaveButtonClick(saveButton, codeTextarea, nameInput, snippetBlock, originalName, originalClasses);
    };

    snippetBlock.querySelector('.snippet-name').appendChild(saveButton);

    hideContextMenu();
}

function handleSaveButtonClick(saveButton, codeTextarea, nameInput, snippetBlock, originalName, originalClasses) {
    const editedCode = codeTextarea.value;
    const editedName = nameInput.value;

    const jsonFilePath = path.join('snippetdata.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    const snippetIndex = jsonData.snippets.snip.findIndex(snippet => snippet.name === originalName);

    if (snippetIndex !== -1) {
        if (originalName !== editedName) {
            jsonData.snippets.snip[snippetIndex].code = editedCode;
            jsonData.snippets.snip[snippetIndex].name = editedName;
        } else {
            jsonData.snippets.snip[snippetIndex].code = editedCode;
        }

        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');

        codeTextarea.replaceWith(document.createElement('pre'));
        snippetBlock.querySelector('.snippet-code pre').innerText = editedCode;

        nameInput.replaceWith(document.createElement('p'));
        const newSnippetName = snippetBlock.querySelector('.snippet-name p');
        newSnippetName.innerText = editedName;

        newSnippetName.className = originalClasses;

        saveButton.remove();
    } else {
        console.error('Snippet not found in JSON data');
    }
}



function copyOption(event) {
    const snippetBlock = event.target.closest('.snippet-block');

    if (snippetBlock) {
        const bigPreviewHeading = document.getElementById('big-preview-container').querySelector('pre');
        const textToCopy = bigPreviewHeading.textContent || bigPreviewHeading.innerText;

        electronAPI.clipboardWriteText(textToCopy);
    }

    hideContextMenu();
}

function deleteOption(event) {
    const snippetBlock = event.target.closest('.snippet-block');

    if (snippetBlock) {
        const snippetName = snippetBlock.querySelector('.snippet-name p').textContent.trim();

        const jsonFilePath = path.join('snippetdata.json');
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        const indexToDelete = jsonData.snippets.snip.findIndex(snippet => snippet.name === snippetName);

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


function toggleBigPreviewHeight() {
    const bigPreviewContainer = document.getElementById('big-preview-container');
    const expandButton = document.getElementById('expandButton');

    bigPreviewContainer.classList.toggle('expanded');

    const isExpanded = bigPreviewContainer.classList.contains('expanded');

    if (isExpanded) {
        expandButton.querySelector('svg').innerHTML = `
                <g transform="translate(0.000000,134.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                <path d="M866 1318 c-13 -19 -16 -57 -16 -218 0 -161 3 -199 16 -218 15 -22
                19 -22 229 -22 l215 0 16 25 c15 23 15 27 0 50 -16 25 -18 25 -159 25 l-142 0
                153 153 c155 155 173 182 140 215 -28 28 -55 10 -210 -145 l-158 -158 0 146
                c0 99 -4 149 -12 157 -19 19 -55 14 -72 -10z"/>
                <path d="M10 466 c-18 -22 -8 -59 20 -73 16 -8 70 -13 150 -13 l125 0 -153
                -153 c-103 -103 -152 -159 -152 -174 0 -21 33 -53 54 -53 5 0 81 71 168 157
                l158 157 0 -142 c0 -140 0 -142 25 -158 23 -15 27 -15 50 0 l25 16 0 206 c0
                122 -4 213 -10 225 -10 18 -23 19 -229 19 -178 0 -221 -3 -231 -14z"/>
                </g>`;
    } else {
        expandButton.querySelector('svg').innerHTML = `
             <g transform="translate(0.000000,134.000000) scale(0.100000,-0.100000)" fill="#000000"
                            stroke="none">
                            <path d="M866 1318 c-20 -29 -20 -34 4 -58 18 -18 33 -20 157 -20 l137 0 -157
-158 c-86 -87 -157 -164 -157 -170 0 -18 38 -52 57 -52 9 0 85 68 170 152
l153 152 0 -131 c0 -113 3 -134 19 -154 16 -20 23 -22 47 -14 l29 10 3 219 c2
153 -1 223 -9 232 -9 11 -56 14 -225 14 -209 0 -213 0 -228 -22z" />
                            <path d="M22 474 c-22 -15 -22 -19 -22 -228 0 -151 3 -215 12 -224 9 -9 74
-12 230 -12 208 0 218 1 228 20 15 28 3 59 -27 71 -13 5 -79 9 -146 9 l-121 0
152 153 c84 85 152 161 152 170 0 19 -34 57 -52 57 -6 0 -83 -71 -170 -157
l-158 -157 0 137 c0 124 -2 139 -20 157 -24 24 -29 24 -58 4z" />
                        </g>`;
    }
}


