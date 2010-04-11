/**
 * コンストラクタ
 *
 * @param  string str          マルコフ連鎖を適用する入力文字列
 * @param  number chain_length チェインの長さ
 * @return void
 */
var Markov = function (str, chain_length) {
  this.init(str, chain_length);
};

Markov.prototype = (function () {
  var NONWORD = "NONWORD",
    state,
    input,
    markovChain,
    chainLength,
    init,
    makeChain,
    pushChain,
    each,
    pick,
    initState,
    nextState,
    getChain;

  /**
   * チェインの初期化
   * 入力文字列、チェインの長さを設定し、チェインを作成する
   *
   * @param  string str 入力文字列
   * @param  number len チェインの長さ
   * @return void
   */
  init = function (str, len) {
    len = Number(len);
    chainLength = len > 0 ? len : 1;
    input = str;
    makeChain(input);
  };

  /**
   * チェインの作成
   *
   * @param  void
   * @return void
   */
  makeChain = function () {
    initState();
    markovChain = {};
    var strArr = input.split(''),
      i,
      c;
    for (i = 0; i < strArr.length; i += 1) {
      c = strArr[i];
      pushChain(c);
      nextState(c);
    }
    pushChain(NONWORD);
  };

  /**
   * チェイン 1 文字挿入する
   *
   * @param  string c 挿入する文字
   * @return void
   */
  pushChain = function (c) {
    var chain = markovChain,
      i;
    for (i = 0; i < (chainLength - 1); i += 1) {
      if (typeof chain[state[i]] === 'undefined') {
        chain[state[i]] = {};
      }
      chain = chain[state[i]];
    }
    if (typeof chain[state[chainLength - 1]] === 'undefined') {
      chain[state[chainLength - 1]] = [];
    }
    chain[state[chainLength - 1]].push(c);
  };

  /**
   * マルコフ連鎖による出力を 1 文字ずつ lambda に渡す
   *
   * @param  function lambda 文字を受ける関数
   * @return void
   */
  each = function (lambda) {
    initState();
    for (;;) {
      var p = pick();
      if (p === NONWORD) {
        break;
      } else {
        lambda.apply(null, [p]);
      }
      nextState(p);
    }
  };

  /**
   * マルコフ連鎖により 1 文字選ぶ
   *
   * @param  void
   * @return string マルコフ連鎖により抽出された文字
   */
  pick = function () {
    var chain = markovChain,
      i,
      r;
    for (i = 0; i < chainLength; i += 1) {
      chain = chain[state[i]];
    }
    r = Math.floor(Math.random() * chain.length);
    return chain[r];
  };

  /**
   * 状態の初期化
   *
   * @param  void
   * @return void
   */
  initState = function () {
    state = [];
    for (var i = 0; i < chainLength; i += 1) {
      state[i] = NONWORD;
    }
  };

  /**
   * 状態を次に進める
   *
   * @param  string c チェインに挿入した文字
   * @return void
   */
  nextState = function(c) {
    for (var i = 0; i < (chainLength - 1); i += 1) {
      state[i] = state[i + 1];
    }
    state[chainLength - 1] = c;
  };

  /**
   * チェインを取得するためのインターフェイス
   *
   * @param  void
   * @return object 生成したチェイン
   */
  getChain = function () {
    return markovChain;
  };

  return {
    init:     init,
    each:     each,
    getChain: getChain
  };
})();
