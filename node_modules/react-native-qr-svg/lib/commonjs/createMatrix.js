"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMatrix = createMatrix;
var _qrcode = _interopRequireDefault(require("qrcode"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function createMatrix(value, errorCorrectionLevel) {
  const arr = _qrcode.default.create(value, {
    errorCorrectionLevel: errorCorrectionLevel
  }).modules.data;
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce((rows, key, i) => {
    return (
      // TODO Fix typescript error
      //  @ts-ignore
      (i % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows
    );
  }, []);
}
//# sourceMappingURL=createMatrix.js.map