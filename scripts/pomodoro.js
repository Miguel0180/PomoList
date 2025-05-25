let pomodoro = document.getElementById("pomodoro-timer");
let short = document.getElementById("short-timer");
let long = document.getElementById("long-timer");
let timers = document.querySelectorAll(".timer-display");
let session = document.getElementById("pomodoro-session");
let shortBreak = document.getElementById("short-break");
let longBreak = document.getElementById("long-break");
let startBtn = document.getElementById("start");
let stopBtn = document.getElementById("stop");
let timerMsg = document.getElementById("timer-message");

let currentTimer = null;
let myInterval = null;
let isPaused = false;
let remainingTime = 0;
let endTimestamp = 0;

// Exibir Pomodoro como padrão
function showDefaultTimer() {
  pomodoro.style.display = "block";
  short.style.display = "none";
  long.style.display = "none";
  currentTimer = pomodoro;
  resetTimerDisplay(); // Resetar o display para o tempo máximo
}
showDefaultTimer();

function hideAll() {
  timers.forEach((timer) => (timer.style.display = "none"));
}

// Alternar sessões
session.addEventListener("click", () => {
  hideAll();
  pomodoro.style.display = "block";
  session.classList.add("active");
  shortBreak.classList.remove("active");
  longBreak.classList.remove("active");
  currentTimer = pomodoro;
  resetButtons();
  resetTimerDisplay();
});

shortBreak.addEventListener("click", () => {
  hideAll();
  short.style.display = "block";
  session.classList.remove("active");
  shortBreak.classList.add("active");
  longBreak.classList.remove("active");
  currentTimer = short;
  resetButtons();
  resetTimerDisplay();
});

longBreak.addEventListener("click", () => {
  hideAll();
  long.style.display = "block";
  session.classList.remove("active");
  shortBreak.classList.remove("active");
  longBreak.classList.add("active");
  currentTimer = long;
  resetButtons();
  resetTimerDisplay();
});

// Função para resetar o display do timer para o tempo máximo
function resetTimerDisplay() {
  let timerDuration = parseFloat(currentTimer.getAttribute("data-duration"));
  let durationInMs = timerDuration * 60 * 1000;
  updateTimerDisplay(durationInMs);
}

// Função para resetar os botões para o estado inicial
function resetButtons() {
  startBtn.textContent = "Start";
  stopBtn.textContent = "Stop";
  isPaused = false;
  if (myInterval) {
    clearInterval(myInterval);
    myInterval = null;
  }
}

// Atualizar a exibição do tempo
function updateTimerDisplay(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  currentTimer.querySelector(".time").textContent = formattedTime;
}

// Iniciar temporizador
function startTimer(timerDisplay) {
  if (isPaused) {
    // Se estiver pausado, continuar de onde parou
    endTimestamp = Date.now() + remainingTime;
    isPaused = false;
    startBtn.textContent = "Pause";
  } else {
    // Novo timer
    let timerDuration = parseFloat(timerDisplay.getAttribute("data-duration"));
    let durationInMs = timerDuration * 60 * 1000;
    endTimestamp = Date.now() + durationInMs;
    startBtn.textContent = "Pause";
    stopBtn.textContent = "Restart";
  }

  myInterval = setInterval(() => {
    remainingTime = endTimestamp - Date.now();

    if (remainingTime <= 0) {
      clearInterval(myInterval);
      myInterval = null;
      currentTimer.querySelector(".time").textContent = "00:00";
      new Audio("https://www.freespecialeffects.co.uk/soundfx/scifi/electronic.wav").play();
      resetButtons();
    } else {
      updateTimerDisplay(remainingTime);
    }
  }, 1000);
}

// Iniciar/Pausar
startBtn.addEventListener("click", () => {
  if (currentTimer) {
    if (myInterval && !isPaused) {
      // Pausar o timer
      clearInterval(myInterval);
      myInterval = null;
      isPaused = true;
      startBtn.textContent = "Resume";
    } else {
      // Iniciar ou continuar
      startTimer(currentTimer);
      timerMsg.style.display = "none";
    }
  } else {
    timerMsg.style.display = "block";
  }
});

// Parar/Reiniciar
stopBtn.addEventListener("click", () => {
  if (stopBtn.textContent === "Restart") {
    // Reiniciar o timer (volta para o tempo máximo)
    resetButtons();
    resetTimerDisplay();
  } else {
    // Parar completamente (só funciona se não estiver em "Restart")
    if (myInterval || isPaused) {
      resetButtons();
      resetTimerDisplay();
    }
  }
});

document.getElementById('btnPomodoro').addEventListener('click', () => {
  document.getElementById('pomodoro-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('btnTodolist').addEventListener('click', () => {
  const title = document.getElementById('title');
  const yOffset = -50; // ajuste a distância aqui
  const y = title.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
});