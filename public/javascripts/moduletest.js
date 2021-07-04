(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function(value, digits) {
  value = parseFloat(value);

  var REGEX_SCIENTIFIC = /(\d+\.?\d*)e\d*(\+|-)(\d+)/;
  var valueString = value.toString();
  var result = REGEX_SCIENTIFIC.exec(valueString);
  var base;
  var positiveNegative;
  var exponents;
  var precision;
  var rVal;


  // is scientific
  if(result) {
    // [ '1e+32', '1', '+', '2', index: 0, input: '1e+32' ]
    base = result[ 1 ];
    positiveNegative = result[ 2 ];
    exponents = result[ 3 ];

    if(positiveNegative === '+') {

      precision = parseInt(exponents);

      // base is a decimal
      if(base.indexOf('.') !== -1) {
        result = /(\d+\.)(\d)/.exec(base);

        // [ 2 ] == right side after decimal
        // [ 1 ] == left side before decimal
        precision -= result[ 2 ].length + result[ 1 ].length;

        rVal = base.split('.').join('') + getZeros(precision);
      } else {
        rVal = base + getZeros(precision);
      }
    } else {
      precision = base.length + parseInt(exponents) - 1;

      // if it contains a period we want to drop precision by one
      if(base.indexOf('.') !== -1) {
        precision--;
      }

      // handle a max precision
      if(digits !== undefined) {
        precision = Math.min(precision, digits);
      }

      rVal = value.toFixed(precision);

      // check if it's only 0's for instance 0.000000 then just return 0
      if(/^0\.0+$/.test(rVal)) {
        rVal = '0';
      }
    }
  } else if(!isNaN(value)) {
    if(digits) {
      rVal = value.toFixed(digits);  
    } else {
      rVal = value.toString();
    }
  } else {
    rVal = value.toString();
  }

  return rVal;
};

function getZeros(count) {
  var rVal = '';

  for(var i = 0; i < count; i++) {
    rVal += '0';
  }

  return rVal;
}
},{}],2:[function(require,module,exports){
var scientificToDecimal = require('../../node_modules/scientific-to-decimal/index.js');

console.log(scientificToDecimal("0x0B4dc07E87b1966Be5898898F094bF778707d99F"));
},{"../../node_modules/scientific-to-decimal/index.js":1}]},{},[2]);
