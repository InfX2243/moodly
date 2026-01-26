const moodButton = document.querySelectorAll(".mood");
const saveBtn = document.getElementById("saveBtn");
const historyList = document.getElementById("history");
const noteInput = document.getElementById("note");

const STORAGE_KEY = "moods";
let selectedMood = "";

// Map mood emoji to body class
const MOOD_THEME_MAP = {
    "😄": "happy",
    "🙂": "okay",
    "😐": "meh",
    "😢": "sad",
    "😡": "angry"
}

const themeToggleBtn = document.getElementById("themeToggle");
const THEME_KEY = "theme";

// Select mood
moodButton.forEach(btn => {
    btn.addEventListener("click", ()=>{
        // Remove 'selected' class from all buttons
        moodButton.forEach(b=>b.classList.remove("selected"));

        // Add 'selected' class to clicked button
        btn.classList.add("selected");
        selectedMood = btn.textContent;

        // Apply mood theme
        applyMoodTheme(selectedMood);
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

themeToggleBtn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

    themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
})

// Render mood history
function renderHistory(){
    const moods = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    historyList.innerHTML = "";
    
    moods.forEach(entry =>{
        const li = document.createElement("li");
        li.innerHTML = `<strong>${entry.date} - ${entry.mood}</strong> ${entry.note ? `: ${entry.note}`:''}`;
        historyList.appendChild(li);
    });

    const today = new Date().toLocaleDateString();
    const todayEntry = moods.find(entry=>entry.date === today);
    if(todayEntry){
        applyMoodTheme(todayEntry.mood);
    }
}

function applyMoodTheme(mood){
    // Remove existing mood classes
    document.body.classList.remove(
        "happy","okay","meh","sad","angry"
    );

    const themeClass = MOOD_THEME_MAP[mood];
    if(themeClass){
        document.body.classList.add(themeClass);
    }
}

function loadThemePreference(){
    const savedTheme = localStorage.getItem(THEME_KEY);
    if(savedTheme === "dark"){
        document.body.classList.add("dark");
        themeToggleBtn.textContent = "☀️ Light Mode";
    }
}

// Load on start
renderHistory();
loadThemePreference();