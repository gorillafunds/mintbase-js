"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryFetch = retryFetch;

var _retry = _interopRequireDefault(require("retry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function retryFetch(_x, _x2, _x3) {
  return _retryFetch.apply(this, arguments);
}

function _retryFetch() {
  _retryFetch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, fetchOptions, retryOptions) {
    var operation;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            operation = _retry["default"].operation(retryOptions);
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              operation.attempt(function () {
                fetch(url, fetchOptions).then( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            resolve(data);

                          case 1:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x4) {
                    return _ref.apply(this, arguments);
                  };
                }())["catch"](function (error) {
                  if (operation.retry(error)) reject(error);
                });
              });
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _retryFetch.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9yZXRyeUZldGNoLnRzIl0sIm5hbWVzIjpbInJldHJ5RmV0Y2giLCJ1cmwiLCJmZXRjaE9wdGlvbnMiLCJyZXRyeU9wdGlvbnMiLCJvcGVyYXRpb24iLCJyZXRyeSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXR0ZW1wdCIsImZldGNoIiwidGhlbiIsImRhdGEiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7OztTQUVzQkEsVTs7Ozs7d0VBQWYsa0JBQ0xDLEdBREssRUFFTEMsWUFGSyxFQUdMQyxZQUhLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtDQyxZQUFBQSxTQUxELEdBS2FDLGtCQUFNRCxTQUFOLENBQWdCRCxZQUFoQixDQUxiO0FBQUEsOENBT0UsSUFBSUcsT0FBSixDQUFzQixVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDaERKLGNBQUFBLFNBQVMsQ0FBQ0ssT0FBVixDQUFrQixZQUFNO0FBQ3RCQyxnQkFBQUEsS0FBSyxDQUFDVCxHQUFELEVBQU1DLFlBQU4sQ0FBTCxDQUNHUyxJQURIO0FBQUEscUZBQ1EsaUJBQU9DLElBQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNKTCw0QkFBQUEsT0FBTyxDQUFDSyxJQUFELENBQVA7O0FBREk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBRFI7O0FBQUE7QUFBQTtBQUFBO0FBQUEsOEJBSVMsVUFBQ0MsS0FBRCxFQUFXO0FBQ2hCLHNCQUFJVCxTQUFTLENBQUNDLEtBQVYsQ0FBZ0JRLEtBQWhCLENBQUosRUFBNEJMLE1BQU0sQ0FBQ0ssS0FBRCxDQUFOO0FBQzdCLGlCQU5IO0FBT0QsZUFSRDtBQVNELGFBVk0sQ0FQRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJldHJ5IGZyb20gJ3JldHJ5J1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmV0cnlGZXRjaChcbiAgdXJsOiBzdHJpbmcsXG4gIGZldGNoT3B0aW9ucz86IFJlcXVlc3RJbml0LFxuICByZXRyeU9wdGlvbnM/OiByZXRyeS5PcGVyYXRpb25PcHRpb25zXG4pIHtcbiAgY29uc3Qgb3BlcmF0aW9uID0gcmV0cnkub3BlcmF0aW9uKHJldHJ5T3B0aW9ucylcblxuICByZXR1cm4gbmV3IFByb21pc2U8UmVzcG9uc2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBvcGVyYXRpb24uYXR0ZW1wdCgoKSA9PiB7XG4gICAgICBmZXRjaCh1cmwsIGZldGNoT3B0aW9ucylcbiAgICAgICAgLnRoZW4oYXN5bmMgKGRhdGEpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICBpZiAob3BlcmF0aW9uLnJldHJ5KGVycm9yKSkgcmVqZWN0KGVycm9yKVxuICAgICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG4iXX0=