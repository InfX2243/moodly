const moodButton = document.querySelectorAll(".mood");
const saveBtn = document.getElementById("saveBtn");
const historyList = document.getElementById("history");
const noteInput = document.getElementById("note");

const STORAGE_KEY = "moods";
let selectedMood = "";

// Select mood
moodButton.forEach(btn => {
    btn.addEventListener("click", ()=>{
        // Remove 'selected' class from all buttons
        moodButton.forEach(b=>b.classList.remove("selected"));

        // Add 'selected' class to clicked button
        btn.classList.add("selected");
        selectedMood = btn.textContent;
    });
});


// Save mood
saveBtn.addEventListener("click", ()=>{
    if(!selectedMood){
        alert("Please select a mood first!");
        return;
    }

    const today = new Date().toLocaleDateString();
    const note = noteInput.value.trim();

    const moods = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Check if today already exists
    const existingIndex = moods.findIndex(entry => entry.date === today);

    if(existingIndex >= 0){
        // Update existing mood
        moods[existingIndex].mood = selectedMood;
        moods[existingIndex].note = note;
    }
    else{
        // Add new mood entry
        moods.push({
            date: today,
            mood: selectedMood,
            note: note
        });
    }
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));

    // Reset selection & note input
    selectedMood = "";
    noteInput.value = "";
    moodButton.forEach(b => b.classList.remove("selected"));

    renderHistory();
});

// Render mood history
function renderHistory(){
    const moods = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    historyList.innerHTML = "";
    
    moods.forEach(entry =>{
        const li = document.createElement("li");
        li.innerHTML = `<strong>${entry.date} - ${entry.mood}</strong> ${entry.note ? `: ${entry.note}`:''}`;
        historyList.appendChild(li);
    });
}

// Load on start
renderHistory();