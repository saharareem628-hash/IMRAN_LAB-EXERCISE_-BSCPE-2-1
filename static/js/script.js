function confirmDelete() {
    return confirm("Are you sure you want to delete this item?");
}

function highlightSearch() {
    const value = document.getElementById("value").value.trim();

    if (value === "") {
        alert("Please enter a value to search.");
        return false;
    }

    alert("Searching for: " + value);
    return true;
}
