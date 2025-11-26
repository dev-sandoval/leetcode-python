# ❌ LA FORMA DIFÍCIL (Sin Dummy Node)
def addTwoNumbers(l1, l2):
    head = None
    current = None
    carry = 0
    
    # ¡Pesadilla de inicialización!
    if not l1 and not l2:
        return None
    
    while l1 is not None or l2 is not None or carry != 0:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        total = val1 + val2 + carry
        
        carry = total // 10
        new_val = total % 10
        
        # ⚠️ AQUÍ ESTÁ EL DOLOR:
        # Tienes que preguntar siempre "if head is None"
        if head is None:
            if total == 0 and not l1 and not l2: # Edge case extra
                head = ListNode(0)
            else:
                head = ListNode(new_val)
            current = head
        else:
            # Más lógica condicional innecesaria
            if current.next is None:
                current.next = ListNode(new_val)
                current = current.next
            else:
                # ¿Qué pasa si...?
                pass 

        if l1: l1 = l1.next
        else: l1 = None
        
        if l2: l2 = l2.next
        else: l2 = None
        
    return head