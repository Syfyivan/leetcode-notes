// /*
// *数组打平，数组可以嵌套任意深层，不可以用标准库的 flat 方法
// Input [[1, 2, [3], []], 4]
// Output [1, 2, 3, 4]
//  */


// const flatArray = (input) => {
//     const res = [];
//     const flat = (nums) => {
//         if(typeof nums !== 'object' && nums !== null) {
//             res.push(nums);
//             return;
//         }
//     for(const item of nums) {
//         // res.push(...flatArray(item, res));
//         flat(item);
//         }
//     }
//     flat(input);
//     return res;
// }

// console.log(flatArray([[1, 2, [3], []], 4]))

// const count = (n) => {
//     if(n === 0 || n === 1) {
//         return 1;
//     }

//     // for(let i = 2; i <= n; i++) {
//     //     dp[i] = dp[i - 1] + dp[i - 2];


//     // }
//     return count(n - 1) + count(n - 2)
    
// }
// console.log(count(100))