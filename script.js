document.addEventListener('DOMContentLoaded', () => {
    const setupScreen = document.getElementById('setup-screen');
    const timerScreen = document.getElementById('timer-screen');
    const startBtn = document.getElementById('start-btn');

    const meetingTimeInput = document.getElementById('meeting-time');
    const agendaInput = document.getElementById('agenda');
    const goalInput = document.getElementById('goal');

    const timerDisplay = document.getElementById('timer-display');
    const notificationArea = document.getElementById('notification-area');
    const displayAgenda = document.getElementById('display-agenda');
    const displayGoal = document.getElementById('display-goal');

    let timerInterval;
    let totalSeconds;
    let notificationFlags;

    startBtn.addEventListener('click', () => {
        const meetingMinutes = parseInt(meetingTimeInput.value, 10);
        if (isNaN(meetingMinutes) || meetingMinutes <= 0) {
            alert('有効なMTG時間を入力してください。');
            return;
        }

        totalSeconds = meetingMinutes * 60;
        const agenda = agendaInput.value;
        const goal = goalInput.value;

        // 表示エリアに設定
        displayAgenda.textContent = agenda;
        displayGoal.textContent = goal;

        // 画面切り替え
        setupScreen.style.display = 'none';
        timerScreen.style.display = 'block';

        startTimer(totalSeconds);
    });

    function startTimer(duration) {
        let remainingSeconds = duration;
        notificationFlags = {
            agenda: false,
            midpoint: false,
            nextAction: false
        };

        // 即座に最初の通知
        showNotification('agenda');

        timerInterval = setInterval(() => {
            remainingSeconds--;

            const elapsedSeconds = duration - remainingSeconds;
            updateTimerDisplay(remainingSeconds);
            checkNotifications(elapsedSeconds, duration);

            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                notificationArea.textContent = 'ミーティングは終了です。';
            }
        }, 1000);
    }

    function updateTimerDisplay(seconds) {
        if (seconds < 0) seconds = 0;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function checkNotifications(elapsed, total) {
        const progress = elapsed / total;

        // 中間地点
        if (progress >= 0.5 && !notificationFlags.midpoint) {
            showNotification('midpoint');
        }
        // 終了10%前
        else if (progress >= 0.9 && !notificationFlags.nextAction) {
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
            case 'midpoint':
                message = 'ゴールの達成状況を確認しましょう。';
                notificationFlags.midpoint = true;
                break;
            case 'nextAction':
                message = 'ネクストアクションを共有する時間です。';
                notificationFlags.nextAction = true;
                break;
        }
        notificationArea.textContent = message;

        // 30秒後にメッセージを消す
        setTimeout(() => {
            if (notificationArea.textContent === message) {
                notificationArea.textContent = '';
            }
        }, 30000);
    }
});
