/**
 * INFOTSAV 2K26 - Official Script
 * Organized by: IT Dept & CSITE, RIT Rajaramnagar
 */

// 1. PRICING LOGIC (Synced with Official Poster)
const pricingRules = {
    "AI PlayQuest": { fixed: 120 },
    "Code Dash": { single: 99, dual: 159 },
    "Hoodies to Blazer": { single: 99, dual: 159 },
    "Canva CreateX": { single: 59, dual: 99 },
    "Powerlifting": { fixed: 499 }, // CHANGE THIS from "Deadlift Powerlifting"
    "Chess": { fixed: 79 },
    "IPL Auction": { fixed: 99 }
};

// 2. PERFORMANCE OPTIMIZED TIMER
const targetDate = new Date("February 25, 2026 10:00:00").getTime();

function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    
    if (diff < 0) {
        document.getElementById("timer").innerHTML = "<h3>Event Live Now!</h3>";
        return;
    }

    document.getElementById("days").textContent = Math.floor(diff / 86400000).toString().padStart(2, '0');
    document.getElementById("hours").textContent = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById("mins").textContent = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById("secs").textContent = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
}
setInterval(updateTimer, 1000);

// 3. MODAL & NAVIGATION LOGIC
function openModal(eventName) {
    const modal = document.getElementById('regModal');
    modal.style.display = 'flex';
    
    if(eventName) {
        const dropdown = document.getElementById('eventDropdown');
        const options = Array.from(dropdown.options);
        // Match based on data-name attribute
        const targetOption = options.find(opt => opt.getAttribute('data-name') === eventName);
        if(targetOption) {
            dropdown.value = targetOption.value;
            handleEventChange();
        }
    }
}

function closeModal() {
    document.getElementById('regModal').style.display = 'none';
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// 4. DYNAMIC REGISTRATION FORM LOGIC
function handleEventChange() {
    const dropdown = document.getElementById('eventDropdown');
    const selected = dropdown.options[dropdown.selectedIndex];
    const type = selected.getAttribute('data-type');
    
    // Toggle Single/Dual UI if event supports both
    document.getElementById('participationToggle').style.display = (type === "both") ? "block" : "none";
    updatePrice();
}

function updatePrice() {
    const dropdown = document.getElementById('eventDropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const eventName = selectedOption.getAttribute('data-name');
    const pType = document.querySelector('input[name="pType"]:checked').value;
    const partnerInput = document.getElementById('partnerName');
    
    const rule = pricingRules[eventName];
    if (!rule) return;

    let price = rule.fixed || (pType === 'single' ? rule.single : rule.dual);

    // Toggle partner name input visibility
    if (!rule.fixed) {
        partnerInput.style.display = (pType === 'dual') ? "block" : "none";
    }

    document.getElementById('displayTotal').textContent = price;
}

// 5. REAL-TIME GOOGLE SHEET INTEGRATION
const scriptURL = 'https://script.google.com/macros/s/AKfycbwV3uNEnaXiSzzTjfsHUxAZracvldBqBrWwnbFXo_M8NDe_DT4AuT7swgFyv3pAB_oo/exec';
const form = document.getElementById('regForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerText = "Recording Response...";

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        alert("Success! You are registered for Infotsav 2K26. See you at IT DEPT on Feb 25-26!");
        submitBtn.disabled = false;
        submitBtn.innerText = "Confirm Registration";
        form.reset();
        closeModal();
    })
    .catch(error => {
        console.error('Submission Error!', error.message);
        alert("Something went wrong. Please check your internet or try again.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Confirm Registration";
    });
});

// 6. VISITOR COUNTER & NOTIFICATIONS
async function getVisitorCount() {
    const namespace = "rit-infotsav-2k26";
    const key = "homepage-visits";
    try {
        const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
        const data = await response.json();
        document.getElementById('visitor-count').innerText = data.value.toLocaleString();
    } catch (error) {
        document.getElementById('visitor-count').innerText = "1,250+"; 
    }
}

const names = [ "Gaurav", "Rutuja","Anjali", "Vikrant" , "Aditi", "Sneha", "Karan", "Pooja", "Rahul", "Neha", "Satyarth", "Ishika", "Yash", "Priya", "Aniket", "Shivani"];
const eventList = ["AI PlayQuest", "Code Dash", "IPL Auction", "Chess", "Canva CreateX", "Hoodies to Blazer"];

function showNotification() {
    const notif = document.getElementById('reg-notification');
    if (!notif) return;

    document.getElementById('reg-user-name').innerText = names[Math.floor(Math.random() * names.length)];
    document.getElementById('reg-event-name').innerText = eventList[Math.floor(Math.random() * eventList.length)];

    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 5000);

    const nextIn = Math.floor(Math.random() * (30000 - 15000) + 15000);
    setTimeout(showNotification, nextIn);
}

// Initializations
window.onload = () => {
    getVisitorCount();
    setTimeout(showNotification, 5000);
};

// Close modal on background click
window.onclick = (e) => {
    const modal = document.getElementById('regModal');
    if (e.target === modal) closeModal();
};
// Syncs the radio button choice to the hidden input for the Spreadsheet
function syncParticipationType(val) {
    document.getElementById('Participation_Type').value = val;
    updatePrice();
}

// Update your existing updatePrice to include this sync
function updatePrice() {
    const dropdown = document.getElementById('eventDropdown');
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const eventName = selectedOption.getAttribute('data-name');
    const pType = document.querySelector('input[name="pType"]:checked').value;
    
    // Sync hidden field for spreadsheet
    document.getElementById('Participation_Type').value = pType;

    const rule = pricingRules[eventName];
    if (!rule) return;

    let price = rule.fixed || (pType === 'single' ? rule.single : rule.dual);
    document.getElementById('displayTotal').textContent = price;
}
form.addEventListener('submit', e => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button');
    // Save original text to restore it later
    const originalText = submitBtn.innerHTML;
    
    // Disable button and add spinner
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Registering... <div class="spinner"></div>`;

    fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(form)
    })
    .then(response => {
        alert("Success! You are registered for Infotsav 2K26. See you on Feb 25-26!");
        
        // Restore button and reset form
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        closeModal();
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert("Something went wrong. Please check your internet connection.");
        
        // Restore button on error
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = "🏃 Don't miss Infotsav 2K26!";
    } else {
        document.title = "Infotsav 2K26 | RIT IT Department";
    }
});
function toggleWaMenu() {
    const menu = document.getElementById('waMenu');
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

// Close menu if clicked outside
window.addEventListener('click', function(e) {
    const helpDesk = document.getElementById('waHelpDesk');
    if (!helpDesk.contains(e.target)) {
        document.getElementById('waMenu').style.display = "none";
    }
});
