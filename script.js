document.addEventListener('DOMContentLoaded', () => {

  //Scroll shadow on navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // Hamburger mobile menu
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  //Mark active nav link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  //Scroll fade-up animations
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  }

  //Init page-specific modules
  if (document.querySelector('#quiz-container'))  initQuiz();
  if (document.querySelector('#game-canvas'))     initGame();
  if (document.querySelector('#contact-form'))    initForm();
  if (document.querySelector('.skill-fill'))      animateSkillBars();

});

function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (!form) return;

  function setError(fieldId, msg) {
    const el = document.getElementById(fieldId + '-error');
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(e => e.textContent = '');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();
    let valid = true;

    const name  = form.querySelector('#fname').value.trim();
    const lname = form.querySelector('#lname').value.trim();
    const email = form.querySelector('#email').value.trim();
    const msg   = form.querySelector('#message').value.trim();
    const yourself = form.querySelector('input[name="yourself"]:checked');
    const interests = form.querySelectorAll('input[name="interests"]:checked');

    if (!name)  { setError('fname', 'First name is required.'); valid = false; }
    if (!lname) { setError('lname', 'Last name is required.'); valid = false; }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    }

    if (!yourself) {
      setError('yourself', 'Please select one option.');
      valid = false;
    }

    if (interests.length === 0) {
      setError('interests', 'Please select at least one interest.');
      valid = false;
    }

    if (!msg || msg.length < 10) {
      setError('message', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      form.reset();
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }
  });
}

//SKILL BARS
function animateSkillBars() {
  // The width is already set inline on each .skill-fill element
  // The CSS @keyframes 'growBar' handles the animation on load
  // This function just ensures they are visible
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.dataset.width;
  });
}

//QUIZ
const quizData = [
{
    question: "What is my favorite anime?",
    options: ["Naruto", "One Piece", "Demon Slayer", "Attack on Titan"],
    answer: 1,
    explanation: "My favorite anime is One Piece."
},

{
    question: "Who is my favorite One Piece character?",
    options: ["Luffy", "Sanji", "Zoro", "Ace"],
    answer: 2,
    explanation: "Zoro is my favorite character because of his determination and loyalty."
},

{
    question: "What is my favorite color?",
    options: ["Purple", "Pink", "Blue", "Black"],
    answer: 1,
    explanation: "Pink is my favorite color because it matches my personality."
},

{
    question: "What sport do I enjoy playing?",
    options: ["Volleyball", "Basketball", "Badminton", "Table Tennis"],
    answer: 3,
    explanation: "I enjoy playing table tennis during my free time."
},

{
    question: "What degree am I currently pursuing?",
    options: [
      "Bachelor of Science in IT",
      "Master in Information Technology",
      "Computer Engineering",
      "Information Systems"
    ],
    answer: 1,
    explanation: "I am currently pursuing a Master in Information Technology degree."
},

{
    question: "What is my current profession?",
    options: [
      "Software Engineer",
      "Graphic Designer",
      "Part-Time Instructor",
      "Web Developer"
    ],
    answer: 2,
    explanation: "I am currently working as a part-time instructor."
},

{
    question: "How would you describe my personality?",
    options: [
      "Quiet",
      "Strict",
      "Bubbly",
      "Serious"
    ],
    answer: 2,
    explanation: "I have a bubbly and cheerful personality."
},

{
    question: "What inspires me the most?",
    options: [
      "Traveling",
      "Money",
      "Building a better future for my family",
      "Playing games"
    ],
    answer: 2,
    explanation: "My dreams and my family inspire me to work hard and keep growing."
}

];

let quizState = { current: 0, score: 0, answered: false, history: [] };

function initQuiz() {
  quizState = { current: 0, score: 0, answered: false, history: [] };
  renderQuestion();
  renderScoreTable();
}

function renderQuestion() {
  const container = document.getElementById('quiz-container');
  const result    = document.getElementById('quiz-result');
  const qCard     = document.getElementById('quiz-question-card');

  if (quizState.current >= quizData.length) {
    qCard.style.display    = 'none';
    result.style.display   = 'block';
    showResult();
    renderScoreTable();
    return;
  }

  qCard.style.display  = 'block';
  result.style.display = 'none';

  const q = quizData[quizState.current];

  // Progress bar
  const pct = (quizState.current / quizData.length) * 100;
  document.getElementById('quiz-progress').style.width = pct + '%';

  // Meta
  document.getElementById('quiz-q-num').textContent  = `Question ${quizState.current + 1} of ${quizData.length}`;
  document.getElementById('quiz-score-live').textContent = `Score: ${quizState.score}`;

  // Question text
  document.getElementById('quiz-question-text').textContent = q.question;

  // Options
  const letters = ['A','B','C','D'];
  const optList = document.getElementById('quiz-options');
  optList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'quiz-option';
    div.dataset.index = i;
    div.innerHTML = `<span class="quiz-option-letter">${letters[i]}</span> ${opt}`;
    div.addEventListener('click', () => handleAnswer(i));
    optList.appendChild(div);
  });

  // Feedback
  const fb = document.getElementById('quiz-feedback');
  fb.style.display = 'none';
  fb.className = '';

  quizState.answered = false;
  document.getElementById('quiz-next-btn').style.display = 'none';
}

function handleAnswer(selected) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizData[quizState.current];
  const options = document.querySelectorAll('.quiz-option');
  const fb = document.getElementById('quiz-feedback');
  const isCorrect = selected === q.answer;

  if (isCorrect) quizState.score++;

  options.forEach((opt, i) => {
    opt.classList.add('disabled');
    if (i === q.answer)  opt.classList.add('correct');
    if (i === selected && !isCorrect) opt.classList.add('wrong');
  });

  fb.style.display = 'block';
  fb.className = isCorrect ? 'correct' : 'wrong';
  fb.textContent = isCorrect
    ? `✅ Correct! ${q.explanation}`
    : `❌ Wrong. ${q.explanation}`;

  document.getElementById('quiz-score-live').textContent = `Score: ${quizState.score}`;

  quizState.history.push({
    question: q.question,
    selected: q.options[selected],
    correct: q.options[q.answer],
    isCorrect
  });

  document.getElementById('quiz-next-btn').style.display = 'inline-flex';
}

function nextQuestion() {
  quizState.current++;
  renderQuestion();
}

function showResult() {

  const pct = Math.round((quizState.score / quizData.length) * 100);

  let emoji, title, msg;

  if (pct === 100) {
    emoji = '🌸';
    title = 'You Know Me So Well!';
    msg = 'Amazing! You really know my interests, dreams, and personality 💖';
  }

  else if (pct >= 75) {
    emoji = '✨';
    title = 'Great Job!';
    msg = 'You know a lot about me! Thanks for taking the quiz 🌷';
  }

  else if (pct >= 50) {
    emoji = '😊';
    title = 'Nice Try!';
    msg = 'You’re getting to know me better little by little 💕';
  }

  else {
    emoji = '🌼';
    title = 'Let’s Be Friends!';
    msg = 'Looks like there’s still more to discover about me ✨';
  }

  document.getElementById('result-emoji').textContent = emoji;

  document.getElementById('result-title').textContent = title;

  document.getElementById('result-score-big').textContent =
    `${quizState.score}/${quizData.length}`;

  document.getElementById('result-pct').textContent =
    `${pct}% Friendship Score 💖`;

  document.getElementById('result-msg').textContent = msg;

  // Progress bar complete
  document.getElementById('quiz-progress').style.width = '100%';
}

function restartQuiz() {
  initQuiz();
}

function renderScoreTable() {
  const tbody = document.getElementById('score-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (quizState.history.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:24px">No attempts yet. Complete the quiz!</td></tr>';
    return;
  }

  quizState.history.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.question}</td>
      <td>${item.selected}</td>
      <td style="color:${item.isCorrect ? '#34c78a' : '#e63946'}; font-weight:600">
        ${item.isCorrect ? '✅ Correct' : '❌ Wrong'}
      </td>`;
    tbody.appendChild(tr);
  });
}

//TABLE TENNIS GAME
function initGame() {
  const canvas  = document.getElementById('game-canvas');
  const ctx     = canvas.getContext('2d');
  const overlay = document.getElementById('game-overlay');

  //Responsive canvas sizing
  function resizeCanvas() {
    const wrap = canvas.parentElement;
    canvas.width  = wrap.clientWidth;
    canvas.height = Math.min(480, canvas.width * 0.56);
  }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); resetPositions(); });

  //Colors from CSS palette
  const C = {
    bg:        '#F7F4FF',
    table:     '#4B2BBF',
    tableLine: '#7B5EE8',
    net:       '#E84393',
    ball:      '#E84393',
    ballGlow:  'rgba(232,67,147,.35)',
    paddle1:   '#4B2BBF',
    paddle2:   '#7B5EE8',
    text:      '#4B2BBF',
  };

  //State
  let state = 'idle'; // idle | playing | paused | won | lost | stopped
  let playerScore = 0;
  let aiScore  = 0;
  const WIN    = 11;
  let raf;

  //Game objects
  let ball, paddle, aiPaddle, particles;

  function resetPositions() {
    const W = canvas.width, H = canvas.height;
    const PW = W * 0.022, PH = H * 0.22;
    ball = {
      x: W / 2, y: H / 2,
      r: Math.max(8, W * 0.014),
      vx: (Math.random() > .5 ? 1 : -1) * W * 0.0035,
      vy: (Math.random() > .5 ? 1 : -1) * H * 0.0025,
      speed: Math.max(W * 0.005, 3),
    };
    paddle = {
      x: W * 0.04,
      y: H / 2 - PH / 2,
      w: PW, h: PH,
      vy: 0, // movement for mouse/touch
    };
    aiPaddle = {
      x: W - W * 0.02 - PW,
      y: H / 2 - PH / 2,
      w: PW, h: PH,
    };
    particles = [];
  }
  resetPositions();

  //Input: mouse / touch / keyboard 
  let targetY = null;

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    targetY = (e.clientY - rect.top) * scaleY - paddle.h / 2;
  });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    targetY = (e.touches[0].clientY - rect.top) * scaleY - paddle.h / 2;
  }, { passive: false });

  // Keyboard support
  const keys = {};

  document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  //Hit Paddle" button
  document.getElementById('hit-btn')?.addEventListener('click', () => {
    if (state === 'idle' || state === 'won' || state === 'lost') startGame();
    // Give player paddle a "smash" boost
    if (state === 'playing') {
      const W = canvas.width, H = canvas.height;
      if (ball.x < W / 2 && ball.x > paddle.x && Math.abs(ball.y - (paddle.y + paddle.h/2)) < paddle.h) {
        ball.vx = Math.abs(ball.vx) * 1.2;
        ball.vy = (Math.random() - .5) * H * 0.02;
        spawnParticles(ball.x, ball.y);
      }
    }
  });

  // Update scores display
  function updateScoreDisplay() {
    const pEl = document.getElementById('player-score');
    const aEl = document.getElementById('ai-score');
    if (pEl) pEl.textContent = playerScore;
    if (aEl) aEl.textContent = aiScore;
  }

  //Particles
  function spawnParticles(x, y) {
    for (let i = 0; i < 12; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - .5) * 6,
        vy: (Math.random() - .5) * 6,
        r: Math.random() * 5 + 2,
        life: 1,
        color: Math.random() > .5 ? C.ball : '#7B5EE8',
      });
    }
  }

  //Draw
  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    // Table surface gradient
    const tg = ctx.createLinearGradient(0, 0, W, 0);
    tg.addColorStop(0, 'rgba(75,43,191,.06)');
    tg.addColorStop(.5,'rgba(75,43,191,.12)');
    tg.addColorStop(1, 'rgba(75,43,191,.06)');
    ctx.fillStyle = tg;
    ctx.fillRect(0, 0, W, H);

    // Court lines
    ctx.strokeStyle = 'rgba(75,43,191,.15)';
    ctx.lineWidth = 2;
    // Top & bottom borders
    ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(W, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H-4); ctx.lineTo(W, H-4); ctx.stroke();


    //TABLE TENNIS NET
    const netX = W / 2;

    //Net Posts
    ctx.fillStyle = "#ead2d2";

    ctx.fillRect(netX - 10, 20, 8, H - 40);
    ctx.fillRect(netX + 2, 20, 8, H - 40);

    //Pink Frame
    ctx.fillStyle = "#0f090c";

    ctx.fillRect(netX - 2, 20, 4, H - 40);

    //Net Mesh
    ctx.strokeStyle = "rgba(40,40,40,0.45)";
    ctx.lineWidth = 1;

    //Horizontal lines
    for(let y = 30; y < H - 30; y += 10){

      ctx.beginPath();

      ctx.moveTo(netX - 2, y);
      ctx.lineTo(netX + 2, y);

      ctx.stroke();
    }

    //Vertical lines
    for(let y = 30; y < H - 30; y += 12){

      ctx.beginPath();

      ctx.moveTo(netX - 4, y);
      ctx.lineTo(netX + 4, y);

      ctx.stroke();
    }

    //Net Glow
    ctx.shadowColor = "rgba(216, 78, 145, 0.4)";
    ctx.shadowBlur = 10;

    ctx.fillStyle = "#ff4fa3";

    ctx.fillRect(netX - 1, 20, 2, H - 40);

    ctx.shadowBlur = 0;
    // Net knob
    ctx.fillStyle = C.net;
    ctx.beginPath(); ctx.arc(W/2, H/2, 8, 0, Math.PI*2); ctx.fill();

    // Particles
    particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

//TABLE TENNIS PADDLES
  drawRealPaddle(paddle.x, paddle.y, paddle.w, paddle.h, "red");
  drawRealPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.w, aiPaddle.h, "black");

  function drawRealPaddle(x, y, w, h, rubberColor){

    // Paddle head
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.ellipse(
      x + w / 2,
      y + h * 0.38,
      w * 2.2,
      h * 0.42,
      0,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = rubberColor;
    ctx.fill();

    // Rubber texture / shine
    ctx.beginPath();
    ctx.ellipse(
      x + w / 2 - w * 0.4,
      y + h * 0.22,
      w * 0.9,
      h * 0.18,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();

    ctx.restore();

    // Wooden handle
    const handleWidth = w * 1.1;
    const handleHeight = h * 0.42;

    const handleGradient = ctx.createLinearGradient(
      x,
      y + h * 0.65,
      x + w,
      y + h
    );

    handleGradient.addColorStop(0, "#f7d6a3");
    handleGradient.addColorStop(0.5, "#c98b4b");
    handleGradient.addColorStop(1, "#f1c27d");

    ctx.fillStyle = handleGradient;

    roundRect(
      ctx,
      x + w / 2 - handleWidth / 2,
      y + h * 0.68,
      handleWidth,
      handleHeight,
      8
    );

    ctx.fill();

    // Handle center line
    ctx.strokeStyle = "rgba(120,70,30,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h * 0.70);
    ctx.lineTo(x + w / 2, y + h * 1.05);
    ctx.stroke();
  }
   //TABLE TENNIS BALL

    const ballGradient = ctx.createRadialGradient(
      ball.x - 3,
      ball.y - 3,
      2,
      ball.x,
      ball.y,
      ball.r
    );

    ballGradient.addColorStop(0, "#fff6cc");
    ballGradient.addColorStop(0.3, "#faefd9");
    ballGradient.addColorStop(1, "#f5e4cf");

    ctx.fillStyle = ballGradient;

    /* Glow */
    ctx.shadowColor = "rgba(255,140,0,0.5)";
    ctx.shadowBlur = 18;

    ctx.beginPath();

    ctx.arc(
      ball.x,
      ball.y,
      ball.r,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  //Update 
  function update() {
    const W = canvas.width, H = canvas.height;
    const spd = W * 0.006;

    // Player paddle via mouse/touch
    if (targetY !== null) {
      const dy = targetY - paddle.y;
      paddle.y += dy * 0.2;
    }
    // Keyboard control
    if (keys['ArrowUp']   || keys['w'] || keys['W']) paddle.y -= H * 0.014;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) paddle.y += H * 0.014;

    // Clamp paddles
    paddle.y   = Math.max(0, Math.min(H - paddle.h, paddle.y));
    aiPaddle.y = Math.max(0, Math.min(H - aiPaddle.h, aiPaddle.y));

    // AI movement (tracks ball with slight delay)
    const aiCenter = aiPaddle.y + aiPaddle.h / 2;
    const diff = ball.y - aiCenter;
    const aiSpeed = H * 0.008 * (0.8 + Math.random() * 0.3);
    if (Math.abs(diff) > 5) {
      aiPaddle.y += diff > 0 ? aiSpeed : -aiSpeed;
    }

    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top/bottom walls
    if (ball.y - ball.r <= 0) { ball.y = ball.r; ball.vy *= -1; }
    if (ball.y + ball.r >= H) { ball.y = H - ball.r; ball.vy *= -1; }

    // Player paddle collision
    if (
      ball.x - ball.r <= paddle.x + paddle.w &&
      ball.x - ball.r >= paddle.x &&
      ball.y >= paddle.y && ball.y <= paddle.y + paddle.h
    ) {
      ball.x = paddle.x + paddle.w + ball.r;
      const hitPos = (ball.y - (paddle.y + paddle.h/2)) / (paddle.h/2);
      ball.vy = hitPos * H * 0.015;
      ball.vx = Math.abs(ball.vx) * 1.04; // slight speed increase
      spawnParticles(ball.x, ball.y);
    }

    // AI paddle collision
    if (
      ball.x + ball.r >= aiPaddle.x &&
      ball.x + ball.r <= aiPaddle.x + aiPaddle.w &&
      ball.y >= aiPaddle.y && ball.y <= aiPaddle.y + aiPaddle.h
    ) {
      ball.x = aiPaddle.x - ball.r;
      const hitPos = (ball.y - (aiPaddle.y + aiPaddle.h/2)) / (aiPaddle.h/2);
      ball.vy = hitPos * H * 0.015;
      ball.vx = -Math.abs(ball.vx) * 1.02;
      spawnParticles(ball.x, ball.y);
    }

    // Scoring
    if (ball.x - ball.r < 0) {
      aiScore++;
      updateScoreDisplay();
      if (aiScore >= WIN) { endGame(false); return; }
      resetBall(1);
    }
    if (ball.x + ball.r > W) {
      playerScore++;
      updateScoreDisplay();
      if (playerScore >= WIN) { endGame(true); return; }
      resetBall(-1);
    }

    // Cap speed
    const maxV = W * 0.018;
    const spd2 = Math.sqrt(ball.vx**2 + ball.vy**2);
    if (spd2 > maxV) {
      ball.vx = (ball.vx / spd2) * maxV;
      ball.vy = (ball.vy / spd2) * maxV;
    }

    // Update particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.05;
      p.vx *= 0.95; p.vy *= 0.95;
    });
    particles = particles.filter(p => p.life > 0);
  }

  function resetBall(dir) {
    const W = canvas.width, H = canvas.height;
    ball.x = W / 2; ball.y = H / 2;
    ball.vx = dir * W * 0.006;
    ball.vy = (Math.random() - .5) * H * 0.012;
  }

  //Game loop
  function loop() {
    if (state !== 'playing') return;
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  //Controls
  function startGame() {
    playerScore = 0; aiScore = 0;
    updateScoreDisplay();
    resetPositions();
    state = 'playing';
    overlay.style.display = 'none';
    loop();
  }

  function endGame(playerWon) {
    state = playerWon ? 'won' : 'lost';
    cancelAnimationFrame(raf);
    draw();

    const title = document.getElementById('overlay-title');
    const msg   = document.getElementById('overlay-msg');
    if (playerWon) {
      title.textContent = '🏆 You Win!';
      msg.textContent   = `Fantastic! You beat the AI ${playerScore}–${aiScore}. Play again?`;
    } else {
      title.textContent = '😅 Game Over';
      msg.textContent   = `AI wins ${aiScore}–${playerScore}. Don't give up — try again!`;
    }
    overlay.style.display = 'flex';
  }

    function pauseGame(){
    if(state === 'playing'){
      state = 'paused';
      cancelAnimationFrame(raf);

      document.getElementById('overlay-title').textContent = '⏸ Game Paused';
      document.getElementById('overlay-msg').textContent = 'Click Start Game to continue playing.';
      overlay.style.display = 'flex';
    }
    else if(state === 'paused'){
      state = 'playing';
      overlay.style.display = 'none';
      loop();
    }
  }

  function stopGame(){
    state = 'stopped';
    cancelAnimationFrame(raf);

    playerScore = 0;
    aiScore = 0;
    updateScoreDisplay();
    resetPositions();
    draw();

    document.getElementById('overlay-title').textContent = '⏹ Game Stopped';
    document.getElementById('overlay-msg').textContent = 'The game has been stopped. Click Start Game to play again.';
    overlay.style.display = 'flex';
  }

  // Expose start to buttons in HTML
  window.startGame = startGame;
  window.pauseGame = pauseGame;
  window.stopGame = stopGame;

  // Draw initial frame
  draw();
}
