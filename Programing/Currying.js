/**
 * Currying
 */

function add(a){
    return function(b){
        return function(c){
            return a + b + c;
        }
    }
}
// console.log(add(1, 2, 3)); // NaN
// console.log(add(1)(2)); // function
console.log(add(1)(2)(3)); // 6

//Es6 Currying
const sum = a => b =>c => a + b + c;
console.log(sum(1)(2)(3)); // 6