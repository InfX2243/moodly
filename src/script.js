const moodButton = document.querySelectorAll(".mood");
const saveBtn = document.getElementById("saveBtn");
const historyList = document.getElementById("history");
const noteInput = document.getElementById("note");
const loadMoreBtn = document.getElementById("loadMoreBtn");

const STORAGE_KEY = "moods";
let selectedMood = "";

let moodChart = null;

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

const HISTORY_PAGE_SIZE = 3;
let visibleHistoryCount = HISTORY_PAGE_SIZE;

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

// Increases textarea height based on amount of text
noteInput.addEventListener("input", () =>{
    autoResizeTextarea(noteInput);
})

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

    renderMoodTrends();

    const hero = document.querySelector(".mood-hero");
    hero.classList.add("accepted");
    setTimeout(() => {
        hero.classList.remove("accepted");
    }, 600);

    saveBtn.classList.add("saved");
    saveBtn.textContent = "Saved";
    saveBtn.disabled = true;

    setTimeout(() => {
        saveBtn.classList.remove("saved");
        saveBtn.textContent = "Save Mood";
        saveBtn.disabled = false;
    }, 1000);

    const activeMood = document.querySelector(".mood.selected");
    if(activeMood){
        activeMood.classList.add("recognized");
        setTimeout(() => {
            activeMood.classList.remove("recognized");
        }, 500);
    }

    // Reset selection & note input
    selectedMood = "";
    noteInput.value = "";
    noteInput.style.height = "44px";
    moodButton.forEach(b => b.classList.remove("selected"));

    renderHistory();
});

themeToggleBtn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

    renderMoodTrends();

    themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
})

loadMoreBtn.addEventListener("click", () => {
    visibleHistoryCount += HISTORY_PAGE_SIZE;
    renderHistory();
})

// Auto resize function
function autoResizeTextarea(el){
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function getChartTheme(){
    const isDark = document.body.classList.contains("dark");

    return{
        textColor: isDark ? "#e5e7eb" : "#374151",
        gridColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        tooltipBg: isDark ? "#020617" : "#ffffff"
    }
}

function renderMoodTrends(){
    const moods = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const theme = getChartTheme();

    // Collect the moods and dates for chart data
    const moodCounts = {
        "😄": 0,
        "🙂": 0,
        "😐": 0,
        "😢": 0,
        "😡": 0
    };

    moods.forEach(entry =>{
        moodCounts[entry.mood]++;
    });

    // Create chart data
    const labels = ["Happy 😄", "Okay 🙂", "Meh 😐", "Sad 😢", "Angry 😡"];
    const data = {
        labels: labels,
        datasets: [{
            label: 'Mood Count',
            data: [moodCounts["😄"], moodCounts["🙂"], moodCounts["😐"], moodCounts["😢"], moodCounts["😡"]],
            backgroundColor: [
                'rgba(34, 197, 94, 0.6)', // Happy (green)
                'rgba(59, 130, 246, 0.6)', // Okay (blue)
                'rgba(107, 114, 128, 0.6)', // Meh (gray)
                'rgba(56, 189, 248, 0.6)', // Sad (light blue)
                'rgba(239, 68, 68, 0.6)'  // Angry (red)
            ],
            borderColor: [
                'rgba(34, 197, 94, 1)', // Happy
                'rgba(59, 130, 246, 1)', // Okay
                'rgba(107, 114, 128, 1)', // Meh
                'rgba(56, 189, 248, 1)', // Sad
                'rgba(239, 68, 68, 1)'   // Angry
            ],
            borderWidth: 1
        }]
    };

    const ctx = document.getElementById('moodTrendChart').getContext('2d');

    if(moodChart){
        moodChart.data = data;

        moodChart.options.scales.x.ticks.color = theme.textColor;
        moodChart.options.scales.y.ticks.color = theme.textColor;

        moodChart.options.scales.x.grid.color = theme.gridColor;
        moodChart.options.scales.y.grid.color = theme.gridColor;

        moodChart.options.plugins.tooltip.backgroundColor = theme.tooltipBg;
        moodChart.options.plugins.tooltip.titleColor = theme.textColor;
        moodChart.options.plugins.tooltip.bodyColor = theme.textColor;

        moodChart.update();
    }
    else{
        moodChart = new Chart(ctx, {
            type: "bar",
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {display: false},
                    tooltip: {
                        backgroundColor: theme.tooltipBg,
                        titleColor: theme.textColor,
                        bodyColor: theme.textColor,
                        borderColor: theme.gridColor,
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        ticks: {color: theme.textColor},
                        grid: {color: theme.gridColor}
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {color: theme.textColor},
                        grid: {color: theme.gridColor}
                    }
                }
            }
        });
    }
}

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

    const sortedMoods = [...moods].sort(
        (a,b) => parseDate(b.date) - parseDate(a.date)
    );
    const visibleMoods = sortedMoods.slice(0, visibleHistoryCount);

    visibleMoods.forEach((entry, index) => {
        const li = document.createElement("li");
        li.classList.add("history-item");
        li.style.animationDelay = `${index * 40}ms`;
        li.innerHTML = `
                        <strong>${entry.date} ${entry.mood}</strong>
                        ${entry.note ? `<p>${entry.note}</p>`:""}
        `;
        historyList.appendChild(li);
    })

    if(visibleHistoryCount < moods.length){
        loadMoreBtn.style.display = "block";
    }
    else{
        loadMoreBtn.style.display = "none";
    }

    // Update mood based theme
    const today = getTodayDate();
    const todayEntry = moods.find(entry=>entry.date === today);
    if(todayEntry){
        applyMoodTheme(todayEntry.mood);
    }

    // Update streak
    const streakCount = calculateStreak(moods);
    document.getElementById("streak").textContent = `🔥 Streak: ${streakCount} day${streakCount !== 1 ? "s" : ""}`;

    animateStreak();

    // Update stats
    const mostMood = calculateMostFrequentMood(moods);
    document.getElementById("mostMood").textContent = `${mostMood || "-"}`;
    document.getElementById("totalEntries").textContent = `${moods.length}`;

    // Call animateStat
    animateStat("mostMood");
    animateStat("totalEntries");

    // Restore today's mood selection
    if(todayEntry){
        moodButton.forEach(btn => {
            if(btn.textContent === todayEntry.mood){
                btn.classList.add("selected", "bounce");
                selectedMood = todayEntry.mood;
            }
            else{
                btn.classList.remove("selected");
            }
        });
        noteInput.value = todayEntry.note || "";
    }
}

function animateStreak(){
    const streakEl = document.getElementById("streak");
    streakEl.classList.remove("animate");
    void streakEl.offsetWidth;
    streakEl.classList.add("animate");
}

function animateStat(id){
    const el = document.getElementById(id);
    el.classList.remove("animate");
    void el.offsetWidth;
    el.classList.add("animate");
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
renderMoodTrends();