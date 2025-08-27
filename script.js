document.addEventListener('DOMContentLoaded', () => {
    const setupScreen = document.getElementById('setup-screen');
    const timerScreen = document.getElementById('timer-screen');
    const startBtn = document.getElementById('start-btn');

    const meetingTimeInput = document.getElementById('meeting-time');
    const agendaInput = document.getElementById('agenda');
    const goalInput = document.getElementById('goal');

    const timerMinutesDisplay = document.getElementById('timer-minutes');
    const timerSecondsDisplay = document.getElementById('timer-seconds');
    const notificationArea = document.getElementById('notification-area');
    const displayAgenda = document.getElementById('display-agenda');
    const displayGoal = document.getElementById('display-goal');

    let timerInterval;
    let remainingSeconds;
    let initialDuration;
    let notificationFlags;

    function timerTick() {
        remainingSeconds--;

        const elapsedSeconds = initialDuration - remainingSeconds;
        updateTimerDisplay(remainingSeconds);
        checkNotifications(elapsedSeconds, initialDuration);

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            notificationArea.textContent = 'ミーティングは終了です。';
        }
    }

    startBtn.addEventListener('click', () => {
        const meetingMinutes = parseInt(meetingTimeInput.value, 10);
        const agenda = agendaInput.value.trim();
        const goal = goalInput.value.trim();

        if (isNaN(meetingMinutes) || meetingMinutes <= 0) {
            alert('有効なMTG時間を入力してください。');
            return;
        }
        if (agenda === '') {
            alert('アジェンダを入力してください。');
            return;
        }
        if (goal === '') {
            alert('ゴールを入力してください。');
            return;
        }

        initialDuration = meetingMinutes * 60;
        remainingSeconds = initialDuration;

        displayAgenda.textContent = agenda;
        displayGoal.textContent = goal;

        setupScreen.style.display = 'none';
        timerScreen.style.display = 'block';

        notificationFlags = undefined;

        updateTimerDisplay(remainingSeconds);
        startTimer();
    });

    function startTimer() {
        clearInterval(timerInterval);

        if (notificationFlags === undefined) {
            notificationFlags = {
                agenda: false,
                midpoint: false,
                nextAction: false
            };
            showNotification('agenda');
        }

        timerInterval = setInterval(timerTick, 1000);
    }

    function updateTimerDisplay(seconds) {
        if (seconds < 0) seconds = 0;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerMinutesDisplay.textContent = String(mins).padStart(2, '0');
        timerSecondsDisplay.textContent = String(secs).padStart(2, '0');
    }

    function checkNotifications(elapsed, total) {
        if (total <= 0) return;
        const progress = elapsed / total;

        if (progress >= 0.1 && !notificationFlags.goal) {
            showNotification('goal');
        }
        
        if (progress >= 0.9 && !notificationFlags.nextAction) {
            showNotification('nextAction');
        }
    }

    function showNotification(type) {
        let message = '';
        switch (type) {
            case 'agenda':
                message = 'アジェンダを共有する時間です。';
                notificationFlags.agenda = true;
                break;
            case 'goal':
                message = 'ゴールの達成状況を確認しましょう。';
                notificationFlags.midpoint = true;
                break;
            case 'nextAction':
                message = 'ネクストアクションを共有する時間です。';
                notificationFlags.nextAction = true;
                break;
        }
        notificationArea.textContent = message;
    }
});