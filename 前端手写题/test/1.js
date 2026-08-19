/*
*数组打平，数组可以嵌套任意深层，不可以用标准库的 flat 方法
Input [[1, 2, [3], []], 4]
Output [1, 2, 3, 4]
 */


const flatArray = (input) => {
    const res = [];
    const flat = (nums) => {
        if(typeof nums !== 'object' && nums !== null) {
        res.push(nums);
    }
     
    for(const item of input) {
        // res.push(...flatArray(item, res));
        flat(item);
    }
    }
    
    return res;
}

console.log([[1, 2, [3], []], 4])