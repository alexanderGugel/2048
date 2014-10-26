window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";
  this.gameHistoryKey   = "gameHistory";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));

  var gameHistory = this.storage.getItem(this.gameHistoryKey);
  gameHistory = gameHistory ? JSON.parse(gameHistory) : [];
  gameHistory.push(gameState);
  this.storage.setItem(this.gameHistoryKey, JSON.stringify(gameHistory));
};

LocalStorageManager.prototype.undo = function () {
  var gameHistory = this.storage.getItem(this.gameHistoryKey);
  gameHistory = gameHistory ? JSON.parse(gameHistory) : [];

  gameHistory.pop();

  var previousGameState = gameHistory.pop();

  if (previousGameState) {
    // console.log(gameHistory);
    // debugger;
    this.setGameState(previousGameState);

    this.storage.setItem(this.gameHistoryKey, JSON.stringify(gameHistory));
  }
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
  this.storage.removeItem(this.gameHistoryKey);
};
