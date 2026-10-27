const textInput = document.getElementById("text");
        const charCount = document.getElementById("charCount");
        const copyBtn = document.getElementById("copyBtn");
        const resultText = document.getElementById("resultText");

        function updateCount() {
            const count = textInput.value.length;
            charCount.textContent = `${count} character${count === 1 ? "" : "s"}`;
        }

        textInput.addEventListener("input", updateCount);
        updateCount();

        if (copyBtn && resultText && !copyBtn.disabled) {
            copyBtn.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(resultText.innerText);
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy result';
                    }, 1500);
                } catch (error) {
                    copyBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Copy unavailable';
                }
            });
        }