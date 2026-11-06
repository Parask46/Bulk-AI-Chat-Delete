async function bulkDeleteCopilotChats() {
    const config = {
        maxDeletions: 50,
        delay: 800, // Slightly higher delay to ensure dynamic menus render reliably
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Select all "More" options buttons for chat history items
    const menuButtons = Array.from(document.querySelectorAll('button[aria-label="More"][data-chat-history-more-button-conversation-id]'));

    console.log(`Found ${menuButtons.length} Copilot chats to process.`);

    if (menuButtons.length === 0) {
        console.error("Could not find any Copilot chat history menu buttons. Make sure the sidebar is open and visible.");
        return;
    }

    let deletedCount = 0;

    for (let i = 0; i < Math.min(menuButtons.length, config.maxDeletions); i++) {
        try {
            // 1. Open the "More options" menu for the chat item
            menuButtons[i].click();
            await sleep(config.delay);

            // 2. Locate the "Delete" option inside the newly opened dropdown menu
            // Looks for menu items containing the word "Delete" or matching popup options
            const menuOptions = Array.from(document.querySelectorAll('[role="menuitem"], button, div'));
            const deleteMenuOption = menuOptions.find(el => el.textContent.trim() === 'Delete' && el.offsetParent !== null);

            if (deleteMenuOption) {
                deleteMenuOption.click();
                await sleep(config.delay);

                // 3. Confirm deletion using Copilot's destructive button class
                const confirmBtn = document.querySelector('button.fx-DestructiveButton');
                
                if (confirmBtn) {
                    confirmBtn.click();
                    deletedCount++;
                    console.log(`Successfully deleted chat ${i + 1}`);
                } else {
                    console.warn(`Could not find final confirmation button for chat ${i + 1}`);
                }
            } else {
                console.warn(`Could not find "Delete" menu option for chat ${i + 1}`);
            }

            // Wait for UI modal animation to complete before moving to the next item
            await sleep(config.delay * 1.5);
        } catch (error) {
            console.error(`Error processing chat ${i + 1}:`, error);
        }
    }

    console.log(`Bulk delete operation complete. Total deleted: ${deletedCount}`);
}

// Run the script
bulkDeleteCopilotChats();
