# **Análisis de Patrón: Ventana Deslizante (Sliding Window)**

Este documento analiza el patrón de diseño algorítmico utilizado en exercise_03.py para resolver el problema "Longest Substring Without Repeating Characters".

## **1\. Estructura de Datos Utilizada**

-   **Hash Map (Diccionario):** Se utiliza para almacenar el "rastro" de los caracteres procesados.
    -   _Clave (Key):_ El carácter encontrado.
    -   _Valor (Value):_ El **último índice** donde se vio ese carácter.
-   **Punteros (Indices):** Dos variables enteras (left, right) que delimitan los bordes de la ventana actual.

## **2\. Tipo de Algoritmo**

-   **Ventana Deslizante Dinámica (Dynamic Sliding Window):** A diferencia de una ventana fija, el tamaño de esta ventana cambia (se expande y contrae) según las condiciones de los datos (encontrar duplicados).

## **3\. El Patrón: Expansión y Contracción**

El objetivo es convertir una solución de fuerza bruta $O(N^2)$ en una solución lineal $O(N)$ evitando re-escanear partes de la cadena que ya sabemos que son válidas.

### **¿Cómo funciona el patrón?**

Imagina una caja rectangular elástica sobre la cadena:

1. **Expansión (right):** La ventana crece hacia la derecha paso a paso, incluyendo nuevos caracteres.
2. **Verificación:** Antes de añadir, consultamos al Hash Map: "¿He visto este carácter antes y está dentro de mi caja actual?".
3. **Salto Inteligente (left):** Si encontramos un duplicado válido, en lugar de avanzar left de uno en uno, lo **saltamos** directamente a la posición índice_anterior \+ 1\. Esto descarta inmediatamente la parte "rota" de la subcadena.

### **Ejemplo Visual: s \= "abcabcbb"**

Cuando right llega a la segunda 'a' (índice 3):

-   La ventana era "abc" (left=0).
-   Detectamos que 'a' ya existe en índice 0\.
-   **Acción:** left salta de 0 a 1\.
-   Nueva ventana lógica: "bca".

## **4\. Cuándo aplicar este patrón**

Este patrón es ideal para resolver problemas con las siguientes características:

-   **Tipo de dato:** Te dan un arreglo (array), lista o cadena (string).
-   **Objetivo:** Te piden encontrar una **subcadena, subarreglo o subsecuencia contigua**.
-   **Criterio:** Buscas el "más largo", "más corto", "mínimo" o "máximo" (problemas de optimización en rangos).

### **Ejemplos de problemas similares:**

-   _Maximum Average Subarray I_
-   _Minimum Size Subarray Sum_
-   _Longest Substring with At Most Two Distinct Characters_
-   _Permutation in String_

## **5\. Análisis de Complejidad**

-   **Temporal:** $O(N)$. Cada carácter es visitado por el puntero right una sola vez y el puntero left nunca retrocede.
-   **Espacial:** $O(min(N, M))$ donde $N$ es la longitud del string y $M$ el tamaño del alfabeto (ej. 26 letras).
