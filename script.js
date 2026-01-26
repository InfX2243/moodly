const moodButton = document.querySelectorAll(".mood");
const saveBtn = document.getElementById("saveBtn");
const historyList = document.getElementById("history");

let selectedMood = "";

// Select mood
moodButton.forEach(btn => {
    btn.addEventListener("click", ()=>{
        moodButton.forEach(b=>b.classList.remove("selected"));
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
    const moodEntry = {
        date: new Date().toLocaleDateString(),
        mood: selectedMood
    };

    const moods = JSON.parse(localStorage.getItem("moods")) || [];
    moods.push(moodEntry);
    localStorage.setItem("moods", JSON.stringify(moods));

    selectedMood = "";
    moodButton.forEach(b=>b.classList.remove("selected"));
    renderHistory();
});

function renderHistory(){
    const moods = JSON.parse(localStorage.getItem("moods")) || [];
    historyList.innerHTML = "";
    
    moods.forEach(entry =>{
        const li = document.createElement("li");
        li.textContent = `${entry.date}-${entry.mood}`;
        historyList.appendChild(li);
    });
}

// Load on start
renderHistory();