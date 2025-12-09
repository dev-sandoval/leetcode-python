// Configuración
const inputString = 'abcabcbb';
const cellSize = 60; // Debe coincidir con CSS --cell-size
const container = document.getElementById('string-container');
const windowEl = document.getElementById('window');
const pointerL = document.getElementById('pointer-l');
const pointerR = document.getElementById('pointer-r');
const mapBody = document.getElementById('map-body');
const logBox = document.getElementById('log-box');

// Elementos de Stats
const elLeft = document.getElementById('val-left');
const elRight = document.getElementById('val-right');
const elMax = document.getElementById('val-max');
const btnNext = document.getElementById('btn-next');

// Estado del algoritmo
let left = 0;
let right = -1;
let maxLen = 0;
let charMap = {}; // Diccionario para almacenar char -> index
let stepState = 'IDLE'; // IDLE, EXPANDING, COLLISION

// Inicialización
function init() {
	// Generar celdas HTML
	const cellsHTML = inputString
		.split('')
		.map(
			(char, index) => `
                <div class="cell" id="cell-${index}">
                    <span class="index-label">${index}</span>
                    ${char}
                </div>
            `
		)
		.join('');

	// Insertar celdas manteniendo la ventana y punteros
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = cellsHTML;
	while (tempDiv.firstChild) {
		container.insertBefore(tempDiv.firstChild, container.querySelector('.pointer-container'));
	}

	updateVisuals();
}

function updateVisuals() {
	// Actualizar textos
	elLeft.textContent = left;
	elRight.textContent = right;
	elMax.textContent = maxLen;

	// Mover punteros
	// Multiplicamos por cellSize + bordes(4px) aprox, para simplicidad usamos gap de 0 en css
	// Ajustamos cálculo basado en que width es 60px y border es 2px (total box model)
	// Mejor cálculo: (Index * (cellSize + 4px de borde aprox si hubiera gap))
	// Como no hay gap, es Index * (cellSize + 4).
	// Las celdas tienen border 2px -> Total width = 64px.
	const cellTotalWidth = 64;

	pointerL.style.transform = `translateX(${left * cellTotalWidth}px)`;

	if (right === -1) {
		pointerR.style.display = 'none';
		windowEl.style.width = '0px';
		windowEl.style.opacity = '0';
	} else {
		pointerR.style.display = 'flex';
		pointerR.style.transform = `translateX(${right * cellTotalWidth}px)`;

		// Actualizar Ventana
		windowEl.style.opacity = '1';
		windowEl.style.left = `${left * cellTotalWidth}px`;
		const width = (right - left + 1) * cellTotalWidth;
		windowEl.style.width = `${width}px`;
	}

	renderMap();
}

function renderMap() {
	mapBody.innerHTML = '';
	for (const [char, idx] of Object.entries(charMap)) {
		const tr = document.createElement('tr');
		tr.innerHTML = `<td>'${char}'</td><td>${idx}</td>`;
		if (char === inputString[right]) {
			tr.classList.add('highlight');
		}
		mapBody.appendChild(tr);
	}
}

function log(msg, type = 'info') {
	logBox.innerHTML = msg;
	logBox.style.borderColor =
		type === 'error'
			? 'var(--accent-red)'
			: type === 'success'
			? 'var(--accent-green)'
			: 'var(--accent-blue)';
}

function highlightCell(idx, type) {
	const cell = document.getElementById(`cell-${idx}`);
	if (cell) {
		// Remover clases previas
		cell.classList.remove('active', 'error', 'valid');
		if (type) cell.classList.add(type);
	}
}

function clearHighlights() {
	for (let i = 0; i < inputString.length; i++) {
		document.getElementById(`cell-${i}`).classList.remove('active', 'error', 'valid');
	}
}

async function nextStep() {
	btnNext.disabled = true;

	// Máquina de estados simple para la lógica paso a paso

	// Paso 1: Mover Right
	if (stepState === 'IDLE') {
		if (right + 1 >= inputString.length) {
			log('¡Algoritmo Terminado! Longitud Máxima alcanzada: ' + maxLen, 'success');
			btnNext.disabled = true;
			btnNext.textContent = 'Fin';
			return;
		}

		clearHighlights();
		right++;
		updateVisuals();
		highlightCell(right, 'active');

		const char = inputString[right];
		log(`Moviendo <b>Right</b> a índice ${right} ('${char}'). Comprobando repeticiones...`);

		stepState = 'CHECKING';
		btnNext.disabled = false;
		return;
	}

	// Paso 2: Verificar Colisión
	if (stepState === 'CHECKING') {
		const char = inputString[right];
		const prevIndex = charMap[char];

		// Condición de colisión: Existe en mapa Y su índice es >= left
		if (prevIndex !== undefined && prevIndex >= left) {
			// Colisión detectada
			log(
				`¡Colisión! '${char}' ya existe en el índice ${prevIndex} (dentro de la ventana).`,
				'error'
			);
			highlightCell(right, 'error');
			highlightCell(prevIndex, 'error'); // Resaltar el duplicado original

			stepState = 'COLLISION_RESOLVE';
		} else {
			// Sin colisión
			log(`'${char}' es único en la ventana actual. Expandiendo ventana.`, 'success');
			highlightCell(right, 'valid');

			// Actualizar Lógica
			charMap[char] = right;
			maxLen = Math.max(maxLen, right - left + 1);

			updateVisuals();
			stepState = 'IDLE'; // Volver al inicio para el siguiente char
		}
		btnNext.disabled = false;
		return;
	}

	// Paso 3: Resolver Colisión (Saltar Left)
	if (stepState === 'COLLISION_RESOLVE') {
		const char = inputString[right];
		const prevIndex = charMap[char];

		log(
			`Saltando <b>Left</b> del índice ${left} al ${
				prevIndex + 1
			} (previo + 1) para excluir la '${char}' repetida.`
		);

		// Animación lógica
		left = prevIndex + 1;

		// Actualizar mapa con la nueva posición del char actual
		charMap[char] = right;

		// Recalcular max (aunque suele crecer, hay que mantener consistencia)
		// En este paso usualmente la ventana se encoge, así que max no cambia,
		// pero actualizamos el estado visual.

		updateVisuals();
		clearHighlights();
		highlightCell(right, 'valid'); // Ahora es válido

		stepState = 'IDLE';
		btnNext.disabled = false;
		return;
	}
}

function resetViz() {
	left = 0;
	right = -1;
	maxLen = 0;
	charMap = {};
	stepState = 'IDLE';

	// Limpiar UI
	container.innerHTML =
		'<div class="sliding-window" id="window"></div><div class="pointer-container"><div class="pointer pointer-l" id="pointer-l"><span>L</span><small>Left</small><span>⬆</span></div><div class="pointer pointer-r" id="pointer-r"><span>R</span><small>Right</small><span>⬆</span></div></div>';

	// Re-vincular elementos que se borraron al limpiar container (solo window y pointers no se borran si los manejamos bien, pero innerHTML borra celdas)
	// Para simplicidad, recargamos la página o re-ejecutamos init limpiando celdas.
	// Mejor estrategia: borrar solo celdas.
	const cells = document.querySelectorAll('.cell');
	cells.forEach((c) => c.remove());

	// Reiniciar referencias globales si fueron destruidas (no lo fueron porque estan fuera del init en structure HTML fija)
	// Solo necesitamos re-generar celdas.
	init();

	logBox.textContent = 'Presiona "Siguiente Paso" para comenzar el algoritmo.';
	logBox.style.borderColor = 'var(--accent-blue)';
	btnNext.disabled = false;
	btnNext.textContent = 'Siguiente Paso ▶';
}

// Run
init();
