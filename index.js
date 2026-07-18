/* ---- placeholder catalogue (swap for Sidd's real VO credits) ---- */
const DEMO   = "Assets/SiddVillanueva_2026_CharacterDemo_English.mp3";
const STUDIO = "Assets/Siddhartha%20Villanueva%20-%20Studio%20Space%20Sample.mp3";

/* playlist grouped into labelled chunks */
const groups = [
    { label: "Demo / Studio", tracks: [
        { character: "Character Demo",      project: "2026 Reel (English)", year: "2026", src: DEMO },
        { character: "Studio Space Sample", project: "Booth Sample",        year: "2026", src: STUDIO },
    ]},
    { label: "Roles", tracks: [
        { character: "Butler Everly", project: "Once Upon An Earl",           year: "2022", src: DEMO },
        { character: "Dameon",        project: "Twice Reborn",                year: "2022", src: DEMO },
        { character: "Memo",          project: "Road X: Magnetized | Ep. 9",  year: "2022", src: DEMO },
        { character: "Tsuru",         project: "Tales of a Paper Goddess",    year: "2021", src: DEMO },
        { character: "Friend #2",     project: "This Was For You",            year: "2019", src: DEMO },
    ]},
];

/* flat view for playback + auto-advance (same order as rendered) */
const tracks = groups.flatMap((g) => g.tracks);

const player  = document.querySelector("#player");
const listing = document.querySelector(".listing-rows");
const playBtn = document.querySelector(".play");
const fill    = document.querySelector(".progress-fill");
const track   = document.querySelector(".progress-track");
const titleEl = document.querySelector(".track-title");

let currentIndex = -1;

/* start every visitor at a sane 25% instead of blasting them at 100% */
player.volume = 0.25;

/* build the playlist: a category label per chunk, then its rows */
let flatIndex = 0;
groups.forEach((g) => {
    const label = document.createElement("div");
    label.className = "group-label";
    label.textContent = g.label;
    listing.appendChild(label);

    g.tracks.forEach((t) => {
        const i = flatIndex++;
        const row = document.createElement("div");
        row.className = "track-row";
        row.innerHTML =
            '<span class="tr-char">' + t.character + '</span>' +
            '<span class="tr-proj">' + t.project + '</span>' +
            '<span class="tr-year">' + t.year + '</span>';
        row.addEventListener("click", () => playTrack(i));
        listing.appendChild(row);
    });
});

function playTrack(i) {
    currentIndex = i;
    const t = tracks[i];
    player.src = t.src;
    player.play();
    titleEl.textContent = t.character + " — " + t.project;
    titleEl.style.color = "#fff";

    document.querySelectorAll(".track-row").forEach((row, idx) => {
        row.classList.toggle("selected", idx === i);
    });
}

/* play / pause button */
playBtn.style.pointerEvents = "auto";
playBtn.addEventListener("click", () => {
    if (currentIndex === -1) { playTrack(0); return; }
    if (player.paused) player.play();
    else player.pause();
});

player.onplay  = () => playBtn.classList.add("is-playing");
player.onpause = () => playBtn.classList.remove("is-playing");

/* progress bar */
player.ontimeupdate = () => {
    if (!player.duration) return;
    const f = player.currentTime / player.duration;
    fill.style.width = (f * 100) + "%";
};

/* click-to-seek */
track.addEventListener("click", (e) => {
    const rect = track.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    if (player.duration) player.currentTime = fraction * player.duration;
});

/* auto-advance to the next track */
player.onended = () => playTrack((currentIndex + 1) % tracks.length);
