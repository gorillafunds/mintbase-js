"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = void 0;

require("isomorphic-unfetch");

var _app = _interopRequireDefault(require("firebase/app"));

require("firebase/storage");

var _browserOrNode = require("browser-or-node");

var _uuid = require("uuid");

var _constants = require("../constants");

var _responseBuilder = require("./responseBuilder");

var _retryFetch = require("./retryFetch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FIREBASE_MJS_ID = 'FIREBASE_MJS_ID';
var ARWEAVE_FOLDER = 'arweave';
var headers = {
  apiKey: 'api-key'
};

var Storage = /*#__PURE__*/function () {
  function Storage() {
    var storageConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Storage);

    _defineProperty(this, "firebase", void 0);

    _defineProperty(this, "storage", void 0);

    _defineProperty(this, "apiKey", void 0);

    _defineProperty(this, "constants", void 0);

    this.constants = storageConfig.constants || {};
    this.apiKey = storageConfig.apiKey || 'anonymous';

    var mintbaseJSFirebase = _app["default"].apps.find(function (_ref) {
      var name = _ref.name;
      return name === FIREBASE_MJS_ID;
    });

    this.firebase = mintbaseJSFirebase !== null && mintbaseJSFirebase !== void 0 ? mintbaseJSFirebase : _app["default"].initializeApp(this.constants.CLOUD_STORAGE_CONFIG || _constants.CLOUD_STORAGE_CONFIG, FIREBASE_MJS_ID);
    this.storage = this.firebase.storage();
  }
  /**
   * Uploads metadata to Arweave via a cloud function
   * @param metadata metadata object
   * @returns arweave content identifier
   */


  _createClass(Storage, [{
    key: "uploadMetadata",
    value: function () {
      var _uploadMetadata = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(metadata) {
        var request, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return (0, _retryFetch.retryFetch)("".concat(_constants.CLOUD_URI, "/arweave/metadata/"), {
                  method: 'POST',
                  body: JSON.stringify(metadata),
                  headers: _defineProperty({}, headers.apiKey, this.apiKey || 'anonymous')
                });

              case 3:
                request = _context.sent;
                _context.next = 6;
                return request.json();

              case 6:
                data = _context.sent;
                return _context.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.uploadMetadata
                }));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 10]]);
      }));

      function uploadMetadata(_x) {
        return _uploadMetadata.apply(this, arguments);
      }

      return uploadMetadata;
    }()
    /**
     * Upload file to Arweave via a cloud function
     * @param file the file to upload
     * @returns retunrns an object containing the arweave content identifier and the content type.
     */

  }, {
    key: "uploadToArweave",
    value: function () {
      var _uploadToArweave = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(file) {
        var buffer, contentType, _yield$this$uploadClo, fileName, error, request, _yield$request$json, id, _contentType, data;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!_browserOrNode.isNode) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Node environment does not yet supports uploads.'
                }));

              case 2:
                _context2.next = 4;
                return file.arrayBuffer();

              case 4:
                buffer = _context2.sent;
                contentType = file.type;
                _context2.prev = 6;
                _context2.next = 9;
                return this.uploadCloud(buffer, contentType);

              case 9:
                _yield$this$uploadClo = _context2.sent;
                fileName = _yield$this$uploadClo.data;
                error = _yield$this$uploadClo.error;

                if (!error) {
                  _context2.next = 14;
                  break;
                }

                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: error
                }));

              case 14:
                _context2.prev = 14;
                _context2.next = 17;
                return (0, _retryFetch.retryFetch)("".concat(_constants.CLOUD_URI, "/arweave/file/").concat(fileName), {
                  headers: _defineProperty({}, headers.apiKey, this.apiKey || 'anonymous')
                });

              case 17:
                request = _context2.sent;
                _context2.next = 20;
                return request.json();

              case 20:
                _yield$request$json = _context2.sent;
                id = _yield$request$json.id;
                _contentType = _yield$request$json.contentType;
                data = {
                  id: id,
                  contentType: _contentType
                };

                if (!(!id || !_contentType)) {
                  _context2.next = 26;
                  break;
                }

                throw new Error(_constants.ERROR_MESSAGES.decentralizedStorageFailed);

              case 26:
                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 29:
                _context2.prev = 29;
                _context2.t0 = _context2["catch"](14);
                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.decentralizedStorageFailed
                }));

              case 32:
                _context2.next = 37;
                break;

              case 34:
                _context2.prev = 34;
                _context2.t1 = _context2["catch"](6);
                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _context2.t1.message
                }));

              case 37:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[6, 34], [14, 29]]);
      }));

      function uploadToArweave(_x2) {
        return _uploadToArweave.apply(this, arguments);
      }

      return uploadToArweave;
    }()
    /**
     * Uploads raw binary data to the cloud. This method is useful because
     * we can trigger an arweave upload via an http request with the returned file name.
     * @param buffer the raw binary data of the file to upload
     * @param contentType the content type
     * @returns the filename
     */

  }, {
    key: "uploadCloud",
    value: function () {
      var _uploadCloud = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(buffer, contentType) {
        var fileName;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!_browserOrNode.isNode) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Node environment does not yet supports uploads.'
                }));

              case 2:
                _context3.prev = 2;
                fileName = (0, _uuid.v4)();

                if (this.storage) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Storage is not initialized'
                }));

              case 6:
                _context3.next = 8;
                return this.storage.ref("".concat(ARWEAVE_FOLDER, "/").concat(fileName)).put(buffer, {
                  contentType: contentType
                });

              case 8:
                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: fileName
                }));

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](2);
                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.uploadCloud
                }));

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 11]]);
      }));

      function uploadCloud(_x3, _x4) {
        return _uploadCloud.apply(this, arguments);
      }

      return uploadCloud;
    }()
  }]);

  return Storage;
}();

exports.Storage = Storage;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zdG9yYWdlLnRzIl0sIm5hbWVzIjpbIkZJUkVCQVNFX01KU19JRCIsIkFSV0VBVkVfRk9MREVSIiwiaGVhZGVycyIsImFwaUtleSIsIlN0b3JhZ2UiLCJzdG9yYWdlQ29uZmlnIiwiY29uc3RhbnRzIiwibWludGJhc2VKU0ZpcmViYXNlIiwiZmlyZWJhc2UiLCJhcHBzIiwiZmluZCIsIm5hbWUiLCJpbml0aWFsaXplQXBwIiwiQ0xPVURfU1RPUkFHRV9DT05GSUciLCJzdG9yYWdlIiwibWV0YWRhdGEiLCJDTE9VRF9VUkkiLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlcXVlc3QiLCJqc29uIiwiZGF0YSIsImVycm9yIiwiRVJST1JfTUVTU0FHRVMiLCJ1cGxvYWRNZXRhZGF0YSIsImZpbGUiLCJpc05vZGUiLCJhcnJheUJ1ZmZlciIsImJ1ZmZlciIsImNvbnRlbnRUeXBlIiwidHlwZSIsInVwbG9hZENsb3VkIiwiZmlsZU5hbWUiLCJpZCIsIkVycm9yIiwiZGVjZW50cmFsaXplZFN0b3JhZ2VGYWlsZWQiLCJtZXNzYWdlIiwicmVmIiwicHV0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxlQUFlLEdBQUcsaUJBQXhCO0FBQ0EsSUFBTUMsY0FBYyxHQUFHLFNBQXZCO0FBQ0EsSUFBTUMsT0FBTyxHQUFHO0FBQ2RDLEVBQUFBLE1BQU0sRUFBRTtBQURNLENBQWhCOztJQVNhQyxPO0FBUVgscUJBQW9EO0FBQUEsUUFBeENDLGFBQXdDLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ2xELFNBQUtDLFNBQUwsR0FBaUJELGFBQWEsQ0FBQ0MsU0FBZCxJQUEyQixFQUE1QztBQUNBLFNBQUtILE1BQUwsR0FBY0UsYUFBYSxDQUFDRixNQUFkLElBQXdCLFdB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QUFmLENBbEJYOztBQUFBO0FBQUE7QUFBQTtBQUFBLGtEQW9CVyxxQ0FBZTtBQUFFVixrQkFBQUEsS0FBSyxFQUFFQywwQkFBZVE7QUFBeEIsaUJBQWYsQ0FwQlg7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnaXNvbW9ycGhpYy11bmZldGNoJ1xuaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlL2FwcCdcbmltcG9ydCAnZmlyZWJhc2Uvc3RvcmFnZSdcbmltcG9ydCB7IGlzTm9kZSB9IGZyb20gJ2Jyb3dzZXItb3Itbm9kZSdcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnXG5pbXBvcnQgeyBDTE9VRF9VUkksIENMT1VEX1NUT1JBR0VfQ09ORklHLCBFUlJPUl9NRVNTQUdFUyB9IGZyb20gJy4uL2NvbnN0YW50cydcbmltcG9ydCB7IENvbnN0YW50cyB9IGZyb20gJ3NyYy90eXBlcydcbmltcG9ydCB7IGZvcm1hdFJlc3BvbnNlLCBSZXNwb25zZURhdGEgfSBmcm9tICcuL3Jlc3BvbnNlQnVpbGRlcidcbmltcG9ydCB7IHJldHJ5RmV0Y2ggfSBmcm9tICcuL3JldHJ5RmV0Y2gnXG5cbmNvbnN0IEZJUkVCQVNFX01KU19JRCA9ICdGSVJFQkFTRV9NSlNfSUQnXG5jb25zdCBBUldFQVZFX0ZPTERFUiA9ICdhcndlYXZlJ1xuY29uc3QgaGVhZGVycyA9IHtcbiAgYXBpS2V5OiAnYXBpLWtleScsXG59XG5cbmludGVyZmFjZSBTdG9yYWdlQ29uZmlnUHJvcHMge1xuICBhcGlLZXk/OiBzdHJpbmdcbiAgY29uc3RhbnRzPzogQ29uc3RhbnRzXG59XG5cbmV4cG9ydCBjbGFzcyBTdG9yYWdlIHtcbiAgcHVibGljIGZpcmViYXNlOiBmaXJlYmFzZS5hcHAuQXBwIHwgdW5kZWZpbmVkXG4gIHB1YmxpYyBzdG9yYWdlOiBmaXJlYmFzZS5zdG9yYWdlLlN0b3JhZ2UgfCB1bmRlZmluZWRcblxuICBwdWJsaWMgYXBpS2V5OiBzdHJpbmdcblxuICBwdWJsaWMgY29uc3RhbnRzOiBDb25zdGFudHNcblxuICBjb25zdHJ1Y3RvcihzdG9yYWdlQ29uZmlnOiBTdG9yYWdlQ29uZmlnUHJvcHMgPSB7fSkge1xuICAgIHRoaXMuY29uc3RhbnRzID0gc3RvcmFnZUNvbmZpZy5jb25zdGFudHMgfHwge31cbiAgICB0aGlzLmFwaUtleSA9IHN0b3JhZ2VDb25maWcuYXBpS2V5IHx8ICdhbm9ueW1vdXMnXG5cbiAgICBjb25zdCBtaW50YmFzZUpTRmlyZWJhc2UgPSBmaXJlYmFzZS5hcHBzLmZpbmQoXG4gICAgICAoeyBuYW1lIH0pID0+IG5hbWUgPT09IEZJUkVCQVNFX01KU19JRFxuICAgIClcblxuICAgIHRoaXMuZmlyZWJhc2UgPVxuICAgICAgbWludGJhc2VKU0ZpcmViYXNlID8/XG4gICAgICBmaXJlYmFzZS5pbml0aWFsaXplQXBwKFxuICAgICAgICB0aGlzLmNvbnN0YW50cy5DTE9VRF9TVE9SQUdFX0NPTkZJRyB8fCBDTE9VRF9TVE9SQUdFX0NPTkZJRyxcbiAgICAgICAgRklSRUJBU0VfTUpTX0lEXG4gICAgICApXG5cbiAgICB0aGlzLnN0b3JhZ2UgPSB0aGlzLmZpcmViYXNlLnN0b3JhZ2UoKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwbG9hZHMgbWV0YWRhdGEgdG8gQXJ3ZWF2ZSB2aWEgYSBjbG91ZCBmdW5jdGlvblxuICAgKiBAcGFyYW0gbWV0YWRhdGEgbWV0YWRhdGEgb2JqZWN0XG4gICAqIEByZXR1cm5zIGFyd2VhdmUgY29udGVudCBpZGVudGlmaWVyXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgdXBsb2FkTWV0YWRhdGEoXG4gICAgbWV0YWRhdGE6IHVua25vd25cbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8eyBpZDogc3RyaW5nIH0+PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBhd2FpdCByZXRyeUZldGNoKGAke0NMT1VEX1VSSX0vYXJ3ZWF2ZS9tZXRhZGF0YS9gLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShtZXRhZGF0YSksXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBbaGVhZGVycy5hcGlLZXldOiB0aGlzLmFwaUtleSB8fCAnYW5vbnltb3VzJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGRhdGE6IHsgaWQ6IHN0cmluZyB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKClcblxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YSB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogRVJST1JfTUVTU0FHRVMudXBsb2FkTWV0YWRhdGEgfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBsb2FkIGZpbGUgdG8gQXJ3ZWF2ZSB2aWEgYSBjbG91ZCBmdW5jdGlvblxuICAgKiBAcGFyYW0gZmlsZSB0aGUgZmlsZSB0byB1cGxvYWRcbiAgICogQHJldHVybnMgcmV0dW5ybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGFyd2VhdmUgY29udGVudCBpZGVudGlmaWVyIGFuZCB0aGUgY29udGVudCB0eXBlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwbG9hZFRvQXJ3ZWF2ZShcbiAgICBmaWxlOiBGaWxlXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPHsgaWQ6IHN0cmluZzsgY29udGVudFR5cGU6IHN0cmluZyB9Pj4ge1xuICAgIGlmIChpc05vZGUpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2Uoe1xuICAgICAgICBlcnJvcjogJ05vZGUgZW52aXJvbm1lbnQgZG9lcyBub3QgeWV0IHN1cHBvcnRzIHVwbG9hZHMuJyxcbiAgICAgIH0pXG5cbiAgICBjb25zdCBidWZmZXIgPSBhd2FpdCBmaWxlLmFycmF5QnVmZmVyKClcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IGZpbGUudHlwZVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFVwbG9hZHMgdG8gZ29vZ2xlIGNsb3VkXG4gICAgICBjb25zdCB7IGRhdGE6IGZpbGVOYW1lLCBlcnJvciB9ID0gYXdhaXQgdGhpcy51cGxvYWRDbG91ZChcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBjb250ZW50VHlwZVxuICAgICAgKVxuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3IgfSlcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gRmV0Y2hlcyBhcndlYXZlIGlkLiBUaGlzIHJlcXVlc3Qgd2lsbCB0cmlnZ2VyIGFuIHVwbG9hZCBpbiB0aGUgY2xvdWRcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IGF3YWl0IHJldHJ5RmV0Y2goYCR7Q0xPVURfVVJJfS9hcndlYXZlL2ZpbGUvJHtmaWxlTmFtZX1gLCB7XG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgW2hlYWRlcnMuYXBpS2V5XTogdGhpcy5hcGlLZXkgfHwgJ2Fub255bW91cycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCB7IGlkLCBjb250ZW50VHlwZSB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKClcblxuICAgICAgICBjb25zdCBkYXRhID0geyBpZCwgY29udGVudFR5cGUgfVxuXG4gICAgICAgIGlmICghaWQgfHwgIWNvbnRlbnRUeXBlKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFUy5kZWNlbnRyYWxpemVkU3RvcmFnZUZhaWxlZClcblxuICAgICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhIH0pXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2Uoe1xuICAgICAgICAgIGVycm9yOiBFUlJPUl9NRVNTQUdFUy5kZWNlbnRyYWxpemVkU3RvcmFnZUZhaWxlZCxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGxvYWRzIHJhdyBiaW5hcnkgZGF0YSB0byB0aGUgY2xvdWQuIFRoaXMgbWV0aG9kIGlzIHVzZWZ1bCBiZWNhdXNlXG4gICAqIHdlIGNhbiB0cmlnZ2VyIGFuIGFyd2VhdmUgdXBsb2FkIHZpYSBhbiBodHRwIHJlcXVlc3Qgd2l0aCB0aGUgcmV0dXJuZWQgZmlsZSBuYW1lLlxuICAgKiBAcGFyYW0gYnVmZmVyIHRoZSByYXcgYmluYXJ5IGRhdGEgb2YgdGhlIGZpbGUgdG8gdXBsb2FkXG4gICAqIEBwYXJhbSBjb250ZW50VHlwZSB0aGUgY29udGVudCB0eXBlXG4gICAqIEByZXR1cm5zIHRoZSBmaWxlbmFtZVxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyB1cGxvYWRDbG91ZChcbiAgICBidWZmZXI6IEFycmF5QnVmZmVyIHwgQnVmZmVyLFxuICAgIGNvbnRlbnRUeXBlOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8c3RyaW5nPj4ge1xuICAgIGlmIChpc05vZGUpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2Uoe1xuICAgICAgICBlcnJvcjogJ05vZGUgZW52aXJvbm1lbnQgZG9lcyBub3QgeWV0IHN1cHBvcnRzIHVwbG9hZHMuJyxcbiAgICAgIH0pXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gdXVpZHY0KClcblxuICAgICAgaWYgKCF0aGlzLnN0b3JhZ2UpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnU3RvcmFnZSBpcyBub3QgaW5pdGlhbGl6ZWQnIH0pXG5cbiAgICAgIGF3YWl0IHRoaXMuc3RvcmFnZVxuICAgICAgICAucmVmKGAke0FSV0VBVkVfRk9MREVSfS8ke2ZpbGVOYW1lfWApXG4gICAgICAgIC5wdXQoYnVmZmVyLCB7IGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZSB9KVxuXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiBmaWxlTmFtZSB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogRVJST1JfTUVTU0FHRVMudXBsb2FkQ2xvdWQgfSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==