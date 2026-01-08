const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const saveBtn = document.getElementById('save');
const timerDisplay = document.getElementById('timer-display');
const sessionIndicator = document.getElementById('session-indicator');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const alarmSound = document.getElementById('alarm-sound');
const soundToggle = document.getElementById('sound-toggle');
const settingsSection = document.getElementById('settings');
const progressCircle = document.querySelector('.progress-ring-circle');
const soundSettingsBtn = document.getElementById('sound-settings-btn');
const soundPanel = document.getElementById('sound-panel');
const alarmSelect = document.getElementById('alarm-select');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const testSoundBtn = document.getElementById('test-sound-btn');

console.log('soundPanel:', soundPanel);
console.log('soundSettingsBtn:', soundSettingsBtn);

let circumference = 0;
if (progressCircle) {
  const radius = progressCircle.r.baseVal.value;
  circumference = 2 * Math.PI * radius;
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = circumference;
}

let timerInterval = null;
let isWorkSession = true;
let isRunning = false;

let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let timeLeft = workDuration;

updateDisplay();

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
saveBtn.addEventListener('click', saveSettings);

soundSettingsBtn.addEventListener('click', () => {
  soundPanel.classList.toggle('open');
});

alarmSelect.addEventListener('change', () => {
  alarmSound.src = alarmSelect.value;
});

volumeSlider.addEventListener('input', () => {
  const volume = volumeSlider.value;
  volumeValue.textContent = volume;
  alarmSound.volume = volume / 100;
});

testSoundBtn.addEventListener('click', () => {
  alarmSound.currentTime = 0;
  alarmSound.play().catch(err => {
    console.error('audio playback failed: ', err);
    alert("couldn't play sound. check console for errors.");
  });
});

alarmSound.volume = 0.5;

function playAlarm() 
{
  if (soundToggle.checked) 
  {
    alarmSound.currentTime = 0;
    alarmSound.play().catch(err => {
      console.log('Audio playback failed:', err);
    });
  }
}

function updateProgress()
{
  if (!progressCircle) return;

  const totalDuration = isWorkSession ? workDuration : breakDuration;
  const progress = timeLeft / totalDuration;
  const offset = circumference - (progress * circumference);

  progressCircle.style.strokeDashoffset = offset;

  if (isWorkSession)
    progressCircle.style.stroke = '#a6b9cfff';
  else 
    progressCircle.style.stroke = '#b0c7ddff';
}

function startTimer() 
{
  if (isRunning) return;
  isRunning = true;

  settingsSection.style.display = 'none';

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    updateProgress();

    if (timeLeft <= 0) 
    {
      clearInterval(timerInterval);

      timerInterval = null;
      isRunning = false;

      playAlarm();
      
      isWorkSession = !isWorkSession;
      timeLeft = isWorkSession ? workDuration : breakDuration;

      updateSessionIndicator();
      updateProgress();

      const message = isWorkSession ?
        "Time to focus!" :
        "Time for a break! :D";

      alert(message);
      updateDisplay();
    }
  }, 1000);
}

function stopTimer() 
{
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
}

function resetTimer() 
{
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  timeLeft = isWorkSession ? workDuration : breakDuration;

  updateDisplay();
  settingsSection.style.display = 'block';
  updateProgress();
}

function updateDisplay() 
{
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime =
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');

  timerDisplay.textContent = formattedTime;
  document.title = formattedTime + (isWorkSession ? ' - Work Time' : ' - Break Time');
}

function updateSessionIndicator() 
{
  sessionIndicator.textContent = isWorkSession ? 'Work' : 'Break';
  sessionIndicator.style.color = isWorkSession ? '#4d4569ff' : '#85a6beff';

  timerDisplay.style.color = isWorkSession ? '#4c6582ff' : '#7192aaff';
}

function saveSettings() 
{
  const workMinutes = parseInt(workTimeInput.value);
  const breakMinutes = parseInt(breakTimeInput.value);

  if (isNaN(workMinutes) || isNaN(breakMinutes) ||
    workMinutes < 1 || breakMinutes < 1) 
  {
    alert('Please enter valid numbers (1 or higher)');
    return;
  }

  workDuration = workMinutes * 60;
  breakDuration = breakMinutes * 60;

  if (!isRunning) 
  {
    if (isWorkSession)
      timeLeft = workDuration;
    else
      timeLeft = breakDuration;

    updateDisplay();
    updateProgress();
  }
}

updateSessionIndicator();
updateProgress();