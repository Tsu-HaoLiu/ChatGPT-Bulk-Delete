class ToastNotification {
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
        this._resetCounters();
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
        if (this.progressCounter <= 0) return "0%";
        return `${((this.progressCounter / this.totalConversations) * 100).toFixed()}%`
    }

    _displayElement() {
        this.toastPopup.style.opacity = 1;
        this.toastPopup.style.bottom = "6rem";
    }
    
    _hideElement() {
        this.toastPopup.style.opacity = 0;
        this.toastPopup.style.bottom = "-10rem";
    }
}
