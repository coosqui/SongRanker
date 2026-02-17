console.log("JavaScript is running");

const songs = [
  { name: "City Walls", rating: 1000 },
  { name: "RAWFEAR", rating: 1000 },
  { name: "Drum Show", rating: 1000 },
  { name: "Garbage", rating: 1000 },
  { name: "The Contract", rating: 1000 },
  { name: "Downstairs", rating: 1000 },
  { name: "Robot Voices", rating: 1000 },
  { name: "Center Mass", rating: 1000 },
  { name: "Cottonwood", rating: 1000 },
  { name: "One Way", rating: 1000 },
  { name: "Days Lie Dormant", rating: 1000 },
  { name: "Tally", rating: 1000 },
  { name: "Intentions", rating: 1000 },
  { name: "Drag Path", rating: 1000 },
];

let left;
let right;

let comparisons = 0;
const MAX_COMPARISONS = songs.length * 5;

const pairHistory = {};

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

start();

function updateElo(winner, loser) {
  const K = 16;

  const expectedWinner =
    1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));

  const expectedLoser =
    1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));

  winner.rating += K * (1 - expectedWinner);
  loser.rating += K * (0 - expectedLoser);

  console.log(
  winner.name,
  "→",
  Math.round(winner.rating),
  "|",
  loser.name,
  "→",
  Math.round(loser.rating)
);
}

function start() {
  nextMatch();
}

function nextMatch() {
  let bestPair = null;
  let lowestCount = Infinity;

  for (let i = 0; i < songs.length; i++) {
    for (let j = i + 1; j < songs.length; j++) {
      const key = pairKey(songs[i], songs[j]);
      const count = pairHistory[key] || 0;

      if (count < lowestCount || (count === lowestCount && Math.random() < 0.5)) {
        lowestCount = count;
        bestPair = [songs[i], songs[j]];
      }
    }
  }

  left = bestPair[0];
  right = bestPair[1];

  leftBtn.innerText = left.name;
  rightBtn.innerText = right.name;
}

function pickWinner(winner, loser) {
  updateElo(winner, loser);

  const key = pairKey(winner, loser);
  pairHistory[key] = (pairHistory[key] || 0) + 1;

  comparisons++;

  if (comparisons >= MAX_COMPARISONS) {
    showRanking();
  } else {
    nextMatch();
  }
}

leftBtn.onclick = () => pickWinner(left, right);
rightBtn.onclick = () => pickWinner(right, left);

function showRanking() {
  document.body.innerHTML = "<h1>Final Ranking</h1>";

  const sorted = [...songs].sort((a, b) => b.rating - a.rating);

  sorted.forEach((song, index) => {
    const p = document.createElement("p");
    p.innerText = `${index + 1}. ${song.name} (${song.rating})`;
    document.body.appendChild(p);
  });
}

function pairKey(a, b) {
  return [a.name, b.name].sort().join("|");
}
