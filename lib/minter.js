"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Minter = void 0;

var _constants = require("./constants");

var _types = require("./types");

var _files = require("./utils/files");

var _storage = require("./utils/storage");

var _responseBuilder = require("./utils/responseBuilder");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * A programmatic metadata generator.
 */
var Minter = /*#__PURE__*/function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function Minter() {
    var minterConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Minter);

    _defineProperty(this, "latestMints", void 0);

    _defineProperty(this, "currentMint", void 0);

    _defineProperty(this, "storage", void 0);

    _defineProperty(this, "apiKey", void 0);

    _defineProperty(this, "constants", void 0);

    this.latestMints = {};
    this.currentMint = {};
    this.constants = minterConfig.constants || {};
    this.apiKey = minterConfig.apiKey || 'anonymous';
    this.storage = new _storage.Storage({
      apiKey: this.apiKey,
      constants: this.constants
    });
  }
  /**
   * Uploads the current metadata object and returns its content identifier.
   */


  _createClass(Minter, [{
    key: "getMetadataId",
    value: function () {
      var _getMetadataId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _yield$this$storage$u, uploadResult, error, id;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.currentMint && Object.keys(this.currentMint).length === 0 && this.currentMint.constructor === Object)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.metadataEmpty
                }));

              case 2:
                if (this.storage) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Storage not initialized'
                }));

              case 4:
                _context.next = 6;
                return this.storage.uploadMetadata(this.currentMint);

              case 6:
                _yield$this$storage$u = _context.sent;
                uploadResult = _yield$this$storage$u.data;
                error = _yield$this$storage$u.error;

                if (!error) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: error
                }));

              case 11:
                id = uploadResult.id;
                this.latestMints = _objectSpread(_objectSpread({}, this.latestMints), {}, _defineProperty({}, id, this.currentMint));
                this.currentMint = {};
                return _context.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: id
                }));

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getMetadataId() {
        return _getMetadataId.apply(this, arguments);
      }

      return getMetadataId;
    }()
    /**
     * Set a field in metadata.
     * @param key The field key.
     * @param value The field value.
     */

  }, {
    key: "setField",
    value: function setField(key, value, override) {
      try {
        this.fieldChecks(key, value);
      } catch (error) {
        return (0, _responseBuilder.formatResponse)({
          error: error.message
        });
      }

      if (!this.currentMint[key]) this.currentMint[key] = value;else if (override && !!this.currentMint[key]) this.currentMint[key] = value;
      return (0, _responseBuilder.formatResponse)({
        data: true
      });
    }
  }, {
    key: "setMetadata",
    value: function setMetadata(metadata, override) {
      var _this = this;

      try {
        Object.keys(metadata).forEach(function (field) {
          _this.setField(field, metadata[field], override);
        });
        return (0, _responseBuilder.formatResponse)({
          data: true
        });
      } catch (error) {
        return (0, _responseBuilder.formatResponse)({
          error: error.message
        });
      }
    }
    /**
     * Uploads file and sets its corresponding URI to a field.
     * @param field The metadata field.
     * @param file The file to upload.
     */

  }, {
    key: "uploadField",
    value: function () {
      var _uploadField = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(field, file) {
        var _VALID_FILE_FORMATS$f;

        var _yield$this$upload, data, error, uri, hash, _determineUploadMetad, keyHash, keyUrl;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if ((_VALID_FILE_FORMATS$f = _constants.VALID_FILE_FORMATS[field]) !== null && _VALID_FILE_FORMATS$f !== void 0 && _VALID_FILE_FORMATS$f.includes(file.type)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.fileTypeNotAccepted
                }));

              case 2:
                _context2.prev = 2;
                _context2.next = 5;
                return this.upload(file);

              case 5:
                _yield$this$upload = _context2.sent;
                data = _yield$this$upload.data;
                error = _yield$this$upload.error;

                if (!error) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.uploadFileAndSet
                }));

              case 10:
                uri = data.uri, hash = data.hash;
                _determineUploadMetad = _determineUploadMetadataFields(field), keyHash = _determineUploadMetad.hash, keyUrl = _determineUploadMetad.url;

                if (keyHash && keyUrl) {
                  this.currentMint[keyUrl] = uri;
                  this.currentMint[keyHash] = hash;
                } else {
                  this.currentMint[field] = uri;
                  this.currentMint["".concat(field, "_hash")] = hash;
                }

                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](2);
                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.uploadFileAndSet
                }));

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 16]]);
      }));

      function uploadField(_x, _x2) {
        return _uploadField.apply(this, arguments);
      }

      return uploadField;
    }()
    /**
     * Uploads file and returns corresponding URI.
     * @param file The file to upload.
     */

  }, {
    key: "upload",
    value: function () {
      var _upload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(file) {
        var tFile, _yield$this$storage$u2, result, error, data;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;

                if (this.storage) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Storage not initialized'
                }));

              case 3:
                _context3.next = 5;
                return (0, _files.correctFileType)(file);

              case 5:
                tFile = _context3.sent;

                if (tFile.size > (this.constants.FILE_UPLOAD_SIZE_LIMIT || _constants.FILE_UPLOAD_SIZE_LIMIT)) {
                  (0, _responseBuilder.formatResponse)({
                    error: 'Storage not initialized'
                  });
                }

                _context3.next = 9;
                return this.storage.uploadToArweave(file);

              case 9:
                _yield$this$storage$u2 = _context3.sent;
                result = _yield$this$storage$u2.data;
                error = _yield$this$storage$u2.error;

                if (!(!result || error)) {
                  _context3.next = 14;
                  break;
                }

                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: error
                }));

              case 14:
                data = {
                  uri: "".concat(this.constants.BASE_ARWEAVE_URI || _constants.BASE_ARWEAVE_URI, "/").concat(result === null || result === void 0 ? void 0 : result.id),
                  hash: result === null || result === void 0 ? void 0 : result.id
                };
                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3["catch"](0);
                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _context3.t0.message
                }));

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 18]]);
      }));

      function upload(_x3) {
        return _upload.apply(this, arguments);
      }

      return upload;
    }() // TODO: implement all checks

  }, {
    key: "fieldChecks",
    value: function fieldChecks(key, value) {
      switch (key) {
        case _types.MetadataField.Media:
          if (typeof value !== 'string') throw new Error(_constants.ERROR_MESSAGES.notString);
          if (!value.match(_constants.REGEX_URL)) throw new Error(_constants.ERROR_MESSAGES.badUrl);
          break;

        case _types.MetadataField.Title:
          if (typeof value !== 'string') throw new Error(_constants.ERROR_MESSAGES.notString);
          break;

        case _types.MetadataField.Description:
          if (typeof value !== 'string') throw new Error(_constants.ERROR_MESSAGES.notString);
          break;

        default:
          break;
      }
    }
  }]);

  return Minter;
}();

exports.Minter = Minter;

var _determineUploadMetadataFields = function _determineUploadMetadataFields(type) {
  switch (type) {
    case _types.MetadataField.Media:
    case _types.MetadataField.Media_hash:
      return {
        url: _types.MetadataField.Media,
        hash: _types.MetadataField.Media_hash
      };

    case _types.MetadataField.Animation_url:
    case _types.MetadataField.Animation_hash:
      return {
        url: _types.MetadataField.Animation_url,
        hash: _types.MetadataField.Animation_hash
      };

    default:
      return {
        url: null,
        hash: null
      };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9taW50ZXIudHMiXSwibmFtZXMiOlsiTWludGVyIiwibWludGVyQ29uZmlnIiwibGF0ZXN0TWludHMiLCJjdXJyZW50TWludCIsImNvbnN0YW50cyIsImFwaUtleSIsInN0b3JhZ2UiLCJTdG9yYWdlIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImNvbnN0cnVjdG9yIiwiZXJyb3IiLCJFUlJPUl9NRVNTQUdFUyIsIm1ldGFkYXRhRW1wdHkiLCJ1cGxvYWRNZXRhZGF0YSIsInVwbG9hZFJlc3VsdCIsImRhdGEiLCJpZCIsImtleSIsInZhbHVlIiwib3ZlcnJpZGUiLCJmaWVsZENoZWNrcyIsIm1lc3NhZ2UiLCJtZXRhZGF0YSIsImZvckVhY2giLCJmaWVsZCIsInNldEZpZWxkIiwiZmlsZSIsIlZBTElEX0ZJTEVfRk9STUFUUyIsImluY2x1ZGVzIiwidHlwZSIsImZpbGVUeXBlTm90QWNjZXB0ZWQiLCJ1cGxvYWQiLCJ1cGxvYWRGaWxlQW5kU2V0IiwidXJpIiwiaGFzaCIsIl9kZXRlcm1pbmVVcGxvYWRNZXRhZGF0YUZpZWxkcyIsImtleUhhc2giLCJrZXlVcmwiLCJ1cmwiLCJ0RmlsZSIsInNpemUiLCJGSUxFX1VQTE9BRF9TSVpFX0xJTUlUIiwidXBsb2FkVG9BcndlYXZlIiwicmVzdWx0IiwiQkFTRV9BUldFQVZFX1VSSSIsIk1ldGFkYXRhRmllbGQiLCJNZWRpYSIsIkVycm9yIiwibm90U3RyaW5nIiwibWF0Y2giLCJSRUdFWF9VUkwiLCJiYWRVcmwiLCJUaXRsZSIsIkRlc2NyaXB0aW9uIiwiTWVkaWFfaGFzaCIsIkFuaW1hdGlvbl91cmwiLCJBbmltYXRpb25faGFzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQU9BOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7SUFDYUEsTTtBQUNYO0FBRUE7QUFRQSxvQkFBa0Q7QUFBQSxRQUF0Q0MsWUFBc0MsdUVBQUosRUFBSTs7QUFBQTs7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S0FBUCxLQUFpQixRQUFyQixFQUErQixNQUFNLElBQUk2QixLQUFKLENBQVVwQywwQkFBZXFDLFNBQXpCLENBQU47QUFDL0I7O0FBRUYsYUFBS0gscUJBQWNRLFdBQW5CO0FBQ0UsY0FBSSxPQUFPbkMsS0FBUCxLQUFpQixRQUFyQixFQUErQixNQUFNLElBQUk2QixLQUFKLENBQVVwQywwQkFBZXFDLFNBQXpCLENBQU47QUFDL0I7O0FBRUY7QUFDRTtBQWZKO0FBaUJEOzs7Ozs7OztBQUdILElBQU1iLDhCQUdMLEdBQUcsU0FIRUEsOEJBR0YsQ0FBQ04sSUFBRCxFQUFVO0FBQ1osVUFBUUEsSUFBUjtBQUNFLFNBQUtnQixxQkFBY0MsS0FBbkI7QUFDQSxTQUFLRCxxQkFBY1MsVUFBbkI7QUFDRSxhQUFPO0FBQUVoQixRQUFBQSxHQUFHLEVBQUVPLHFCQUFjQyxLQUFyQjtBQUE0QlosUUFBQUEsSUFBSSxFQUFFVyxxQkFBY1M7QUFBaEQsT0FBUDs7QUFFRixTQUFLVCxxQkFBY1UsYUFBbkI7QUFDQSxTQUFLVixxQkFBY1csY0FBbkI7QUFDRSxhQUFPO0FBQ0xsQixRQUFBQSxHQUFHLEVBQUVPLHFCQUFjVSxhQURkO0FBRUxyQixRQUFBQSxJQUFJLEVBQUVXLHFCQUFjVztBQUZmLE9BQVA7O0FBS0Y7QUFDRSxhQUFPO0FBQUVsQixRQUFBQSxHQUFHLEVBQUUsSUFBUDtBQUFhSixRQUFBQSxJQUFJLEVBQUU7QUFBbkIsT0FBUDtBQWJKO0FBZUQsQ0FuQkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBCQVNFX0FSV0VBVkVfVVJJLFxuICBGSUxFX1VQTE9BRF9TSVpFX0xJTUlULFxuICBSRUdFWF9VUkwsXG4gIFZBTElEX0ZJTEVfRk9STUFUUyxcbiAgRVJST1JfTUVTU0FHRVMsXG59IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgQ29uc3RhbnRzLCBNZXRhZGF0YUZpZWxkIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGNvcnJlY3RGaWxlVHlwZSB9IGZyb20gJy4vdXRpbHMvZmlsZXMnXG5pbXBvcnQgeyBTdG9yYWdlIH0gZnJvbSAnLi91dGlscy9zdG9yYWdlJ1xuaW1wb3J0IHsgZm9ybWF0UmVzcG9uc2UsIFJlc3BvbnNlRGF0YSB9IGZyb20gJy4vdXRpbHMvcmVzcG9uc2VCdWlsZGVyJ1xuXG5pbnRlcmZhY2UgTWludGVyQ29uZmlnUHJvcHMge1xuICBhcGlLZXk/OiBzdHJpbmdcbiAgY29uc3RhbnRzPzogQ29uc3RhbnRzXG59XG5cbi8qKlxuICogQSBwcm9ncmFtbWF0aWMgbWV0YWRhdGEgZ2VuZXJhdG9yLlxuICovXG5leHBvcnQgY2xhc3MgTWludGVyIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgcHVibGljIGxhdGVzdE1pbnRzOiBhbnlcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgcHVibGljIGN1cnJlbnRNaW50OiBhbnlcblxuICBwdWJsaWMgc3RvcmFnZTogU3RvcmFnZSB8IHVuZGVmaW5lZFxuXG4gIHB1YmxpYyBhcGlLZXk6IHN0cmluZ1xuICBwdWJsaWMgY29uc3RhbnRzOiBDb25zdGFudHNcblxuICBjb25zdHJ1Y3RvcihtaW50ZXJDb25maWc6IE1pbnRlckNvbmZpZ1Byb3BzID0ge30pIHtcbiAgICB0aGlzLmxhdGVzdE1pbnRzID0ge31cbiAgICB0aGlzLmN1cnJlbnRNaW50ID0ge31cblxuICAgIHRoaXMuY29uc3RhbnRzID0gbWludGVyQ29uZmlnLmNvbnN0YW50cyB8fCB7fVxuICAgIHRoaXMuYXBpS2V5ID0gbWludGVyQ29uZmlnLmFwaUtleSB8fCAnYW5vbnltb3VzJ1xuXG4gICAgdGhpcy5zdG9yYWdlID0gbmV3IFN0b3JhZ2Uoe1xuICAgICAgYXBpS2V5OiB0aGlzLmFwaUtleSxcbiAgICAgIGNvbnN0YW50czogdGhpcy5jb25zdGFudHMsXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGxvYWRzIHRoZSBjdXJyZW50IG1ldGFkYXRhIG9iamVjdCBhbmQgcmV0dXJucyBpdHMgY29udGVudCBpZGVudGlmaWVyLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGdldE1ldGFkYXRhSWQoKTogUHJvbWlzZTxSZXNwb25zZURhdGE8c3RyaW5nPj4ge1xuICAgIGlmIChcbiAgICAgIHRoaXMuY3VycmVudE1pbnQgJiZcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuY3VycmVudE1pbnQpLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgdGhpcy5jdXJyZW50TWludC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0XG4gICAgKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6IEVSUk9SX01FU1NBR0VTLm1ldGFkYXRhRW1wdHkgfSlcblxuICAgIGlmICghdGhpcy5zdG9yYWdlKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdTdG9yYWdlIG5vdCBpbml0aWFsaXplZCcgfSlcblxuICAgIGNvbnN0IHsgZGF0YTogdXBsb2FkUmVzdWx0LCBlcnJvciB9ID0gYXdhaXQgdGhpcy5zdG9yYWdlLnVwbG9hZE1ldGFkYXRhKFxuICAgICAgdGhpcy5jdXJyZW50TWludFxuICAgIClcblxuICAgIGlmIChlcnJvcikgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3IgfSlcblxuICAgIGNvbnN0IHsgaWQgfSA9IHVwbG9hZFJlc3VsdFxuXG4gICAgdGhpcy5sYXRlc3RNaW50cyA9IHsgLi4udGhpcy5sYXRlc3RNaW50cywgW2lkXTogdGhpcy5jdXJyZW50TWludCB9XG4gICAgdGhpcy5jdXJyZW50TWludCA9IHt9XG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiBpZCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhIGZpZWxkIGluIG1ldGFkYXRhLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBmaWVsZCBrZXkuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgZmllbGQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgc2V0RmllbGQoXG4gICAga2V5OiBNZXRhZGF0YUZpZWxkLFxuICAgIHZhbHVlOiB1bmtub3duLFxuICAgIG92ZXJyaWRlPzogYm9vbGVhblxuICApOiBSZXNwb25zZURhdGE8Ym9vbGVhbj4ge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmZpZWxkQ2hlY2tzKGtleSwgdmFsdWUpXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY3VycmVudE1pbnRba2V5XSkgdGhpcy5jdXJyZW50TWludFtrZXldID0gdmFsdWVcbiAgICBlbHNlIGlmIChvdmVycmlkZSAmJiAhIXRoaXMuY3VycmVudE1pbnRba2V5XSkgdGhpcy5jdXJyZW50TWludFtrZXldID0gdmFsdWVcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHRydWUgfSlcbiAgfVxuXG4gIHB1YmxpYyBzZXRNZXRhZGF0YShtZXRhZGF0YTogYW55LCBvdmVycmlkZT86IGJvb2xlYW4pOiBSZXNwb25zZURhdGE8Ym9vbGVhbj4ge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3Qua2V5cyhtZXRhZGF0YSkuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgdGhpcy5zZXRGaWVsZChmaWVsZCBhcyBNZXRhZGF0YUZpZWxkLCBtZXRhZGF0YVtmaWVsZF0sIG92ZXJyaWRlKVxuICAgICAgfSlcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHRydWUgfSlcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGxvYWRzIGZpbGUgYW5kIHNldHMgaXRzIGNvcnJlc3BvbmRpbmcgVVJJIHRvIGEgZmllbGQuXG4gICAqIEBwYXJhbSBmaWVsZCBUaGUgbWV0YWRhdGEgZmllbGQuXG4gICAqIEBwYXJhbSBmaWxlIFRoZSBmaWxlIHRvIHVwbG9hZC5cbiAgICovXG4gIHB1YmxpYyBhc3luYyB1cGxvYWRGaWVsZChcbiAgICBmaWVsZDogTWV0YWRhdGFGaWVsZCxcbiAgICBmaWxlOiBGaWxlXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgaWYgKCFWQUxJRF9GSUxFX0ZPUk1BVFNbZmllbGRdPy5pbmNsdWRlcyhmaWxlLnR5cGUpKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6IEVSUk9SX01FU1NBR0VTLmZpbGVUeXBlTm90QWNjZXB0ZWQgfSlcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCB0aGlzLnVwbG9hZChmaWxlKVxuXG4gICAgICBpZiAoZXJyb3IpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiBFUlJPUl9NRVNTQUdFUy51cGxvYWRGaWxlQW5kU2V0IH0pXG5cbiAgICAgIGNvbnN0IHsgdXJpLCBoYXNoIH0gPSBkYXRhXG5cbiAgICAgIGNvbnN0IHsgaGFzaDoga2V5SGFzaCwgdXJsOiBrZXlVcmwgfSA9XG4gICAgICAgIF9kZXRlcm1pbmVVcGxvYWRNZXRhZGF0YUZpZWxkcyhmaWVsZClcblxuICAgICAgaWYgKGtleUhhc2ggJiYga2V5VXJsKSB7XG4gICAgICAgIHRoaXMuY3VycmVudE1pbnRba2V5VXJsXSA9IHVyaVxuICAgICAgICB0aGlzLmN1cnJlbnRNaW50W2tleUhhc2hdID0gaGFzaFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TWludFtmaWVsZF0gPSB1cmlcbiAgICAgICAgdGhpcy5jdXJyZW50TWludFtgJHtmaWVsZH1faGFzaGBdID0gaGFzaFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiB0cnVlIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiBFUlJPUl9NRVNTQUdFUy51cGxvYWRGaWxlQW5kU2V0IH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwbG9hZHMgZmlsZSBhbmQgcmV0dXJucyBjb3JyZXNwb25kaW5nIFVSSS5cbiAgICogQHBhcmFtIGZpbGUgVGhlIGZpbGUgdG8gdXBsb2FkLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwbG9hZChcbiAgICBmaWxlOiBGaWxlXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPHsgdXJpOiBzdHJpbmc7IGhhc2g6IHN0cmluZyB9Pj4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuc3RvcmFnZSkge1xuICAgICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ1N0b3JhZ2Ugbm90IGluaXRpYWxpemVkJyB9KVxuICAgICAgfVxuXG4gICAgICAvLyBjb3JyZWN0cyBNSU1FIHR5cGUuXG4gICAgICBjb25zdCB0RmlsZSA9IGF3YWl0IGNvcnJlY3RGaWxlVHlwZShmaWxlKVxuXG4gICAgICBpZiAoXG4gICAgICAgIHRGaWxlLnNpemUgPlxuICAgICAgICAodGhpcy5jb25zdGFudHMuRklMRV9VUExPQURfU0laRV9MSU1JVCB8fCBGSUxFX1VQTE9BRF9TSVpFX0xJTUlUKVxuICAgICAgKSB7XG4gICAgICAgIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdTdG9yYWdlIG5vdCBpbml0aWFsaXplZCcgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBkYXRhOiByZXN1bHQsIGVycm9yIH0gPSBhd2FpdCB0aGlzLnN0b3JhZ2UudXBsb2FkVG9BcndlYXZlKGZpbGUpXG5cbiAgICAgIGlmICghcmVzdWx0IHx8IGVycm9yKSByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvciB9KVxuXG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICB1cmk6IGAke3RoaXMuY29uc3RhbnRzLkJBU0VfQVJXRUFWRV9VUkkgfHwgQkFTRV9BUldFQVZFX1VSSX0vJHtcbiAgICAgICAgICByZXN1bHQ/LmlkXG4gICAgICAgIH1gLFxuICAgICAgICBoYXNoOiByZXN1bHQ/LmlkLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhIH0pXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSlcbiAgICB9XG4gIH1cblxuICAvLyBUT0RPOiBpbXBsZW1lbnQgYWxsIGNoZWNrc1xuICBwcml2YXRlIGZpZWxkQ2hlY2tzKGtleTogTWV0YWRhdGFGaWVsZCwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlIE1ldGFkYXRhRmllbGQuTWVkaWE6XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoRVJST1JfTUVTU0FHRVMubm90U3RyaW5nKVxuICAgICAgICBpZiAoIXZhbHVlLm1hdGNoKFJFR0VYX1VSTCkpIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFUy5iYWRVcmwpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgTWV0YWRhdGFGaWVsZC5UaXRsZTpcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFUy5ub3RTdHJpbmcpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgTWV0YWRhdGFGaWVsZC5EZXNjcmlwdGlvbjpcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFUy5ub3RTdHJpbmcpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IF9kZXRlcm1pbmVVcGxvYWRNZXRhZGF0YUZpZWxkczogKHR5cGU6IE1ldGFkYXRhRmllbGQpID0+IHtcbiAgdXJsOiBzdHJpbmcgfCBudWxsXG4gIGhhc2g6IHN0cmluZyB8IG51bGxcbn0gPSAodHlwZSkgPT4ge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIE1ldGFkYXRhRmllbGQuTWVkaWE6XG4gICAgY2FzZSBNZXRhZGF0YUZpZWxkLk1lZGlhX2hhc2g6XG4gICAgICByZXR1cm4geyB1cmw6IE1ldGFkYXRhRmllbGQuTWVkaWEsIGhhc2g6IE1ldGFkYXRhRmllbGQuTWVkaWFfaGFzaCB9XG5cbiAgICBjYXNlIE1ldGFkYXRhRmllbGQuQW5pbWF0aW9uX3VybDpcbiAgICBjYXNlIE1ldGFkYXRhRmllbGQuQW5pbWF0aW9uX2hhc2g6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6IE1ldGFkYXRhRmllbGQuQW5pbWF0aW9uX3VybCxcbiAgICAgICAgaGFzaDogTWV0YWRhdGFGaWVsZC5BbmltYXRpb25faGFzaCxcbiAgICAgIH1cblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4geyB1cmw6IG51bGwsIGhhc2g6IG51bGwgfVxuICB9XG59XG4iXX0=