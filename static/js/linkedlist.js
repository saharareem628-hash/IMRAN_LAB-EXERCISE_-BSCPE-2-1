(() => {
            const list = [];
            const input = document.getElementById("nodeValue");
            const nodesContainer = document.getElementById("nodesContainer");
            const nodeCount = document.getElementById("nodeCount");
            const listStatus = document.getElementById("listStatus");
            const message = document.getElementById("message");

            function showMessage(text) {
                message.textContent = text;
                message.classList.add("show");
            }

            function getValue() {
                return input.value.trim();
            }

            function requireValue() {
                const value = getValue();
                if (!value) {
                    showMessage("Please enter a value first.");
                    input.focus();
                    return null;
                }
                return value;
            }

            function renderList(highlightIndex = -1) {
                nodesContainer.replaceChildren();
                nodeCount.textContent = `${list.length} ${list.length === 1 ? "node" : "nodes"}`;
                listStatus.textContent = list.length ? "CONNECTED" : "EMPTY LIST";

                if (list.length === 0) {
                    const empty = document.createElement("div");
                    empty.className = "empty-state";

                    const icon = document.createElement("div");
                    icon.className = "empty-icon";
                    icon.textContent = "◇";

                    const strong = document.createElement("strong");
                    strong.textContent = "Your list is empty";

                    const hint = document.createElement("div");
                    hint.textContent = "Add a value to create your first node.";

                    empty.append(icon, strong, hint);
                    nodesContainer.appendChild(empty);
                    return;
                }

                list.forEach((value, index) => {
                    const node = document.createElement("div");
                    node.className = "node";

                    if (index === highlightIndex) {
                        node.style.borderColor = "#8eb5ff";
                        node.style.boxShadow = "0 0 24px #5b91ff30";
                    }

                    const top = document.createElement("div");
                    top.className = "node-top";

                    const label = document.createElement("span");
                    label.textContent = index === 0 ? "HEAD NODE" : `NODE ${index + 1}`;

                    const indexLabel = document.createElement("span");
                    indexLabel.textContent = `#${index + 1}`;
                    top.append(label, indexLabel);

                    const data = document.createElement("div");
                    data.className = "node-data";
                    data.textContent = value;

                    const bottom = document.createElement("div");
                    bottom.className = "node-bottom";

                    const dataLabel = document.createElement("span");
                    dataLabel.textContent = "DATA";

                    const nextLabel = document.createElement("span");
                    nextLabel.textContent = index === list.length - 1 ? "NEXT → NULL" : "NEXT →";

                    bottom.append(dataLabel, nextLabel);
                    node.append(top, data, bottom);
                    nodesContainer.appendChild(node);

                    const arrow = document.createElement("div");
                    arrow.className = "arrow";
                    arrow.innerHTML = "<span>↓</span><small>NEXT</small>";
                    nodesContainer.appendChild(arrow);
                });

                const nullNode = document.createElement("div");
                nullNode.className = "null-node";
                nullNode.textContent = "NULL · END OF LIST";
                nodesContainer.appendChild(nullNode);
            }

            document.getElementById("addHead").addEventListener("click", () => {
                const value = requireValue();
                if (value === null) return;

                list.unshift(value);
                input.value = "";
                renderList(0);
                showMessage(`"${value}" added at the beginning.`);
            });

            document.getElementById("addTail").addEventListener("click", () => {
                const value = requireValue();
                if (value === null) return;

                list.push(value);
                input.value = "";
                renderList(list.length - 1);
                showMessage(`"${value}" added at the end.`);
            });

            document.getElementById("deleteHead").addEventListener("click", () => {
                if (!list.length) {
                    showMessage("The list is already empty.");
                    return;
                }

                const removed = list.shift();
                renderList();
                showMessage(`Deleted head node "${removed}".`);
            });

            document.getElementById("deleteValue").addEventListener("click", () => {
                const value = requireValue();
                if (value === null) return;

                const index = list.findIndex(item =>
                    item.toLowerCase() === value.toLowerCase()
                );

                if (index === -1) {
                    showMessage(`"${value}" was not found in the list.`);
                    return;
                }

                const removed = list.splice(index, 1)[0];
                input.value = "";
                renderList();
                showMessage(`Deleted "${removed}" from the list.`);
            });

            document.getElementById("searchValue").addEventListener("click", () => {
                const value = requireValue();
                if (value === null) return;

                const index = list.findIndex(item =>
                    item.toLowerCase() === value.toLowerCase()
                );

                if (index === -1) {
                    renderList();
                    showMessage(`"${value}" was not found.`);
                } else {
                    renderList(index);
                    showMessage(`Found "${list[index]}" at node ${index + 1}.`);
                }
            });

            document.getElementById("clearList").addEventListener("click", () => {
                if (!list.length) {
                    showMessage("There are no nodes to clear.");
                    return;
                }

                list.length = 0;
                renderList();
                showMessage("List cleared successfully.");
            });

            input.addEventListener("keydown", event => {
                if (event.key === "Enter") {
                    document.getElementById("addTail").click();
                }
            });

            renderList();
        })();