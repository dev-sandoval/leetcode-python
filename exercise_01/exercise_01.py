class Solution(object):
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        seen = {}

        for index, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], index]
            seen[num] = index


nums = [2, 7, 11, 15]
target = 9
s = Solution()

print("Input: nums = {}, target = {}".format(nums, target))
print("Output:", s.twoSum(nums, target))
