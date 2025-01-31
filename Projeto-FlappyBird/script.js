let move_speed = 3, gravity = 0.5;
let bat = document.querySelector('.bat');
let img = document.getElementById('bat-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// Obtendo propriedades do morcego e do fundo
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// Sistema de Recorde (High Score)
let record_title = document.querySelector('.record_title');
let record_val = document.querySelector('.record_val');

let highScore = localStorage.getItem('highScore') || 0; // Recupera o recorde salvo
record_title.innerHTML = "Recorde: ";
record_val.innerHTML = highScore; // Exibe o recorde ao iniciar

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
        img.style.display = 'block';
        bat.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score: ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    let bat_dy = 0;
    let pipe_separation = 0;
    let pipe_gap = 35;

    function move() {
        if (game_state !== 'Play') return;

        let bat_props = bat.getBoundingClientRect();
        let pipes = document.querySelectorAll('.pipe_sprite');
        
        pipes.forEach((element) => {
            let pipe_props = element.getBoundingClientRect();
            
            if (pipe_props.right <= 0) {
                element.remove();
            } else {
                if (
                    bat_props.left < pipe_props.left + pipe_props.width &&
                    bat_props.left + bat_props.width > pipe_props.left &&
                    bat_props.top < pipe_props.top + pipe_props.height &&
                    bat_props.top + bat_props.height > pipe_props.top
                ) {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Pressione enter para reiniciar';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                } else {
                    if (pipe_props.right < bat_props.left && element.increase_score === '1') {
                        let newScore = parseInt(score_val.innerHTML) + 1;
                        score_val.innerHTML = newScore;
                        element.increase_score = '0';
                        sound_point.play();

                        // Atualiza o recorde se a pontuação atual for maior
                        if (newScore > highScore) {
                            highScore = newScore;
                            localStorage.setItem('highScore', highScore); // Salva o recorde
                            record_val.innerHTML = highScore; // Atualiza na tela
                        }
                    }
                    element.style.left = pipe_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity() {
        if (game_state !== 'Play') return;
        bat_dy += gravity;
        bat.style.top = Math.min(parseFloat(bat.style.top) + bat_dy, background.bottom - bat.clientHeight) + 'px';

        if (parseFloat(bat.style.top) <= 0 || parseFloat(bat.style.top) + bat.clientHeight >= background.bottom) {
            game_state = 'End';
            message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Pressione enter para reiniciar';
            message.classList.add('messageStyle');
            img.style.display = 'none';
            sound_die.play();
            return;
        }
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/bat-2.png';
            bat_dy = -7.6;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/bat.png';
        }
    });

    function create_pipe() {
        if (game_state !== 'Play') return;
        if (pipe_separation > 115) {
            pipe_separation = 0;
            let pipe_pos = Math.floor(Math.random() * 40) + 10;
            
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_pos - 70 + 'vh';
            pipe_top.style.left = '100vw';
            document.body.appendChild(pipe_top);
            
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_pos + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';
            document.body.appendChild(pipe_bottom);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
