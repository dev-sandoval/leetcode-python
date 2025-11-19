def twoSum(nums, target):
    n = len(nums)

    # ❌ Bucle 1: Recorre cada número
    for i in range(n):

        # ❌ Bucle 2: Recorre el resto (ANIDADO)
        for j in range(i + 1, n):

            # Esto genera complejidad O(n²) 🐌
            if nums[i] + nums[j] == target:
                return [i, j]

    return []
