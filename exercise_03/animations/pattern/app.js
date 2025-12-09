/**
 * SLIDING WINDOW VISUALIZATION
 * * Lógica:
 * 1. Array infinito (circular o generado proceduralmente).
 * 2. Estado 'Expandir': Mueve rightIndex hacia adelante.
 * 3. Estado 'Validar': Chequea una condición simulada (ej. suma máxima o longitud aleatoria).
 * 4. Estado 'Contraer': Si la condición falla, mueve leftIndex hacia adelante.
 */

const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let frames = 0;

// Configuración
const CONFIG = {
	blockSize: 60,
	blockGap: 10,
	yPos: 0, // Se calculará en resize
	speed: 0.08, // Velocidad de interpolación visual
	colorValid: '#00ffaa', // Verde neón
	colorInvalid: '#ffaa00', // Naranja advertencia
	bgBlock: '#1a1a1a',
	activeBlock: '#2a2a2a',
};

// Estado de la simulación
const state = {
	blocks: [],
	leftIndex: 0,
	rightIndex: 0,

	// Posiciones visuales (float) para animación suave
	visualLeft: 0,
	visualRight: 0,

	// Lógica
	mode: 'EXPAND', // 'EXPAND' o 'CONTRACT'
	waitTimer: 0,
	limit: 0, // Límite simulado para la ventana actual
	currentSum: 0,
};

// Partículas de texto flotante
let particles = [];

class Block {
	constructor(index, val) {
		this.index = index;
		this.value = val; // Valor numérico para simular "peso"
		this.height = 40 + Math.random() * 60; // Altura estética variada
	}
}

class TextParticle {
	constructor(x, y, text, color) {
		this.x = x;
		this.y = y;
		this.text = text;
		this.color = color;
		this.life = 1.0;
		this.vy = -1.5; // Flota hacia arriba
	}

	update() {
		this.y += this.vy;
		this.life -= 0.02;
	}

	draw(ctx) {
		ctx.globalAlpha = Math.max(0, this.life);
		ctx.fillStyle = this.color;
		ctx.font = 'bold 14px monospace';
		ctx.fillText(this.text, this.x, this.y);
		ctx.globalAlpha = 1.0;
	}
}

function init() {
	resize();
	// Generar bloques iniciales (suficientes para el loop)
	for (let i = 0; i < 100; i++) {
		state.blocks.push(new Block(i, Math.floor(Math.random() * 10) + 1));
	}

	// Configuración inicial aleatoria
	state.limit = 15 + Math.random() * 20;
}

function resize() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	CONFIG.yPos = height / 2;
}

window.addEventListener('resize', resize);

// --- Lógica del Bucle ---

function logicStep() {
	// Si estamos esperando (pausa dramática)
	if (state.waitTimer > 0) {
		state.waitTimer--;
		return;
	}

	// Calcular la "suma" actual dentro de la ventana lógica
	let currentWindowSum = 0;
	for (let i = state.leftIndex; i <= state.rightIndex; i++) {
		if (state.blocks[i]) currentWindowSum += state.blocks[i].value;
	}

	// Máquina de estados simple
	if (state.mode === 'EXPAND') {
		// Condición de parada de expansión:
		// Hemos excedido el límite simulado o hemos crecido mucho aleatoriamente
		if (currentWindowSum > state.limit) {
			// ¡Condición rota! Cambiar a contraer
			state.mode = 'CONTRACT';
			state.waitTimer = 20; // Pausa para que el usuario vea el error

			// Efecto visual
			addParticle(state.visualRight, 'Limit Exceeded!', CONFIG.colorInvalid);
		} else {
			// Seguir expandiendo
			state.rightIndex++;
			addParticle(state.rightIndex, 'Right++ (Expand)', CONFIG.colorValid);
			state.waitTimer = 10; // Pequeña pausa entre pasos
		}
	} else if (state.mode === 'CONTRACT') {
		// Condición de parada de contracción:
		// Hemos vuelto a estar por debajo del límite
		if (currentWindowSum <= state.limit) {
			// ¡Condición restaurada! Volver a expandir
			state.mode = 'EXPAND';
			state.limit = 15 + Math.random() * 20; // Nuevo límite aleatorio para la siguiente fase
			state.waitTimer = 10;

			addParticle(state.visualLeft, 'Valid State', CONFIG.colorValid);
		} else {
			// Seguir contrayendo
			state.leftIndex++;
			addParticle(state.leftIndex, 'Left++ (Shrink)', CONFIG.colorInvalid);
			state.waitTimer = 15; // Un poco más lento al contraer para énfasis
		}
	}

	// Generar más bloques si nos acercamos al final
	if (state.rightIndex > state.blocks.length - 20) {
		for (let i = 0; i < 20; i++) {
			let idx = state.blocks.length;
			state.blocks.push(new Block(idx, Math.floor(Math.random() * 10) + 1));
		}
	}
}

function addParticle(blockIndex, text, color) {
	// Convertir índice de bloque a posición X aproximada (relativa al scroll)
	// Se calcula mejor en el draw, pero aquí estimamos para crear el objeto
	// La posición X real se calcula dinámicamente en el render
	// Usamos un valor temporal, el render lo ajustará si queremos pegarlo al bloque,
	// pero para simplicidad usaremos la posición visual actual en lógica

	// Mejor enfoque: La partícula guarda el índice lógico y calcula su X al dibujarse
	// Para simplificar este script, calcularemos X basado en el offset de cámara actual
	const blockW = CONFIG.blockSize + CONFIG.blockGap;
	const x = blockIndex * blockW;
	particles.push(new TextParticle(x, CONFIG.yPos - 60, text, color));
}

// --- Renderizado ---

function draw() {
	// 1. Lógica de animación suave (Interpolación)
	// Lerp (Linear Interpolation) para que los bordes visuales persigan a los índices lógicos
	state.visualLeft += (state.leftIndex - state.visualLeft) * CONFIG.speed;
	state.visualRight += (state.rightIndex - state.visualRight) * CONFIG.speed;

	// 2. Cámara / Scroll
	// Mantenemos la ventana centrada en la pantalla
	const blockFullWidth = CONFIG.blockSize + CONFIG.blockGap;
	const centerOfWindow = (state.visualLeft + state.visualRight) / 2;
	const cameraX = centerOfWindow * blockFullWidth - width / 2;

	// Limpiar fondo
	ctx.fillStyle = '#0d0d0d';
	ctx.fillRect(0, 0, width, height);

	// Dibujar rejilla de fondo (efecto tech)
	ctx.strokeStyle = '#1a1a1a';
	ctx.lineWidth = 1;
	ctx.beginPath();
	for (let i = 0; i < width; i += 40) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, height);
	}
	for (let i = 0; i < height; i += 40) {
		ctx.moveTo(0, i);
		ctx.lineTo(width, i);
	}
	ctx.stroke();

	ctx.save();
	// Aplicar transformación de cámara
	ctx.translate(-cameraX, 0);

	// 3. Dibujar Bloques
	// Optimizacion: Solo dibujar los visibles
	const startRender = Math.floor(cameraX / blockFullWidth) - 2;
	const endRender = Math.floor((cameraX + width) / blockFullWidth) + 2;

	for (let i = Math.max(0, startRender); i < Math.min(state.blocks.length, endRender); i++) {
		const blk = state.blocks[i];
		const x = i * blockFullWidth;
		const y = CONFIG.yPos - blk.height / 2;

		// Determinar si está dentro de la ventana activa (visualmente)
		// Usamos una tolerancia suave
		const isInside = i >= state.visualLeft - 0.1 && i <= state.visualRight + 0.1;

		ctx.fillStyle = isInside ? CONFIG.activeBlock : CONFIG.bgBlock;

		// Dibujar bloque
		ctx.fillRect(x, y, CONFIG.blockSize, blk.height);

		// Texto de valor dentro del bloque
		ctx.fillStyle = isInside ? '#fff' : '#444';
		ctx.font = '12px monospace';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(blk.value, x + CONFIG.blockSize / 2, CONFIG.yPos);

		// Índice pequeño abajo
		ctx.fillStyle = '#333';
		ctx.font = '10px monospace';
		ctx.fillText(i, x + CONFIG.blockSize / 2, CONFIG.yPos + 40);
	}

	// 4. Dibujar la Ventana Deslizante (Overlay)
	const winX = state.visualLeft * blockFullWidth;
	const winW = (state.visualRight - state.visualLeft) * blockFullWidth + CONFIG.blockSize; // +blockSize para cubrir el último
	const winY = CONFIG.yPos - 50;
	const winH = 100;

	// Color basado en el estado
	const mainColor = state.mode === 'CONTRACT' ? CONFIG.colorInvalid : CONFIG.colorValid;

	// Brillo / Glow
	ctx.shadowBlur = 20;
	ctx.shadowColor = mainColor;
	ctx.strokeStyle = mainColor;
	ctx.lineWidth = 3;

	// Rectángulo de la ventana
	ctx.strokeRect(winX - 5, winY, winW + 10, winH);

	// Fondo semitransparente de la ventana
	ctx.fillStyle = mainColor;
	ctx.globalAlpha = 0.1;
	ctx.fillRect(winX - 5, winY, winW + 10, winH);
	ctx.globalAlpha = 1.0;
	ctx.shadowBlur = 0;

	// Etiquetas en los bordes de la ventana
	ctx.fillStyle = mainColor;
	ctx.font = 'bold 12px monospace';

	// Etiqueta 'L'
	ctx.fillText('L', winX - 5, winY - 10);
	// Etiqueta 'R'
	ctx.fillText('R', winX + winW + 5, winY - 10);

	// Dibujar Partículas
	for (let p of particles) {
		// Ajustamos la posición X de la partícula al mundo real
		// (ya que las creamos con coordenadas absolutas en lógica, aquí funcionan bien con el translate)
		p.update();
		p.draw(ctx);
	}
	// Limpiar partículas muertas
	particles = particles.filter((p) => p.life > 0);

	ctx.restore();

	// Loop logic (controlado por tiempo para no ir super rápido)
	if (frames % 5 === 0) {
		// Velocidad de la lógica
		logicStep();
	}

	frames++;
	requestAnimationFrame(draw);
}

// Iniciar
init();
draw();
