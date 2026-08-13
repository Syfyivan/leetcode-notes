/**
 * @param {string} S
 * @return {string}
 */
var compressString = function(S) {
    let result = '';
    let index = 0;
    while(index < S.length) {
        let count = 1;
        if(S[index] =! S[index + 1]) {
            result += S[index] + count;
        } 
        else{
            count++;
        }
        index++;
    }
    return result;
};