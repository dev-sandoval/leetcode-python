class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        Encuentra la longitud de la subcadena más larga sin caracteres repetidos.
        Utiliza el patrón de Ventana Deslizante (Sliding Window).
        """
        # Mapa para guardar el caracter y su último índice visto
        # Clave: Caracter, Valor: Índice
        char_index_map = {}

        left = 0
        max_length = 0

        for right in range(len(s)):
            current_char = s[right]

            # Si el caracter ya fue visto y está DENTRO de la ventana actual (>= left)
            if current_char in char_index_map and char_index_map[current_char] >= left:
                # Movemos el puntero izquierdo justo después de la ocurrencia anterior
                # Esto "cierra" la ventana vieja y empieza una nueva válida
                left = char_index_map[current_char] + 1

            # Actualizamos la posición del caracter actual (sea nuevo o repetido)
            char_index_map[current_char] = right

            # Calculamos la longitud de la ventana actual y comparamos con el máximo
            # La fórmula es (índice_derecho - índice_izquierdo + 1)
            max_length = max(max_length, right - left + 1)

        return max_length


if __name__ == "__main__":
    solution = Solution()

    # Casos de prueba
    test_cases = [
        ("abcabcbb", 3),  # "abc"
        ("bbbbb", 1),  # "b"
        ("pwwkew", 3),  # "wke"
        ("", 0),  # Vacío
        (" ", 1),  # Espacio
    ]

    print(f"{'Input':<15} | {'Expected':<8} | {'Result':<8} | {'Status'}")
    print("-" * 50)

    for s, expected in test_cases:
        result = solution.lengthOfLongestSubstring(s)
        status = "Pass" if result == expected else "Fail"
        print(
            f"'{s}'".ljust(15) + f" | {str(expected):<8} | {str(result):<8} | {status}"
        )
