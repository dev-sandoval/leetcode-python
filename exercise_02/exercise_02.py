from typing import Optional


# Definición para singly-linked list (esto ya te lo da LeetCode).
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def addTwoNumbers(
        self, l1: Optional[ListNode], l2: Optional[ListNode]
    ) -> Optional[ListNode]:
        # 1. Inicializamos un nodo "tonto" (dummy) para simplificar el retorno
        dummy = ListNode(0)
        current = dummy  # Puntero para construir la nueva lista
        carry = 0  # La llevada inicial es 0

        # 2. Iteramos mientras haya nodos en l1, l2 O exista un carry pendiente
        while l1 or l2 or carry:
            # Obtenemos valores (si la lista se acabó, usamos 0)
            val1 = l1.val if l1 else 0
            val2 = l2.val if l2 else 0

            # 3. Suma total del momento
            total = val1 + val2 + carry

            # 4. Actualizamos el carry y el valor del nuevo nodo
            carry = total // 10  # División entera (ej: 15 // 10 = 1)
            new_digit = total % 10  # Módulo (ej: 15 % 10 = 5)

            # 5. Creamos el nodo y avanzamos
            current.next = ListNode(new_digit)
            current = current.next
            print(current.val)

            # Avanzamos en las listas originales si es posible
            if l1:
                l1 = l1.next
            if l2:
                l2 = l2.next

        # Retornamos el siguiente del dummy (donde empieza la suma real)
        return dummy.next


if __name__ == "__main__":
    s = Solution()

    # Helper function to create linked list from array
    def create_linked_list(arr):
        if not arr:
            return None
        head = ListNode(arr[0])
        current = head
        for val in arr[1:]:
            current.next = ListNode(val)
            current = current.next
        return head

    # Helper function to print linked list
    def print_linked_list(node):
        result = []
        while node:
            result.append(str(node.val))
            node = node.next
        return " -> ".join(result)

    # Create test linked lists
    l1 = create_linked_list([2, 4, 3])  # Represents 342
    l2 = create_linked_list([5, 6, 4])  # Represents 465

    # Add the two numbers
    result = s.addTwoNumbers(l1, l2)

    # Print the result
    print(
        "Result:", print_linked_list(result)
    )  # Should be 7 -> 0 -> 8 (represents 807)
