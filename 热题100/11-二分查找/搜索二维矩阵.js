/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    let m = matrix.length
    let left = 0; 
    let n = matrix[0].length;
    let right = m * n - 1;
    
    while(left <= right) {
        const mid = Math.floor((left + right ) / 2);
        const val = matrix[Math.floor(mid / n)][mid % n]
        if(val === target) return true;
        else if(val < target)  left = mid + 1;
        else right = mid - 1;
    }
    return false;
};