document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');

    let currentFilter = 'all';
    let searchQuery = '';

    function filterGames() {
        gameCards.forEach(card => {
            const cardConsole = card.getAttribute('data-console');
            const cardName = card.getAttribute('data-name');

            const matchesFilter = (currentFilter === 'all' || cardConsole === currentFilter);
            const matchesSearch = cardName.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterGames();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-console');
            filterGames();
        });
    });

    document.querySelectorAll('.download-zip-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const btn = e.target;
            const sourceUrl = btn.getAttribute('data-source-url');
            const folderStructure = btn.getAttribute('data-folder-structure');
            const filename = btn.getAttribute('data-filename');
            const zipname = btn.getAttribute('data-zipname');

            btn.disabled = true;
            btn.innerText = "Processing server-side...";

            try {
                // Dynamically points to your Vercel serverless API route path
                const vercelProxy = "/api/proxy?url="; 
                
                const response = await fetch(vercelProxy + encodeURIComponent(sourceUrl));
                if (!response.ok) throw new Error("Vercel serverless engine failed to proxy file.");
                
                const fileBlob = await response.blob();
                btn.innerText = "Zipping file...";

                const zip = new JSZip();

                if (folderStructure && folderStructure.trim() !== "") {
                    zip.folder(folderStructure).file(filename, fileBlob);
                } else {
                    zip.file(filename, fileBlob);
                }

                const zippedContent = await zip.generateAsync({ type: "blob" });
                saveAs(zippedContent, zipname);

                btn.disabled = false;
                btn.innerText = "Download Configured ZIP";

            } catch (error) {
                console.error(error);
                alert("Download failed via Vercel serverless proxy routing.");
                btn.disabled = false;
                btn.innerText = "Download Configured ZIP";
            }
        });
    });
});
