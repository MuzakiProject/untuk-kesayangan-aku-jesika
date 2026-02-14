
        let currentStage = 1;
        let heartCount = 0;
        let catchScore = 0;
        let userAnswer = '';
        let gameInterval;
        let updateInterval;
        let catcherX = 50;

        function nextStage(stage) {
            document.getElementById('stage' + currentStage).classList.remove('active');
            currentStage = stage;
            document.getElementById('stage' + stage).classList.add('active');
            updateProgress();
            
            if (stage === 3) {
                startCatchGame();
            }
            
            if (stage === 6) {
                document.getElementById('totalHearts').textContent = heartCount;
                document.getElementById('userAnswer').textContent = userAnswer;
                createConfetti();
            }
        }

        function updateProgress() {
            const progress = (currentStage / 6) * 100;
            document.getElementById('progress').style.width = progress + '%';
            document.getElementById('progressText').textContent = Math.round(progress) + '%';
        }

        function moveButton() {
            const noBtn = document.getElementById('noBtn');
            const container = noBtn.parentElement;
            const maxX = container.offsetWidth - noBtn.offsetWidth - 20;
            const maxY = container.offsetHeight - noBtn.offsetHeight - 20;
            
            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;
            
            noBtn.style.position = 'absolute';
            noBtn.style.left = randomX + 'px';
            noBtn.style.top = randomY + 'px';
            
            const texts = ['Yakin tidak?', 'Coba lagi deh', 'Masa sih?', 'Klik yang iya dong', 'Ayolah~'];
            noBtn.querySelector('span').textContent = texts[Math.floor(Math.random() * texts.length)];
        }

        function addHeart() {
            heartCount++;
            const hearts = '❤️'.repeat(Math.min(heartCount, 30));
            document.getElementById('heartCounter').textContent = hearts;
            
            if (heartCount > 30) {
                document.getElementById('heartCounter').innerHTML = '❤️'.repeat(30) + '<br><div style="font-size: 1.5rem; margin-top: 16px;">+' + (heartCount - 30) + ' lagi!</div>';
            }
        }

        function startCatchGame() {
            const game = document.getElementById('catchGame');
            const catcher = document.getElementById('catcher');
            let hearts = [];
            
            const moveHandler = (clientX) => {
                const rect = game.getBoundingClientRect();
                catcherX = ((clientX - rect.left) / rect.width) * 100;
                catcherX = Math.max(0, Math.min(85, catcherX));
                catcher.style.left = catcherX + '%';
            };
            
            game.addEventListener('mousemove', (e) => moveHandler(e.clientX));
            game.addEventListener('touchmove', (e) => {
                e.preventDefault();
                moveHandler(e.touches[0].clientX);
            });
            
            gameInterval = setInterval(() => {
                if (catchScore >= 10) {
                    clearInterval(gameInterval);
                    clearInterval(updateInterval);
                    hearts.forEach(h => {
                        if (h.element && h.element.parentNode) {
                            h.element.remove();
                        }
                    });
                    setTimeout(() => nextStage(4), 1000);
                    return;
                }
                
                const heart = document.createElement('div');
                heart.className = 'falling-item';
                heart.textContent = ['❤️', '💕', '💖', '💗'][Math.floor(Math.random() * 4)];
                const startX = Math.random() * 80 + 5;
                heart.style.left = startX + '%';
                heart.style.top = '-50px';
                game.appendChild(heart);
                
                hearts.push({
                    element: heart,
                    x: startX,
                    y: -50,
                    caught: false
                });
                
            }, 800);
            
            updateInterval = setInterval(() => {
                if (catchScore >= 10) {
                    clearInterval(updateInterval);
                    return;
                }
                
                hearts.forEach((heartObj, index) => {
                    if (!heartObj.element || heartObj.caught) return;
                    
                    heartObj.y += 3;
                    heartObj.element.style.top = heartObj.y + 'px';
                    
                    const heartRect = heartObj.element.getBoundingClientRect();
                    const catcherRect = catcher.getBoundingClientRect();
                    
                    if (
                        heartRect.bottom >= catcherRect.top &&
                        heartRect.bottom <= catcherRect.bottom + 20 &&
                        heartRect.right >= catcherRect.left &&
                        heartRect.left <= catcherRect.right
                    ) {
                        heartObj.caught = true;
                        catchScore++;
                        document.getElementById('catchScore').textContent = catchScore;
                        heartObj.element.style.transform = 'scale(1.5)';
                        
                        setTimeout(() => {
                            if (heartObj.element && heartObj.element.parentNode) {
                                heartObj.element.remove();
                            }
                        }, 300);
                        
                        hearts.splice(index, 1);
                    }
                    
                    if (heartObj.y > 340) {
                        if (heartObj.element && heartObj.element.parentNode) {
                            heartObj.element.remove();
                        }
                        hearts.splice(index, 1);
                    }
                });
            }, 30);
        }

        function setAnswer(answer) {
            userAnswer = answer;
            nextStage(6);
        }

        function createConfetti() {
            const colors = ['#FF385C', '#FF6B9D', '#FFD93D', '#667eea', '#764ba2'];
            for (let i = 0; i < 150; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = Math.random() * 2 + 's';
                    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => confetti.remove(), 5000);
                }, i * 20);
            }
        }

        function restart() {
            heartCount = 0;
            catchScore = 0;
            userAnswer = '';
            document.getElementById('catchScore').textContent = '0';
            document.getElementById('heartCounter').textContent = '❤️';
            nextStage(1);
        }

        updateProgress();