# Análisis de Patrón: Búsqueda de Complementos con Hash Map

Este documento analiza el patrón de diseño algorítmico utilizado en `exercise_01.py` (conocido comúnmente como el problema "Two Sum").

## 1. Estructura de Datos Utilizada

-   **Hash Map (Diccionario en Python):** Se utiliza para almacenar elementos que ya hemos iterado, permitiendo búsquedas en tiempo constante $O(1)$ en promedio.
    -   _Clave (Key):_ El valor del número en el array.
    -   _Valor (Value):_ El índice donde se encuentra ese número.

## 2. Tipo de Algoritmo

-   **Iteración Única con Memoria Auxiliar (One-pass Hash Table):** El algoritmo recorre la lista una sola vez. A medida que avanza, toma decisiones basadas en la información almacenada de los elementos previos.

## 3. El Patrón: Búsqueda de Complemento (Complement Lookup)

El núcleo de este patrón no es simplemente sumar números, sino **transformar un problema de búsqueda cuadrática $O(n^2)$ en uno lineal $O(n)$ usando espacio extra**.

### ¿Cómo funciona el patrón?

En lugar de preguntar "¿Este número suma el objetivo con algún otro número en el futuro?", reformulamos la pregunta hacia el pasado:

> "¿He visto antes el número que me falta para completar el objetivo?"

La fórmula clave es:
`complemento = objetivo - actual`

### Pasos del Patrón:

1.  **Inicializar** un mapa vacío (`seen`).
2.  **Iterar** sobre la colección de elementos.
3.  **Calcular** lo que nos falta (`complemento`).
4.  **Verificar** si ese `complemento` ya existe en nuestro mapa `seen`.
    -   **Si existe:** ¡Éxito! Tenemos el elemento actual y el anterior (recuperado del mapa).
    -   **Si no existe:** Guardamos el elemento actual y su índice en el mapa para que pueda servir como complemento de un número futuro.

## 4. Cuándo aplicar este patrón

Este patrón es ideal para resolver problemas con las siguientes características:

-   **Búsqueda de Pares:** Necesitas encontrar dos elementos que cumplan una relación específica (suma, resta, producto, etc.).
-   **Arrays No Ordenados:** Si el array estuviera ordenado, podríamos usar el patrón de _Two Pointers_ (Dos Punteros), pero para datos desordenados, el Hash Map es superior.
-   **Optimización de Tiempo:** Cuando una solución de fuerza bruta implica bucles anidados ($O(n^2)$) y necesitas reducirla a $O(n)$.

### Ejemplos de problemas similares:

-   Encontrar si existen dos números cuya diferencia sea $K$.
-   Encontrar subarreglos que sumen $K$ (usando suma prefija + hash map).
-   Detectar duplicados o frecuencias de elementos.

## Resumen

-   **Problema:** Encontrar par $(a, b)$ tal que $a + b = target$.
-   **Solución Ingenua:** Para cada $a$, buscar $b$ en el resto de la lista ($O(n^2)$).
-   **Solución con Patrón:** Para cada $b$, verificar si $a$ (donde $a = target - b$) ya fue visto ($O(n)$).
