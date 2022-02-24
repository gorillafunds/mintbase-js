"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wallet = void 0;

require("isomorphic-unfetch");

var _browserOrNode = require("browser-or-node");

var _nearApiJs = require("near-api-js");

var _bn = _interopRequireDefault(require("bn.js"));

var _api = require("./api");

var _types = require("./types");

var _constants = require("./constants");

var _minter = require("./minter");

var _nearCosts = require("./utils/near-costs");

var _externalConstants = require("./utils/external-constants");

var _responseBuilder = require("./utils/responseBuilder");

var _message = require("./utils/message");

var _tweetnacl = require("tweetnacl");

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
 * Mintbase Wallet.
 * Main entry point for users to sign and interact with NEAR and Mintbase infrastructure.
 */
var Wallet = /*#__PURE__*/function () {
  /**
   * Mintbase wallet constructor.
   * Creates an instance of a Mintbase wallet.
   * @param apiConfig api confuguration options.
   * @returns the wallet instance
   */
  function Wallet() {
    var _this = this;

    _classCallCheck(this, Wallet);

    _defineProperty(this, "api", void 0);

    _defineProperty(this, "activeWallet", void 0);

    _defineProperty(this, "activeNearConnection", void 0);

    _defineProperty(this, "activeAccount", void 0);

    _defineProperty(this, "networkName", _types.Network.testnet);

    _defineProperty(this, "chain", _types.Chain.near);

    _defineProperty(this, "keyStore", void 0);

    _defineProperty(this, "nearConfig", void 0);

    _defineProperty(this, "minter", void 0);

    _defineProperty(this, "constants", void 0);

    _defineProperty(this, "rpcCall", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
        var _ref$headers, headers, _ref$body, body, method, request, data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref$headers = _ref.headers, headers = _ref$headers === void 0 ? {} : _ref$headers, _ref$body = _ref.body, body = _ref$body === void 0 ? {} : _ref$body, method = _ref.method;

                if (_this.nearConfig) {
                  _context.next = 3;
                  break;
                }

                throw new Error('NEAR Config not defined.');

              case 3:
                _context.next = 5;
                return fetch(_this.nearConfig.nodeUrl, {
                  method: 'POST',
                  body: JSON.stringify(_objectSpread(_objectSpread({}, body), {}, {
                    jsonrpc: '2.0',
                    id: "mintbase-".concat(Math.random().toString().substr(2, 10)),
                    method: method
                  })),
                  headers: _objectSpread(_objectSpread({}, headers), {}, {
                    'Content-Type': 'application/json'
                  })
                });

              case 5:
                request = _context.sent;
                _context.next = 8;
                return request.json();

              case 8:
                data = _context.sent;
                return _context.abrupt("return", data === null || data === void 0 ? void 0 : data.result);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(this, "viewAccessKey", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(accountId, publicKey) {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this.rpcCall({
                  body: {
                    params: {
                      request_type: 'view_access_key',
                      finality: 'final',
                      account_id: accountId,
                      public_key: publicKey
                    }
                  },
                  method: 'query'
                });

              case 2:
                result = _context2.sent;
                return _context2.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2, _x3) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty(this, "viewAccessKeyList", /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(accountId) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _this.rpcCall({
                  body: {
                    params: {
                      request_type: 'view_access_key_list',
                      finality: 'final',
                      account_id: accountId
                    }
                  },
                  method: 'query'
                });

              case 2:
                result = _context3.sent;
                return _context3.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());

    _defineProperty(this, "transactionStatus", /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(transactionHash, accountId) {
        var result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this.rpcCall({
                  body: {
                    params: [transactionHash, accountId]
                  },
                  method: 'tx'
                });

              case 2:
                result = _context4.sent;
                return _context4.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x5, _x6) {
        return _ref5.apply(this, arguments);
      };
    }());

    _defineProperty(this, "transactionStatusWithReceipts", /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(transactionHash, accountId) {
        var result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _this.rpcCall({
                  body: {
                    params: [transactionHash, accountId]
                  },
                  method: 'EXPERIMENTAL_tx_status'
                });

              case 2:
                result = _context5.sent;
                return _context5.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: result
                }));

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x7, _x8) {
        return _ref6.apply(this, arguments);
      };
    }());

    this.constants = {};
  }

  _createClass(Wallet, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(walletConfig) {
        var data;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return (0, _externalConstants.initializeExternalConstants)({
                  apiKey: walletConfig.apiKey,
                  networkName: walletConfig.networkName || this.networkName
                });

              case 3:
                this.constants = _context6.sent;
                this.api = new _api.API({
                  networkName: walletConfig.networkName || this.networkName,
                  chain: walletConfig.chain || this.chain,
                  constants: this.constants
                });
                this.networkName = walletConfig.networkName || _types.Network.testnet;
                this.chain = walletConfig.chain || _types.Chain.near;
                this.nearConfig = this.getNearConfig(this.networkName);
                this.keyStore = this.getKeyStore();
                this.minter = new _minter.Minter({
                  apiKey: walletConfig.apiKey,
                  constants: this.constants
                });
                _context6.next = 12;
                return this.connect();

              case 12:
                data = {
                  wallet: this,
                  isConnected: this.isConnected()
                }; // TODO: decide if we should really return the formatted response or the atual instance

                return _context6.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 16:
                _context6.prev = 16;
                _context6.t0 = _context6["catch"](0);
                return _context6.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _context6.t0
                }));

              case 19:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 16]]);
      }));

      function init(_x9) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "isConnected",
    value: function isConnected() {
      var _this$activeWallet$is, _this$activeWallet;

      return (_this$activeWallet$is = (_this$activeWallet = this.activeWallet) === null || _this$activeWallet === void 0 ? void 0 : _this$activeWallet.isSignedIn()) !== null && _this$activeWallet$is !== void 0 ? _this$activeWallet$is : false;
    }
    /**
     * Creates a connection to a NEAR smart contract
     * @param props wallet connection properties - the config to create a connection with
     *
     */

  }, {
    key: "connect",
    value: function () {
      var _connect2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var props,
            contractAddress,
            _connectionObject,
            near,
            _accountId,
            privateKey,
            _connectionObject2,
            _near,
            _accountId2,
            _args7 = arguments;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                props = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
                contractAddress = props.contractAddress || this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME;

                if (!_browserOrNode.isBrowser) {
                  _context7.next = 23;
                  break;
                }

                _connectionObject = _objectSpread({
                  deps: {
                    keyStore: this.getKeyStore()
                  }
                }, this.getNearConfig(this.networkName, contractAddress));
                _context7.next = 6;
                return (0, _nearApiJs.connect)(_connectionObject);

              case 6:
                near = _context7.sent;
                this.activeNearConnection = near;
                this.activeWallet = new _nearApiJs.WalletAccount(near, _constants.DEFAULT_APP_NAME);

                if (!(props !== null && props !== void 0 && props.requestSignIn)) {
                  _context7.next = 13;
                  break;
                }

                this.activeWallet.requestSignIn(contractAddress, _constants.DEFAULT_APP_NAME);
                _context7.next = 18;
                break;

              case 13:
                if (!this.activeWallet.isSignedIn()) {
                  _context7.next = 18;
                  break;
                }

                _accountId = this.activeWallet.getAccountId();
                _context7.next = 17;
                return this.activeNearConnection.account(_accountId);

              case 17:
                this.activeAccount = _context7.sent;

              case 18:
                _context7.next = 20;
                return (0, _nearApiJs.connect)(_connectionObject);

              case 20:
                return _context7.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: 'connected'
                }));

              case 23:
                if (!_browserOrNode.isNode) {
                  _context7.next = 39;
                  break;
                }

                privateKey = props.privateKey;

                if (privateKey) {
                  _context7.next = 27;
                  break;
                }

                return _context7.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Private key is not defined.'
                }));

              case 27:
                this.setSessionKeyPair(this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME, privateKey);
                _connectionObject2 = _objectSpread({
                  deps: {
                    keyStore: this.getKeyStore()
                  }
                }, this.getNearConfig(this.networkName, contractAddress));
                _near = new _nearApiJs.Near(_connectionObject2);
                this.activeNearConnection = _near;
                this.activeWallet = new _nearApiJs.WalletAccount(_near, _constants.DEFAULT_APP_NAME);
                _accountId2 = this.activeWallet.getAccountId();
                _context7.next = 35;
                return this.activeNearConnection.account(_accountId2);

              case 35:
                this.activeAccount = _context7.sent;
                return _context7.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: 'connection activated'
                }));

              case 39:
                return _context7.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Only Browser or Node environment supported.'
                }));

              case 40:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function connect() {
        return _connect2.apply(this, arguments);
      }

      return connect;
    }()
    /**
     * Disconnects user. Removes the LocalStorage entry that
     * represents an authorized wallet account but leaves private keys intact.
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this$activeWallet2;

      (_this$activeWallet2 = this.activeWallet) === null || _this$activeWallet2 === void 0 ? void 0 : _this$activeWallet2.signOut();
      this.activeNearConnection = undefined;
      this.activeAccount = undefined;
      return (0, _responseBuilder.formatResponse)({
        data: 'disconnected'
      });
    }
    /**
     * Connects to a wallet stored on local storage.
     * @param accountId the account identifier to connect.
     * @returns whether connection was successful or not.
     */

  }, {
    key: "connectTo",
    value: function () {
      var _connectTo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(accountId) {
        var _this2 = this;

        var _this$getLocalAccount, localAccounts, _getFullAccessPublicKey, localStorageKey, fullAccessKey;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!_browserOrNode.isNode) {
                  _context9.next = 2;
                  break;
                }

                return _context9.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Node environment does not yet support the connectTo method.'
                }));

              case 2:
                // get localstorage accounts
                _this$getLocalAccount = this.getLocalAccounts(), localAccounts = _this$getLocalAccount.data; // does account user is trying to connect exists in storage?

                if (localAccounts[accountId]) {
                  _context9.next = 5;
                  break;
                }

                return _context9.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: false
                }));

              case 5:
                // get a full access public key with the largest nonce
                _getFullAccessPublicKey = /*#__PURE__*/function () {
                  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(accountId) {
                    var _yield$_this2$viewAcc, keysRequest, fullAccessKeys, highestNonceKey;

                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            _context8.next = 2;
                            return _this2.viewAccessKeyList(accountId);

                          case 2:
                            _yield$_this2$viewAcc = _context8.sent;
                            keysRequest = _yield$_this2$viewAcc.data;
                            // filter by full access keys
                            fullAccessKeys = keysRequest.keys.filter(function (acc) {
                              return acc.access_key.permission === 'FullAccess';
                            }); // get the highest nonce key

                            highestNonceKey = fullAccessKeys.reduce(function (acc, curr) {
                              var _acc$access_key, _curr$access_key;

                              return (acc === null || acc === void 0 ? void 0 : (_acc$access_key = acc.access_key) === null || _acc$access_key === void 0 ? void 0 : _acc$access_key.nonce) > (curr === null || curr === void 0 ? void 0 : (_curr$access_key = curr.access_key) === null || _curr$access_key === void 0 ? void 0 : _curr$access_key.nonce) ? acc : curr;
                            });
                            return _context8.abrupt("return", highestNonceKey);

                          case 7:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8);
                  }));

                  return function _getFullAccessPublicKey(_x11) {
                    return _ref7.apply(this, arguments);
                  };
                }();

                if (!_browserOrNode.isBrowser) {
                  _context9.next = 14;
                  break;
                }

                localStorageKey = "".concat(_constants.DEFAULT_APP_NAME).concat(_constants.NEAR_LOCAL_STORAGE_KEY_SUFFIX);
                _context9.next = 10;
                return _getFullAccessPublicKey(accountId);

              case 10:
                fullAccessKey = _context9.sent;
                localStorage.setItem(localStorageKey, JSON.stringify({
                  accountId: accountId,
                  allKeys: [fullAccessKey.public_key]
                }));
                this.connect();
                return _context9.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 14:
                return _context9.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: false
                }));

              case 15:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function connectTo(_x10) {
        return _connectTo.apply(this, arguments);
      }

      return connectTo;
    }()
    /**
     * Fetches connected account details.
     * @returns details of the current connection.
     */

  }, {
    key: "details",
    value: function () {
      var _details = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var _this$activeWallet3, _this$activeNearConne;

        var account, accountId, _yield$this$getSessio, keyPair, publicKey, balance, _yield$this$viewAcces, accessKey, allowance, contractName, data;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                account = (_this$activeWallet3 = this.activeWallet) === null || _this$activeWallet3 === void 0 ? void 0 : _this$activeWallet3.account();
                accountId = account === null || account === void 0 ? void 0 : account.accountId;
                _context10.next = 4;
                return this.getSessionKeyPair();

              case 4:
                _yield$this$getSessio = _context10.sent;
                keyPair = _yield$this$getSessio.data;

                if (!(!account || !accountId)) {
                  _context10.next = 8;
                  break;
                }

                return _context10.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 8:
                if (!(!keyPair || !accountId)) {
                  _context10.next = 10;
                  break;
                }

                return _context10.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: "No Key Pair for account ".concat(accountId)
                }));

              case 10:
                publicKey = keyPair.getPublicKey().toString();
                _context10.next = 13;
                return account.getAccountBalance();

              case 13:
                balance = _context10.sent;

                if (balance) {
                  _context10.next = 16;
                  break;
                }

                return _context10.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: ''
                }));

              case 16:
                _context10.next = 18;
                return this.viewAccessKey(accountId, publicKey);

              case 18:
                _yield$this$viewAcces = _context10.sent;
                accessKey = _yield$this$viewAcces.data;
                allowance = _nearApiJs.utils.format.formatNearAmount(accessKey.permission.FunctionCall.allowance);
                contractName = (_this$activeNearConne = this.activeNearConnection) === null || _this$activeNearConne === void 0 ? void 0 : _this$activeNearConne.config.contractName;
                data = {
                  accountId: accountId,
                  balance: _nearApiJs.utils.format.formatNearAmount(balance === null || balance === void 0 ? void 0 : balance.total, 2),
                  allowance: allowance,
                  contractName: contractName
                };
                return _context10.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 24:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function details() {
        return _details.apply(this, arguments);
      }

      return details;
    }()
    /**
     * Transfer one or more tokens.
     * @param tokenIds The mapping of transfers, defined by: [[accountName1, tokenId1], [accountName2, tokenId2]]
     * @param contractName The contract name to transfer tokens from.
     */
    // TODO: need more checks on the tokenIds

  }, {
    key: "transfer",
    value: function () {
      var _transfer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(tokenIds, contractName) {
        var _this$activeWallet4, _this$activeWallet5;

        var account, accountId, contract;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                account = (_this$activeWallet4 = this.activeWallet) === null || _this$activeWallet4 === void 0 ? void 0 : _this$activeWallet4.account();
                accountId = (_this$activeWallet5 = this.activeWallet) === null || _this$activeWallet5 === void 0 ? void 0 : _this$activeWallet5.account().accountId;

                if (!(!account || !accountId)) {
                  _context11.next = 4;
                  break;
                }

                return _context11.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 4:
                if (contractName) {
                  _context11.next = 6;
                  break;
                }

                return _context11.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'No contract was provided.'
                }));

              case 6:
                contract = new _nearApiJs.Contract(account, contractName, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context11.next = 9;
                return contract.nft_batch_transfer({
                  token_ids: tokenIds
                }, _constants.MAX_GAS, _constants.ONE_YOCTO);

              case 9:
                return _context11.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 10:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function transfer(_x12, _x13) {
        return _transfer.apply(this, arguments);
      }

      return transfer;
    }()
    /**
     * Transfer one token.
     * @param tokenId The token id to transfer.
     * @param receiverId The account id to transfer to.
     * @param contractName The contract name to transfer tokens from.
     */
    // TODO: need more checks on the tokenIds

  }, {
    key: "simpleTransfer",
    value: function () {
      var _simpleTransfer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(tokenId, receiverId, contractName) {
        var _this$activeWallet6, _this$activeWallet7;

        var account, accountId, contract;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                account = (_this$activeWallet6 = this.activeWallet) === null || _this$activeWallet6 === void 0 ? void 0 : _this$activeWallet6.account();
                accountId = (_this$activeWallet7 = this.activeWallet) === null || _this$activeWallet7 === void 0 ? void 0 : _this$activeWallet7.account().accountId;

                if (!(!account || !accountId)) {
                  _context12.next = 4;
                  break;
                }

                return _context12.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 4:
                if (contractName) {
                  _context12.next = 6;
                  break;
                }

                return _context12.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'No contract was provided.'
                }));

              case 6:
                contract = new _nearApiJs.Contract(account, contractName, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context12.next = 9;
                return contract.nft_transfer({
                  receiver_id: receiverId,
                  token_id: tokenId
                }, _constants.MAX_GAS, _constants.ONE_YOCTO);

              case 9:
                return _context12.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 10:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function simpleTransfer(_x14, _x15, _x16) {
        return _simpleTransfer.apply(this, arguments);
      }

      return simpleTransfer;
    }()
    /**
     * Burn one or more tokens from the same contract.
     * @param contractName The contract name to burn tokens from.
     * @param tokenIds An array containing token ids to be burnt.
     */

  }, {
    key: "burn",
    value: function () {
      var _burn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(tokenIds) {
        var _this$activeWallet8, _this$activeWallet9;

        var account, accountId, contractName, isSameContract, contract, burnIds;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                account = (_this$activeWallet8 = this.activeWallet) === null || _this$activeWallet8 === void 0 ? void 0 : _this$activeWallet8.account();
                accountId = (_this$activeWallet9 = this.activeWallet) === null || _this$activeWallet9 === void 0 ? void 0 : _this$activeWallet9.account().accountId;
                contractName = tokenIds[0].split(':')[1];
                isSameContract = tokenIds.every(function (id) {
                  var split = id.split(':');
                  if (split.length === 2) return split[1] === contractName;
                  return false;
                });

                if (isSameContract) {
                  _context13.next = 6;
                  break;
                }

                return _context13.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Tokens need to be all from the same contract.'
                }));

              case 6:
                if (!(!account || !accountId)) {
                  _context13.next = 8;
                  break;
                }

                return _context13.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 8:
                if (contractName) {
                  _context13.next = 10;
                  break;
                }

                return _context13.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'No contract was provided.'
                }));

              case 10:
                contract = new _nearApiJs.Contract(account, contractName, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                });
                burnIds = tokenIds.map(function (id) {
                  return id.split(':')[0];
                }); // @ts-ignore: method does not exist on Contract type

                _context13.next = 14;
                return contract.nft_batch_burn({
                  token_ids: burnIds
                }, _constants.MAX_GAS, _constants.ONE_YOCTO);

              case 14:
                return _context13.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 15:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function burn(_x17) {
        return _burn.apply(this, arguments);
      }

      return burn;
    }()
    /**
     * List an item for sale in the market.
     * @param tokenId The token id list.
     * @param storeId The token store id (contract name).
     * @param price The listing price.
     * @param splitOwners List of splits.
     */

  }, {
    key: "batchList",
    value: function () {
      var _batchList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(tokenId, storeId, price, options) {
        var _this$activeWallet10, _this$activeWallet11, _options$autotransfer;

        var account, accountId, gas, contract, listCost;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                account = (_this$activeWallet10 = this.activeWallet) === null || _this$activeWallet10 === void 0 ? void 0 : _this$activeWallet10.account();
                accountId = (_this$activeWallet11 = this.activeWallet) === null || _this$activeWallet11 === void 0 ? void 0 : _this$activeWallet11.account().accountId;
                gas = !(options !== null && options !== void 0 && options.gas) ? _constants.MAX_GAS : new _bn["default"](options === null || options === void 0 ? void 0 : options.gas);

                if (!(!account || !accountId)) {
                  _context14.next = 5;
                  break;
                }

                return _context14.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                // TODO: Check if account owns the tokens that are trying to sell

                /*const token: Token = await this.api.fetchToken(
                  tokenId,
                  `${tokenId}:${storeId}`
                )
                 const isOwner = token.ownerId === accountId
                if (!isOwner) throw new Error('User does not own token.')*/
                contract = new _nearApiJs.Contract(account, storeId, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // TODO: Checks on split_owners

                listCost = (0, _nearCosts.calculateListCost)(tokenId.length); // @ts-ignore: method does not exist on Contract type

                _context14.next = 9;
                return contract.nft_batch_approve({
                  token_ids: tokenId,
                  account_id: (options === null || options === void 0 ? void 0 : options.marketAddress) || this.constants.MARKET_ADDRESS || "0.".concat(this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME),
                  msg: JSON.stringify({
                    price: price,
                    autotransfer: (_options$autotransfer = options === null || options === void 0 ? void 0 : options.autotransfer) !== null && _options$autotransfer !== void 0 ? _options$autotransfer : true
                  })
                }, gas, _nearApiJs.utils.format.parseNearAmount(listCost.toString()));

              case 9:
                return _context14.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 10:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function batchList(_x18, _x19, _x20, _x21) {
        return _batchList.apply(this, arguments);
      }

      return batchList;
    }()
    /**
     * List an item for sale in the market.
     * @param tokenId The token id.
     * @param storeId The token store id (contract name).
     * @param price The listing price.
     * @param splitOwners List of splits.
     */

  }, {
    key: "list",
    value: function () {
      var _list = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(tokenId, storeId, price, options) {
        var _this$activeWallet12, _this$activeWallet13, _options$autotransfer2;

        var account, accountId, gas, contract, listCost;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                account = (_this$activeWallet12 = this.activeWallet) === null || _this$activeWallet12 === void 0 ? void 0 : _this$activeWallet12.account();
                accountId = (_this$activeWallet13 = this.activeWallet) === null || _this$activeWallet13 === void 0 ? void 0 : _this$activeWallet13.account().accountId;
                gas = !(options !== null && options !== void 0 && options.gas) ? _constants.MAX_GAS : new _bn["default"](options === null || options === void 0 ? void 0 : options.gas);

                if (!(!account || !accountId)) {
                  _context15.next = 5;
                  break;
                }

                return _context15.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                // TODO: Check if account owns the tokens that are trying to sell

                /*const token: Token = await this.api.fetchToken(
                  tokenId,
                  `${tokenId}:${storeId}`
                )
                 const isOwner = token.ownerId === accountId
                if (!isOwner) throw new Error('User does not own token.')*/
                contract = new _nearApiJs.Contract(account, storeId, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // TODO: Checks on split_owners

                listCost = (0, _nearCosts.calculateListCost)(1); // @ts-ignore: method does not exist on Contract type

                _context15.next = 9;
                return contract.nft_approve({
                  token_id: tokenId,
                  account_id: (options === null || options === void 0 ? void 0 : options.marketAddress) || this.constants.MARKET_ADDRESS || "0.".concat(this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME),
                  msg: JSON.stringify({
                    price: price,
                    autotransfer: (_options$autotransfer2 = options === null || options === void 0 ? void 0 : options.autotransfer) !== null && _options$autotransfer2 !== void 0 ? _options$autotransfer2 : true
                  })
                }, gas, _nearApiJs.utils.format.parseNearAmount(listCost.toString()));

              case 9:
                return _context15.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 10:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function list(_x22, _x23, _x24, _x25) {
        return _list.apply(this, arguments);
      }

      return list;
    }()
  }, {
    key: "revokeAccount",
    value: function () {
      var _revokeAccount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(tokenId, storeId, accountRevokeId) {
        var _this$activeWallet14, _this$activeWallet15;

        var account, accountId, contract;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                account = (_this$activeWallet14 = this.activeWallet) === null || _this$activeWallet14 === void 0 ? void 0 : _this$activeWallet14.account();
                accountId = (_this$activeWallet15 = this.activeWallet) === null || _this$activeWallet15 === void 0 ? void 0 : _this$activeWallet15.account().accountId;

                if (!(!account || !accountId)) {
                  _context16.next = 4;
                  break;
                }

                return _context16.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 4:
                contract = new _nearApiJs.Contract(account, storeId, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context16.next = 7;
                return contract.nft_revoke({
                  token_id: tokenId,
                  account_id: accountRevokeId
                }, _constants.MAX_GAS);

              case 7:
                return _context16.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 8:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function revokeAccount(_x26, _x27, _x28) {
        return _revokeAccount.apply(this, arguments);
      }

      return revokeAccount;
    }()
  }, {
    key: "revokeAllAccounts",
    value: function () {
      var _revokeAllAccounts = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(tokenId, storeId) {
        var _this$activeWallet16, _this$activeWallet17;

        var account, accountId, GAS, contract;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                account = (_this$activeWallet16 = this.activeWallet) === null || _this$activeWallet16 === void 0 ? void 0 : _this$activeWallet16.account();
                accountId = (_this$activeWallet17 = this.activeWallet) === null || _this$activeWallet17 === void 0 ? void 0 : _this$activeWallet17.account().accountId;
                GAS = new _bn["default"]('300000000000000');

                if (!(!account || !accountId)) {
                  _context17.next = 5;
                  break;
                }

                return _context17.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                contract = new _nearApiJs.Contract(account, storeId, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context17.next = 8;
                return contract.nft_revoke_all({
                  token_id: tokenId
                }, GAS);

              case 8:
                return _context17.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 9:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function revokeAllAccounts(_x29, _x30) {
        return _revokeAllAccounts.apply(this, arguments);
      }

      return revokeAllAccounts;
    }()
    /**
     * Make an offer to a token from a group.
     * @param groupId
     * @param price
     */

  }, {
    key: "makeGroupOffer",
    value: function () {
      var _makeGroupOffer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(groupId, price, options) {
        var _this$activeWallet18, _this$activeWallet19;

        var account, accountId, gas, _yield$this$api$fetch, list, error, contract, setPrice;

        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                account = (_this$activeWallet18 = this.activeWallet) === null || _this$activeWallet18 === void 0 ? void 0 : _this$activeWallet18.account();
                accountId = (_this$activeWallet19 = this.activeWallet) === null || _this$activeWallet19 === void 0 ? void 0 : _this$activeWallet19.account().accountId;
                gas = !(options !== null && options !== void 0 && options.gas) ? _constants.MAX_GAS : new _bn["default"](options === null || options === void 0 ? void 0 : options.gas);

                if (!(!account || !accountId)) {
                  _context18.next = 5;
                  break;
                }

                return _context18.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                if (!groupId) (0, _responseBuilder.formatResponse)({
                  error: 'Please provide a groupId'
                });

                if (this.api) {
                  _context18.next = 8;
                  break;
                }

                return _context18.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'API is not defined.'
                }));

              case 8:
                _context18.next = 10;
                return this.api.fetchListById(groupId);

              case 10:
                _yield$this$api$fetch = _context18.sent;
                list = _yield$this$api$fetch.data;
                error = _yield$this$api$fetch.error;

                if (!error) {
                  _context18.next = 15;
                  break;
                }

                return _context18.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: error
                }));

              case 15:
                contract = new _nearApiJs.Contract(account, (options === null || options === void 0 ? void 0 : options.marketAddress) || this.constants.MARKET_ADDRESS || "0.".concat(this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME), {
                  viewMethods: this.constants.MARKET_CONTRACT_VIEW_METHODS || _constants.MARKET_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.MARKET_CONTRACT_CALL_METHODS || _constants.MARKET_CONTRACT_CALL_METHODS
                });
                setPrice = price || list.price; // @ts-ignore: method does not exist on Contract type

                _context18.next = 19;
                return contract.make_offer({
                  token_key: list.token.id,
                  price: setPrice,
                  timeout: {
                    Hours: _constants.TWENTY_FOUR
                  }
                }, gas, setPrice);

              case 19:
                return _context18.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 20:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function makeGroupOffer(_x31, _x32, _x33) {
        return _makeGroupOffer.apply(this, arguments);
      }

      return makeGroupOffer;
    }()
    /**
     * Make an offer to multiple tokens.
     * @param tokenIds: Array of tokenIds
     * @param price: Price of each token
     */

  }, {
    key: "batchMakeOffer",
    value: function () {
      var _batchMakeOffer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(tokenIds, prices, options) {
        var _this$activeWallet20, _this$activeWallet21;

        var account, accountId, gas, contract, totalPrice;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                account = (_this$activeWallet20 = this.activeWallet) === null || _this$activeWallet20 === void 0 ? void 0 : _this$activeWallet20.account();
                accountId = (_this$activeWallet21 = this.activeWallet) === null || _this$activeWallet21 === void 0 ? void 0 : _this$activeWallet21.account().accountId;
                gas = !(options !== null && options !== void 0 && options.gas) ? _constants.MAX_GAS : new _bn["default"](options === null || options === void 0 ? void 0 : options.gas);

                if (!(!account || !accountId)) {
                  _context19.next = 5;
                  break;
                }

                return _context19.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                contract = new _nearApiJs.Contract(account, (options === null || options === void 0 ? void 0 : options.marketAddress) || this.constants.MARKET_ADDRESS || "0.".concat(this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME), {
                  viewMethods: this.constants.MARKET_CONTRACT_VIEW_METHODS || _constants.MARKET_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.MARKET_CONTRACT_CALL_METHODS || _constants.MARKET_CONTRACT_CALL_METHODS
                });
                totalPrice = prices.reduce(function (acc, curr) {
                  return acc.add(new _bn["default"](curr));
                }, new _bn["default"](0)); // @ts-ignore: method does not exist on Contract type

                _context19.next = 9;
                return contract.make_offer({
                  token_key: tokenIds,
                  price: prices,
                  timeout: Array(tokenIds.length).fill({
                    Hours: _constants.TWENTY_FOUR
                  })
                }, gas, totalPrice.toString());

              case 9:
                return _context19.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 10:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function batchMakeOffer(_x34, _x35, _x36) {
        return _batchMakeOffer.apply(this, arguments);
      }

      return batchMakeOffer;
    }()
    /**
     * Make an offer to a token.
     * @param tokenId
     * @param price
     */

  }, {
    key: "makeOffer",
    value: function () {
      var _makeOffer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(tokenId, price, options) {
        var _this$activeWallet22, _this$activeWallet23;

        var account, accountId, gas, contract;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                account = (_this$activeWallet22 = this.activeWallet) === null || _this$activeWallet22 === void 0 ? void 0 : _this$activeWallet22.account();
                accountId = (_this$activeWallet23 = this.activeWallet) === null || _this$activeWallet23 === void 0 ? void 0 : _this$activeWallet23.account().accountId;
                gas = !(options !== null && options !== void 0 && options.gas) ? _constants.MAX_GAS : new _bn["default"](options === null || options === void 0 ? void 0 : options.gas);

                if (!(!account || !accountId)) {
                  _context20.next = 5;
                  break;
                }

                return _context20.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                if (tokenId) {
                  _context20.next = 7;
                  break;
                }

                return _context20.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Please provide a tokenId'
                }));

              case 7:
                contract = new _nearApiJs.Contract(account, (options === null || options === void 0 ? void 0 : options.marketAddress) || this.constants.MARKET_ADDRESS || "0.".concat(this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME), {
                  viewMethods: this.constants.MARKET_CONTRACT_VIEW_METHODS || _constants.MARKET_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.MARKET_CONTRACT_CALL_METHODS || _constants.MARKET_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context20.next = 10;
                return contract.make_offer({
                  token_key: [tokenId],
                  price: [price],
                  timeout: [{
                    Hours: _constants.TWENTY_FOUR
                  }]
                }, gas, price);

              case 10:
                return _context20.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 11:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function makeOffer(_x37, _x38, _x39) {
        return _makeOffer.apply(this, arguments);
      }

      return makeOffer;
    }()
    /**
     * Make an offer to a token.
     * @param tokenId
     * @param price
     */

  }, {
    key: "acceptAndTransfer",
    value: function () {
      var _acceptAndTransfer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(tokenId, options) {
        var _this$activeWallet24, _this$activeWallet25;

        var account, accountId, gas, contract;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                account = (_this$activeWallet24 = this.activeWallet) === null || _this$activeWallet24 === void 0 ? void 0 : _this$activeWallet24.account();
                accountId = (_this$activeWallet25 = this.activeWallet) === null || _this$activeWallet25 === void 0 ? void 0 : _this$activeWallet25.account().accountId;
                gas = !(options !== null && options !== void 0 && options.gas) ? _constants.MAX_GAS : new _bn["default"](options === null || options === void 0 ? void 0 : options.gas);

                if (!(!account || !accountId)) {
                  _context21.next = 5;
                  break;
                }

                return _context21.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                if (tokenId) {
                  _context21.next = 7;
                  break;
                }

                return _context21.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Please provide a tokenId'
                }));

              case 7:
                contract = new _nearApiJs.Contract(account, (options === null || options === void 0 ? void 0 : options.marketAddress) || this.constants.MARKET_ADDRESS || "0.".concat(this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME), {
                  viewMethods: this.constants.MARKET_CONTRACT_VIEW_METHODS || _constants.MARKET_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.MARKET_CONTRACT_CALL_METHODS || _constants.MARKET_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context21.next = 10;
                return contract.accept_and_transfer({
                  token_key: tokenId
                }, gas, _constants.ONE_YOCTO);

              case 10:
                return _context21.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 11:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function acceptAndTransfer(_x40, _x41) {
        return _acceptAndTransfer.apply(this, arguments);
      }

      return acceptAndTransfer;
    }()
    /**
     *  Withdraw the escrow deposited for an offer.
     * @param tokenKey The token key. `<tokenId>:<contractName>`
     */

  }, {
    key: "withdrawOffer",
    value: function () {
      var _withdrawOffer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(tokenKey, options) {
        var _this$activeWallet26, _this$activeWallet27;

        var account, accountId, gas, contract;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                account = (_this$activeWallet26 = this.activeWallet) === null || _this$activeWallet26 === void 0 ? void 0 : _this$activeWallet26.account();
                accountId = (_this$activeWallet27 = this.activeWallet) === null || _this$activeWallet27 === void 0 ? void 0 : _this$activeWallet27.account().accountId;
                gas = !(options !== null && options !== void 0 && options.gas) ? _constants.MAX_GAS : new _bn["default"](options === null || options === void 0 ? void 0 : options.gas);

                if (!(!account || !accountId)) {
                  _context22.next = 5;
                  break;
                }

                return _context22.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                contract = new _nearApiJs.Contract(account, (options === null || options === void 0 ? void 0 : options.marketAddress) || this.constants.MARKET_ADDRESS || "0.".concat(this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME), {
                  viewMethods: this.constants.MARKET_CONTRACT_VIEW_METHODS || _constants.MARKET_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.MARKET_CONTRACT_CALL_METHODS || _constants.MARKET_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context22.next = 8;
                return contract.withdraw_offer({
                  token_key: tokenKey
                }, gas);

              case 8:
                return _context22.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 9:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function withdrawOffer(_x42, _x43) {
        return _withdrawOffer.apply(this, arguments);
      }

      return withdrawOffer;
    }()
    /**
     * Creates a store
     * @param storeId Store name
     * @param symbol Store symbol
     */

  }, {
    key: "deployStore",
    value: function () {
      var _deployStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(storeId, symbol, options) {
        var _this$activeWallet28, _this$activeWallet29, _options$icon;

        var account, accountId, gas, contract, storeData, attachedDeposit;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                account = (_this$activeWallet28 = this.activeWallet) === null || _this$activeWallet28 === void 0 ? void 0 : _this$activeWallet28.account();
                accountId = (_this$activeWallet29 = this.activeWallet) === null || _this$activeWallet29 === void 0 ? void 0 : _this$activeWallet29.account().accountId;
                gas = !(options !== null && options !== void 0 && options.gas) ? _constants.MAX_GAS : new _bn["default"](options === null || options === void 0 ? void 0 : options.gas);

                if (!(!account || !accountId)) {
                  _context23.next = 5;
                  break;
                }

                return _context23.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 5:
                // TODO: regex check inputs (storeId and symbol)
                contract = new _nearApiJs.Contract(account, this.constants.FACTORY_CONTRACT_NAME || _constants.FACTORY_CONTRACT_NAME, {
                  viewMethods: this.constants.FACTORY_CONTRACT_VIEW_METHODS || _constants.FACTORY_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.FACTORY_CONTRACT_CALL_METHODS || _constants.FACTORY_CONTRACT_CALL_METHODS
                });
                storeData = {
                  owner_id: accountId,
                  metadata: {
                    spec: 'nft-1.0.0',
                    name: storeId.replace(/[^a-z0-9]+/gim, '').toLowerCase(),
                    symbol: symbol.replace(/[^a-z0-9]+/gim, '').toLowerCase(),
                    icon: (_options$icon = options === null || options === void 0 ? void 0 : options.icon) !== null && _options$icon !== void 0 ? _options$icon : _constants.MINTBASE_32x32_BASE64_DARK_LOGO,
                    base_uri: this.constants.BASE_ARWEAVE_URI || _constants.BASE_ARWEAVE_URI,
                    reference: null,
                    reference_hash: null
                  }
                };
                attachedDeposit = !(options !== null && options !== void 0 && options.attachedDeposit) ? _constants.DEPLOY_STORE_COST : new _bn["default"](options === null || options === void 0 ? void 0 : options.attachedDeposit); // @ts-ignore: method does not exist on Contract type

                _context23.next = 10;
                return contract.create_store(storeData, gas, attachedDeposit);

              case 10:
                return _context23.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 11:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function deployStore(_x44, _x45, _x46) {
        return _deployStore.apply(this, arguments);
      }

      return deployStore;
    }()
    /**
     * Transfers ownership of a store
     * @param newOwner
     * @param keepOldMinters
     */

  }, {
    key: "transferStoreOwnership",
    value: function () {
      var _transferStoreOwnership = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(newOwner, contractName, options) {
        var _this$activeWallet30, _this$activeWallet31;

        var account, accountId, contract, keepOldMinters;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                account = (_this$activeWallet30 = this.activeWallet) === null || _this$activeWallet30 === void 0 ? void 0 : _this$activeWallet30.account();
                accountId = (_this$activeWallet31 = this.activeWallet) === null || _this$activeWallet31 === void 0 ? void 0 : _this$activeWallet31.account().accountId;

                if (!(!account || !accountId)) {
                  _context24.next = 4;
                  break;
                }

                return _context24.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 4:
                if (contractName) {
                  _context24.next = 6;
                  break;
                }

                return _context24.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'No contract was provided.'
                }));

              case 6:
                contract = new _nearApiJs.Contract(account, contractName, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                });
                keepOldMinters = (options === null || options === void 0 ? void 0 : options.keepOldMinters) || true; // @ts-ignore: method does not exist on Contract type

                _context24.next = 10;
                return contract.transfer_store_ownership({
                  new_owner: newOwner,
                  keep_old_minters: keepOldMinters
                }, _constants.MAX_GAS, _constants.ONE_YOCTO);

              case 10:
                return _context24.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 11:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function transferStoreOwnership(_x47, _x48, _x49) {
        return _transferStoreOwnership.apply(this, arguments);
      }

      return transferStoreOwnership;
    }()
    /**
     * Mint a token
     * @param amount The number of tokens to mint.
     * @param contractName The contract in which tokens will be minted.
     */

  }, {
    key: "mint",
    value: function () {
      var _mint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(amount, contractName, royalties, splits, category) {
        var _this$activeWallet32, _this$activeWallet33;

        var account, accountId, contract, _yield$this$minter$ge, metadataId, obj;

        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                account = (_this$activeWallet32 = this.activeWallet) === null || _this$activeWallet32 === void 0 ? void 0 : _this$activeWallet32.account();
                accountId = (_this$activeWallet33 = this.activeWallet) === null || _this$activeWallet33 === void 0 ? void 0 : _this$activeWallet33.account().accountId;

                if (!(!account || !accountId)) {
                  _context25.next = 4;
                  break;
                }

                return _context25.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 4:
                if (contractName) {
                  _context25.next = 6;
                  break;
                }

                return _context25.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'No contract was provided.'
                }));

              case 6:
                contract = new _nearApiJs.Contract(account, contractName, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // TODO: Check if minter has a valid object to mint.

                if (this.minter) {
                  _context25.next = 9;
                  break;
                }

                return _context25.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Minter not defined.'
                }));

              case 9:
                _context25.next = 11;
                return this.minter.getMetadataId();

              case 11:
                _yield$this$minter$ge = _context25.sent;
                metadataId = _yield$this$minter$ge.data;
                obj = {
                  owner_id: accountId,
                  metadata: {
                    reference: metadataId,
                    // TODO: check if category is lowercase
                    extra: !category ? null : category
                  },
                  num_to_mint: amount,
                  royalty_args: !royalties ? null : {
                    split_between: royalties,
                    percentage: _constants.DEFAULT_ROYALTY_PERCENT
                  },
                  split_owners: splits || null
                }; // @ts-ignore: method does not exist on Contract type

                _context25.next = 16;
                return contract.nft_batch_mint(obj, _constants.MAX_GAS, _constants.ONE_YOCTO);

              case 16:
                return _context25.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 17:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function mint(_x50, _x51, _x52, _x53, _x54) {
        return _mint.apply(this, arguments);
      }

      return mint;
    }()
    /**
     * Batch mint serveral tokens
     */

  }, {
    key: "batchMint",
    value: function batchMint() {
      console.log("Hello");
    }
    /**
     * Mint more pieces of tokens of a thing.
     * @param amount The number of tokens to mint.
     * @param id The thing id
     * @param splits The contract in which tokens will be minted.
     */

  }, {
    key: "mintMore",
    value: function () {
      var _mintMore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(amount, id, splits) {
        var _this$activeWallet34, _this$activeWallet35;

        var account, accountId, _yield$this$api$custo, data, error, _thing, thing, contractName, memo, metaId, token, contract, _royalties, obj;

        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                account = (_this$activeWallet34 = this.activeWallet) === null || _this$activeWallet34 === void 0 ? void 0 : _this$activeWallet34.account();
                accountId = (_this$activeWallet35 = this.activeWallet) === null || _this$activeWallet35 === void 0 ? void 0 : _this$activeWallet35.account().accountId;

                if (!(!account || !accountId)) {
                  _context26.next = 4;
                  break;
                }

                throw new Error('Account is undefined.');

              case 4:
                if (this.api) {
                  _context26.next = 6;
                  break;
                }

                throw new Error('API is not defined.');

              case 6:
                _context26.next = 8;
                return this.api.custom("query GET_THING_BY_ID($id: String!) {\n      thing(where: {id: {_eq: $id}}) {\n        metaId\n        storeId\n        memo\n        tokens {\n          royaltyPercent\n          royaltys {\n            account\n            percent\n          }\n        }\n      }\n    }\n    ", {
                  id: id
                });

              case 8:
                _yield$this$api$custo = _context26.sent;
                data = _yield$this$api$custo.data;
                error = _yield$this$api$custo.error;
                _thing = data.thing;

                if (!(error || _thing.length === 0)) {
                  _context26.next = 14;
                  break;
                }

                return _context26.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Thing does not exist.'
                }));

              case 14:
                thing = _thing[0];

                if (!(thing.tokens.length === 0)) {
                  _context26.next = 17;
                  break;
                }

                return _context26.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Thing does not have tokens.'
                }));

              case 17:
                contractName = thing.storeId;
                memo = thing.memo;
                metaId = thing.metaId;
                token = thing.tokens[0];
                contract = new _nearApiJs.Contract(account, contractName, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                });
                _royalties = token.royaltys.reduce(function (accumulator, _ref8) {
                  var account = _ref8.account,
                      percent = _ref8.percent;
                  return _objectSpread(_objectSpread({}, accumulator), {}, _defineProperty({}, account, percent));
                }, {});
                obj = {
                  owner_id: accountId,
                  metadata: {
                    reference: metaId,
                    extra: memo
                  },
                  num_to_mint: amount,
                  royalty_args: Object.keys(_royalties).length > 0 ? {
                    split_between: _royalties,
                    percentage: token.royaltyPercent
                  } : null,
                  split_owners: splits || null
                }; // @ts-ignore: method does not exist on Contract type

                _context26.next = 26;
                return contract.nft_batch_mint(obj, _constants.MAX_GAS, _constants.ONE_YOCTO);

              case 26:
                return _context26.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 27:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function mintMore(_x55, _x56, _x57) {
        return _mintMore.apply(this, arguments);
      }

      return mintMore;
    }()
  }, {
    key: "grantMinter",
    value: function () {
      var _grantMinter = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(minterAccountId, contractName) {
        var _this$activeWallet36, _this$activeWallet37;

        var account, accountId, contract;
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                account = (_this$activeWallet36 = this.activeWallet) === null || _this$activeWallet36 === void 0 ? void 0 : _this$activeWallet36.account();
                accountId = (_this$activeWallet37 = this.activeWallet) === null || _this$activeWallet37 === void 0 ? void 0 : _this$activeWallet37.account().accountId;

                if (!(!account || !accountId)) {
                  _context27.next = 4;
                  break;
                }

                return _context27.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 4:
                if (contractName) {
                  _context27.next = 6;
                  break;
                }

                return _context27.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'No contract was provided.'
                }));

              case 6:
                contract = new _nearApiJs.Contract(account, contractName, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context27.next = 9;
                return contract.grant_minter({
                  account_id: minterAccountId
                }, _constants.MAX_GAS, _constants.ONE_YOCTO);

              case 9:
                return _context27.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 10:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function grantMinter(_x58, _x59) {
        return _grantMinter.apply(this, arguments);
      }

      return grantMinter;
    }()
  }, {
    key: "revokeMinter",
    value: function () {
      var _revokeMinter = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(minterAccountId, contractName) {
        var _this$activeWallet38, _this$activeWallet39;

        var account, accountId, contract;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                account = (_this$activeWallet38 = this.activeWallet) === null || _this$activeWallet38 === void 0 ? void 0 : _this$activeWallet38.account();
                accountId = (_this$activeWallet39 = this.activeWallet) === null || _this$activeWallet39 === void 0 ? void 0 : _this$activeWallet39.account().accountId;

                if (!(!account || !accountId)) {
                  _context28.next = 4;
                  break;
                }

                return _context28.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'Account is undefined.'
                }));

              case 4:
                if (contractName) {
                  _context28.next = 6;
                  break;
                }

                return _context28.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'No contract was provided.'
                }));

              case 6:
                contract = new _nearApiJs.Contract(account, contractName, {
                  viewMethods: this.constants.STORE_CONTRACT_VIEW_METHODS || _constants.STORE_CONTRACT_VIEW_METHODS,
                  changeMethods: this.constants.STORE_CONTRACT_CALL_METHODS || _constants.STORE_CONTRACT_CALL_METHODS
                }); // @ts-ignore: method does not exist on Contract type

                _context28.next = 9;
                return contract.revoke_minter({
                  account_id: minterAccountId
                }, _constants.MAX_GAS, _constants.ONE_YOCTO);

              case 9:
                return _context28.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: true
                }));

              case 10:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function revokeMinter(_x60, _x61) {
        return _revokeMinter.apply(this, arguments);
      }

      return revokeMinter;
    }()
  }, {
    key: "setSessionKeyPair",
    value: function () {
      var _setSessionKeyPair = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(accountId, privateKey) {
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                if (this.keyStore) {
                  _context29.next = 2;
                  break;
                }

                return _context29.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: 'KeyStore not defined.'
                }));

              case 2:
                this.keyStore.setKey(this.networkName, accountId, _nearApiJs.KeyPair.fromString(privateKey));
                return _context29.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: this.keyStore
                }));

              case 4:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function setSessionKeyPair(_x62, _x63) {
        return _setSessionKeyPair.apply(this, arguments);
      }

      return setSessionKeyPair;
    }()
  }, {
    key: "getSessionKeyPair",
    value: function () {
      var _getSessionKeyPair = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
        var _this$activeWallet40, _this$keyStore;

        var accountId, data;
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                accountId = (_this$activeWallet40 = this.activeWallet) === null || _this$activeWallet40 === void 0 ? void 0 : _this$activeWallet40.getAccountId();

                if (accountId) {
                  _context30.next = 3;
                  break;
                }

                return _context30.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.undefinedAccountId
                }));

              case 3:
                if (this.keyStore) {
                  _context30.next = 5;
                  break;
                }

                return _context30.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.undefinedKeyStore
                }));

              case 5:
                _context30.next = 7;
                return (_this$keyStore = this.keyStore) === null || _this$keyStore === void 0 ? void 0 : _this$keyStore.getKey(this.networkName, accountId);

              case 7:
                data = _context30.sent;
                return _context30.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: data
                }));

              case 9:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function getSessionKeyPair() {
        return _getSessionKeyPair.apply(this, arguments);
      }

      return getSessionKeyPair;
    }()
  }, {
    key: "signMessage",
    value: function () {
      var _signMessage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(message) {
        var _this$activeAccount;

        var _yield$this$getSessio2, keyPair, error, accountId, arrayBuffer, encodedMessage, _keyPair$sign, signature, publicKey;

        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                if (this.isConnected()) {
                  _context31.next = 2;
                  break;
                }

                return _context31.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.walletNotConnected
                }));

              case 2:
                _context31.next = 4;
                return this.getSessionKeyPair();

              case 4:
                _yield$this$getSessio2 = _context31.sent;
                keyPair = _yield$this$getSessio2.data;
                error = _yield$this$getSessio2.error;

                if (!error) {
                  _context31.next = 9;
                  break;
                }

                return _context31.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.invalidKeyPair
                }));

              case 9:
                accountId = (_this$activeAccount = this.activeAccount) === null || _this$activeAccount === void 0 ? void 0 : _this$activeAccount.accountId;

                if (accountId) {
                  _context31.next = 12;
                  break;
                }

                return _context31.abrupt("return", (0, _responseBuilder.formatResponse)({
                  error: _constants.ERROR_MESSAGES.undefinedAccountId
                }));

              case 12:
                arrayBuffer = new TextEncoder().encode(message).buffer;
                encodedMessage = new Uint8Array(arrayBuffer);
                _keyPair$sign = keyPair.sign(encodedMessage), signature = _keyPair$sign.signature, publicKey = _keyPair$sign.publicKey;
                return _context31.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: {
                    signature: Array.from(signature),
                    publicKey: Array.from(publicKey.data),
                    publicKey_str: keyPair.getPublicKey().toString(),
                    accountId: accountId
                  }
                }));

              case 16:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function signMessage(_x64) {
        return _signMessage.apply(this, arguments);
      }

      return signMessage;
    }()
  }, {
    key: "verifySignature",
    value: function () {
      var _verifySignature = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(requestBody) {
        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                return _context32.abrupt("return", _tweetnacl.sign.detached.verify((0, _message.messageEncode)(requestBody.message), new Uint8Array(requestBody.signature), new Uint8Array(requestBody.publicKey)));

              case 1:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32);
      }));

      function verifySignature(_x65) {
        return _verifySignature.apply(this, arguments);
      }

      return verifySignature;
    }()
  }, {
    key: "getKeyStore",
    value: function getKeyStore() {
      if (_browserOrNode.isNode) return new _nearApiJs.keyStores.InMemoryKeyStore();
      if (_browserOrNode.isBrowser) return new _nearApiJs.keyStores.BrowserLocalStorageKeyStore();
      throw new Error('Runtime environment has to be Node or Browser');
    } // private getKeyPairFromLocalstorage() {}

    /**
     * Fetch local storage connections
     */

  }, {
    key: "getLocalAccounts",
    value: function getLocalAccounts() {
      var regex = /near-api-js:keystore:/;
      var keys = Object.keys(localStorage);
      var matches = keys.filter(function (key) {
        return regex.exec(key) !== null;
      });
      var accounts = {};
      matches.forEach(function (key) {
        var accountId = key.split(':')[2];
        accounts = _objectSpread(_objectSpread({}, accounts), {}, _defineProperty({}, accountId, {
          accountId: accountId,
          contractName: '' // TODO: get contractName connection

        }));
      });
      return (0, _responseBuilder.formatResponse)({
        data: accounts
      });
    }
    /**
     * Fetch transaction result given a transaction hash.
     * @param txHash the transaction's hash
     * @returns the transaction result
     */

  }, {
    key: "fetchTransactionResult",
    value: function () {
      var _fetchTransactionResult = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(txHash) {
        var _this$activeNearConne2, _this$activeWallet41;

        var connection, accountId, decodeHash, txResult;
        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                connection = (_this$activeNearConne2 = this.activeNearConnection) === null || _this$activeNearConne2 === void 0 ? void 0 : _this$activeNearConne2.connection;

                if (connection) {
                  _context33.next = 3;
                  break;
                }

                throw new Error('Near connection is undefined.');

              case 3:
                accountId = (_this$activeWallet41 = this.activeWallet) === null || _this$activeWallet41 === void 0 ? void 0 : _this$activeWallet41.account().accountId;

                if (accountId) {
                  _context33.next = 6;
                  break;
                }

                throw new Error('Account Id is undefined.');

              case 6:
                decodeHash = _nearApiJs.utils.serialize.base_decode(txHash);
                _context33.next = 9;
                return connection.provider.txStatus(decodeHash, accountId);

              case 9:
                txResult = _context33.sent;
                return _context33.abrupt("return", (0, _responseBuilder.formatResponse)({
                  data: txResult
                }));

              case 11:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function fetchTransactionResult(_x66) {
        return _fetchTransactionResult.apply(this, arguments);
      }

      return fetchTransactionResult;
    }()
  }, {
    key: "getNearConfig",
    value:
    /**
     * Get NEAR configuration object. Defaults to testnet.
     * @param networkName
     * @param contractAddress
     */
    function getNearConfig(networkName, contractAddress) {
      var _this$constants, _this$constants2, _this$constants3;

      switch (networkName) {
        case _types.Network.testnet:
          return {
            networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
            contractName: contractAddress || ((_this$constants = this.constants) === null || _this$constants === void 0 ? void 0 : _this$constants.FACTORY_CONTRACT_NAME) || _constants.FACTORY_CONTRACT_NAME,
            walletUrl: 'https://wallet.testnet.near.org',
            helperUrl: 'https://helper.testnet.near.org'
          };

        case _types.Network.mainnet:
          return {
            networkId: 'mainnet',
            nodeUrl: 'https://rpc.mainnet.near.org',
            contractName: contractAddress || ((_this$constants2 = this.constants) === null || _this$constants2 === void 0 ? void 0 : _this$constants2.FACTORY_CONTRACT_NAME) || _constants.FACTORY_CONTRACT_NAME,
            walletUrl: 'https://wallet.near.org',
            helperUrl: 'https://helper.mainnet.near.org'
          };

        default:
          return {
            networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
            contractName: contractAddress || ((_this$constants3 = this.constants) === null || _this$constants3 === void 0 ? void 0 : _this$constants3.FACTORY_CONTRACT_NAME) || _constants.FACTORY_CONTRACT_NAME,
            walletUrl: 'https://wallet.testnet.near.org',
            helperUrl: 'https://helper.testnet.near.org'
          };
      }
    }
  }]);

  return Wallet;
}();

exports.Wallet = Wallet;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93YWxsZXQudHMiXSwibmFtZXMiOlsiV2FsbGV0IiwiTmV0d29yayIsInRlc3RuZXQiLCJDaGFpbiIsIm5lYXIiLCJoZWFkZXJzIiwiYm9keSIsIm1ldGhvZCIsIm5lYXJDb25maWciLCJFcnJvciIsImZldGNoIiwibm9kZVVybCIsIkpTT04iLCJzdHJpbmdpZnkiLCJqc29ucnBjIiwiaWQiLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJzdWJzdHIiLCJyZXF1ZXN0IiwianNvbiIsImRhdGEiLCJyZXN1bHQiLCJhY2NvdW50SWQiLCJwdWJsaWNLZXkiLCJycGNDYWxsIiwicGFyYW1zIiwicmVxdWVzdF90eXBlIiwiZmluYWxpdHkiLCJhY2NvdW50X2lkIiwicHVibGljX2tleSIsInRyYW5zYWN0aW9uSGFzaCIsImNvbnN0YW50cyIsIndhbGxldENvbmZpZyIsImFwaUtleSIsIm5ldHdvcmtOYW1lIiwiYXBpIiwiQVBJIiwiY2hhaW4iLCJnZXROZWFyQ29uZmlnIiwia2V5U3RvcmUiLCJnZXRLZXlTdG9yZSIsIm1pbnRlciIsIk1pbnRlciIsImNvbm5lY3QiLCJ3YWxsZXQiLCJpc0Nvbm5lY3RlZCIsImVycm9yIiwiYWN0aXZlV2FsbGV0IiwiaXNTaWduZWRJbiIsInByb3BzIiwiY29udHJhY3RBZGRyZXNzIiwiRkFDVE9SWV9DT05UUkFDVF9OQU1FIiwiaXNCcm93c2VyIiwiX2Nvbm5lY3Rpb25PYmplY3QiLCJkZXBzIiwiYWN0aXZlTmVhckNvbm5lY3Rpb24iLCJXYWxsZXRBY2NvdW50IiwiREVGQVVMVF9BUFBfTkFNRSIsInJlcXVlc3RTaWduSW4iLCJnZXRBY2NvdW50SWQiLCJhY2NvdW50IiwiYWN0aXZlQWNjb3VudCIsImlzTm9kZSIsInByaXZhdGVLZXkiLCJzZXRTZXNzaW9uS2V5UGFpciIsIk5lYXIiLCJzaWduT3V0IiwidW5kZWZpbmVkIiwiZ2V0TG9jYWxBY2NvdW50cyIsImxvY2FsQWNjb3VudHMiLCJfZ2V0RnVsbEFjY2Vzc1B1YmxpY0tleSIsInZpZXdBY2Nlc3NLZXlMaXN0Iiwia2V5c1JlcXVlc3QiLCJmdWxsQWNjZXNzS2V5cyIsImtleXMiLCJmaWx0ZXIiLCJhY2MiLCJhY2Nlc3Nfa2V5IiwicGVybWlzc2lvbiIsImhpZ2hlc3ROb25jZUtleSIsInJlZHVjZSIsImN1cnIiLCJub25jZSIsImxvY2FsU3RvcmFnZUtleSIsIk5FQVJfTE9DQUxfU1RPUkFHRV9LRVlfU1VGRklYIiwiZnVsbEFjY2Vzc0tleSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJhbGxLZXlzIiwiZ2V0U2Vzc2lvbktleVBhaXIiLCJrZXlQYWlyIiwiZ2V0UHVibGljS2V5IiwiZ2V0QWNjb3VudEJhbGFuY2UiLCJiYWxhbmNlIiwidmlld0FjY2Vzc0tleSIsImFjY2Vzc0tleSIsImFsbG93YW5jZSIsInV0aWxzIiwiZm9ybWF0IiwiZm9ybWF0TmVhckFtb3VudCIsIkZ1bmN0aW9uQ2FsbCIsImNvbnRyYWN0TmFtZSIsImNvbmZpZyIsInRvdGFsIiwidG9rZW5JZHMiLCJjb250cmFjdCIsIkNvbnRyYWN0Iiwidmlld01ldGhvZHMiLCJTVE9SRV9DT05UUkFDVF9WSUVXX01FVEhPRFMiLCJjaGFuZ2VNZXRob2RzIiwiU1RPUkVfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTIiwibmZ0X2JhdGNoX3RyYW5zZmVyIiwidG9rZW5faWRzIiwiTUFYX0dBUyIsIk9ORV9ZT0NUTyIsInRva2VuSWQiLCJyZWNlaXZlcklkIiwibmZ0X3RyYW5zZmVyIiwicmVjZWl2ZXJfaWQiLCJ0b2tlbl9pZCIsInNwbGl0IiwiaXNTYW1lQ29udHJhY3QiLCJldmVyeSIsImxlbmd0aCIsImJ1cm5JZHMiLCJtYXAiLCJuZnRfYmF0Y2hfYnVybiIsInN0b3JlSWQiLCJwcmljZSIsIm9wdGlvbnMiLCJnYXMiLCJCTiIsImxpc3RDb3N0IiwibmZ0X2JhdGNoX2FwcHJvdmUiLCJtYXJrZXRBZGRyZXNzIiwiTUFSS0VUX0FERFJFU1MiLCJtc2ciLCJhdXRvdHJhbnNmZXIiLCJwYXJzZU5lYXJBbW91bnQiLCJuZnRfYXBwcm92ZSIsImFjY291bnRSZXZva2VJZCIsIm5mdF9yZXZva2UiLCJHQVMiLCJuZnRfcmV2b2tlX2FsbCIsImdyb3VwSWQiLCJmZXRjaExpc3RCeUlkIiwibGlzdCIsIk1BUktFVF9DT05UUkFDVF9WSUVXX01FVEhPRFMiLCJNQVJLRVRfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTIiwic2V0UHJpY2UiLCJtYWtlX29mZmVyIiwidG9rZW5fa2V5IiwidG9rZW4iLCJ0aW1lb3V0IiwiSG91cnMiLCJUV0VOVFlfRk9VUiIsInByaWNlcyIsInRvdGFsUHJpY2UiLCJhZGQiLCJBcnJheSIsImZpbGwiLCJhY2NlcHRfYW5kX3RyYW5zZmVyIiwidG9rZW5LZXkiLCJ3aXRoZHJhd19vZmZlciIsInN5bWJvbCIsIkZBQ1RPUllfQ09OVFJBQ1RfVklFV19NRVRIT0RTIiwiRkFDVE9SWV9DT05UUkFDVF9DQUxMX01FVEhPRFMiLCJzdG9yZURhdGEiLCJvd25lcl9pZCIsIm1ldGFkYXRhIiwic3BlYyIsIm5hbWUiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJpY29uIiwiTUlOVEJBU0VfMzJ4MzJfQkFTRTY0X0RBUktfTE9HTyIsImJhc2VfdXJpIiwiQkFTRV9BUldFQVZFX1VSSSIsInJlZmVyZW5jZSIsInJlZmVyZW5jZV9oYXNoIiwiYXR0YWNoZWREZXBvc2l0IiwiREVQTE9ZX1NUT1JFX0NPU1QiLCJjcmVhdGVfc3RvcmUiLCJuZXdPd25lciIsImtlZXBPbGRNaW50ZXJzIiwidHJhbnNmZXJfc3RvcmVfb3duZXJzaGlwIiwibmV3X293bmVyIiwia2VlcF9vbGRfbWludGVycyIsImFtb3VudCIsInJveWFsdGllcyIsInNwbGl0cyIsImNhdGVnb3J5IiwiZ2V0TWV0YWRhdGFJZCIsIm1ldGFkYXRhSWQiLCJvYmoiLCJleHRyYSIsIm51bV90b19taW50Iiwicm95YWx0eV9hcmdzIiwic3BsaXRfYmV0d2VlbiIsInBlcmNlbnRhZ2UiLCJERUZBVUxUX1JPWUFMVFlfUEVSQ0VOVCIsInNwbGl0X293bmVycyIsIm5mdF9iYXRjaF9taW50IiwiY29uc29sZSIsImxvZyIsImN1c3RvbSIsIl90aGluZyIsInRoaW5nIiwidG9rZW5zIiwibWVtbyIsIm1ldGFJZCIsIl9yb3lhbHRpZXMiLCJyb3lhbHR5cyIsImFjY3VtdWxhdG9yIiwicGVyY2VudCIsIk9iamVjdCIsInJveWFsdHlQZXJjZW50IiwibWludGVyQWNjb3VudElkIiwiZ3JhbnRfbWludGVyIiwicmV2b2tlX21pbnRlciIsInNldEtleSIsIktleVBhaXIiLCJmcm9tU3RyaW5nIiwiRVJST1JfTUVTU0FHRVMiLCJ1bmRlZmluZWRBY2NvdW50SWQiLCJ1bmRlZmluZWRLZXlTdG9yZSIsImdldEtleSIsIm1lc3NhZ2UiLCJ3YWxsZXROb3RDb25uZWN0ZWQiLCJpbnZhbGlkS2V5UGFpciIsImFycmF5QnVmZmVyIiwiVGV4dEVuY29kZXIiLCJlbmNvZGUiLCJidWZmZXIiLCJlbmNvZGVkTWVzc2FnZSIsIlVpbnQ4QXJyYXkiLCJzaWduIiwic2lnbmF0dXJlIiwiZnJvbSIsInB1YmxpY0tleV9zdHIiLCJyZXF1ZXN0Qm9keSIsImRldGFjaGVkIiwidmVyaWZ5Iiwia2V5U3RvcmVzIiwiSW5NZW1vcnlLZXlTdG9yZSIsIkJyb3dzZXJMb2NhbFN0b3JhZ2VLZXlTdG9yZSIsInJlZ2V4IiwibWF0Y2hlcyIsImtleSIsImV4ZWMiLCJhY2NvdW50cyIsImZvckVhY2giLCJ0eEhhc2giLCJjb25uZWN0aW9uIiwiZGVjb2RlSGFzaCIsInNlcmlhbGl6ZSIsImJhc2VfZGVjb2RlIiwicHJvdmlkZXIiLCJ0eFN0YXR1cyIsInR4UmVzdWx0IiwibmV0d29ya0lkIiwid2FsbGV0VXJsIiwiaGVscGVyVXJsIiwibWFpbm5ldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQVdBOztBQUdBOztBQUNBOztBQVdBOztBQW1CQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBO0FBQ0E7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QUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0UsMkJBQ0VqTyxXQURGLEVBRUVnQixlQUZGLEVBR2M7QUFBQTs7QUFDWixjQUFRaEIsV0FBUjtBQUNFLGFBQUtuQyxlQUFRQyxPQUFiO0FBQ0UsaUJBQU87QUFDTG9RLFlBQUFBLFNBQVMsRUFBRSxTQUROO0FBRUwzUCxZQUFBQSxPQUFPLEVBQUUsOEJBRko7QUFHTDRGLFlBQUFBLFlBQVksRUFDVm5ELGVBQWUsd0JBQ2YsS0FBS25CLFNBRFUsb0RBQ2YsZ0JBQWdCb0IscUJBREQsQ0FBZixJQUVBQSxnQ0FORztBQU9Ma04sWUFBQUEsU0FBUyxFQUFFLGlDQVBOO0FBUUxDLFlBQUFBLFNBQVMsRUFBRTtBQVJOLFdBQVA7O0FBV0YsYUFBS3ZRLGVBQVF3USxPQUFiO0FBQ0UsaUJBQU87QUFDTEgsWUFBQUEsU0FBUyxFQUFFLFNBRE47QUFFTDNQLFlBQUFBLE9BQU8sRUFBRSw4QkFGSjtBQUdMNEYsWUFBQUEsWUFBWSxFQUNWbkQsZUFBZSx5QkFDZixLQUFLbkIsU0FEVSxxREFDZixpQkFBZ0JvQixxQkFERCxDQUFmLElBRUFBLGdDQU5HO0FBT0xrTixZQUFBQSxTQUFTLEVBQUUseUJBUE47QUFRTEMsWUFBQUEsU0FBUyxFQUFFO0FBUk4sV0FBUDs7QUFVRjtBQUNFLGlCQUFPO0FBQ0xGLFlBQUFBLFNBQVMsRUFBRSxTQUROO0FBRUwzUCxZQUFBQSxPQUFPLEVBQUUsOEJBRko7QUFHTDRGLFlBQUFBLFlBQVksRUFDVm5ELGVBQWUseUJBQ2YsS0FBS25CLFNBRFUscURBQ2YsaUJBQWdCb0IscUJBREQsQ0FBZixJQUVBQSxnQ0FORztBQU9Ma04sWUFBQUEsU0FBUyxFQUFFLGlDQVBOO0FBUUxDLFlBQUFBLFNBQVMsRUFBRTtBQVJOLFdBQVA7QUF6Qko7QUFvQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2lzb21vcnBoaWMtdW5mZXRjaCdcbmltcG9ydCB7IGlzQnJvd3NlciwgaXNOb2RlIH0gZnJvbSAnYnJvd3Nlci1vci1ub2RlJ1xuaW1wb3J0IHtcbiAga2V5U3RvcmVzLFxuICBXYWxsZXRBY2NvdW50LFxuICBLZXlQYWlyLFxuICBOZWFyLFxuICBBY2NvdW50LFxuICB1dGlscyxcbiAgV2FsbGV0Q29ubmVjdGlvbixcbiAgQ29udHJhY3QsXG4gIGNvbm5lY3QsXG59IGZyb20gJ25lYXItYXBpLWpzJ1xuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJ1xuaW1wb3J0IHsgS2V5U3RvcmUgfSBmcm9tICduZWFyLWFwaS1qcy9saWIva2V5X3N0b3JlcydcblxuaW1wb3J0IHsgQVBJIH0gZnJvbSAnLi9hcGknXG5pbXBvcnQge1xuICBDaGFpbixcbiAgV2FsbGV0TG9naW5Qcm9wcyxcbiAgTmV0d29yayxcbiAgU3BsaXQsXG4gIFJveWFsdGllcyxcbiAgTkVBUkNvbmZpZyxcbiAgQ29uc3RhbnRzLFxuICBXYWxsZXRDb25maWcsXG59IGZyb20gJy4vdHlwZXMnXG5cbmltcG9ydCB7XG4gIEZBQ1RPUllfQ09OVFJBQ1RfTkFNRSxcbiAgREVGQVVMVF9BUFBfTkFNRSxcbiAgTkVBUl9MT0NBTF9TVE9SQUdFX0tFWV9TVUZGSVgsXG4gIEJBU0VfQVJXRUFWRV9VUkksXG4gIFNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgU1RPUkVfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICBERUZBVUxUX1JPWUFMVFlfUEVSQ0VOVCxcbiAgTUFSS0VUX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgTUFSS0VUX0NPTlRSQUNUX0NBTExfTUVUSE9EUyxcbiAgTUFYX0dBUyxcbiAgT05FX1lPQ1RPLFxuICBERVBMT1lfU1RPUkVfQ09TVCxcbiAgRkFDVE9SWV9DT05UUkFDVF9WSUVXX01FVEhPRFMsXG4gIEZBQ1RPUllfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICBUV0VOVFlfRk9VUixcbiAgTUlOVEJBU0VfMzJ4MzJfQkFTRTY0X0RBUktfTE9HTyxcbiAgRVJST1JfTUVTU0FHRVMsXG59IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgTWludGVyIH0gZnJvbSAnLi9taW50ZXInXG5cbmltcG9ydCB7IGNhbGN1bGF0ZUxpc3RDb3N0IH0gZnJvbSAnLi91dGlscy9uZWFyLWNvc3RzJ1xuaW1wb3J0IHsgaW5pdGlhbGl6ZUV4dGVybmFsQ29uc3RhbnRzIH0gZnJvbSAnLi91dGlscy9leHRlcm5hbC1jb25zdGFudHMnXG5pbXBvcnQgeyBmb3JtYXRSZXNwb25zZSwgUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi91dGlscy9yZXNwb25zZUJ1aWxkZXInXG5pbXBvcnQgeyBGaW5hbEV4ZWN1dGlvbk91dGNvbWUgfSBmcm9tICduZWFyLWFwaS1qcy9saWIvcHJvdmlkZXJzJ1xuaW1wb3J0IHsgbWVzc2FnZUVuY29kZSB9IGZyb20gJy4vdXRpbHMvbWVzc2FnZSdcbmltcG9ydCB7IHNpZ24gfSBmcm9tICd0d2VldG5hY2wnXG4vKipcbiAqIE1pbnRiYXNlIFdhbGxldC5cbiAqIE1haW4gZW50cnkgcG9pbnQgZm9yIHVzZXJzIHRvIHNpZ24gYW5kIGludGVyYWN0IHdpdGggTkVBUiBhbmQgTWludGJhc2UgaW5mcmFzdHJ1Y3R1cmUuXG4gKi9cbmV4cG9ydCBjbGFzcyBXYWxsZXQge1xuICBwdWJsaWMgYXBpOiBBUEkgfCB1bmRlZmluZWRcblxuICBwdWJsaWMgYWN0aXZlV2FsbGV0PzogV2FsbGV0Q29ubmVjdGlvblxuICBwdWJsaWMgYWN0aXZlTmVhckNvbm5lY3Rpb24/OiBOZWFyXG4gIHB1YmxpYyBhY3RpdmVBY2NvdW50PzogQWNjb3VudFxuXG4gIHB1YmxpYyBuZXR3b3JrTmFtZTogTmV0d29yayA9IE5ldHdvcmsudGVzdG5ldFxuICBwdWJsaWMgY2hhaW46IENoYWluID0gQ2hhaW4ubmVhclxuXG4gIHB1YmxpYyBrZXlTdG9yZTogS2V5U3RvcmUgfCB1bmRlZmluZWRcblxuICBwdWJsaWMgbmVhckNvbmZpZzogTkVBUkNvbmZpZyB8IHVuZGVmaW5lZFxuICBwdWJsaWMgbWludGVyOiBNaW50ZXIgfCB1bmRlZmluZWRcblxuICBwdWJsaWMgY29uc3RhbnRzOiBDb25zdGFudHNcblxuICAvKipcbiAgICogTWludGJhc2Ugd2FsbGV0IGNvbnN0cnVjdG9yLlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGEgTWludGJhc2Ugd2FsbGV0LlxuICAgKiBAcGFyYW0gYXBpQ29uZmlnIGFwaSBjb25mdWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIHRoZSB3YWxsZXQgaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uc3RhbnRzID0ge31cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbml0KFxuICAgIHdhbGxldENvbmZpZzogV2FsbGV0Q29uZmlnXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPHsgd2FsbGV0OiBXYWxsZXQ7IGlzQ29ubmVjdGVkOiBib29sZWFuIH0+PiB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY29uc3RhbnRzID0gYXdhaXQgaW5pdGlhbGl6ZUV4dGVybmFsQ29uc3RhbnRzKHtcbiAgICAgICAgYXBpS2V5OiB3YWxsZXRDb25maWcuYXBpS2V5LFxuICAgICAgICBuZXR3b3JrTmFtZTogd2FsbGV0Q29uZmlnLm5ldHdvcmtOYW1lIHx8IHRoaXMubmV0d29ya05hbWUsXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmFwaSA9IG5ldyBBUEkoe1xuICAgICAgICBuZXR3b3JrTmFtZTogd2FsbGV0Q29uZmlnLm5ldHdvcmtOYW1lIHx8IHRoaXMubmV0d29ya05hbWUsXG4gICAgICAgIGNoYWluOiB3YWxsZXRDb25maWcuY2hhaW4gfHwgdGhpcy5jaGFpbixcbiAgICAgICAgY29uc3RhbnRzOiB0aGlzLmNvbnN0YW50cyxcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMubmV0d29ya05hbWUgPSB3YWxsZXRDb25maWcubmV0d29ya05hbWUgfHwgTmV0d29yay50ZXN0bmV0XG4gICAgICB0aGlzLmNoYWluID0gd2FsbGV0Q29uZmlnLmNoYWluIHx8IENoYWluLm5lYXJcbiAgICAgIHRoaXMubmVhckNvbmZpZyA9IHRoaXMuZ2V0TmVhckNvbmZpZyh0aGlzLm5ldHdvcmtOYW1lKVxuICAgICAgdGhpcy5rZXlTdG9yZSA9IHRoaXMuZ2V0S2V5U3RvcmUoKVxuXG4gICAgICB0aGlzLm1pbnRlciA9IG5ldyBNaW50ZXIoe1xuICAgICAgICBhcGlLZXk6IHdhbGxldENvbmZpZy5hcGlLZXksXG4gICAgICAgIGNvbnN0YW50czogdGhpcy5jb25zdGFudHMsXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3QoKVxuXG4gICAgICBjb25zdCBkYXRhID0geyB3YWxsZXQ6IHRoaXMsIGlzQ29ubmVjdGVkOiB0aGlzLmlzQ29ubmVjdGVkKCkgfVxuXG4gICAgICAvLyBUT0RPOiBkZWNpZGUgaWYgd2Ugc2hvdWxkIHJlYWxseSByZXR1cm4gdGhlIGZvcm1hdHRlZCByZXNwb25zZSBvciB0aGUgYXR1YWwgaW5zdGFuY2VcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7XG4gICAgICAgIGRhdGEsXG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yIH0pXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdhbGxldD8uaXNTaWduZWRJbigpID8/IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNvbm5lY3Rpb24gdG8gYSBORUFSIHNtYXJ0IGNvbnRyYWN0XG4gICAqIEBwYXJhbSBwcm9wcyB3YWxsZXQgY29ubmVjdGlvbiBwcm9wZXJ0aWVzIC0gdGhlIGNvbmZpZyB0byBjcmVhdGUgYSBjb25uZWN0aW9uIHdpdGhcbiAgICpcbiAgICovXG4gIHB1YmxpYyBhc3luYyBjb25uZWN0KFxuICAgIHByb3BzOiBXYWxsZXRMb2dpblByb3BzID0ge31cbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8c3RyaW5nPj4ge1xuICAgIGNvbnN0IGNvbnRyYWN0QWRkcmVzcyA9XG4gICAgICBwcm9wcy5jb250cmFjdEFkZHJlc3MgfHxcbiAgICAgIHRoaXMuY29uc3RhbnRzLkZBQ1RPUllfQ09OVFJBQ1RfTkFNRSB8fFxuICAgICAgRkFDVE9SWV9DT05UUkFDVF9OQU1FXG5cbiAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBfY29ubmVjdGlvbk9iamVjdCA9IHtcbiAgICAgICAgZGVwczogeyBrZXlTdG9yZTogdGhpcy5nZXRLZXlTdG9yZSgpIH0sXG4gICAgICAgIC4uLnRoaXMuZ2V0TmVhckNvbmZpZyh0aGlzLm5ldHdvcmtOYW1lLCBjb250cmFjdEFkZHJlc3MpLFxuICAgICAgfVxuXG4gICAgICBjb25zdCBuZWFyID0gYXdhaXQgY29ubmVjdChfY29ubmVjdGlvbk9iamVjdClcbiAgICAgIHRoaXMuYWN0aXZlTmVhckNvbm5lY3Rpb24gPSBuZWFyXG4gICAgICB0aGlzLmFjdGl2ZVdhbGxldCA9IG5ldyBXYWxsZXRBY2NvdW50KG5lYXIsIERFRkFVTFRfQVBQX05BTUUpXG5cbiAgICAgIGlmIChwcm9wcz8ucmVxdWVzdFNpZ25Jbikge1xuICAgICAgICB0aGlzLmFjdGl2ZVdhbGxldC5yZXF1ZXN0U2lnbkluKGNvbnRyYWN0QWRkcmVzcywgREVGQVVMVF9BUFBfTkFNRSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmVXYWxsZXQuaXNTaWduZWRJbigpKSB7XG4gICAgICAgIGNvbnN0IGFjY291bnRJZCA9IHRoaXMuYWN0aXZlV2FsbGV0LmdldEFjY291bnRJZCgpXG5cbiAgICAgICAgdGhpcy5hY3RpdmVBY2NvdW50ID0gYXdhaXQgdGhpcy5hY3RpdmVOZWFyQ29ubmVjdGlvbi5hY2NvdW50KGFjY291bnRJZClcbiAgICAgIH1cblxuICAgICAgYXdhaXQgY29ubmVjdChfY29ubmVjdGlvbk9iamVjdClcbiAgICAgIC8vIFRPRE86IGRlZmluZSBhIHByb3BlciByZXR1cm4gdmFsdWVcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6ICdjb25uZWN0ZWQnIH0pXG4gICAgfSBlbHNlIGlmIChpc05vZGUpIHtcbiAgICAgIGNvbnN0IHByaXZhdGVLZXkgPSBwcm9wcy5wcml2YXRlS2V5XG5cbiAgICAgIGlmICghcHJpdmF0ZUtleSlcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdQcml2YXRlIGtleSBpcyBub3QgZGVmaW5lZC4nIH0pXG5cbiAgICAgIHRoaXMuc2V0U2Vzc2lvbktleVBhaXIoXG4gICAgICAgIHRoaXMuY29uc3RhbnRzLkZBQ1RPUllfQ09OVFJBQ1RfTkFNRSB8fCBGQUNUT1JZX0NPTlRSQUNUX05BTUUsXG4gICAgICAgIHByaXZhdGVLZXlcbiAgICAgIClcblxuICAgICAgY29uc3QgX2Nvbm5lY3Rpb25PYmplY3QgPSB7XG4gICAgICAgIGRlcHM6IHsga2V5U3RvcmU6IHRoaXMuZ2V0S2V5U3RvcmUoKSB9LFxuICAgICAgICAuLi50aGlzLmdldE5lYXJDb25maWcodGhpcy5uZXR3b3JrTmFtZSwgY29udHJhY3RBZGRyZXNzKSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmVhciA9IG5ldyBOZWFyKF9jb25uZWN0aW9uT2JqZWN0KVxuXG4gICAgICB0aGlzLmFjdGl2ZU5lYXJDb25uZWN0aW9uID0gbmVhclxuICAgICAgdGhpcy5hY3RpdmVXYWxsZXQgPSBuZXcgV2FsbGV0QWNjb3VudChuZWFyLCBERUZBVUxUX0FQUF9OQU1FKVxuXG4gICAgICBjb25zdCBhY2NvdW50SWQgPSB0aGlzLmFjdGl2ZVdhbGxldC5nZXRBY2NvdW50SWQoKVxuICAgICAgdGhpcy5hY3RpdmVBY2NvdW50ID0gYXdhaXQgdGhpcy5hY3RpdmVOZWFyQ29ubmVjdGlvbi5hY2NvdW50KGFjY291bnRJZClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6ICdjb25uZWN0aW9uIGFjdGl2YXRlZCcgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHtcbiAgICAgICAgZXJyb3I6ICdPbmx5IEJyb3dzZXIgb3IgTm9kZSBlbnZpcm9ubWVudCBzdXBwb3J0ZWQuJyxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIHVzZXIuIFJlbW92ZXMgdGhlIExvY2FsU3RvcmFnZSBlbnRyeSB0aGF0XG4gICAqIHJlcHJlc2VudHMgYW4gYXV0aG9yaXplZCB3YWxsZXQgYWNjb3VudCBidXQgbGVhdmVzIHByaXZhdGUga2V5cyBpbnRhY3QuXG4gICAqL1xuICBwdWJsaWMgZGlzY29ubmVjdCgpOiBSZXNwb25zZURhdGE8c3RyaW5nPiB7XG4gICAgdGhpcy5hY3RpdmVXYWxsZXQ/LnNpZ25PdXQoKVxuICAgIHRoaXMuYWN0aXZlTmVhckNvbm5lY3Rpb24gPSB1bmRlZmluZWRcbiAgICB0aGlzLmFjdGl2ZUFjY291bnQgPSB1bmRlZmluZWRcbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiAnZGlzY29ubmVjdGVkJyB9KVxuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3RzIHRvIGEgd2FsbGV0IHN0b3JlZCBvbiBsb2NhbCBzdG9yYWdlLlxuICAgKiBAcGFyYW0gYWNjb3VudElkIHRoZSBhY2NvdW50IGlkZW50aWZpZXIgdG8gY29ubmVjdC5cbiAgICogQHJldHVybnMgd2hldGhlciBjb25uZWN0aW9uIHdhcyBzdWNjZXNzZnVsIG9yIG5vdC5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBjb25uZWN0VG8oYWNjb3VudElkOiBzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxib29sZWFuPj4ge1xuICAgIGlmIChpc05vZGUpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2Uoe1xuICAgICAgICBlcnJvcjogJ05vZGUgZW52aXJvbm1lbnQgZG9lcyBub3QgeWV0IHN1cHBvcnQgdGhlIGNvbm5lY3RUbyBtZXRob2QuJyxcbiAgICAgIH0pXG5cbiAgICAvLyBnZXQgbG9jYWxzdG9yYWdlIGFjY291bnRzXG4gICAgY29uc3QgeyBkYXRhOiBsb2NhbEFjY291bnRzIH0gPSB0aGlzLmdldExvY2FsQWNjb3VudHMoKVxuXG4gICAgLy8gZG9lcyBhY2NvdW50IHVzZXIgaXMgdHJ5aW5nIHRvIGNvbm5lY3QgZXhpc3RzIGluIHN0b3JhZ2U/XG4gICAgaWYgKCFsb2NhbEFjY291bnRzW2FjY291bnRJZF0pIHtcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IGZhbHNlIH0pXG4gICAgICAvLyByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBnZXQgYSBmdWxsIGFjY2VzcyBwdWJsaWMga2V5IHdpdGggdGhlIGxhcmdlc3Qgbm9uY2VcbiAgICBjb25zdCBfZ2V0RnVsbEFjY2Vzc1B1YmxpY0tleSA9IGFzeW5jIChhY2NvdW50SWQ6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgeyBkYXRhOiBrZXlzUmVxdWVzdCB9ID0gYXdhaXQgdGhpcy52aWV3QWNjZXNzS2V5TGlzdChhY2NvdW50SWQpXG5cbiAgICAgIC8vIGZpbHRlciBieSBmdWxsIGFjY2VzcyBrZXlzXG4gICAgICBjb25zdCBmdWxsQWNjZXNzS2V5cyA9IGtleXNSZXF1ZXN0LmtleXMuZmlsdGVyKFxuICAgICAgICAoYWNjOiB7IGFjY2Vzc19rZXk6IHsgcGVybWlzc2lvbjogc3RyaW5nIH0gfSkgPT5cbiAgICAgICAgICBhY2MuYWNjZXNzX2tleS5wZXJtaXNzaW9uID09PSAnRnVsbEFjY2VzcydcbiAgICAgIClcblxuICAgICAgLy8gZ2V0IHRoZSBoaWdoZXN0IG5vbmNlIGtleVxuICAgICAgY29uc3QgaGlnaGVzdE5vbmNlS2V5ID0gZnVsbEFjY2Vzc0tleXMucmVkdWNlKFxuICAgICAgICAoXG4gICAgICAgICAgYWNjOiB7IGFjY2Vzc19rZXk6IHsgbm9uY2U6IG51bWJlciB9IH0sXG4gICAgICAgICAgY3VycjogeyBhY2Nlc3Nfa2V5OiB7IG5vbmNlOiBudW1iZXIgfSB9XG4gICAgICAgICkgPT4gKGFjYz8uYWNjZXNzX2tleT8ubm9uY2UgPiBjdXJyPy5hY2Nlc3Nfa2V5Py5ub25jZSA/IGFjYyA6IGN1cnIpXG4gICAgICApXG5cbiAgICAgIHJldHVybiBoaWdoZXN0Tm9uY2VLZXlcbiAgICB9XG5cbiAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBsb2NhbFN0b3JhZ2VLZXkgPSBgJHtERUZBVUxUX0FQUF9OQU1FfSR7TkVBUl9MT0NBTF9TVE9SQUdFX0tFWV9TVUZGSVh9YFxuICAgICAgY29uc3QgZnVsbEFjY2Vzc0tleSA9IGF3YWl0IF9nZXRGdWxsQWNjZXNzUHVibGljS2V5KGFjY291bnRJZClcblxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgIGxvY2FsU3RvcmFnZUtleSxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGFjY291bnRJZDogYWNjb3VudElkLFxuICAgICAgICAgIGFsbEtleXM6IFtmdWxsQWNjZXNzS2V5LnB1YmxpY19rZXldLFxuICAgICAgICB9KVxuICAgICAgKVxuXG4gICAgICB0aGlzLmNvbm5lY3QoKVxuXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiB0cnVlIH0pXG4gICAgfVxuICAgIC8vIFRPRE86IEltcGxlbWVudCBmb3IgTm9kZSBlbnZpcm9ubWVudFxuICAgIC8vIGlmKGlzTm9kZSkge31cblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IGZhbHNlIH0pXG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyBjb25uZWN0ZWQgYWNjb3VudCBkZXRhaWxzLlxuICAgKiBAcmV0dXJucyBkZXRhaWxzIG9mIHRoZSBjdXJyZW50IGNvbm5lY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGV0YWlscygpOiBQcm9taXNlPFxuICAgIFJlc3BvbnNlRGF0YTx7XG4gICAgICBhY2NvdW50SWQ6IHN0cmluZ1xuICAgICAgYmFsYW5jZTogc3RyaW5nXG4gICAgICBhbGxvd2FuY2U6IHN0cmluZ1xuICAgICAgY29udHJhY3ROYW1lOiBzdHJpbmdcbiAgICB9PlxuICA+IHtcbiAgICBjb25zdCBhY2NvdW50ID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKVxuICAgIGNvbnN0IGFjY291bnRJZCA9IGFjY291bnQ/LmFjY291bnRJZFxuICAgIGNvbnN0IHsgZGF0YToga2V5UGFpciB9ID0gYXdhaXQgdGhpcy5nZXRTZXNzaW9uS2V5UGFpcigpXG5cbiAgICBpZiAoIWFjY291bnQgfHwgIWFjY291bnRJZClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnQWNjb3VudCBpcyB1bmRlZmluZWQuJyB9KVxuXG4gICAgaWYgKCFrZXlQYWlyIHx8ICFhY2NvdW50SWQpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogYE5vIEtleSBQYWlyIGZvciBhY2NvdW50ICR7YWNjb3VudElkfWAgfSlcblxuICAgIGNvbnN0IHB1YmxpY0tleSA9IGtleVBhaXIuZ2V0UHVibGljS2V5KCkudG9TdHJpbmcoKVxuICAgIGNvbnN0IGJhbGFuY2UgPSBhd2FpdCBhY2NvdW50LmdldEFjY291bnRCYWxhbmNlKClcblxuICAgIC8vIFRPRE86IHdlIHNob3VsZCBhZGQgYSBwcm9wZXIgZXJyb3IgbWVzc2FnZSBmb3IgdGhpcyBvbmVcbiAgICBpZiAoIWJhbGFuY2UpIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnJyB9KVxuXG4gICAgY29uc3QgeyBkYXRhOiBhY2Nlc3NLZXkgfSA9IGF3YWl0IHRoaXMudmlld0FjY2Vzc0tleShhY2NvdW50SWQsIHB1YmxpY0tleSlcblxuICAgIGNvbnN0IGFsbG93YW5jZSA9IHV0aWxzLmZvcm1hdC5mb3JtYXROZWFyQW1vdW50KFxuICAgICAgYWNjZXNzS2V5LnBlcm1pc3Npb24uRnVuY3Rpb25DYWxsLmFsbG93YW5jZVxuICAgIClcblxuICAgIGNvbnN0IGNvbnRyYWN0TmFtZSA9IHRoaXMuYWN0aXZlTmVhckNvbm5lY3Rpb24/LmNvbmZpZy5jb250cmFjdE5hbWVcblxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBhY2NvdW50SWQ6IGFjY291bnRJZCxcbiAgICAgIGJhbGFuY2U6IHV0aWxzLmZvcm1hdC5mb3JtYXROZWFyQW1vdW50KGJhbGFuY2U/LnRvdGFsLCAyKSxcbiAgICAgIGFsbG93YW5jZTogYWxsb3dhbmNlLFxuICAgICAgY29udHJhY3ROYW1lOiBjb250cmFjdE5hbWUsXG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZmVyIG9uZSBvciBtb3JlIHRva2Vucy5cbiAgICogQHBhcmFtIHRva2VuSWRzIFRoZSBtYXBwaW5nIG9mIHRyYW5zZmVycywgZGVmaW5lZCBieTogW1thY2NvdW50TmFtZTEsIHRva2VuSWQxXSwgW2FjY291bnROYW1lMiwgdG9rZW5JZDJdXVxuICAgKiBAcGFyYW0gY29udHJhY3ROYW1lIFRoZSBjb250cmFjdCBuYW1lIHRvIHRyYW5zZmVyIHRva2VucyBmcm9tLlxuICAgKi9cbiAgLy8gVE9ETzogbmVlZCBtb3JlIGNoZWNrcyBvbiB0aGUgdG9rZW5JZHNcbiAgcHVibGljIGFzeW5jIHRyYW5zZmVyKFxuICAgIHRva2VuSWRzOiBbc3RyaW5nLCBzdHJpbmddW10sXG4gICAgY29udHJhY3ROYW1lOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8Ym9vbGVhbj4+IHtcbiAgICBjb25zdCBhY2NvdW50ID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKVxuICAgIGNvbnN0IGFjY291bnRJZCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KCkuYWNjb3VudElkXG5cbiAgICBpZiAoIWFjY291bnQgfHwgIWFjY291bnRJZClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnQWNjb3VudCBpcyB1bmRlZmluZWQuJyB9KVxuICAgIGlmICghY29udHJhY3ROYW1lKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdObyBjb250cmFjdCB3YXMgcHJvdmlkZWQuJyB9KVxuXG4gICAgY29uc3QgY29udHJhY3QgPSBuZXcgQ29udHJhY3QoYWNjb3VudCwgY29udHJhY3ROYW1lLCB7XG4gICAgICB2aWV3TWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgICAgIGNoYW5nZU1ldGhvZHM6XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLlNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyB8fFxuICAgICAgICBTVE9SRV9DT05UUkFDVF9DQUxMX01FVEhPRFMsXG4gICAgfSlcblxuICAgIC8vIEB0cy1pZ25vcmU6IG1ldGhvZCBkb2VzIG5vdCBleGlzdCBvbiBDb250cmFjdCB0eXBlXG4gICAgYXdhaXQgY29udHJhY3QubmZ0X2JhdGNoX3RyYW5zZmVyKFxuICAgICAgeyB0b2tlbl9pZHM6IHRva2VuSWRzIH0sXG4gICAgICBNQVhfR0FTLFxuICAgICAgT05FX1lPQ1RPXG4gICAgKVxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHRydWUgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2ZlciBvbmUgdG9rZW4uXG4gICAqIEBwYXJhbSB0b2tlbklkIFRoZSB0b2tlbiBpZCB0byB0cmFuc2Zlci5cbiAgICogQHBhcmFtIHJlY2VpdmVySWQgVGhlIGFjY291bnQgaWQgdG8gdHJhbnNmZXIgdG8uXG4gICAqIEBwYXJhbSBjb250cmFjdE5hbWUgVGhlIGNvbnRyYWN0IG5hbWUgdG8gdHJhbnNmZXIgdG9rZW5zIGZyb20uXG4gICAqL1xuICAvLyBUT0RPOiBuZWVkIG1vcmUgY2hlY2tzIG9uIHRoZSB0b2tlbklkc1xuICBwdWJsaWMgYXN5bmMgc2ltcGxlVHJhbnNmZXIoXG4gICAgdG9rZW5JZDogc3RyaW5nLFxuICAgIHJlY2VpdmVySWQ6IHN0cmluZyxcbiAgICBjb250cmFjdE5hbWU6IHN0cmluZ1xuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxib29sZWFuPj4ge1xuICAgIGNvbnN0IGFjY291bnQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpXG4gICAgY29uc3QgYWNjb3VudElkID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKS5hY2NvdW50SWRcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdBY2NvdW50IGlzIHVuZGVmaW5lZC4nIH0pXG4gICAgaWYgKCFjb250cmFjdE5hbWUpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ05vIGNvbnRyYWN0IHdhcyBwcm92aWRlZC4nIH0pXG5cbiAgICBjb25zdCBjb250cmFjdCA9IG5ldyBDb250cmFjdChhY2NvdW50LCBjb250cmFjdE5hbWUsIHtcbiAgICAgIHZpZXdNZXRob2RzOlxuICAgICAgICB0aGlzLmNvbnN0YW50cy5TVE9SRV9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTLFxuICAgICAgY2hhbmdlTWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyxcbiAgICB9KVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC5uZnRfdHJhbnNmZXIoXG4gICAgICB7IHJlY2VpdmVyX2lkOiByZWNlaXZlcklkLCB0b2tlbl9pZDogdG9rZW5JZCB9LFxuICAgICAgTUFYX0dBUyxcbiAgICAgIE9ORV9ZT0NUT1xuICAgIClcbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiB0cnVlIH0pXG4gIH1cblxuICAvKipcbiAgICogQnVybiBvbmUgb3IgbW9yZSB0b2tlbnMgZnJvbSB0aGUgc2FtZSBjb250cmFjdC5cbiAgICogQHBhcmFtIGNvbnRyYWN0TmFtZSBUaGUgY29udHJhY3QgbmFtZSB0byBidXJuIHRva2VucyBmcm9tLlxuICAgKiBAcGFyYW0gdG9rZW5JZHMgQW4gYXJyYXkgY29udGFpbmluZyB0b2tlbiBpZHMgdG8gYmUgYnVybnQuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgYnVybih0b2tlbklkczogc3RyaW5nW10pOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxib29sZWFuPj4ge1xuICAgIGNvbnN0IGFjY291bnQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpXG4gICAgY29uc3QgYWNjb3VudElkID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKS5hY2NvdW50SWRcblxuICAgIGNvbnN0IGNvbnRyYWN0TmFtZSA9IHRva2VuSWRzWzBdLnNwbGl0KCc6JylbMV1cbiAgICBjb25zdCBpc1NhbWVDb250cmFjdCA9IHRva2VuSWRzLmV2ZXJ5KChpZCkgPT4ge1xuICAgICAgY29uc3Qgc3BsaXQgPSBpZC5zcGxpdCgnOicpXG5cbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPT09IDIpIHJldHVybiBzcGxpdFsxXSA9PT0gY29udHJhY3ROYW1lXG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG5cbiAgICBpZiAoIWlzU2FtZUNvbnRyYWN0KVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHtcbiAgICAgICAgZXJyb3I6ICdUb2tlbnMgbmVlZCB0byBiZSBhbGwgZnJvbSB0aGUgc2FtZSBjb250cmFjdC4nLFxuICAgICAgfSlcbiAgICBpZiAoIWFjY291bnQgfHwgIWFjY291bnRJZClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnQWNjb3VudCBpcyB1bmRlZmluZWQuJyB9KVxuICAgIGlmICghY29udHJhY3ROYW1lKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdObyBjb250cmFjdCB3YXMgcHJvdmlkZWQuJyB9KVxuXG4gICAgY29uc3QgY29udHJhY3QgPSBuZXcgQ29udHJhY3QoYWNjb3VudCwgY29udHJhY3ROYW1lLCB7XG4gICAgICB2aWV3TWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgICAgIGNoYW5nZU1ldGhvZHM6XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLlNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyB8fFxuICAgICAgICBTVE9SRV9DT05UUkFDVF9DQUxMX01FVEhPRFMsXG4gICAgfSlcblxuICAgIGNvbnN0IGJ1cm5JZHMgPSB0b2tlbklkcy5tYXAoKGlkKSA9PiBpZC5zcGxpdCgnOicpWzBdKVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC5uZnRfYmF0Y2hfYnVybih7IHRva2VuX2lkczogYnVybklkcyB9LCBNQVhfR0FTLCBPTkVfWU9DVE8pXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHJ1ZSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIExpc3QgYW4gaXRlbSBmb3Igc2FsZSBpbiB0aGUgbWFya2V0LlxuICAgKiBAcGFyYW0gdG9rZW5JZCBUaGUgdG9rZW4gaWQgbGlzdC5cbiAgICogQHBhcmFtIHN0b3JlSWQgVGhlIHRva2VuIHN0b3JlIGlkIChjb250cmFjdCBuYW1lKS5cbiAgICogQHBhcmFtIHByaWNlIFRoZSBsaXN0aW5nIHByaWNlLlxuICAgKiBAcGFyYW0gc3BsaXRPd25lcnMgTGlzdCBvZiBzcGxpdHMuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgYmF0Y2hMaXN0KFxuICAgIHRva2VuSWQ6IHN0cmluZ1tdLFxuICAgIHN0b3JlSWQ6IHN0cmluZyxcbiAgICBwcmljZTogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiB7XG4gICAgICBhdXRvdHJhbnNmZXI/OiBib29sZWFuXG4gICAgICBtYXJrZXRBZGRyZXNzPzogc3RyaW5nXG4gICAgICBnYXM/OiBzdHJpbmdcbiAgICB9XG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgY29uc3QgYWNjb3VudCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KClcbiAgICBjb25zdCBhY2NvdW50SWQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpLmFjY291bnRJZFxuICAgIGNvbnN0IGdhcyA9ICFvcHRpb25zPy5nYXMgPyBNQVhfR0FTIDogbmV3IEJOKG9wdGlvbnM/LmdhcylcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdBY2NvdW50IGlzIHVuZGVmaW5lZC4nIH0pXG5cbiAgICAvLyBUT0RPOiBDaGVjayBpZiBhY2NvdW50IG93bnMgdGhlIHRva2VucyB0aGF0IGFyZSB0cnlpbmcgdG8gc2VsbFxuICAgIC8qY29uc3QgdG9rZW46IFRva2VuID0gYXdhaXQgdGhpcy5hcGkuZmV0Y2hUb2tlbihcbiAgICAgIHRva2VuSWQsXG4gICAgICBgJHt0b2tlbklkfToke3N0b3JlSWR9YFxuICAgIClcblxuICAgIGNvbnN0IGlzT3duZXIgPSB0b2tlbi5vd25lcklkID09PSBhY2NvdW50SWRcbiAgICBpZiAoIWlzT3duZXIpIHRocm93IG5ldyBFcnJvcignVXNlciBkb2VzIG5vdCBvd24gdG9rZW4uJykqL1xuXG4gICAgY29uc3QgY29udHJhY3QgPSBuZXcgQ29udHJhY3QoYWNjb3VudCwgc3RvcmVJZCwge1xuICAgICAgdmlld01ldGhvZHM6XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLlNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyB8fFxuICAgICAgICBTVE9SRV9DT05UUkFDVF9WSUVXX01FVEhPRFMsXG4gICAgICBjaGFuZ2VNZXRob2RzOlxuICAgICAgICB0aGlzLmNvbnN0YW50cy5TVE9SRV9DT05UUkFDVF9DQUxMX01FVEhPRFMgfHxcbiAgICAgICAgU1RPUkVfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICAgIH0pXG5cbiAgICAvLyBUT0RPOiBDaGVja3Mgb24gc3BsaXRfb3duZXJzXG5cbiAgICBjb25zdCBsaXN0Q29zdCA9IGNhbGN1bGF0ZUxpc3RDb3N0KHRva2VuSWQubGVuZ3RoKVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC5uZnRfYmF0Y2hfYXBwcm92ZShcbiAgICAgIHtcbiAgICAgICAgdG9rZW5faWRzOiB0b2tlbklkLFxuICAgICAgICBhY2NvdW50X2lkOlxuICAgICAgICAgIG9wdGlvbnM/Lm1hcmtldEFkZHJlc3MgfHxcbiAgICAgICAgICB0aGlzLmNvbnN0YW50cy5NQVJLRVRfQUREUkVTUyB8fFxuICAgICAgICAgIGAwLiR7dGhpcy5jb25zdGFudHMuRkFDVE9SWV9DT05UUkFDVF9OQU1FIHx8IEZBQ1RPUllfQ09OVFJBQ1RfTkFNRX1gLFxuICAgICAgICBtc2c6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgICAgYXV0b3RyYW5zZmVyOiBvcHRpb25zPy5hdXRvdHJhbnNmZXIgPz8gdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgICAgZ2FzLFxuICAgICAgdXRpbHMuZm9ybWF0LnBhcnNlTmVhckFtb3VudChsaXN0Q29zdC50b1N0cmluZygpKVxuICAgIClcbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiB0cnVlIH0pXG4gIH1cblxuICAvKipcbiAgICogTGlzdCBhbiBpdGVtIGZvciBzYWxlIGluIHRoZSBtYXJrZXQuXG4gICAqIEBwYXJhbSB0b2tlbklkIFRoZSB0b2tlbiBpZC5cbiAgICogQHBhcmFtIHN0b3JlSWQgVGhlIHRva2VuIHN0b3JlIGlkIChjb250cmFjdCBuYW1lKS5cbiAgICogQHBhcmFtIHByaWNlIFRoZSBsaXN0aW5nIHByaWNlLlxuICAgKiBAcGFyYW0gc3BsaXRPd25lcnMgTGlzdCBvZiBzcGxpdHMuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgbGlzdChcbiAgICB0b2tlbklkOiBzdHJpbmcsXG4gICAgc3RvcmVJZDogc3RyaW5nLFxuICAgIHByaWNlOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IHtcbiAgICAgIGF1dG90cmFuc2Zlcj86IGJvb2xlYW5cbiAgICAgIG1hcmtldEFkZHJlc3M/OiBzdHJpbmdcbiAgICAgIGdhcz86IHN0cmluZ1xuICAgIH1cbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8Ym9vbGVhbj4+IHtcbiAgICBjb25zdCBhY2NvdW50ID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKVxuICAgIGNvbnN0IGFjY291bnRJZCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KCkuYWNjb3VudElkXG4gICAgY29uc3QgZ2FzID0gIW9wdGlvbnM/LmdhcyA/IE1BWF9HQVMgOiBuZXcgQk4ob3B0aW9ucz8uZ2FzKVxuXG4gICAgaWYgKCFhY2NvdW50IHx8ICFhY2NvdW50SWQpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ0FjY291bnQgaXMgdW5kZWZpbmVkLicgfSlcblxuICAgIC8vIFRPRE86IENoZWNrIGlmIGFjY291bnQgb3ducyB0aGUgdG9rZW5zIHRoYXQgYXJlIHRyeWluZyB0byBzZWxsXG4gICAgLypjb25zdCB0b2tlbjogVG9rZW4gPSBhd2FpdCB0aGlzLmFwaS5mZXRjaFRva2VuKFxuICAgICAgdG9rZW5JZCxcbiAgICAgIGAke3Rva2VuSWR9OiR7c3RvcmVJZH1gXG4gICAgKVxuXG4gICAgY29uc3QgaXNPd25lciA9IHRva2VuLm93bmVySWQgPT09IGFjY291bnRJZFxuICAgIGlmICghaXNPd25lcikgdGhyb3cgbmV3IEVycm9yKCdVc2VyIGRvZXMgbm90IG93biB0b2tlbi4nKSovXG5cbiAgICBjb25zdCBjb250cmFjdCA9IG5ldyBDb250cmFjdChhY2NvdW50LCBzdG9yZUlkLCB7XG4gICAgICB2aWV3TWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgICAgIGNoYW5nZU1ldGhvZHM6XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLlNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyB8fFxuICAgICAgICBTVE9SRV9DT05UUkFDVF9DQUxMX01FVEhPRFMsXG4gICAgfSlcblxuICAgIC8vIFRPRE86IENoZWNrcyBvbiBzcGxpdF9vd25lcnNcblxuICAgIGNvbnN0IGxpc3RDb3N0ID0gY2FsY3VsYXRlTGlzdENvc3QoMSlcblxuICAgIC8vIEB0cy1pZ25vcmU6IG1ldGhvZCBkb2VzIG5vdCBleGlzdCBvbiBDb250cmFjdCB0eXBlXG4gICAgYXdhaXQgY29udHJhY3QubmZ0X2FwcHJvdmUoXG4gICAgICB7XG4gICAgICAgIHRva2VuX2lkOiB0b2tlbklkLFxuICAgICAgICBhY2NvdW50X2lkOlxuICAgICAgICAgIG9wdGlvbnM/Lm1hcmtldEFkZHJlc3MgfHxcbiAgICAgICAgICB0aGlzLmNvbnN0YW50cy5NQVJLRVRfQUREUkVTUyB8fFxuICAgICAgICAgIGAwLiR7dGhpcy5jb25zdGFudHMuRkFDVE9SWV9DT05UUkFDVF9OQU1FIHx8IEZBQ1RPUllfQ09OVFJBQ1RfTkFNRX1gLFxuICAgICAgICBtc2c6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgICAgYXV0b3RyYW5zZmVyOiBvcHRpb25zPy5hdXRvdHJhbnNmZXIgPz8gdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgICAgZ2FzLFxuICAgICAgdXRpbHMuZm9ybWF0LnBhcnNlTmVhckFtb3VudChsaXN0Q29zdC50b1N0cmluZygpKVxuICAgIClcbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiB0cnVlIH0pXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmV2b2tlQWNjb3VudChcbiAgICB0b2tlbklkOiBzdHJpbmcsXG4gICAgc3RvcmVJZDogc3RyaW5nLFxuICAgIGFjY291bnRSZXZva2VJZDogc3RyaW5nXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgY29uc3QgYWNjb3VudCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KClcbiAgICBjb25zdCBhY2NvdW50SWQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpLmFjY291bnRJZFxuXG4gICAgaWYgKCFhY2NvdW50IHx8ICFhY2NvdW50SWQpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ0FjY291bnQgaXMgdW5kZWZpbmVkLicgfSlcblxuICAgIGNvbnN0IGNvbnRyYWN0ID0gbmV3IENvbnRyYWN0KGFjY291bnQsIHN0b3JlSWQsIHtcbiAgICAgIHZpZXdNZXRob2RzOlxuICAgICAgICB0aGlzLmNvbnN0YW50cy5TVE9SRV9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTLFxuICAgICAgY2hhbmdlTWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyxcbiAgICB9KVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC5uZnRfcmV2b2tlKFxuICAgICAgeyB0b2tlbl9pZDogdG9rZW5JZCwgYWNjb3VudF9pZDogYWNjb3VudFJldm9rZUlkIH0sXG4gICAgICBNQVhfR0FTXG4gICAgKVxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHRydWUgfSlcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZXZva2VBbGxBY2NvdW50cyhcbiAgICB0b2tlbklkOiBzdHJpbmcsXG4gICAgc3RvcmVJZDogc3RyaW5nXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgY29uc3QgYWNjb3VudCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KClcbiAgICBjb25zdCBhY2NvdW50SWQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpLmFjY291bnRJZFxuICAgIGNvbnN0IEdBUyA9IG5ldyBCTignMzAwMDAwMDAwMDAwMDAwJylcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdBY2NvdW50IGlzIHVuZGVmaW5lZC4nIH0pXG5cbiAgICBjb25zdCBjb250cmFjdCA9IG5ldyBDb250cmFjdChhY2NvdW50LCBzdG9yZUlkLCB7XG4gICAgICB2aWV3TWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgICAgIGNoYW5nZU1ldGhvZHM6XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLlNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyB8fFxuICAgICAgICBTVE9SRV9DT05UUkFDVF9DQUxMX01FVEhPRFMsXG4gICAgfSlcblxuICAgIC8vIEB0cy1pZ25vcmU6IG1ldGhvZCBkb2VzIG5vdCBleGlzdCBvbiBDb250cmFjdCB0eXBlXG4gICAgYXdhaXQgY29udHJhY3QubmZ0X3Jldm9rZV9hbGwoeyB0b2tlbl9pZDogdG9rZW5JZCB9LCBHQVMpXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHJ1ZSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gb2ZmZXIgdG8gYSB0b2tlbiBmcm9tIGEgZ3JvdXAuXG4gICAqIEBwYXJhbSBncm91cElkXG4gICAqIEBwYXJhbSBwcmljZVxuICAgKi9cbiAgcHVibGljIGFzeW5jIG1ha2VHcm91cE9mZmVyKFxuICAgIGdyb3VwSWQ6IHN0cmluZyxcbiAgICBwcmljZT86IHN0cmluZyxcbiAgICBvcHRpb25zPzoge1xuICAgICAgbWFya2V0QWRkcmVzcz86IHN0cmluZ1xuICAgICAgZ2FzPzogc3RyaW5nXG4gICAgfVxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxib29sZWFuPj4ge1xuICAgIGNvbnN0IGFjY291bnQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpXG4gICAgY29uc3QgYWNjb3VudElkID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKS5hY2NvdW50SWRcbiAgICBjb25zdCBnYXMgPSAhb3B0aW9ucz8uZ2FzID8gTUFYX0dBUyA6IG5ldyBCTihvcHRpb25zPy5nYXMpXG5cbiAgICBpZiAoIWFjY291bnQgfHwgIWFjY291bnRJZClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnQWNjb3VudCBpcyB1bmRlZmluZWQuJyB9KVxuICAgIGlmICghZ3JvdXBJZCkgZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ1BsZWFzZSBwcm92aWRlIGEgZ3JvdXBJZCcgfSlcblxuICAgIGlmICghdGhpcy5hcGkpIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnQVBJIGlzIG5vdCBkZWZpbmVkLicgfSlcblxuICAgIGNvbnN0IHsgZGF0YTogbGlzdCwgZXJyb3IgfSA9IGF3YWl0IHRoaXMuYXBpLmZldGNoTGlzdEJ5SWQoZ3JvdXBJZClcblxuICAgIGlmIChlcnJvcikgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3IgfSlcblxuICAgIGNvbnN0IGNvbnRyYWN0ID0gbmV3IENvbnRyYWN0KFxuICAgICAgYWNjb3VudCxcbiAgICAgIG9wdGlvbnM/Lm1hcmtldEFkZHJlc3MgfHxcbiAgICAgICAgdGhpcy5jb25zdGFudHMuTUFSS0VUX0FERFJFU1MgfHxcbiAgICAgICAgYDAuJHt0aGlzLmNvbnN0YW50cy5GQUNUT1JZX0NPTlRSQUNUX05BTUUgfHwgRkFDVE9SWV9DT05UUkFDVF9OQU1FfWAsXG4gICAgICB7XG4gICAgICAgIHZpZXdNZXRob2RzOlxuICAgICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgICBNQVJLRVRfQ09OVFJBQ1RfVklFV19NRVRIT0RTLFxuICAgICAgICBjaGFuZ2VNZXRob2RzOlxuICAgICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9DT05UUkFDVF9DQUxMX01FVEhPRFMgfHxcbiAgICAgICAgICBNQVJLRVRfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICAgICAgfVxuICAgIClcblxuICAgIGNvbnN0IHNldFByaWNlID0gcHJpY2UgfHwgbGlzdC5wcmljZVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC5tYWtlX29mZmVyKFxuICAgICAge1xuICAgICAgICB0b2tlbl9rZXk6IGxpc3QudG9rZW4uaWQsXG4gICAgICAgIHByaWNlOiBzZXRQcmljZSxcbiAgICAgICAgdGltZW91dDogeyBIb3VyczogVFdFTlRZX0ZPVVIgfSxcbiAgICAgIH0sXG4gICAgICBnYXMsXG4gICAgICBzZXRQcmljZVxuICAgIClcbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiB0cnVlIH0pXG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBvZmZlciB0byBtdWx0aXBsZSB0b2tlbnMuXG4gICAqIEBwYXJhbSB0b2tlbklkczogQXJyYXkgb2YgdG9rZW5JZHNcbiAgICogQHBhcmFtIHByaWNlOiBQcmljZSBvZiBlYWNoIHRva2VuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgYmF0Y2hNYWtlT2ZmZXIoXG4gICAgdG9rZW5JZHM6IHN0cmluZ1tdLFxuICAgIHByaWNlczogc3RyaW5nW10sXG4gICAgb3B0aW9ucz86IHtcbiAgICAgIG1hcmtldEFkZHJlc3M/OiBzdHJpbmdcbiAgICAgIGdhcz86IHN0cmluZ1xuICAgIH1cbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8Ym9vbGVhbj4+IHtcbiAgICBjb25zdCBhY2NvdW50ID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKVxuICAgIGNvbnN0IGFjY291bnRJZCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KCkuYWNjb3VudElkXG4gICAgY29uc3QgZ2FzID0gIW9wdGlvbnM/LmdhcyA/IE1BWF9HQVMgOiBuZXcgQk4ob3B0aW9ucz8uZ2FzKVxuXG4gICAgaWYgKCFhY2NvdW50IHx8ICFhY2NvdW50SWQpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ0FjY291bnQgaXMgdW5kZWZpbmVkLicgfSlcblxuICAgIGNvbnN0IGNvbnRyYWN0ID0gbmV3IENvbnRyYWN0KFxuICAgICAgYWNjb3VudCxcbiAgICAgIG9wdGlvbnM/Lm1hcmtldEFkZHJlc3MgfHxcbiAgICAgICAgdGhpcy5jb25zdGFudHMuTUFSS0VUX0FERFJFU1MgfHxcbiAgICAgICAgYDAuJHt0aGlzLmNvbnN0YW50cy5GQUNUT1JZX0NPTlRSQUNUX05BTUUgfHwgRkFDVE9SWV9DT05UUkFDVF9OQU1FfWAsXG4gICAgICB7XG4gICAgICAgIHZpZXdNZXRob2RzOlxuICAgICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgICBNQVJLRVRfQ09OVFJBQ1RfVklFV19NRVRIT0RTLFxuICAgICAgICBjaGFuZ2VNZXRob2RzOlxuICAgICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9DT05UUkFDVF9DQUxMX01FVEhPRFMgfHxcbiAgICAgICAgICBNQVJLRVRfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICAgICAgfVxuICAgIClcblxuICAgIGNvbnN0IHRvdGFsUHJpY2UgPSBwcmljZXMucmVkdWNlKFxuICAgICAgKGFjYywgY3VycikgPT4gYWNjLmFkZChuZXcgQk4oY3VycikpLFxuICAgICAgbmV3IEJOKDApXG4gICAgKVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC5tYWtlX29mZmVyKFxuICAgICAge1xuICAgICAgICB0b2tlbl9rZXk6IHRva2VuSWRzLFxuICAgICAgICBwcmljZTogcHJpY2VzLFxuICAgICAgICB0aW1lb3V0OiBBcnJheSh0b2tlbklkcy5sZW5ndGgpLmZpbGwoeyBIb3VyczogVFdFTlRZX0ZPVVIgfSksXG4gICAgICB9LFxuICAgICAgZ2FzLFxuICAgICAgdG90YWxQcmljZS50b1N0cmluZygpXG4gICAgKVxuXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHJ1ZSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gb2ZmZXIgdG8gYSB0b2tlbi5cbiAgICogQHBhcmFtIHRva2VuSWRcbiAgICogQHBhcmFtIHByaWNlXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgbWFrZU9mZmVyKFxuICAgIHRva2VuSWQ6IHN0cmluZyxcbiAgICBwcmljZTogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiB7XG4gICAgICBtYXJrZXRBZGRyZXNzPzogc3RyaW5nXG4gICAgICBnYXM/OiBzdHJpbmdcbiAgICB9XG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgY29uc3QgYWNjb3VudCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KClcbiAgICBjb25zdCBhY2NvdW50SWQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpLmFjY291bnRJZFxuICAgIGNvbnN0IGdhcyA9ICFvcHRpb25zPy5nYXMgPyBNQVhfR0FTIDogbmV3IEJOKG9wdGlvbnM/LmdhcylcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdBY2NvdW50IGlzIHVuZGVmaW5lZC4nIH0pXG4gICAgaWYgKCF0b2tlbklkKSByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ1BsZWFzZSBwcm92aWRlIGEgdG9rZW5JZCcgfSlcblxuICAgIGNvbnN0IGNvbnRyYWN0ID0gbmV3IENvbnRyYWN0KFxuICAgICAgYWNjb3VudCxcbiAgICAgIG9wdGlvbnM/Lm1hcmtldEFkZHJlc3MgfHxcbiAgICAgICAgdGhpcy5jb25zdGFudHMuTUFSS0VUX0FERFJFU1MgfHxcbiAgICAgICAgYDAuJHt0aGlzLmNvbnN0YW50cy5GQUNUT1JZX0NPTlRSQUNUX05BTUUgfHwgRkFDVE9SWV9DT05UUkFDVF9OQU1FfWAsXG4gICAgICB7XG4gICAgICAgIHZpZXdNZXRob2RzOlxuICAgICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgICBNQVJLRVRfQ09OVFJBQ1RfVklFV19NRVRIT0RTLFxuICAgICAgICBjaGFuZ2VNZXRob2RzOlxuICAgICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9DT05UUkFDVF9DQUxMX01FVEhPRFMgfHxcbiAgICAgICAgICBNQVJLRVRfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICAgICAgfVxuICAgIClcblxuICAgIC8vIEB0cy1pZ25vcmU6IG1ldGhvZCBkb2VzIG5vdCBleGlzdCBvbiBDb250cmFjdCB0eXBlXG4gICAgYXdhaXQgY29udHJhY3QubWFrZV9vZmZlcihcbiAgICAgIHtcbiAgICAgICAgdG9rZW5fa2V5OiBbdG9rZW5JZF0sXG4gICAgICAgIHByaWNlOiBbcHJpY2VdLFxuICAgICAgICB0aW1lb3V0OiBbeyBIb3VyczogVFdFTlRZX0ZPVVIgfV0sXG4gICAgICB9LFxuICAgICAgZ2FzLFxuICAgICAgcHJpY2VcbiAgICApXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHJ1ZSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gb2ZmZXIgdG8gYSB0b2tlbi5cbiAgICogQHBhcmFtIHRva2VuSWRcbiAgICogQHBhcmFtIHByaWNlXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgYWNjZXB0QW5kVHJhbnNmZXIoXG4gICAgdG9rZW5JZDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiB7XG4gICAgICBtYXJrZXRBZGRyZXNzPzogc3RyaW5nXG4gICAgICBnYXM/OiBzdHJpbmdcbiAgICB9XG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgY29uc3QgYWNjb3VudCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KClcbiAgICBjb25zdCBhY2NvdW50SWQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpLmFjY291bnRJZFxuICAgIGNvbnN0IGdhcyA9ICFvcHRpb25zPy5nYXMgPyBNQVhfR0FTIDogbmV3IEJOKG9wdGlvbnM/LmdhcylcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdBY2NvdW50IGlzIHVuZGVmaW5lZC4nIH0pXG4gICAgaWYgKCF0b2tlbklkKSByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ1BsZWFzZSBwcm92aWRlIGEgdG9rZW5JZCcgfSlcblxuICAgIGNvbnN0IGNvbnRyYWN0ID0gbmV3IENvbnRyYWN0KFxuICAgICAgYWNjb3VudCxcbiAgICAgIG9wdGlvbnM/Lm1hcmtldEFkZHJlc3MgfHxcbiAgICAgICAgdGhpcy5jb25zdGFudHMuTUFSS0VUX0FERFJFU1MgfHxcbiAgICAgICAgYDAuJHt0aGlzLmNvbnN0YW50cy5GQUNUT1JZX0NPTlRSQUNUX05BTUUgfHwgRkFDVE9SWV9DT05UUkFDVF9OQU1FfWAsXG4gICAgICB7XG4gICAgICAgIHZpZXdNZXRob2RzOlxuICAgICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgICBNQVJLRVRfQ09OVFJBQ1RfVklFV19NRVRIT0RTLFxuICAgICAgICBjaGFuZ2VNZXRob2RzOlxuICAgICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9DT05UUkFDVF9DQUxMX01FVEhPRFMgfHxcbiAgICAgICAgICBNQVJLRVRfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICAgICAgfVxuICAgIClcblxuICAgIC8vIEB0cy1pZ25vcmU6IG1ldGhvZCBkb2VzIG5vdCBleGlzdCBvbiBDb250cmFjdCB0eXBlXG4gICAgYXdhaXQgY29udHJhY3QuYWNjZXB0X2FuZF90cmFuc2ZlcihcbiAgICAgIHtcbiAgICAgICAgdG9rZW5fa2V5OiB0b2tlbklkLFxuICAgICAgfSxcbiAgICAgIGdhcyxcbiAgICAgIE9ORV9ZT0NUT1xuICAgIClcbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiB0cnVlIH0pXG4gIH1cblxuICAvKipcbiAgICogIFdpdGhkcmF3IHRoZSBlc2Nyb3cgZGVwb3NpdGVkIGZvciBhbiBvZmZlci5cbiAgICogQHBhcmFtIHRva2VuS2V5IFRoZSB0b2tlbiBrZXkuIGA8dG9rZW5JZD46PGNvbnRyYWN0TmFtZT5gXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgd2l0aGRyYXdPZmZlcihcbiAgICB0b2tlbktleTogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiB7XG4gICAgICBtYXJrZXRBZGRyZXNzPzogc3RyaW5nXG4gICAgICBnYXM/OiBzdHJpbmdcbiAgICB9XG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgY29uc3QgYWNjb3VudCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KClcbiAgICBjb25zdCBhY2NvdW50SWQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpLmFjY291bnRJZFxuICAgIGNvbnN0IGdhcyA9ICFvcHRpb25zPy5nYXMgPyBNQVhfR0FTIDogbmV3IEJOKG9wdGlvbnM/LmdhcylcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdBY2NvdW50IGlzIHVuZGVmaW5lZC4nIH0pXG5cbiAgICBjb25zdCBjb250cmFjdCA9IG5ldyBDb250cmFjdChcbiAgICAgIGFjY291bnQsXG4gICAgICBvcHRpb25zPy5tYXJrZXRBZGRyZXNzIHx8XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLk1BUktFVF9BRERSRVNTIHx8XG4gICAgICAgIGAwLiR7dGhpcy5jb25zdGFudHMuRkFDVE9SWV9DT05UUkFDVF9OQU1FIHx8IEZBQ1RPUllfQ09OVFJBQ1RfTkFNRX1gLFxuICAgICAge1xuICAgICAgICB2aWV3TWV0aG9kczpcbiAgICAgICAgICB0aGlzLmNvbnN0YW50cy5NQVJLRVRfQ09OVFJBQ1RfVklFV19NRVRIT0RTIHx8XG4gICAgICAgICAgTUFSS0VUX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgICAgICAgY2hhbmdlTWV0aG9kczpcbiAgICAgICAgICB0aGlzLmNvbnN0YW50cy5NQVJLRVRfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTIHx8XG4gICAgICAgICAgTUFSS0VUX0NPTlRSQUNUX0NBTExfTUVUSE9EUyxcbiAgICAgIH1cbiAgICApXG5cbiAgICAvLyBAdHMtaWdub3JlOiBtZXRob2QgZG9lcyBub3QgZXhpc3Qgb24gQ29udHJhY3QgdHlwZVxuICAgIGF3YWl0IGNvbnRyYWN0LndpdGhkcmF3X29mZmVyKHsgdG9rZW5fa2V5OiB0b2tlbktleSB9LCBnYXMpXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHJ1ZSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzdG9yZVxuICAgKiBAcGFyYW0gc3RvcmVJZCBTdG9yZSBuYW1lXG4gICAqIEBwYXJhbSBzeW1ib2wgU3RvcmUgc3ltYm9sXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGVwbG95U3RvcmUoXG4gICAgc3RvcmVJZDogc3RyaW5nLFxuICAgIHN5bWJvbDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiB7IGF0dGFjaGVkRGVwb3NpdD86IHN0cmluZzsgaWNvbj86IHN0cmluZzsgZ2FzPzogc3RyaW5nIH1cbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8Ym9vbGVhbj4+IHtcbiAgICBjb25zdCBhY2NvdW50ID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKVxuICAgIGNvbnN0IGFjY291bnRJZCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KCkuYWNjb3VudElkXG4gICAgY29uc3QgZ2FzID0gIW9wdGlvbnM/LmdhcyA/IE1BWF9HQVMgOiBuZXcgQk4ob3B0aW9ucz8uZ2FzKVxuXG4gICAgaWYgKCFhY2NvdW50IHx8ICFhY2NvdW50SWQpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ0FjY291bnQgaXMgdW5kZWZpbmVkLicgfSlcblxuICAgIC8vIFRPRE86IHJlZ2V4IGNoZWNrIGlucHV0cyAoc3RvcmVJZCBhbmQgc3ltYm9sKVxuXG4gICAgY29uc3QgY29udHJhY3QgPSBuZXcgQ29udHJhY3QoXG4gICAgICBhY2NvdW50LFxuICAgICAgdGhpcy5jb25zdGFudHMuRkFDVE9SWV9DT05UUkFDVF9OQU1FIHx8IEZBQ1RPUllfQ09OVFJBQ1RfTkFNRSxcbiAgICAgIHtcbiAgICAgICAgdmlld01ldGhvZHM6XG4gICAgICAgICAgdGhpcy5jb25zdGFudHMuRkFDVE9SWV9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgICBGQUNUT1JZX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgICAgICAgY2hhbmdlTWV0aG9kczpcbiAgICAgICAgICB0aGlzLmNvbnN0YW50cy5GQUNUT1JZX0NPTlRSQUNUX0NBTExfTUVUSE9EUyB8fFxuICAgICAgICAgIEZBQ1RPUllfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICAgICAgfVxuICAgIClcblxuICAgIGNvbnN0IHN0b3JlRGF0YSA9IHtcbiAgICAgIG93bmVyX2lkOiBhY2NvdW50SWQsXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBzcGVjOiAnbmZ0LTEuMC4wJyxcbiAgICAgICAgbmFtZTogc3RvcmVJZC5yZXBsYWNlKC9bXmEtejAtOV0rL2dpbSwgJycpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHN5bWJvbDogc3ltYm9sLnJlcGxhY2UoL1teYS16MC05XSsvZ2ltLCAnJykudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgaWNvbjogb3B0aW9ucz8uaWNvbiA/PyBNSU5UQkFTRV8zMngzMl9CQVNFNjRfREFSS19MT0dPLFxuICAgICAgICBiYXNlX3VyaTogdGhpcy5jb25zdGFudHMuQkFTRV9BUldFQVZFX1VSSSB8fCBCQVNFX0FSV0VBVkVfVVJJLFxuICAgICAgICByZWZlcmVuY2U6IG51bGwsXG4gICAgICAgIHJlZmVyZW5jZV9oYXNoOiBudWxsLFxuICAgICAgfSxcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2hlZERlcG9zaXQgPSAhb3B0aW9ucz8uYXR0YWNoZWREZXBvc2l0XG4gICAgICA/IERFUExPWV9TVE9SRV9DT1NUXG4gICAgICA6IG5ldyBCTihvcHRpb25zPy5hdHRhY2hlZERlcG9zaXQpXG5cbiAgICAvLyBAdHMtaWdub3JlOiBtZXRob2QgZG9lcyBub3QgZXhpc3Qgb24gQ29udHJhY3QgdHlwZVxuICAgIGF3YWl0IGNvbnRyYWN0LmNyZWF0ZV9zdG9yZShzdG9yZURhdGEsIGdhcywgYXR0YWNoZWREZXBvc2l0KVxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHRydWUgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2ZlcnMgb3duZXJzaGlwIG9mIGEgc3RvcmVcbiAgICogQHBhcmFtIG5ld093bmVyXG4gICAqIEBwYXJhbSBrZWVwT2xkTWludGVyc1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHRyYW5zZmVyU3RvcmVPd25lcnNoaXAoXG4gICAgbmV3T3duZXI6IHN0cmluZyxcbiAgICBjb250cmFjdE5hbWU6IHN0cmluZyxcbiAgICBvcHRpb25zPzogeyBrZWVwT2xkTWludGVyczogYm9vbGVhbiB9XG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGJvb2xlYW4+PiB7XG4gICAgY29uc3QgYWNjb3VudCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KClcbiAgICBjb25zdCBhY2NvdW50SWQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpLmFjY291bnRJZFxuXG4gICAgaWYgKCFhY2NvdW50IHx8ICFhY2NvdW50SWQpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ0FjY291bnQgaXMgdW5kZWZpbmVkLicgfSlcblxuICAgIGlmICghY29udHJhY3ROYW1lKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdObyBjb250cmFjdCB3YXMgcHJvdmlkZWQuJyB9KVxuXG4gICAgY29uc3QgY29udHJhY3QgPSBuZXcgQ29udHJhY3QoYWNjb3VudCwgY29udHJhY3ROYW1lLCB7XG4gICAgICB2aWV3TWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgICAgIGNoYW5nZU1ldGhvZHM6XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLlNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyB8fFxuICAgICAgICBTVE9SRV9DT05UUkFDVF9DQUxMX01FVEhPRFMsXG4gICAgfSlcblxuICAgIGNvbnN0IGtlZXBPbGRNaW50ZXJzID0gb3B0aW9ucz8ua2VlcE9sZE1pbnRlcnMgfHwgdHJ1ZVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC50cmFuc2Zlcl9zdG9yZV9vd25lcnNoaXAoXG4gICAgICB7IG5ld19vd25lcjogbmV3T3duZXIsIGtlZXBfb2xkX21pbnRlcnM6IGtlZXBPbGRNaW50ZXJzIH0sXG4gICAgICBNQVhfR0FTLFxuICAgICAgT05FX1lPQ1RPXG4gICAgKVxuXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHJ1ZSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE1pbnQgYSB0b2tlblxuICAgKiBAcGFyYW0gYW1vdW50IFRoZSBudW1iZXIgb2YgdG9rZW5zIHRvIG1pbnQuXG4gICAqIEBwYXJhbSBjb250cmFjdE5hbWUgVGhlIGNvbnRyYWN0IGluIHdoaWNoIHRva2VucyB3aWxsIGJlIG1pbnRlZC5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBtaW50KFxuICAgIGFtb3VudDogbnVtYmVyLFxuICAgIGNvbnRyYWN0TmFtZTogc3RyaW5nLFxuICAgIHJveWFsdGllcz86IFJveWFsdGllcyxcbiAgICBzcGxpdHM/OiBTcGxpdCxcbiAgICBjYXRlZ29yeT86IHN0cmluZ1xuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxib29sZWFuPj4ge1xuICAgIGNvbnN0IGFjY291bnQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpXG4gICAgY29uc3QgYWNjb3VudElkID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKS5hY2NvdW50SWRcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdBY2NvdW50IGlzIHVuZGVmaW5lZC4nIH0pXG4gICAgaWYgKCFjb250cmFjdE5hbWUpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ05vIGNvbnRyYWN0IHdhcyBwcm92aWRlZC4nIH0pXG5cbiAgICBjb25zdCBjb250cmFjdCA9IG5ldyBDb250cmFjdChhY2NvdW50LCBjb250cmFjdE5hbWUsIHtcbiAgICAgIHZpZXdNZXRob2RzOlxuICAgICAgICB0aGlzLmNvbnN0YW50cy5TVE9SRV9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTLFxuICAgICAgY2hhbmdlTWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyxcbiAgICB9KVxuXG4gICAgLy8gVE9ETzogQ2hlY2sgaWYgbWludGVyIGhhcyBhIHZhbGlkIG9iamVjdCB0byBtaW50LlxuXG4gICAgaWYgKCF0aGlzLm1pbnRlcikgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdNaW50ZXIgbm90IGRlZmluZWQuJyB9KVxuXG4gICAgY29uc3QgeyBkYXRhOiBtZXRhZGF0YUlkIH0gPSBhd2FpdCB0aGlzLm1pbnRlci5nZXRNZXRhZGF0YUlkKClcblxuICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgIG93bmVyX2lkOiBhY2NvdW50SWQsXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICByZWZlcmVuY2U6IG1ldGFkYXRhSWQsXG4gICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIGNhdGVnb3J5IGlzIGxvd2VyY2FzZVxuICAgICAgICBleHRyYTogIWNhdGVnb3J5ID8gbnVsbCA6IGNhdGVnb3J5LFxuICAgICAgfSxcbiAgICAgIG51bV90b19taW50OiBhbW91bnQsXG4gICAgICByb3lhbHR5X2FyZ3M6ICFyb3lhbHRpZXNcbiAgICAgICAgPyBudWxsXG4gICAgICAgIDogeyBzcGxpdF9iZXR3ZWVuOiByb3lhbHRpZXMsIHBlcmNlbnRhZ2U6IERFRkFVTFRfUk9ZQUxUWV9QRVJDRU5UIH0sXG4gICAgICBzcGxpdF9vd25lcnM6IHNwbGl0cyB8fCBudWxsLFxuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmU6IG1ldGhvZCBkb2VzIG5vdCBleGlzdCBvbiBDb250cmFjdCB0eXBlXG4gICAgYXdhaXQgY29udHJhY3QubmZ0X2JhdGNoX21pbnQob2JqLCBNQVhfR0FTLCBPTkVfWU9DVE8pXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHJ1ZSB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEJhdGNoIG1pbnQgc2VydmVyYWwgdG9rZW5zXG4gICAqL1xuICAgcHVibGljIGJhdGNoTWludChcbiAgKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coXCJIZWxsb1wiKVxuICB9XG5cbiAgLyoqXG4gICAqIE1pbnQgbW9yZSBwaWVjZXMgb2YgdG9rZW5zIG9mIGEgdGhpbmcuXG4gICAqIEBwYXJhbSBhbW91bnQgVGhlIG51bWJlciBvZiB0b2tlbnMgdG8gbWludC5cbiAgICogQHBhcmFtIGlkIFRoZSB0aGluZyBpZFxuICAgKiBAcGFyYW0gc3BsaXRzIFRoZSBjb250cmFjdCBpbiB3aGljaCB0b2tlbnMgd2lsbCBiZSBtaW50ZWQuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgbWludE1vcmUoXG4gICAgYW1vdW50OiBudW1iZXIsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBzcGxpdHM/OiBTcGxpdFxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxib29sZWFuPj4ge1xuICAgIGNvbnN0IGFjY291bnQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpXG4gICAgY29uc3QgYWNjb3VudElkID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKS5hY2NvdW50SWRcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKSB0aHJvdyBuZXcgRXJyb3IoJ0FjY291bnQgaXMgdW5kZWZpbmVkLicpXG4gICAgaWYgKCF0aGlzLmFwaSkgdGhyb3cgbmV3IEVycm9yKCdBUEkgaXMgbm90IGRlZmluZWQuJylcblxuICAgIC8vIFRPRE86IG1vdmUgdGhpcyB0aGluZyB0eXBlIHRvIGEgcHJvcGVyIHBsYWNlXG4gICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgdGhpcy5hcGkuY3VzdG9tPHtcbiAgICAgIHRoaW5nOiB7XG4gICAgICAgIG1ldGFJZDogc3RyaW5nXG4gICAgICAgIHN0b3JlSWQ6IHN0cmluZ1xuICAgICAgICBtZW1vOiBzdHJpbmdcbiAgICAgICAgdG9rZW5zOiB7XG4gICAgICAgICAgcm95YWx0eVBlcmNlbnQ6IHN0cmluZ1xuICAgICAgICAgIHJveWFsdHlzOiB7IGFjY291bnQ6IHN0cmluZzsgcGVyY2VudDogc3RyaW5nIH1bXVxuICAgICAgICB9W11cbiAgICAgIH1bXVxuICAgIH0+KFxuICAgICAgYHF1ZXJ5IEdFVF9USElOR19CWV9JRCgkaWQ6IFN0cmluZyEpIHtcbiAgICAgIHRoaW5nKHdoZXJlOiB7aWQ6IHtfZXE6ICRpZH19KSB7XG4gICAgICAgIG1ldGFJZFxuICAgICAgICBzdG9yZUlkXG4gICAgICAgIG1lbW9cbiAgICAgICAgdG9rZW5zIHtcbiAgICAgICAgICByb3lhbHR5UGVyY2VudFxuICAgICAgICAgIHJveWFsdHlzIHtcbiAgICAgICAgICAgIGFjY291bnRcbiAgICAgICAgICAgIHBlcmNlbnRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgYCxcbiAgICAgIHsgaWQgfVxuICAgIClcblxuICAgIGNvbnN0IHsgdGhpbmc6IF90aGluZyB9ID0gZGF0YVxuXG4gICAgaWYgKGVycm9yIHx8IF90aGluZy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnVGhpbmcgZG9lcyBub3QgZXhpc3QuJyB9KVxuICAgIH1cblxuICAgIGNvbnN0IHRoaW5nID0gX3RoaW5nWzBdXG5cbiAgICBpZiAodGhpbmcudG9rZW5zLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnVGhpbmcgZG9lcyBub3QgaGF2ZSB0b2tlbnMuJyB9KVxuXG4gICAgY29uc3QgY29udHJhY3ROYW1lID0gdGhpbmcuc3RvcmVJZFxuICAgIGNvbnN0IG1lbW8gPSB0aGluZy5tZW1vXG4gICAgY29uc3QgbWV0YUlkID0gdGhpbmcubWV0YUlkXG4gICAgY29uc3QgdG9rZW4gPSB0aGluZy50b2tlbnNbMF1cblxuICAgIGNvbnN0IGNvbnRyYWN0ID0gbmV3IENvbnRyYWN0KGFjY291bnQsIGNvbnRyYWN0TmFtZSwge1xuICAgICAgdmlld01ldGhvZHM6XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLlNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyB8fFxuICAgICAgICBTVE9SRV9DT05UUkFDVF9WSUVXX01FVEhPRFMsXG4gICAgICBjaGFuZ2VNZXRob2RzOlxuICAgICAgICB0aGlzLmNvbnN0YW50cy5TVE9SRV9DT05UUkFDVF9DQUxMX01FVEhPRFMgfHxcbiAgICAgICAgU1RPUkVfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTLFxuICAgIH0pXG5cbiAgICBjb25zdCBfcm95YWx0aWVzID0gdG9rZW4ucm95YWx0eXMucmVkdWNlKFxuICAgICAgKGFjY3VtdWxhdG9yLCB7IGFjY291bnQsIHBlcmNlbnQgfSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmFjY3VtdWxhdG9yLFxuICAgICAgICAgIFthY2NvdW50XTogcGVyY2VudCxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHt9XG4gICAgKVxuXG4gICAgY29uc3Qgb2JqID0ge1xuICAgICAgb3duZXJfaWQ6IGFjY291bnRJZCxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIHJlZmVyZW5jZTogbWV0YUlkLFxuICAgICAgICBleHRyYTogbWVtbyxcbiAgICAgIH0sXG4gICAgICBudW1fdG9fbWludDogYW1vdW50LFxuICAgICAgcm95YWx0eV9hcmdzOlxuICAgICAgICBPYmplY3Qua2V5cyhfcm95YWx0aWVzKS5sZW5ndGggPiAwXG4gICAgICAgICAgPyB7XG4gICAgICAgICAgICAgIHNwbGl0X2JldHdlZW46IF9yb3lhbHRpZXMsXG4gICAgICAgICAgICAgIHBlcmNlbnRhZ2U6IHRva2VuLnJveWFsdHlQZXJjZW50LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIDogbnVsbCxcbiAgICAgIHNwbGl0X293bmVyczogc3BsaXRzIHx8IG51bGwsXG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC5uZnRfYmF0Y2hfbWludChvYmosIE1BWF9HQVMsIE9ORV9ZT0NUTylcbiAgICAvLyBUT0RPOiBkZWZpbmUgYSByZXNwb25zZSBmb3IgdGhpc1xuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHRydWUgfSlcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBncmFudE1pbnRlcihcbiAgICBtaW50ZXJBY2NvdW50SWQ6IHN0cmluZyxcbiAgICBjb250cmFjdE5hbWU6IHN0cmluZ1xuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxib29sZWFuPj4ge1xuICAgIGNvbnN0IGFjY291bnQgPSB0aGlzLmFjdGl2ZVdhbGxldD8uYWNjb3VudCgpXG4gICAgY29uc3QgYWNjb3VudElkID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKS5hY2NvdW50SWRcblxuICAgIGlmICghYWNjb3VudCB8fCAhYWNjb3VudElkKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdBY2NvdW50IGlzIHVuZGVmaW5lZC4nIH0pXG4gICAgaWYgKCFjb250cmFjdE5hbWUpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ05vIGNvbnRyYWN0IHdhcyBwcm92aWRlZC4nIH0pXG5cbiAgICBjb25zdCBjb250cmFjdCA9IG5ldyBDb250cmFjdChhY2NvdW50LCBjb250cmFjdE5hbWUsIHtcbiAgICAgIHZpZXdNZXRob2RzOlxuICAgICAgICB0aGlzLmNvbnN0YW50cy5TVE9SRV9DT05UUkFDVF9WSUVXX01FVEhPRFMgfHxcbiAgICAgICAgU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTLFxuICAgICAgY2hhbmdlTWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfQ0FMTF9NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyxcbiAgICB9KVxuXG4gICAgLy8gQHRzLWlnbm9yZTogbWV0aG9kIGRvZXMgbm90IGV4aXN0IG9uIENvbnRyYWN0IHR5cGVcbiAgICBhd2FpdCBjb250cmFjdC5ncmFudF9taW50ZXIoXG4gICAgICB7IGFjY291bnRfaWQ6IG1pbnRlckFjY291bnRJZCB9LFxuICAgICAgTUFYX0dBUyxcbiAgICAgIE9ORV9ZT0NUT1xuICAgIClcbiAgICAvLyBUT0RPOiBkZWZpbmUgYSByZXNwb25zZSBmb3IgdGhpc1xuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHRydWUgfSlcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZXZva2VNaW50ZXIoXG4gICAgbWludGVyQWNjb3VudElkOiBzdHJpbmcsXG4gICAgY29udHJhY3ROYW1lOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8Ym9vbGVhbj4+IHtcbiAgICBjb25zdCBhY2NvdW50ID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKVxuICAgIGNvbnN0IGFjY291bnRJZCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5hY2NvdW50KCkuYWNjb3VudElkXG5cbiAgICBpZiAoIWFjY291bnQgfHwgIWFjY291bnRJZClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiAnQWNjb3VudCBpcyB1bmRlZmluZWQuJyB9KVxuICAgIGlmICghY29udHJhY3ROYW1lKVxuICAgICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZXJyb3I6ICdObyBjb250cmFjdCB3YXMgcHJvdmlkZWQuJyB9KVxuXG4gICAgY29uc3QgY29udHJhY3QgPSBuZXcgQ29udHJhY3QoYWNjb3VudCwgY29udHJhY3ROYW1lLCB7XG4gICAgICB2aWV3TWV0aG9kczpcbiAgICAgICAgdGhpcy5jb25zdGFudHMuU1RPUkVfQ09OVFJBQ1RfVklFV19NRVRIT0RTIHx8XG4gICAgICAgIFNUT1JFX0NPTlRSQUNUX1ZJRVdfTUVUSE9EUyxcbiAgICAgIGNoYW5nZU1ldGhvZHM6XG4gICAgICAgIHRoaXMuY29uc3RhbnRzLlNUT1JFX0NPTlRSQUNUX0NBTExfTUVUSE9EUyB8fFxuICAgICAgICBTVE9SRV9DT05UUkFDVF9DQUxMX01FVEhPRFMsXG4gICAgfSlcblxuICAgIC8vIEB0cy1pZ25vcmU6IG1ldGhvZCBkb2VzIG5vdCBleGlzdCBvbiBDb250cmFjdCB0eXBlXG4gICAgYXdhaXQgY29udHJhY3QucmV2b2tlX21pbnRlcihcbiAgICAgIHsgYWNjb3VudF9pZDogbWludGVyQWNjb3VudElkIH0sXG4gICAgICBNQVhfR0FTLFxuICAgICAgT05FX1lPQ1RPXG4gICAgKVxuICAgIC8vIFRPRE86IGRlZmluZSBhIHJlc3BvbnNlIGZvciB0aGlzXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHJ1ZSB9KVxuICB9XG5cbiAgcHVibGljIGFzeW5jIHNldFNlc3Npb25LZXlQYWlyKFxuICAgIGFjY291bnRJZDogc3RyaW5nLFxuICAgIHByaXZhdGVLZXk6IHN0cmluZ1xuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxLZXlTdG9yZT4+IHtcbiAgICBpZiAoIXRoaXMua2V5U3RvcmUpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogJ0tleVN0b3JlIG5vdCBkZWZpbmVkLicgfSlcblxuICAgIHRoaXMua2V5U3RvcmUuc2V0S2V5KFxuICAgICAgdGhpcy5uZXR3b3JrTmFtZSxcbiAgICAgIGFjY291bnRJZCxcbiAgICAgIEtleVBhaXIuZnJvbVN0cmluZyhwcml2YXRlS2V5KVxuICAgIClcblxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHRoaXMua2V5U3RvcmUgfSlcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRTZXNzaW9uS2V5UGFpcigpOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxLZXlQYWlyPj4ge1xuICAgIGNvbnN0IGFjY291bnRJZCA9IHRoaXMuYWN0aXZlV2FsbGV0Py5nZXRBY2NvdW50SWQoKVxuXG4gICAgaWYgKCFhY2NvdW50SWQpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogRVJST1JfTUVTU0FHRVMudW5kZWZpbmVkQWNjb3VudElkIH0pXG5cbiAgICBpZiAoIXRoaXMua2V5U3RvcmUpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogRVJST1JfTUVTU0FHRVMudW5kZWZpbmVkS2V5U3RvcmUgfSlcblxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmtleVN0b3JlPy5nZXRLZXkodGhpcy5uZXR3b3JrTmFtZSwgYWNjb3VudElkKVxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGEgfSlcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzaWduTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiBQcm9taXNlPFxuICAgIFJlc3BvbnNlRGF0YTx7XG4gICAgICBzaWduYXR1cmU6IG51bWJlcltdXG4gICAgICBwdWJsaWNLZXk6IG51bWJlcltdXG4gICAgICBhY2NvdW50SWQ6IHN0cmluZ1xuICAgICAgcHVibGljS2V5X3N0cjogc3RyaW5nXG4gICAgfT5cbiAgPiB7XG4gICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKCkpXG4gICAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBlcnJvcjogRVJST1JfTUVTU0FHRVMud2FsbGV0Tm90Q29ubmVjdGVkIH0pXG5cbiAgICBjb25zdCB7IGRhdGE6IGtleVBhaXIsIGVycm9yIH0gPSBhd2FpdCB0aGlzLmdldFNlc3Npb25LZXlQYWlyKClcbiAgICBpZiAoZXJyb3IpIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiBFUlJPUl9NRVNTQUdFUy5pbnZhbGlkS2V5UGFpciB9KVxuXG4gICAgY29uc3QgYWNjb3VudElkID0gdGhpcy5hY3RpdmVBY2NvdW50Py5hY2NvdW50SWRcbiAgICBpZiAoIWFjY291bnRJZClcbiAgICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGVycm9yOiBFUlJPUl9NRVNTQUdFUy51bmRlZmluZWRBY2NvdW50SWQgfSlcblxuICAgIGNvbnN0IGFycmF5QnVmZmVyID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKG1lc3NhZ2UpLmJ1ZmZlclxuICAgIGNvbnN0IGVuY29kZWRNZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpXG5cbiAgICBjb25zdCB7IHNpZ25hdHVyZSwgcHVibGljS2V5IH0gPSBrZXlQYWlyLnNpZ24oZW5jb2RlZE1lc3NhZ2UpXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2Uoe1xuICAgICAgZGF0YToge1xuICAgICAgICBzaWduYXR1cmU6IEFycmF5LmZyb20oc2lnbmF0dXJlKSxcbiAgICAgICAgcHVibGljS2V5OiBBcnJheS5mcm9tKHB1YmxpY0tleS5kYXRhKSxcbiAgICAgICAgcHVibGljS2V5X3N0cjoga2V5UGFpci5nZXRQdWJsaWNLZXkoKS50b1N0cmluZygpLFxuICAgICAgICBhY2NvdW50SWQsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgdmVyaWZ5U2lnbmF0dXJlKHJlcXVlc3RCb2R5OiB7XG4gICAgcHVibGljS2V5OiBudW1iZXJbXVxuICAgIHNpZ25hdHVyZTogbnVtYmVyW11cbiAgICBhY2NvdW50SWQ6IHN0cmluZ1xuICAgIG1lc3NhZ2U6IHN0cmluZ1xuICB9KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHNpZ24uZGV0YWNoZWQudmVyaWZ5KFxuICAgICAgbWVzc2FnZUVuY29kZShyZXF1ZXN0Qm9keS5tZXNzYWdlKSxcbiAgICAgIG5ldyBVaW50OEFycmF5KHJlcXVlc3RCb2R5LnNpZ25hdHVyZSksXG4gICAgICBuZXcgVWludDhBcnJheShyZXF1ZXN0Qm9keS5wdWJsaWNLZXkpXG4gICAgKVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRLZXlTdG9yZSgpIHtcbiAgICBpZiAoaXNOb2RlKSByZXR1cm4gbmV3IGtleVN0b3Jlcy5Jbk1lbW9yeUtleVN0b3JlKClcbiAgICBpZiAoaXNCcm93c2VyKSByZXR1cm4gbmV3IGtleVN0b3Jlcy5Ccm93c2VyTG9jYWxTdG9yYWdlS2V5U3RvcmUoKVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdSdW50aW1lIGVudmlyb25tZW50IGhhcyB0byBiZSBOb2RlIG9yIEJyb3dzZXInKVxuICB9XG5cbiAgLy8gcHJpdmF0ZSBnZXRLZXlQYWlyRnJvbUxvY2Fsc3RvcmFnZSgpIHt9XG5cbiAgLyoqXG4gICAqIEZldGNoIGxvY2FsIHN0b3JhZ2UgY29ubmVjdGlvbnNcbiAgICovXG4gIHB1YmxpYyBnZXRMb2NhbEFjY291bnRzKCk6IFJlc3BvbnNlRGF0YTx7XG4gICAgW2FjY291bnRJZDogc3RyaW5nXTogeyBhY2NvdW50SWQ/OiBzdHJpbmc7IGNvbnRyYWN0TmFtZT86IHN0cmluZyB9XG4gIH0+IHtcbiAgICBjb25zdCByZWdleCA9IC9uZWFyLWFwaS1qczprZXlzdG9yZTovXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSlcblxuICAgIGNvbnN0IG1hdGNoZXMgPSBrZXlzLmZpbHRlcigoa2V5KSA9PiB7XG4gICAgICByZXR1cm4gcmVnZXguZXhlYyhrZXkpICE9PSBudWxsXG4gICAgfSlcblxuICAgIGxldCBhY2NvdW50cyA9IHt9XG5cbiAgICBtYXRjaGVzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgY29uc3QgYWNjb3VudElkID0ga2V5LnNwbGl0KCc6JylbMl1cblxuICAgICAgYWNjb3VudHMgPSB7XG4gICAgICAgIC4uLmFjY291bnRzLFxuICAgICAgICBbYWNjb3VudElkXToge1xuICAgICAgICAgIGFjY291bnRJZDogYWNjb3VudElkLFxuICAgICAgICAgIGNvbnRyYWN0TmFtZTogJycsIC8vIFRPRE86IGdldCBjb250cmFjdE5hbWUgY29ubmVjdGlvblxuICAgICAgICB9LFxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gZm9ybWF0UmVzcG9uc2UoeyBkYXRhOiBhY2NvdW50cyB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIHRyYW5zYWN0aW9uIHJlc3VsdCBnaXZlbiBhIHRyYW5zYWN0aW9uIGhhc2guXG4gICAqIEBwYXJhbSB0eEhhc2ggdGhlIHRyYW5zYWN0aW9uJ3MgaGFzaFxuICAgKiBAcmV0dXJucyB0aGUgdHJhbnNhY3Rpb24gcmVzdWx0XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZmV0Y2hUcmFuc2FjdGlvblJlc3VsdChcbiAgICB0eEhhc2g6IHN0cmluZ1xuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxGaW5hbEV4ZWN1dGlvbk91dGNvbWU+PiB7XG4gICAgY29uc3QgY29ubmVjdGlvbiA9IHRoaXMuYWN0aXZlTmVhckNvbm5lY3Rpb24/LmNvbm5lY3Rpb25cbiAgICBpZiAoIWNvbm5lY3Rpb24pIHRocm93IG5ldyBFcnJvcignTmVhciBjb25uZWN0aW9uIGlzIHVuZGVmaW5lZC4nKVxuXG4gICAgY29uc3QgYWNjb3VudElkID0gdGhpcy5hY3RpdmVXYWxsZXQ/LmFjY291bnQoKS5hY2NvdW50SWRcbiAgICBpZiAoIWFjY291bnRJZCkgdGhyb3cgbmV3IEVycm9yKCdBY2NvdW50IElkIGlzIHVuZGVmaW5lZC4nKVxuXG4gICAgY29uc3QgZGVjb2RlSGFzaCA9IHV0aWxzLnNlcmlhbGl6ZS5iYXNlX2RlY29kZSh0eEhhc2gpXG5cbiAgICBjb25zdCB0eFJlc3VsdCA9IGF3YWl0IGNvbm5lY3Rpb24ucHJvdmlkZXIudHhTdGF0dXMoZGVjb2RlSGFzaCwgYWNjb3VudElkKVxuXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogdHhSZXN1bHQgfSlcbiAgfVxuXG4gIHByaXZhdGUgcnBjQ2FsbCA9IGFzeW5jICh7XG4gICAgaGVhZGVycyA9IHt9LFxuICAgIGJvZHkgPSB7fSxcbiAgICBtZXRob2QsXG4gIH06IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGhlYWRlcnM/OiBhbnlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGJvZHk/OiBhbnlcbiAgICBtZXRob2Q6IHN0cmluZ1xuICB9KSA9PiB7XG4gICAgaWYgKCF0aGlzLm5lYXJDb25maWcpIHRocm93IG5ldyBFcnJvcignTkVBUiBDb25maWcgbm90IGRlZmluZWQuJylcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBhd2FpdCBmZXRjaCh0aGlzLm5lYXJDb25maWcubm9kZVVybCwge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIC4uLmJvZHksXG4gICAgICAgIGpzb25ycGM6ICcyLjAnLFxuICAgICAgICBpZDogYG1pbnRiYXNlLSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygpLnN1YnN0cigyLCAxMCl9YCxcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB9KSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLi4uaGVhZGVycyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxuICAgIHJldHVybiBkYXRhPy5yZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBhY2Nlc3Mga2V5IGluZm9ybWF0aW9uXG4gICAqIEBwYXJhbSBhY2NvdW50SWQgYWNjb3VudCBpZFxuICAgKiBAcGFyYW0gcHVibGljS2V5IHB1YmxpYyBrZXlcbiAgICogQHJldHVybnMgQWNjZXNzIEtleSBpbmZvcm1hdGlvblxuICAgKi9cbiAgcHVibGljIHZpZXdBY2Nlc3NLZXkgPSBhc3luYyAoXG4gICAgYWNjb3VudElkOiBzdHJpbmcsXG4gICAgcHVibGljS2V5OiBzdHJpbmdcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxhbnk+PiA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5ycGNDYWxsKHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgcmVxdWVzdF90eXBlOiAndmlld19hY2Nlc3Nfa2V5JyxcbiAgICAgICAgICBmaW5hbGl0eTogJ2ZpbmFsJyxcbiAgICAgICAgICBhY2NvdW50X2lkOiBhY2NvdW50SWQsXG4gICAgICAgICAgcHVibGljX2tleTogcHVibGljS2V5LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ3F1ZXJ5JyxcbiAgICB9KVxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHJlc3VsdCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIGxpc3Qgb2YgYWNjZXNzIGtleXMgZm9yIGEgZ2l2ZW4gYWNjb3VudFxuICAgKiBAcGFyYW0gYWNjb3VudElkIGFjY291bnQgaWRcbiAgICogQHJldHVybnMgTGlzdCBvZiBhY2Nlc3Mga2V5c1xuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgcHVibGljIHZpZXdBY2Nlc3NLZXlMaXN0ID0gYXN5bmMgKFxuICAgIGFjY291bnRJZDogc3RyaW5nXG4gICk6IFByb21pc2U8UmVzcG9uc2VEYXRhPGFueT4+ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJwY0NhbGwoe1xuICAgICAgYm9keToge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICByZXF1ZXN0X3R5cGU6ICd2aWV3X2FjY2Vzc19rZXlfbGlzdCcsXG4gICAgICAgICAgZmluYWxpdHk6ICdmaW5hbCcsXG4gICAgICAgICAgYWNjb3VudF9pZDogYWNjb3VudElkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ3F1ZXJ5JyxcbiAgICB9KVxuICAgIHJldHVybiBmb3JtYXRSZXNwb25zZSh7IGRhdGE6IHJlc3VsdCB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIGEgdHJhbnNhY3Rpb24gc3RhdHVzLlxuICAgKiBAcGFyYW0gdHJhbnNhY3Rpb25IYXNoIFRoZSB0cmFuc2FjdGlvbnMnIGhhc2guXG4gICAqIEBwYXJhbSBhY2NvdW50SWQgVGhlIGFjY291bnQgd2hvIGluaXRpYXRlZCB0aGUgdHJhbnNhdGlvbi4gVE9ETzogTWlnaHQgbm90IGJlIHJlYWxseSBuZWNlc3NhcnkgdG8gcGFzcyB0aGlzLlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNhY3Rpb24gcmVzdWx0XG4gICAqL1xuICBwdWJsaWMgdHJhbnNhY3Rpb25TdGF0dXMgPSBhc3luYyAoXG4gICAgdHJhbnNhY3Rpb25IYXNoOiBzdHJpbmcsXG4gICAgYWNjb3VudElkOiBzdHJpbmdcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICApOiBQcm9taXNlPFJlc3BvbnNlRGF0YTxhbnk+PiA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5ycGNDYWxsKHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcGFyYW1zOiBbdHJhbnNhY3Rpb25IYXNoLCBhY2NvdW50SWRdLFxuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ3R4JyxcbiAgICB9KVxuXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogcmVzdWx0IH0pXG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggdHJhbnNhY3Rpb24gc3RhdHVzIHdpdGggYWxsIHJlY2VpcHRzLlxuICAgKiBAcGFyYW0gdHJhbnNhY3Rpb25IYXNoIFRoZSB0cmFuc2FjdGlvbnMnIGhhc2guXG4gICAqIEBwYXJhbSBhY2NvdW50SWQgVGhlIGFjY291bnQgd2hvIGluaXRpYXRlZCB0aGUgdHJhbnNhdGlvbi4gVE9ETzogTWlnaHQgbm90IGJlIHJlYWxseSBuZWNlc3NhcnkgdG8gcGFzcyB0aGlzLlxuICAgKiBAcmV0dXJucyBUaGUgdHJhbnNhY3Rpb24gcmVzdWx0IHdpdGggYWxsIHJlY2VpcHRzLlxuICAgKi9cbiAgcHVibGljIHRyYW5zYWN0aW9uU3RhdHVzV2l0aFJlY2VpcHRzID0gYXN5bmMgKFxuICAgIHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nLFxuICAgIGFjY291bnRJZDogc3RyaW5nXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgKTogUHJvbWlzZTxSZXNwb25zZURhdGE8YW55Pj4gPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucnBjQ2FsbCh7XG4gICAgICBib2R5OiB7XG4gICAgICAgIHBhcmFtczogW3RyYW5zYWN0aW9uSGFzaCwgYWNjb3VudElkXSxcbiAgICAgIH0sXG4gICAgICBtZXRob2Q6ICdFWFBFUklNRU5UQUxfdHhfc3RhdHVzJyxcbiAgICB9KVxuXG4gICAgcmV0dXJuIGZvcm1hdFJlc3BvbnNlKHsgZGF0YTogcmVzdWx0IH0pXG4gIH1cblxuICAvKipcbiAgICogR2V0IE5FQVIgY29uZmlndXJhdGlvbiBvYmplY3QuIERlZmF1bHRzIHRvIHRlc3RuZXQuXG4gICAqIEBwYXJhbSBuZXR3b3JrTmFtZVxuICAgKiBAcGFyYW0gY29udHJhY3RBZGRyZXNzXG4gICAqL1xuICBwcml2YXRlIGdldE5lYXJDb25maWcoXG4gICAgbmV0d29ya05hbWU6IE5ldHdvcmssXG4gICAgY29udHJhY3RBZGRyZXNzPzogc3RyaW5nXG4gICk6IE5FQVJDb25maWcge1xuICAgIHN3aXRjaCAobmV0d29ya05hbWUpIHtcbiAgICAgIGNhc2UgTmV0d29yay50ZXN0bmV0OlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5ldHdvcmtJZDogJ3Rlc3RuZXQnLFxuICAgICAgICAgIG5vZGVVcmw6ICdodHRwczovL3JwYy50ZXN0bmV0Lm5lYXIub3JnJyxcbiAgICAgICAgICBjb250cmFjdE5hbWU6XG4gICAgICAgICAgICBjb250cmFjdEFkZHJlc3MgfHxcbiAgICAgICAgICAgIHRoaXMuY29uc3RhbnRzPy5GQUNUT1JZX0NPTlRSQUNUX05BTUUgfHxcbiAgICAgICAgICAgIEZBQ1RPUllfQ09OVFJBQ1RfTkFNRSxcbiAgICAgICAgICB3YWxsZXRVcmw6ICdodHRwczovL3dhbGxldC50ZXN0bmV0Lm5lYXIub3JnJyxcbiAgICAgICAgICBoZWxwZXJVcmw6ICdodHRwczovL2hlbHBlci50ZXN0bmV0Lm5lYXIub3JnJyxcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIE5ldHdvcmsubWFpbm5ldDpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuZXR3b3JrSWQ6ICdtYWlubmV0JyxcbiAgICAgICAgICBub2RlVXJsOiAnaHR0cHM6Ly9ycGMubWFpbm5ldC5uZWFyLm9yZycsXG4gICAgICAgICAgY29udHJhY3ROYW1lOlxuICAgICAgICAgICAgY29udHJhY3RBZGRyZXNzIHx8XG4gICAgICAgICAgICB0aGlzLmNvbnN0YW50cz8uRkFDVE9SWV9DT05UUkFDVF9OQU1FIHx8XG4gICAgICAgICAgICBGQUNUT1JZX0NPTlRSQUNUX05BTUUsXG4gICAgICAgICAgd2FsbGV0VXJsOiAnaHR0cHM6Ly93YWxsZXQubmVhci5vcmcnLFxuICAgICAgICAgIGhlbHBlclVybDogJ2h0dHBzOi8vaGVscGVyLm1haW5uZXQubmVhci5vcmcnLFxuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5ldHdvcmtJZDogJ3Rlc3RuZXQnLFxuICAgICAgICAgIG5vZGVVcmw6ICdodHRwczovL3JwYy50ZXN0bmV0Lm5lYXIub3JnJyxcbiAgICAgICAgICBjb250cmFjdE5hbWU6XG4gICAgICAgICAgICBjb250cmFjdEFkZHJlc3MgfHxcbiAgICAgICAgICAgIHRoaXMuY29uc3RhbnRzPy5GQUNUT1JZX0NPTlRSQUNUX05BTUUgfHxcbiAgICAgICAgICAgIEZBQ1RPUllfQ09OVFJBQ1RfTkFNRSxcbiAgICAgICAgICB3YWxsZXRVcmw6ICdodHRwczovL3dhbGxldC50ZXN0bmV0Lm5lYXIub3JnJyxcbiAgICAgICAgICBoZWxwZXJVcmw6ICdodHRwczovL2hlbHBlci50ZXN0bmV0Lm5lYXIub3JnJyxcbiAgICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19