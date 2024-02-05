import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate;
const datetimePicker = document.querySelector('#datetime-picker');
let startButton = document.querySelector('[data-start]');
startButton.disabled = true;

let dataDays = document.querySelector('[data-days]');
let dataHours = document.querySelector('[data-hours]');
let dataMinutes = document.querySelector('[data-minutes]');
let dataSeconds = document.querySelector('[data-seconds]');

let timerInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] > Date.now()) {
      userSelectedDate = selectedDates[0];
      startButton.disabled = false;
      updateTimeDisplay(timerInterval)
    } else {
      userSelectedDate = undefined;
      startButton.disabled = true;
      iziToast.show({
        message: "Please choose a date in the future",
        position: 'topRight',
        color: 'red'
      })
    };
  },
};

startButton.addEventListener('click', startTimer)

const updateTimeDisplay = () => {
  const timeDifference = userSelectedDate - Date.now();
  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  if (!isNaN(days) && !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
    dataDays.textContent = addLeadingZero(days);
    dataHours.textContent = addLeadingZero(hours);
    dataMinutes.textContent = addLeadingZero(minutes);
    dataSeconds.textContent = addLeadingZero(seconds);
  }

  // Checking if the timer has reached zero
  if (timeDifference <= 0) {
    stopTimer();
  }
}
function startTimer() {
  // Переконайтеся, що userSelectedDate встановлено перед викликом
  if (userSelectedDate) {
    // Заборонити вибір нової дати
    datetimePicker.disabled = true;
    // Заборонити клік на кнопку "Старт"
    startButton.disabled = true;

    // Запуск таймера, оновлення інтерфейсу щосекунди
    timerInterval = setInterval(updateTimeDisplay, 1000);
  }
}
function stopTimer(){
  if (timerInterval) {
    clearInterval(timerInterval);

    // Розблокувати вибір нової дати
    datetimePicker.disabled = false;
    // Розблокувати кнопку "Старт"
    startButton.disabled = false;

    // Очистити вибрану дату
    datetimePicker.value = "";

    dataDays.textContent = "00";
    dataHours.textContent = "00";
    dataMinutes.textContent = "00";
    dataSeconds.textContent = "00";

    timerInterval = null;
  }
}

const addLeadingZero = (value) => {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr(datetimePicker, options);