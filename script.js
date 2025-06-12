// --- SCRIPT PARA ANIMAÇÃO DE PARTÍCULAS (V4.5) ---
const canvas = document.getElementById('abertura-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let shootingStarsArray = [];
let mouse = { x: null, y: null };

document.addEventListener('DOMContentLoaded', function() {
    iniciarContadorTempo();
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Classe para estrelas normais (cintilantes)
class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseX = this.x; // Posição original para o efeito parallax
        this.baseY = this.y;
        this.density = (Math.random() * 50) + 20; // Quão sensível a partícula é ao mouse (profundidade)
        this.twinkleSpeed = Math.random() * 0.05 + 0.02; // Velocidade da cintilação
        this.twinkleValue = Math.random() * Math.PI * 2; // Ponto inicial na onda senoidal
        this.opacity = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(225, 172, 172, ${this.opacity})`; // Cor-primaria com opacidade dinâmica
        ctx.fill();
    }
    update() {
        // Efeito Parallax: move a partícula com base na posição do mouse
        if (mouse.x !== null) {
            let mouseOffsetX = (mouse.x - canvas.width / 2);
            let mouseOffsetY = (mouse.y - canvas.height / 2);
            // A partícula se move da sua posição base na direção oposta ao mouse
            this.x = this.baseX - (mouseOffsetX / this.density);
            this.y = this.baseY - (mouseOffsetY / this.density);
        }

        // Efeito de Cintilação (Twinkle)
        this.twinkleValue += this.twinkleSpeed;
        // Usa uma onda senoidal para uma transição suave de opacidade
        this.opacity = Math.abs(Math.sin(this.twinkleValue)) * 0.8 + 0.1; 

        this.draw();
    }
}

// Classe para estrelas cadentes
class ShootingStar {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.len = (Math.random() * 80) + 10;
        this.speed = (Math.random() * 10) + 6;
        this.size = (Math.random() * 1) + 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.velX = Math.cos(this.angle) * this.speed;
        this.velY = Math.sin(this.angle) * this.speed;
        this.life = 100; // Tempo de vida
        this.opacity = 1;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.velX * (this.len / this.speed), this.y - this.velY * (this.len / this.speed));
        ctx.lineWidth = this.size;
        ctx.strokeStyle = `rgba(253, 224, 71, ${this.opacity})`; // Cor-destaque
        ctx.stroke();
    }
    update() {
        this.x += this.velX;
        this.y += this.velY;
        this.life--;
        this.opacity *= 0.98; // Fade out

        if(this.life < 0) {
            this.reset();
        }
        this.draw();
    }
}


function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 8000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y, size));
    }
    
    shootingStarsArray = [];
    for(let i = 0; i < 3; i++) { // Número de estrelas cadentes simultâneas
         shootingStarsArray.push(new ShootingStar());
    }
}

function animate() {
    // Desenha o fundo
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha as estrelas normais
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    // Desenha as estrelas cadentes
    for(let i = 0; i < shootingStarsArray.length; i++) {
        shootingStarsArray[i].update();
    }
    
    requestAnimationFrame(animate);
}

init();
animate();

// Recalcula as partículas se a janela for redimensionada
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// --- SCRIPT PARA OBSERVAR ANIMAÇÕES DA TIMELINE ---
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
    observer.observe(item);
});

// --- SCRIPT DO CARROSSEL (SWIPER) ---
var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    loop: true,
});

function iniciarContadorTempo() {
    // !!! IMPORTANTE: Defina a data de início do namoro aqui !!!
    // Formato: 'ANO-MÊS-DIATHORA:MINUTO:SEGUNDO' (ex: '2023-01-15T10:00:00')
    const dataInicioNamoro = new Date('2022-11-10T14:00:00').getTime(); // Substitua pela data correta!

    const spanDias = document.getElementById('dias');
    const spanHoras = document.getElementById('horas');
    const spanMinutos = document.getElementById('minutos');
    const spanSegundos = document.getElementById('segundos');
    const textoContandoDesde = document.querySelector('.contador-tempo + p > small');

    if (!spanDias || !spanHoras || !spanMinutos || !spanSegundos) {
        console.error("Elementos do contador não encontrados. Verifique os IDs no HTML.");
        return;
    }

    // Atualiza o texto "Contando desde..."
    if (textoContandoDesde) {
        const dataFormatada = new Date(dataInicioNamoro).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        textoContandoDesde.textContent = `Contando desde ${dataFormatada}`;
    }


    function atualizarContador() {
        const agora = new Date().getTime();
        const diferenca = agora - dataInicioNamoro;

        if (diferenca < 0) {
            // Se a data de início for no futuro, pode mostrar 0 ou uma mensagem
            spanDias.textContent = '00';
            spanHoras.textContent = '00';
            spanMinutos.textContent = '00';
            spanSegundos.textContent = '00';
            // clearInterval(intervalo); // Opcional: parar o contador se a data for futura
            return;
        }

        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        spanDias.textContent = String(dias).padStart(2, '0');
        spanHoras.textContent = String(horas).padStart(2, '0');
        spanMinutos.textContent = String(minutos).padStart(2, '0');
        spanSegundos.textContent = String(segundos).padStart(2, '0');
    }

    atualizarContador(); // Chama uma vez para não esperar 1 segundo para mostrar
    const intervalo = setInterval(atualizarContador, 1000); // Atualiza a cada segundo
}

// --- SCRIPT DO MODAL ---
const modal = document.getElementById('motivo-modal');
const modalText = document.getElementById('modal-text');
const closeButton = document.querySelector('.close-button');
const motivos = document.querySelectorAll('.motivo');

motivos.forEach(motivo => {
    motivo.addEventListener('click', () => {
        modalText.textContent = motivo.getAttribute('data-text');
        modal.style.display = 'flex';
    });
});

function closeModal() {
    modal.style.display = 'none';
}

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', e => (e.target == modal ? closeModal() : ''));
window.addEventListener('keydown', e => (e.key === 'Escape' ? closeModal() : ''));


