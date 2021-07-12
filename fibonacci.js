var fibonacci = require('bindings')('fibonacciModule');

for(let i = 0; i < 10; i++)
    console.log(fibonacci.Get())