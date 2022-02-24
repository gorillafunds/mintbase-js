"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API = void 0;

require("isomorphic-unfetch");

var _graphqlRequest = require("graphql-request");

var _urlcat = _interopRequireDefault(require("urlcat"));

var _types = require("./types");

var _constants = require("./constants");

var _responseBuilder = require("./utils/responseBuilder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Mintbase API.
 * Main entry point for users read Mintbase data.
 */
var API = /*#__PURE__*/function () {
  function API(apiConfig) {
    _classCallCheck(this, API);

    _defineProperty(this, "apiBaseUrl", _constants.API_BASE_NEAR_TESTNET);

    _defineProperty(this, "defaultLimit", 20);

    _defineProperty(this, "chainName", _types.Chain.near);

    _defineProperty(this, "networkName", void 0);

    _defineProperty(this, "constants", void 0);

    this.constants = apiConfig.constants;
    this.networkName = apiConfig.networkName || _types.Network.testnet;

    switch (apiConfig.chain) {
      case _types.Chain.near:
        if (this.networkName === _types.Network.testnet) {
          this.apiBaseUrl = this.constants.API_BASE_NEAR_TESTNET || apiConfig.apiBaseUrl || _constants.API_BASE_NEAR_TESTNET;
        } else if (this.networkName === _types.Network.mainnet) {
          this.apiBaseUrl = this.constants.API_BASE_NEAR_MAINNET || apiConfig.apiBaseUrl || _constants.API_BASE_NEAR_MAINNET;
        }

        this.chainName = _types.Chain.near;
        break;

      default:
        this.apiBaseUrl = this.constants.API_BASE_NEAR_TESTNET || apiConfig.apiBaseUrl || _constants.API_BASE_NEAR_TESTNET;
        this.chainName = apiConfig.chain || _types.Chain.near;
        break;
    }
  }
  /**
   * Fetch marketplace and each token's metadata (w/ cursor offset pagination enabled).
   * @param limit number of results
   * @param offset number of records to skip
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any


  _createClass(API, [{
    key: "fetchMarketplace",
    value: function () {
      var _fetchMarketplace = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(offset, limit) {
        var _this = this;

        var url, response, result, promises, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/marketplace', {
                  limit: limit || this.defaultLimit,
                  offset: offset || 0
                });
                _context2.next = 3;
                return fetch(url);

              case 3:
                response = _context2.sent;
                _context2.next = 6;
                return response.json();

              case 6:
                result = _context2.sent;
                promises = result.list.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(list) {
                    var baseUri, metaId, metadataUri, _yield$_this$fetchMet, metadata;

                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            baseUri = list.token.thing.store.baseUri;
                            metaId = list.token.thing.metaId;
                            metadataUri = (0, _urlcat["default"])(baseUri, metaId);
                            _context.next = 5;
                            return _this.fetchMetadata(metadataUri);

                          case 5:
                            _yield$_this$fetchMet = _context.sent;
                            metadata = _yield$_this$fetchMet.data;
                            return _context.abrupt("return", _objectSpread(_objectSpread({}, list), {}, {
                              metadata: metadata
                            }));

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x3) {
                    return _ref.apply(this, arguments);
                  };
                }());
                _context2.next = 10;
                return Promise.all(promises);

              case 10:
                data = _context2.sent;
                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchMarketplace(_x, _x2) {
        return _fetchMarketplace.apply(this, arguments);
      }

      return fetchMarketplace;
    }() // eslint-disable-next-line @typescript-eslint/no-explicit-any

  }, {
    key: "fetchAccount",
    value: function () {
      var _fetchAccount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(accountId) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/accounts/:accountId', {
                  accountId: accountId
                });
                _context3.next = 3;
                return fetch(url);

              case 3:
                response = _context3.sent;
                _context3.next = 6;
                return response.json();

              case 6:
                result = _context3.sent;
                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetchAccount(_x4) {
        return _fetchAccount.apply(this, arguments);
      }

      return fetchAccount;
    }()
  }, {
    key: "fetchTokenApprovals",
    value: function () {
      var _fetchTokenApprovals = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(tokenKey, contractAddress) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/token-approvals', {
                  accountId: contractAddress,
                  tokenKey: tokenKey
                });
                _context4.next = 3;
                return fetch(url);

              case 3:
                response = _context4.sent;
                _context4.next = 6;
                return response.json();

              case 6:
                result = _context4.sent;
                return _context4.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetchTokenApprovals(_x5, _x6) {
        return _fetchTokenApprovals.apply(this, arguments);
      }

      return fetchTokenApprovals;
    }()
  }, {
    key: "fetchApprovals",
    value: function () {
      var _fetchApprovals = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(offset, limit) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/approvals/', {
                  limit: limit || this.defaultLimit,
                  offset: offset || 0
                });
                _context5.next = 3;
                return fetch(url);

              case 3:
                response = _context5.sent;
                _context5.next = 6;
                return response.json();

              case 6:
                result = _context5.sent;
                return _context5.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function fetchApprovals(_x7, _x8) {
        return _fetchApprovals.apply(this, arguments);
      }

      return fetchApprovals;
    }()
    /**
     * Fetch thing metadata.
     * @param thingId Thing Id
     * @returns token metadata
     */

  }, {
    key: "fetchThingMetadata",
    value: function () {
      var _fetchThingMetadata = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(thingId) {
        var url, response, result, thing, metadataUri, _yield$this$fetchMeta, metadata, error;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/things/:id', {
                  id: thingId
                });
                _context6.next = 3;
                return fetch(url);

              case 3:
                response = _context6.sent;
                _context6.next = 6;
                return response.json();

              case 6:
                result = _context6.sent;

                if (!(result.thing.length === 0)) {
                  _context6.next = 9;
                  break;
                }

                return _context6.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: "".concat(thingId, " is not a valid thing.")
                }));

              case 9:
                thing = result.thing[0];
                metadataUri = (0, _urlcat["default"])(thing.store.baseUri, thing.metaId);
                _context6.next = 13;
                return this.fetchMetadata(metadataUri);

              case 13:
                _yield$this$fetchMeta = _context6.sent;
                metadata = _yield$this$fetchMeta.data;
                error = _yield$this$fetchMeta.error;

                if (!error) {
                  _context6.next = 18;
                  break;
                }

                return _context6.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: error
                }));

              case 18:
                return _context6.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: metadata
                }));

              case 19:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function fetchThingMetadata(_x9) {
        return _fetchThingMetadata.apply(this, arguments);
      }

      return fetchThingMetadata;
    }()
    /**
     * Fetch list by id.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

  }, {
    key: "fetchListById",
    value: function () {
      var _fetchListById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(id) {
        var url, response, result, list;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/lists/:id', {
                  id: id
                });
                _context7.next = 3;
                return fetch(url);

              case 3:
                response = _context7.sent;
                _context7.next = 6;
                return response.json();

              case 6:
                result = _context7.sent;

                if (!(result.list.length === 0)) {
                  _context7.next = 9;
                  break;
                }

                return _context7.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: "No results for ".concat(id)
                }));

              case 9:
                list = result.list[0];
                return _context7.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: list
                }));

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function fetchListById(_x10) {
        return _fetchListById.apply(this, arguments);
      }

      return fetchListById;
    }() // eslint-disable-next-line @typescript-eslint/no-explicit-any

  }, {
    key: "fetchLists",
    value: function () {
      var _fetchLists = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(offset, limit) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/lists/', {
                  limit: limit || this.defaultLimit,
                  offset: offset || 0
                });
                _context8.next = 3;
                return fetch(url);

              case 3:
                response = _context8.sent;
                _context8.next = 6;
                return response.json();

              case 6:
                result = _context8.sent;
                return _context8.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function fetchLists(_x11, _x12) {
        return _fetchLists.apply(this, arguments);
      }

      return fetchLists;
    }()
    /**
     * Fetch thing by Id
     * TODO: Not yet implemented
     */

  }, {
    key: "fetchThingById",
    value: function () {
      var _fetchThingById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(thingId) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/things/:id', {
                  id: thingId
                });
                _context9.next = 3;
                return fetch(url);

              case 3:
                response = _context9.sent;
                _context9.next = 6;
                return response.json();

              case 6:
                result = _context9.sent;
                return _context9.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function fetchThingById(_x13) {
        return _fetchThingById.apply(this, arguments);
      }

      return fetchThingById;
    }()
    /**
     * Fetch thing.
     */

  }, {
    key: "fetchThings",
    value: function () {
      var _fetchThings = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(offset, limit) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/things/', {
                  limit: limit || this.defaultLimit,
                  offset: offset || 0
                });
                _context10.next = 3;
                return fetch(url);

              case 3:
                response = _context10.sent;
                _context10.next = 6;
                return response.json();

              case 6:
                result = _context10.sent;
                return _context10.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function fetchThings(_x14, _x15) {
        return _fetchThings.apply(this, arguments);
      }

      return fetchThings;
    }()
    /**
     * Fetch token
     * @param tokenId token id
     * @returns the token data
     */

  }, {
    key: "fetchTokenById",
    value: function () {
      var _fetchTokenById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(tokenId) {
        var url, response, result, token;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/tokens/:id', {
                  id: tokenId
                });
                _context11.next = 3;
                return fetch(url);

              case 3:
                response = _context11.sent;
                _context11.next = 6;
                return response.json();

              case 6:
                result = _context11.sent;

                if (!(result.token.length === 0)) {
                  _context11.next = 9;
                  break;
                }

                return _context11.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: "".concat(tokenId, " is not a valid token")
                }));

              case 9:
                token = result.token[0];
                return _context11.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: token
                }));

              case 11:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function fetchTokenById(_x16) {
        return _fetchTokenById.apply(this, arguments);
      }

      return fetchTokenById;
    }()
  }, {
    key: "fetchTokens",
    value: function () {
      var _fetchTokens = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(offset, limit) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/tokens/', {
                  limit: limit || this.defaultLimit,
                  offset: offset || 0
                });
                _context12.next = 3;
                return fetch(url);

              case 3:
                response = _context12.sent;
                _context12.next = 6;
                return response.json();

              case 6:
                result = _context12.sent;
                return _context12.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function fetchTokens(_x17, _x18) {
        return _fetchTokens.apply(this, arguments);
      }

      return fetchTokens;
    }()
  }, {
    key: "fetchStoreById",
    value: function () {
      var _fetchStoreById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(storeId) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/stores/:id/', {
                  id: storeId
                });
                _context13.next = 3;
                return fetch(url);

              case 3:
                response = _context13.sent;
                _context13.next = 6;
                return response.json();

              case 6:
                result = _context13.sent;
                return _context13.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function fetchStoreById(_x19) {
        return _fetchStoreById.apply(this, arguments);
      }

      return fetchStoreById;
    }()
  }, {
    key: "fetchStores",
    value: function () {
      var _fetchStores = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(offset, limit) {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/stores/', {
                  limit: limit || this.defaultLimit,
                  offset: offset || 0
                });
                _context14.next = 3;
                return fetch(url);

              case 3:
                response = _context14.sent;
                _context14.next = 6;
                return response.json();

              case 6:
                result = _context14.sent;
                return _context14.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function fetchStores(_x20, _x21) {
        return _fetchStores.apply(this, arguments);
      }

      return fetchStores;
    }()
  }, {
    key: "fetchCategories",
    value: function () {
      var _fetchCategories = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        var url, response, result, categories;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/categories/');
                _context15.next = 3;
                return fetch(url);

              case 3:
                response = _context15.sent;
                _context15.next = 6;
                return response.json();

              case 6:
                result = _context15.sent;
                categories = result.thing.map(function (category) {
                  return category.memo;
                });
                return _context15.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: categories
                }));

              case 9:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function fetchCategories() {
        return _fetchCategories.apply(this, arguments);
      }

      return fetchCategories;
    }()
  }, {
    key: "fetchStats",
    value: function () {
      var _fetchStats = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        var url, response, result;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                url = (0, _urlcat["default"])("".concat(this.apiBaseUrl, "/api/rest/"), '/stats/');
                _context16.next = 3;
                return fetch(url);

              case 3:
                response = _context16.sent;
                _context16.next = 6;
                return response.json();

              case 6:
                result = _context16.sent;
                return _context16.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 8:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function fetchStats() {
        return _fetchStats.apply(this, arguments);
      }

      return fetchStats;
    }()
    /**
     * Checks whether account owns a token or not.
     * @param tokenId token id
     * @param accountId account id
     * @returns whether an account owns a token or not.
     */

  }, {
    key: "isTokenOwner",
    value: function () {
      var _isTokenOwner = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(accountId, tokenKey) {
        var _yield$this$fetchToke, token, data;

        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this.fetchTokenById(tokenKey);

              case 2:
                _yield$this$fetchToke = _context17.sent;
                token = _yield$this$fetchToke.data;

                if (token) {
                  _context17.next = 6;
                  break;
                }

                return _context17.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: false
                }));

              case 6:
                data = (token === null || token === void 0 ? void 0 : token.ownerId) === accountId;
                return _context17.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 8:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function isTokenOwner(_x22, _x23) {
        return _isTokenOwner.apply(this, arguments);
      }

      return isTokenOwner;
    }()
    /**
     * Fetch metadata from Arweave
     * @param id arweave content identifier
     * @returns metadata
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

  }, {
    key: "fetchMetadata",
    value: function () {
      var _fetchMetadata = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(url) {
        var request, data;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return fetch(url);

              case 2:
                request = _context18.sent;

                if (request.ok) {
                  _context18.next = 5;
                  break;
                }

                return _context18.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Not found'
                }));

              case 5:
                _context18.next = 7;
                return request.json();

              case 7:
                data = _context18.sent;
                return _context18.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 9:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18);
      }));

      function fetchMetadata(_x24) {
        return _fetchMetadata.apply(this, arguments);
      }

      return fetchMetadata;
    }()
    /**
     * Makes custom GraphQL query
     * @param query custom GraphQL query
     * @param variables object with variables passed to the query
     * @returns result of query
     */

  }, {
    key: "custom",
    value: function () {
      var _custom = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(query, variables) {
        var url, data;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                url = (0, _urlcat["default"])(this.apiBaseUrl, '/v1/graphql');
                _context19.prev = 1;
                _context19.next = 4;
                return (0, _graphqlRequest.request)(url, query, variables);

              case 4:
                data = _context19.sent;
                return _context19.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 8:
                _context19.prev = 8;
                _context19.t0 = _context19["catch"](1);
                return _context19.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _context19.t0.message
                }));

              case 11:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this, [[1, 8]]);
      }));

      function custom(_x25, _x26) {
        return _custom.apply(this, arguments);
      }

      return custom;
    }()
  }]);

  return API;
}();

exports.API = API;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcGkudHMiXSwibmFtZXMiOlsiQVBJIiwiYXBpQ29uZmlnIiwiQVBJX0JBU0VfTkVBUl9URVNUTkVUIiwiQ2hhaW4iLCJuZWFyIiwiY29uc3RhbnRzIiwibmV0d29ya05hbWUiLCJOZXR3b3JrIiwidGVzdG5ldCIsImNoYWluIiwiYXBpQmFzZVVybCIsIm1haW5uZXQiLCJBUElfQkFTRV9ORUFSX01BSU5ORVQiLCJjaGFpbk5hbWUiLCJvZmZzZXQiLCJsaW1pdCIsInVybCIsImRlZmF1bHRMaW1pdCIsImZldGNoIiwicmVzcG9uc2UiLCJqc29uIiwicmVzdWx0IiwicHJvbWlzZXMiLCJsaXN0IiwibWFwIiwiYmFzZVVyaSIsInRva2VuIiwidGhpbmciLCJzdG9yZSIsIm1ldGFJZCIsIm1ldGFkYXRhVXJpIiwiZmV0Y2hNZXRhZGF0YSIsIm1ldGFkYXRhIiwiZGF0YSIsIlByb21pc2UiLCJhbGwiLCJhY2NvdW50SWQiLCJ0b2tlbktleSIsImNvbnRyYWN0QWRkcmVzcyIsInRoaW5nSWQiLCJpZCIsImxlbmd0aCIsImVycm9yIiwidG9rZW5JZCIsInN0b3JlSWQiLCJjYXRlZ29yaWVzIiwiY2F0ZWdvcnkiLCJtZW1vIiwiZmV0Y2hUb2tlbkJ5SWQiLCJvd25lcklkIiwicmVxdWVzdCIsIm9rIiwicXVlcnkiLCJ2YXJpYWJsZXMiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBT0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7SUFDYUEsRztBQVFYLGVBQVlDLFNBQVosRUFBMEM7QUFBQTs7QUFBQSx3Q0FQZEMsZ0NBT2M7O0FBQUEsMENBTnBCLEVBTW9COztBQUFBLHVDQUxmQyxhQUFNQyxJQUtTOztBQUFBOztBQUFBOztBQUN4QyxTQUFLQyxTQUFMLEdBQWlCSixTQUFTLENBQUNJLFNBQTNCO0FBRUEsU0FBS0MsV0FBTCxHQUFtQkwsU0FBUyxDQUFDSyxX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QSxPQUFPLENBQUNDLEVBSGY7QUFBQTtBQUFBO0FBQUE7O0FBQUEsbURBSVcscUNBQWU7QUFBRVQsa0JBQUFBLEtBQUssRUFBRTtBQUFULGlCQUFmLENBSlg7O0FBQUE7QUFBQTtBQUFBLHVCQU9xQlEsT0FBTyxDQUFDOUIsSUFBUixFQVByQjs7QUFBQTtBQU9RYSxnQkFBQUEsSUFQUjtBQUFBLG1EQVFTLHFDQUFlO0FBQUVBLGtCQUFBQSxJQUFJLEVBQUpBO0FBQUYsaUJBQWYsQ0FSVDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPOzs7Ozs7OztBQVdBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7NEVBQ0UsbUJBQ0VtQixLQURGLEVBRUVDLFNBRkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSVFyQyxnQkFBQUEsR0FKUixHQUljLHdCQUFPLEtBQUtOLFVBQVosRUFBd0IsYUFBeEIsQ0FKZDtBQUFBO0FBQUE7QUFBQSx1QkFPdUIsNkJBQVFNLEdBQVIsRUFBYW9DLEtBQWIsRUFBb0JDLFNBQXBCLENBUHZCOztBQUFBO0FBT1VwQixnQkFBQUEsSUFQVjtBQUFBLG1EQVFXLHFDQUFlO0FBQUVBLGtCQUFBQSxJQUFJLEVBQUpBO0FBQUYsaUJBQWYsQ0FSWDs7QUFBQTtBQUFBO0FBQUE7QUFBQSxtREFVVyxxQ0FBZTtBQUFFUyxrQkFBQUEsS0FBSyxFQUFFLGNBQU1ZO0FBQWYsaUJBQWYsQ0FWWDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdpc29tb3JwaGljLXVuZmV0Y2gnXG5pbXBvcnQgeyByZXF1ZXN0IH0gZnJvbSAnZ3JhcGhxbC1yZXF1ZXN0J1xuaW1wb3J0IHVybGNhdCBmcm9tICd1cmxjYXQnXG5cbmltcG9ydCB7XG4gIE1pbnRiYXNlQVBJQ29uZmlnLFxuICBOZXR3b3JrLFxuICBDaGFpbixcbiAgQ29uc3RhbnRzLFxuICBNaW50TWV0YWRhdGEsXG59IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBBUElfQkFTRV9ORUFSX01BSU5ORVQsIEFQSV9CQVNFX05FQVJfVEVTVE5FVCB9IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgZm9ybWF0UmVzcG9uc2UsIFJlc3BvbnNlRGF0YSB9IGZyb20gJy4vdXRpbHMvcmVzcG9uc2VCdWlsZGVyJ1xuXG4vKipcbiAqIE1pbnRiYXNlIEFQSS5cbiAqIE1haW4gZW50cnkgcG9pbnQgZm9yIHVzZXJzIHJlYWQgTWludGJhc2UgZGF0YS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFQSSB7XG4gIHB1YmxpYyBhcGlCYXNlVXJsOiBzdHJpbmcgPSBBUElfQkFTRV9ORUFSX1RFU1RORVRcbiAgcHVibGljIGRlZmF1bHRMaW1pdCA9IDIwXG4gIHB1YmxpYyBjaGFpbk5hbWU6IHN0cmluZyA9IENoYWluLm5lYXJcbiAgcHVibGljIG5ldHdvcmtOYW1lOiBOZXR3b3JrIHwgdW5kZWZpbmVkXG5cbiAgcHVibGljIGNvbnN0YW50czogQ29uc3RhbnRzXG5cbiAgY29uc3RydWN0b3IoYXBpQ29uZmlnOiBNaW50YmFzZUFQSUNvbmZpZykge1xuICAgIHRoaXMuY29uc3RhbnRzID0gYXBpQ29uZmlnLmNvbnN0YW50c1xuXG4gICAgdGhpcy5uZXR3b3JrTmFtZSA9IGFwaUNvbmZpZy5uZXR3b3JrTmFtZSB8fCBOZXR3b3JrLnRlc3RuZXRcblxuICAgIHN3aXRjaCAoYXBpQ29uZmlnLmNoYWluKSB7XG4gICAgICBjYXNlIENoYWluLm5lYXI6XG4gICAgICAgIGlmICh0aGlzLm5ldHdvcmtOYW1lID09PSBOZXR3b3JrLnRlc3RuZXQpIHtcbiAgICAgICAgICB0aGlzLmFwaUJhc2VVcmwgPVxuICAgICAgICAgICAgdGhpcy5jb25zdGFudHMuQVBJX0JBU0VfTkVBUl9URVNUTkVUIHx8XG4gICAgICAgICAgICBhcGlDb25maWcuYXBpQmFzZVVybCB8fFxuICAgICAgICAgICAgQVBJX0JBU0VfTkVBUl9URVNUTkVUXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5uZXR3b3JrTmFtZSA9PT0gTmV0d29yay5tYWlubmV0KSB7XG4gICAgICAgICAgdGhpcy5hcGlCYXNlVXJsID1cbiAgICAgICAgICAgIHRoaXMuY29uc3RhbnRzLkFQSV9CQVNFX05FQVJfTUFJTk5FVCB8fFxuICAgICAgICAgICAgYXBpQ29uZmlnLmFwaUJhc2VVcmwgfHxcbiAgICAgICAgICAgIEFQSV9CQVNFX05FQVJfTUFJTk5FVFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hhaW5OYW1lID0gQ2hhaW4ubmVhclxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5hcGlCYXNlVXJsID1cbiAgICAgICAgICB0aGlzLmNvbnN0YW50cy5BUElfQkFTRV9ORUFSX1RFU1RORVQgfHxcbiAgICAgICAgICBhcGlDb25maWcuYXBpQmFzZVVybCB8fFxuICAgICAgICAgIEFQSV9CQVNFX05FQVJfVEVTVE5FVFxuICAgICAgICB0aGlzLmNoYWluTmFtZSA9IGFwaUNvbmZpZy5jaGFpbiB8fCBDaGFpbi5uZWFyXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIG1hcmtldHBsYWNlIGFuZCBlYWNoIHRva2VuJ3MgbWV0YWRhdGEgKHcvIGN1cnNvciBvZmZzZXQgcGFnaW5hdGlvbiBlbmFibGVkKS5cbiAgICogQHBhcmFtIGxpbWl0IG51bWJlciBvZiByZXN1bHRzXG4gICAqIEBwYXJhbSBvZmZzZXQgbnVtYmVyIG9mIHJlY29yZHMgdG8gc2tpcFxuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgcHVibGljIGFzeW5jIGZldGNoTWFya2V0cGxhY2UoXG4gICAgb2Zmc2V0PzogbnVtYmVyLFxuICAgIGxpbWl0PzogbnVtYmVyXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGFueT4+IHtcbiAgICBjb25zdCB1cmwgPSB1cmxjYXQoYCR7dGhpcy5hcGlCYXNlVXJsfS9hcGkvcmVzdC9gLCAnL21hcmtldHBsYWNlJywge1xuICAgICAgbGltaXQ6IGxpbWl0IHx8IHRoaXMuZGVmYXVsdExpbWl0LFxuICAgICAgb2Zmc2V0OiBvZmZzZXQgfHwgMCxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICBjb25zdCBwcm9taXNlcyA9IHJlc3VsdC5saXN0Lm1hcChhc3luYyAobGlzdDogYW55KSA9PiB7XG4gICAgICBjb25zdCBiYXNlVXJpID0gbGlzdC50b2tlbi50aGluZy5zdG9yZS5iYXNlVXJpXG4gICAgICBjb25zdCBtZXRhSWQgPSBsaXN0LnRva2VuLnRoaW5nLm1ldGFJZFxuICAgICAgY29uc3QgbWV0YWRhdGFVcmkgPSB1cmxjYXQoYmFzZVVyaSwgbWV0YUlkKVxuICAgICAgY29uc3QgeyBkYXRhOiBtZXRhZGF0YSB9ID0gYXdhaXQgdGhpcy5mZXRjaE1ldGFkYXRhKG1ldGFkYXRhVXJpKVxuXG4gICAgICByZXR1cm4geyAuLi5saXN0LCBtZXRhZGF0YSB9XG4gICAgfSlcblxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGEgfSlcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIHB1YmxpYyBhc3luYyBmZXRjaEFjY291bnQoYWNjb3VudElkOiBzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxhbnk+PiB7XG4gICAgY29uc3QgdXJsID0gdXJsY2F0KGAke3RoaXMuYXBpQmFzZVVybH0vYXBpL3Jlc3QvYCwgJy9hY2NvdW50cy86YWNjb3VudElkJywge1xuICAgICAgYWNjb3VudElkOiBhY2NvdW50SWQsXG4gICAgfSlcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogcmVzdWx0IH0pXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZmV0Y2hUb2tlbkFwcHJvdmFscyhcbiAgICB0b2tlbktleTogc3RyaW5nLFxuICAgIGNvbnRyYWN0QWRkcmVzczogc3RyaW5nXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGFueT4+IHtcbiAgICBjb25zdCB1cmwgPSB1cmxjYXQoYCR7dGhpcy5hcGlCYXNlVXJsfS9hcGkvcmVzdC9gLCAnL3Rva2VuLWFwcHJvdmFscycsIHtcbiAgICAgIGFjY291bnRJZDogY29udHJhY3RBZGRyZXNzLFxuICAgICAgdG9rZW5LZXk6IHRva2VuS2V5LFxuICAgIH0pXG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybClcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHJlc3VsdCB9KVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGZldGNoQXBwcm92YWxzKFxuICAgIG9mZnNldD86IG51bWJlcixcbiAgICBsaW1pdD86IG51bWJlclxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxhbnk+PiB7XG4gICAgY29uc3QgdXJsID0gdXJsY2F0KGAke3RoaXMuYXBpQmFzZVVybH0vYXBpL3Jlc3QvYCwgJy9hcHByb3ZhbHMvJywge1xuICAgICAgbGltaXQ6IGxpbWl0IHx8IHRoaXMuZGVmYXVsdExpbWl0LFxuICAgICAgb2Zmc2V0OiBvZmZzZXQgfHwgMCxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiByZXN1bHQgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCB0aGluZyBtZXRhZGF0YS5cbiAgICogQHBhcmFtIHRoaW5nSWQgVGhpbmcgSWRcbiAgICogQHJldHVybnMgdG9rZW4gbWV0YWRhdGFcbiAgICovXG4gIHB1YmxpYyBhc3luYyBmZXRjaFRoaW5nTWV0YWRhdGEoXG4gICAgdGhpbmdJZDogc3RyaW5nXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPE1pbnRNZXRhZGF0YT4+IHtcbiAgICBjb25zdCB1cmwgPSB1cmxjYXQoYCR7dGhpcy5hcGlCYXNlVXJsfS9hcGkvcmVzdC9gLCAnL3RoaW5ncy86aWQnLCB7XG4gICAgICBpZDogdGhpbmdJZCxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICBpZiAocmVzdWx0LnRoaW5nLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiBgJHt0aGluZ0lkfSBpcyBub3QgYSB2YWxpZCB0aGluZy5gIH0pXG5cbiAgICBjb25zdCB0aGluZyA9IHJlc3VsdC50aGluZ1swXVxuXG4gICAgY29uc3QgbWV0YWRhdGFVcmkgPSB1cmxjYXQodGhpbmcuc3RvcmUuYmFzZVVyaSwgdGhpbmcubWV0YUlkKVxuICAgIGNvbnN0IHsgZGF0YTogbWV0YWRhdGEsIGVycm9yIH0gPSBhd2FpdCB0aGlzLmZldGNoTWV0YWRhdGEobWV0YWRhdGFVcmkpXG5cbiAgICBpZiAoZXJyb3IpIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yIH0pXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiBtZXRhZGF0YSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIGxpc3QgYnkgaWQuXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBwdWJsaWMgYXN5bmMgZmV0Y2hMaXN0QnlJZChpZDogc3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZURhdGE8YW55Pj4ge1xuICAgIGNvbnN0IHVybCA9IHVybGNhdChgJHt0aGlzLmFwaUJhc2VVcmx9L2FwaS9yZXN0L2AsICcvbGlzdHMvOmlkJywge1xuICAgICAgaWQ6IGlkLFxuICAgIH0pXG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybClcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgIGlmIChyZXN1bHQubGlzdC5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogYE5vIHJlc3VsdHMgZm9yICR7aWR9YCB9KVxuXG4gICAgY29uc3QgbGlzdCA9IHJlc3VsdC5saXN0WzBdXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiBsaXN0IH0pXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBwdWJsaWMgYXN5bmMgZmV0Y2hMaXN0cyhcbiAgICBvZmZzZXQ/OiBudW1iZXIsXG4gICAgbGltaXQ/OiBudW1iZXJcbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8YW55Pj4ge1xuICAgIGNvbnN0IHVybCA9IHVybGNhdChgJHt0aGlzLmFwaUJhc2VVcmx9L2FwaS9yZXN0L2AsICcvbGlzdHMvJywge1xuICAgICAgbGltaXQ6IGxpbWl0IHx8IHRoaXMuZGVmYXVsdExpbWl0LFxuICAgICAgb2Zmc2V0OiBvZmZzZXQgfHwgMCxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiByZXN1bHQgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCB0aGluZyBieSBJZFxuICAgKiBUT0RPOiBOb3QgeWV0IGltcGxlbWVudGVkXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZmV0Y2hUaGluZ0J5SWQodGhpbmdJZDogc3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZURhdGE8YW55Pj4ge1xuICAgIGNvbnN0IHVybCA9IHVybGNhdChgJHt0aGlzLmFwaUJhc2VVcmx9L2FwaS9yZXN0L2AsICcvdGhpbmdzLzppZCcsIHtcbiAgICAgIGlkOiB0aGluZ0lkLFxuICAgIH0pXG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybClcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHJlc3VsdCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIHRoaW5nLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGZldGNoVGhpbmdzKFxuICAgIG9mZnNldD86IG51bWJlcixcbiAgICBsaW1pdD86IG51bWJlclxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxhbnk+PiB7XG4gICAgY29uc3QgdXJsID0gdXJsY2F0KGAke3RoaXMuYXBpQmFzZVVybH0vYXBpL3Jlc3QvYCwgJy90aGluZ3MvJywge1xuICAgICAgbGltaXQ6IGxpbWl0IHx8IHRoaXMuZGVmYXVsdExpbWl0LFxuICAgICAgb2Zmc2V0OiBvZmZzZXQgfHwgMCxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiByZXN1bHQgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCB0b2tlblxuICAgKiBAcGFyYW0gdG9rZW5JZCB0b2tlbiBpZFxuICAgKiBAcmV0dXJucyB0aGUgdG9rZW4gZGF0YVxuICAgKi9cbiAgcHVibGljIGFzeW5jIGZldGNoVG9rZW5CeUlkKHRva2VuSWQ6IHN0cmluZyk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGFueT4+IHtcbiAgICBjb25zdCB1cmwgPSB1cmxjYXQoYCR7dGhpcy5hcGlCYXNlVXJsfS9hcGkvcmVzdC9gLCAnL3Rva2Vucy86aWQnLCB7XG4gICAgICBpZDogdG9rZW5JZCxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICBpZiAocmVzdWx0LnRva2VuLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiBgJHt0b2tlbklkfSBpcyBub3QgYSB2YWxpZCB0b2tlbmAgfSlcblxuICAgIGNvbnN0IHRva2VuID0gcmVzdWx0LnRva2VuWzBdXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiB0b2tlbiB9KVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGZldGNoVG9rZW5zKFxuICAgIG9mZnNldD86IG51bWJlcixcbiAgICBsaW1pdD86IG51bWJlclxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxhbnk+PiB7XG4gICAgY29uc3QgdXJsID0gdXJsY2F0KGAke3RoaXMuYXBpQmFzZVVybH0vYXBpL3Jlc3QvYCwgJy90b2tlbnMvJywge1xuICAgICAgbGltaXQ6IGxpbWl0IHx8IHRoaXMuZGVmYXVsdExpbWl0LFxuICAgICAgb2Zmc2V0OiBvZmZzZXQgfHwgMCxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiByZXN1bHQgfSlcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBmZXRjaFN0b3JlQnlJZChzdG9yZUlkOiBzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxhbnk+PiB7XG4gICAgY29uc3QgdXJsID0gdXJsY2F0KGAke3RoaXMuYXBpQmFzZVVybH0vYXBpL3Jlc3QvYCwgJy9zdG9yZXMvOmlkLycsIHtcbiAgICAgIGlkOiBzdG9yZUlkLFxuICAgIH0pXG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybClcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHJlc3VsdCB9KVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGZldGNoU3RvcmVzKFxuICAgIG9mZnNldD86IG51bWJlcixcbiAgICBsaW1pdD86IG51bWJlclxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxhbnk+PiB7XG4gICAgY29uc3QgdXJsID0gdXJsY2F0KGAke3RoaXMuYXBpQmFzZVVybH0vYXBpL3Jlc3QvYCwgJy9zdG9yZXMvJywge1xuICAgICAgbGltaXQ6IGxpbWl0IHx8IHRoaXMuZGVmYXVsdExpbWl0LFxuICAgICAgb2Zmc2V0OiBvZmZzZXQgfHwgMCxcbiAgICB9KVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiByZXN1bHQgfSlcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBmZXRjaENhdGVnb3JpZXMoKTogUHJvbWlzZTxSZXNwb25zZURhdGE8YW55Pj4ge1xuICAgIGNvbnN0IHVybCA9IHVybGNhdChgJHt0aGlzLmFwaUJhc2VVcmx9L2FwaS9yZXN0L2AsICcvY2F0ZWdvcmllcy8nKVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICBjb25zdCBjYXRlZ29yaWVzID0gcmVzdWx0LnRoaW5nLm1hcChcbiAgICAgIChjYXRlZ29yeTogeyBtZW1vOiBhbnkgfSkgPT4gY2F0ZWdvcnkubWVtb1xuICAgIClcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IGNhdGVnb3JpZXMgfSlcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBmZXRjaFN0YXRzKCk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGFueT4+IHtcbiAgICBjb25zdCB1cmwgPSB1cmxjYXQoYCR7dGhpcy5hcGlCYXNlVXJsfS9hcGkvcmVzdC9gLCAnL3N0YXRzLycpXG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybClcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHJlc3VsdCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIGFjY291bnQgb3ducyBhIHRva2VuIG9yIG5vdC5cbiAgICogQHBhcmFtIHRva2VuSWQgdG9rZW4gaWRcbiAgICogQHBhcmFtIGFjY291bnRJZCBhY2NvdW50IGlkXG4gICAqIEByZXR1cm5zIHdoZXRoZXIgYW4gYWNjb3VudCBvd25zIGEgdG9rZW4gb3Igbm90LlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGlzVG9rZW5Pd25lcihcbiAgICBhY2NvdW50SWQ6IHN0cmluZyxcbiAgICB0b2tlbktleTogc3RyaW5nXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgY29uc3QgeyBkYXRhOiB0b2tlbiB9ID0gYXdhaXQgdGhpcy5mZXRjaFRva2VuQnlJZCh0b2tlbktleSlcblxuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IGZhbHNlIH0pXG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHRva2VuPy5vd25lcklkID09PSBhY2NvdW50SWRcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGEgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBtZXRhZGF0YSBmcm9tIEFyd2VhdmVcbiAgICogQHBhcmFtIGlkIGFyd2VhdmUgY29udGVudCBpZGVudGlmaWVyXG4gICAqIEByZXR1cm5zIG1ldGFkYXRhXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBwdWJsaWMgYXN5bmMgZmV0Y2hNZXRhZGF0YSh1cmw6IHN0cmluZyk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGFueT4+IHtcbiAgICBjb25zdCByZXF1ZXN0ID0gYXdhaXQgZmV0Y2godXJsKVxuXG4gICAgaWYgKCFyZXF1ZXN0Lm9rKSB7XG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ05vdCBmb3VuZCcgfSlcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVxdWVzdC5qc29uKClcbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhIH0pXG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgY3VzdG9tIEdyYXBoUUwgcXVlcnlcbiAgICogQHBhcmFtIHF1ZXJ5IGN1c3RvbSBHcmFwaFFMIHF1ZXJ5XG4gICAqIEBwYXJhbSB2YXJpYWJsZXMgb2JqZWN0IHdpdGggdmFyaWFibGVzIHBhc3NlZCB0byB0aGUgcXVlcnlcbiAgICogQHJldHVybnMgcmVzdWx0IG9mIHF1ZXJ5XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY3VzdG9tPFQ+KFxuICAgIHF1ZXJ5OiBzdHJpbmcsXG4gICAgdmFyaWFibGVzPzogdW5rbm93blxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxUPj4ge1xuICAgIGNvbnN0IHVybCA9IHVybGNhdCh0aGlzLmFwaUJhc2VVcmwsICcvdjEvZ3JhcGhxbCcpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcXVlc3QodXJsLCBxdWVyeSwgdmFyaWFibGVzKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YSB9KVxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiBlcnJvci5tZXNzYWdlIH0pXG4gICAgfVxuICB9XG59XG4iXX0=