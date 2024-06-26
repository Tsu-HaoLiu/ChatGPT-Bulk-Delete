const internalHTML = `<div style="opacity: 1; height: auto; overflow: hidden;top: 3.75rem;" 
class="sticky z-20 text-sm flex flex-wrap justify-between w-full bottom-2 items-start left-0 right-0 bg-token-sidebar-surface-primary">
    <div id="custom-toggle-checkbox" style="" 
        class="custom-input-btn group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-tertiary w-1/2 border">
        <div class="flex items-center gap-2 p-2">
            <div style="font-size: 0.725rem;" class="relative grow overflow-hidden whitespace-nowrap text-center">
                Toggle Checkbox
            </div>
        </div>
    </div>
    <div id="custom-bulk-remove" style=""
        class="custom-input-btn group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-tertiary w-1/2 border">
        <div class="flex items-center gap-2 p-2">
            <div class="relative grow overflow-hidden whitespace-nowrap text-center">
                Bulk Remove
            </div>
        </div>
    </div>
    <div id="custom-confirm" style="display: none;"
        class="custom-confirmation-btn group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-tertiary w-1/2 border border-green-500">
        <div class="flex items-center gap-2 p-2">
            <div class="relative grow overflow-hidden whitespace-nowrap text-center">
                ✔
            </div>
        </div>
    </div>
    <div id="custom-deny" style="display: none;"
        class="custom-confirmation-btn group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-tertiary w-1/2 border border-red-600">
        <div class="flex items-center gap-2 p-2">
            <div class="relative grow overflow-hidden whitespace-nowrap text-center">
                ❌
            </div>
        </div>
    </div>
    <div id="custom-select-all" style="display: none;"
        class="custom-input-btn group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-tertiary w-1/2 mt-1 border">
        <div class="flex items-center gap-2 p-2">
            <div class="relative grow overflow-hidden whitespace-nowrap text-center">
                Select All
            </div>
        </div>
    </div>
    <div id="custom-deselect-all" style="display: none;"
        class="custom-input-btn group relative rounded-lg active:opacity-90 hover:bg-token-sidebar-surface-tertiary w-1/2 mt-1 border">
        <div class="flex items-center gap-2 p-2">
            <div class="relative grow overflow-hidden whitespace-nowrap text-center">
                Deselect All
            </div>
        </div>
    </div>
</div>
<div id="custom-headless-toaster" style=""
    class="group fixed right-3 z-10 hidden gap-1 lg:flex">
    <div style="min-width: 500px;"
        class="popover absolute bottom-full right-0 z-20 mb-2 w-full overflow-hidden rounded-md border border-token-border-light bg-token-main-surface-primary p-1.5 shadow-lg outline-none opacity-100 translate-y-0"
        >
        <a class="flex px-3 min-h-[44px] py-1 items-center gap-3 transition-colors duration-200 cursor-pointer text-sm rounded-md hover:bg-token-main-surface-tertiary">
            <!-- https://codepen.io/Rplus/pen/PWZYRM -->
            <div class="box">
                <div class="cat">
                    <div class="cat__body"></div>
                    <div class="cat__body"></div>
                    <div class="cat__tail"></div>
                    <div class="cat__head"></div>
                </div>
            </div>
            <!----------------------------------------->
            <div class="w-full">
                <div class="mb-2 flex justify-between items-center">
                    <h3 class="text-sm font-semibold text-gray-800 dark:text-white">Bulk Deleting...</h3>
                    <span id="custom-failed-counter" class="text-sm text-gray-800 dark:text-white">Failed: 0</span>
                </div>
                <div class="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700"
                    role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                    <div id="custom-progress-bar" style=""
                        class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-70 fbc-blue-70 text-xs text-white text-center whitespace-nowrap dark:bg-blue-500">
                        0/0</div>
                </div>
            </div>
        </a>
    </div>
</div>`;

let checkboxActive = true;
let toaster;


function toggleDisplay(elements) {
    let elementList = [].concat(elements);
    for(const e of elementList) {
        e.style.display = e.style.display == "none" ? "initial" : "none";
    }
}

function iterateCheckboxes(checkboxAction) {
    const conversationCheckboxes = document.getElementsByClassName("custom-checkbox");
    if (conversationCheckboxes.length === 0) return;

    for (const convoCheckbox of conversationCheckboxes) {
        convoCheckbox.checked = checkboxAction;
    }
}

function injectElements() {
    document.querySelector('[aria-label="Chat history"]')
        .firstElementChild.nextElementSibling.firstElementChild
        .insertAdjacentHTML("afterend", internalHTML);
}

function attachActionListeners() {
    const toggleCheckboxBtn = document.getElementById("custom-toggle-checkbox");
    const bulkRemove = document.getElementById("custom-bulk-remove");
    const selectAll = document.getElementById("custom-select-all");
    const deselectAll = document.getElementById("custom-deselect-all");
    const confirmModal = document.getElementById("custom-confirm");
    const denyModal = document.getElementById("custom-deny");

    function hideConfirmationModal() {
        toggleDisplay([confirmModal, denyModal, bulkRemove]);
    }

    // onClick Bulk btn, display confirmation modal
    bulkRemove.addEventListener("click", () => {
        toggleDisplay([bulkRemove, confirmModal, denyModal]);
    });

    confirmModal.addEventListener("click", () => {
        hideConfirmationModal();
        deleteConversations();
    });

    // On deny confirmation, do nothing
    denyModal.addEventListener("click", hideConfirmationModal);

    toggleCheckboxBtn.addEventListener("click", toggleCheckboxes);

    selectAll.addEventListener("click", iterateCheckboxes.bind(null, true));
    deselectAll.addEventListener("click", iterateCheckboxes.bind(null, false));
}


let lastChecked = null;

function checkboxShiftSelect(e) {
    if (!lastChecked) {
        lastChecked = e.target;
        return;
    }

    if (e.shiftKey) {
        const checkboxCollections = document.getElementsByClassName("custom-checkbox");
        const checkboxArray = Array.from(checkboxCollections);
        const from = checkboxArray.indexOf(e.target);
        const to = checkboxArray.indexOf(lastChecked);

        const start = Math.min(from, to);
        const end = Math.max(from, to) + 1;

        for (let i = start; i < end; i++) {
            // Outside the start and end window continue
            if (i < start && i > end) continue;

            checkboxCollections[i].checked = lastChecked.checked;
        }
    }

    lastChecked = e.target;
}

function toggleCheckboxes() {
    const conversations = document.querySelectorAll("li.relative");
    const selectAll = document.getElementById("custom-select-all");
    const deselectAll = document.getElementById("custom-deselect-all");
    toggleDisplay([selectAll, deselectAll]);

    for (const conversation of conversations) {
        const targetCheckbox = conversation.getElementsByClassName("custom-checkbox");

        // Toggle OFF
        if (targetCheckbox.length != 0) {
            // May run into some issues of duplicate checkboxes not being cleared
            targetCheckbox[0].remove();
            continue;
        }

        if (!checkboxActive) continue;

        // Toggle ON
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "custom-checkbox";
        checkbox.addEventListener("click", checkboxShiftSelect);

        conversation.firstElementChild.style.alignItems = "center";
        conversation.firstElementChild.style.display = "flex";
        conversation.firstElementChild.insertAdjacentElement("afterbegin", checkbox);
    }

    checkboxActive = !checkboxActive;
    return;
}


(() => {
    const checkInterval = setInterval(async () => {
        try {
            if (document.querySelector('[aria-label="Chat history"]').firstElementChild.nextElementSibling.firstElementChild) {
                apiGetAccessToken();
                injectElements();
                attachActionListeners();
                toaster = new ToastNotification();
                clearInterval(checkInterval);
            }
        } catch (error) {
            console.log(`[${new Date().toLocaleTimeString()}]`, error);
            clearInterval(checkInterval);
        }
    }, 1000);
})();