const setPositions = () => {
  const maxSymbols = 30;
  const randomSymbols = ["⚪", "⚫", "🔴", "🔵", "🟠", "🟡", "🟢", "🟣", "🟤"];
  for (var i = 0; i < maxSymbols; i++) {
    const p = document.createElement("p");
    p.innerHTML =
      randomSymbols[Math.floor(Math.random() * randomSymbols.length)];
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    var speed = Math.floor(Math.random() * 60);
    while (speed < 10) {
      speed = Math.floor(Math.random() * 60);
    }
    p.style.top = x + "%";
    p.style.left = y + "%";
    p.style.animation = "travel " + speed + "s ease-in-out";
    p.style.animationIterationCount = "infinite";
    document.querySelector(".background").appendChild(p);
  }
};
