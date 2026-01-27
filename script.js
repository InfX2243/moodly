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

function getTodayDate(){
    return new Date().toISOString().split("T")[0];
}

function parseDate(dateString){
    return new Date(dateString + "T00:00:00");
}

// Select mood
moodButton.forEach(btn => {
    btn.addEventListener("click", ()=>{
        // Remove 'selected' class from all buttons
        moodButton.forEach(b=>b.classList.remove("selected"));

        // Add 'selected' class to clicked button
        btn.classList.add("selected");
        selectedMood = btn.textContent;

        // trigger bounce animation
        btn.classList.remove("bounce"); // reset if already bouncing
        void btn.offsetWidth; //force reflow (force browser to restart animation)
        btn.classList.add("bounce");

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

    const today = getTodayDate();
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
    const emptyState = document.getElementById("emptyState");
    const moods = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    historyList.innerHTML = "";

    if(moods.length === 0){
        emptyState.style.display = "block";
    }
    else{
        emptyState.style.display = "none";
    }
    
    moods.forEach(entry =>{
        const li = document.createElement("li");
        li.classList.add("history-item");
        li.style.animationDelay = `${entry * 40}ms`
        li.innerHTML = `<strong>${entry.date} - ${entry.mood}</strong> ${entry.note ? `: ${entry.note}`:''}`;
        historyList.appendChild(li);
    });

    // Update mood based theme
    const today = getTodayDate();
    const todayEntry = moods.find(entry=>entry.date === today);
    if(todayEntry){
        applyMoodTheme(todayEntry.mood);
    }

    // Update streak
    const streakCount = calculateStreak(moods);
    document.getElementById("streak").textContent = `🔥 Streak: ${streakCount} day${streakCount !== 1 ? "s" : ""}`;

    // Update stats
    const mostMood = calculateMostFrequentMood(moods);
    document.getElementById("mostMood").textContent = `${mostMood || "-"}`;
    document.getElementById("totalEntries").textContent = `${moods.length}`;
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

function calculateStreak(moods){
    if(moods.length === 0) return 0;

    // Extract & Sort by date descending
    const dates = moods
        .map(entry => parseDate(entry.date))
        .sort((a, b) => b - a);

    let streak = 1;

    for(let i = 0; i < dates.length - 1; i++){
        const diffInDays = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);

        if(diffInDays === 1){
            streak++;
        }
        else{
            break;
        }
    }
    return streak;
}

function calculateMostFrequentMood(moods){
    if(moods.length === 0) return null;

    const counts = {};

    moods.forEach(entry =>{
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });

    let mostMood = null;
    let maxCount = 0;

    for(const mood in counts){
        if(counts[mood] > maxCount){
            mostMood = mood;
            maxCount = counts[mood];
        }
    }

    return mostMood;
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