class ToastNotification {

    // todo add animation for progress bar, so it doesn't feel so choppy
    constructor() {
        this.toastPopup = document.getElementById("custom-headless-toaster");
        this.failedCounterDisplay = document.getElementById("custom-failed-counter");
        this.progressBarDisplay = document.getElementById("custom-progress-bar");
        this.totalConversations = 0;
        this.progressCounter = 0;
        this.failedCounter = 0;
    }

    createToast(total) {
        this._resetCounters();
        this._displayElement();
        this.totalConversations = total;

        this.progressBarDisplay.style.width = "0%";
        this.progressBarDisplay.textContent = `0/${this.totalConversations}`;
    }

    clearToast() {
        this._hideElement();
    }

    refreshProgressDisplay() {
        this.progressBarDisplay.style.width = this._percentCalculation();
        this.progressBarDisplay.textContent = `${this.progressCounter}/${this.totalConversations}`;
    }

    updateProgressCounter() {
        this.progressCounter++;
        this.refreshProgressDisplay();
    }

    updateErrorCounter() {
        this.failedCounter++;
        this.failedCounterDisplay.textContent = `Failed: ${this.failedCounter}`;
    }

    _resetCounters() {
        this.totalConversations = 0;
        this.progressCounter = 0;
        this.failedCounter = 0;
    }

    _percentCalculation() {
        return `${((this.progressCounter / this.totalConversations) * 100).toFixed()}%`
    }

    _displayElement() {
        this.toastPopup.style.display = "initial";
    }
    
    _hideElement() {
        // todo add popup animations from the bottom right to bottom set position
        this.toastPopup.style.display = "none";
    }
}


