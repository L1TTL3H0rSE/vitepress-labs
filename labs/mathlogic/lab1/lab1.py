class Solution:
    def sortByBits(self, arr: List[int]) -> List[int]:
        sorted_arr = sorted(arr)
        bits = []
        for n in sorted_arr:
            local = float(n)
            ones = 0
            while local != 0:
                one = abs(local % 2)
                ones += one
                if one == 1:
                    local = local - 1
                local = local / 2
            bits.append(int(ones))
        sorted_by_bits = []
        for i in range(len(sorted_arr)):
            sorted_by_bits.append({ 'e': sorted_arr[i], 'bits': bits[i] })
        sorted_by_bits.sort(key=lambda x: x['bits'])
        return [item['e'] for item in sorted_by_bits]