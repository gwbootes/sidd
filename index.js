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
        // Add a `url:` to any track that lives out on the net (a game page, itch,
        // Steam, YouTube, wherever). A row WITH a url plays the sample AND opens
        // that page in a new tab on click. A row without one just plays. Example:
        //   { character: "Memo", project: "Road X", year: "2022", src: DEMO, url: "https://the-games-page.com" },
        { character: "Butler Everly", project: "Once Upon An Earl",           year: "2022", src: DEMO, url: "https://oishii.itch.io/once-upon-an-earl" },
        { character: "Dameon",        project: "Twice Reborn",                year: "2022", src: DEMO, url: "https://firststepcinematics.itch.io/twice-reborn" },
        { character: "Memo",          project: "Road X: Magnetized | Ep. 9",  year: "2022", src: DEMO, url: "https://roadxpodcast.buzzsprout.com/2016089/episodes/11581837-road-x-9-magnetized" },
        { character: "Tsuru",         project: "Tales of a Paper Goddess",    year: "2021", src: DEMO, url: "https://filmfreeway.com/TalesofaPaperHairGoddess" },
        { character: "Friend #2",     project: "This Was For You",            year: "2019", src: DEMO, url: "https://store.steampowered.com/app/1067930/this_was_for_you/" },
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
        row.className = "track-row" + (t.url ? " has-link" : "");
        // linked rows get a small ↗ after the project name as a "this opens out" cue
        const linkMark = t.url ? ' <span class="tr-ext">↗</span>' : '';
        row.innerHTML =
            '<span class="tr-char">' + t.character + '</span>' +
            '<span class="tr-proj">' + t.project + linkMark + '</span>' +
            '<span class="tr-year">' + t.year + '</span>';
        row.addEventListener("click", () => {
            playTrack(i);
            // dual-action: a real click also opens the game page in a new tab.
            // Kept HERE (not in playTrack) so auto-advance never spawns tabs.
            if (t.url) window.open(t.url, "_blank", "noopener");
        });
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
