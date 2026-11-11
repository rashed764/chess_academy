import test from 'node:test';
import assert from 'node:assert/strict';
import {
  START_FEN,
  createGame,
  isValidFen,
  getLegalMovesForSquare,
  makeMoveSafe,
  getGameState,
  validateBoardAction,
  calculateMaterial,
} from './rules';

test('createGame initializes standard chess position', () => {
  const game = createGame();
  assert.equal(game.fen(), START_FEN);
  assert.equal(game.turn(), 'w');
  assert.equal(game.inCheck(), false);
});

test('isValidFen identifies valid and invalid FENs', () => {
  assert.equal(isValidFen(START_FEN), true);
  assert.equal(isValidFen('invalid-fen-string'), false);
  assert.equal(isValidFen('4k3/8/8/8/8/8/8/4K3 w - - 0 1'), true);
});

test('getLegalMovesForSquare finds correct pawn opening moves', () => {
  const e2Moves = getLegalMovesForSquare(START_FEN, 'e2');
  assert.deepEqual(e2Moves.sort(), ['e3', 'e4'].sort());

  const b1Moves = getLegalMovesForSquare(START_FEN, 'b1');
  assert.deepEqual(b1Moves.sort(), ['a3', 'c3'].sort());
});

test('makeMoveSafe executes legal moves and rejects illegal moves', () => {
  // Legal e2-e4
  const res1 = makeMoveSafe(START_FEN, 'e2', 'e4');
  assert.equal(res1.success, true);
  assert.equal(res1.move?.san, 'e4');

  // Illegal e2-e5
  const res2 = makeMoveSafe(START_FEN, 'e2', 'e5');
  assert.equal(res2.success, false);
  assert.equal(res2.error, 'Illegal move');
});

test('getGameState detects Scholar Mate checkmate correctly', () => {
  // Scholar's Mate: 1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7#
  let fen = START_FEN;
  const moves = [
    ['e2', 'e4'],
    ['e7', 'e5'],
    ['f1', 'c4'],
    ['b8', 'c6'],
    ['d1', 'h5'],
    ['g8', 'f6'],
    ['h5', 'f7'],
  ];

  for (const [from, to] of moves) {
    const res = makeMoveSafe(fen, from, to);
    assert.equal(res.success, true);
    fen = res.newFen;
  }

  const state = getGameState(fen);
  assert.equal(state.isCheck, true);
  assert.equal(state.isCheckmate, true);
  assert.equal(state.isGameOver, true);
});

test('validateBoardAction checks square and move legality', () => {
  const validAction = {
    type: 'HIGHLIGHT_SQUARES' as const,
    squares: ['e4', 'd5'],
  };
  assert.equal(validateBoardAction(validAction, START_FEN).valid, true);

  const invalidSquareAction = {
    type: 'HIGHLIGHT_SQUARES' as const,
    squares: ['z9'],
  };
  assert.equal(validateBoardAction(invalidSquareAction, START_FEN).valid, false);

  const legalMoveAction = {
    type: 'PLAY_MOVE' as const,
    move: { from: 'e2', to: 'e4' },
  };
  assert.equal(validateBoardAction(legalMoveAction, START_FEN).valid, true);

  const illegalMoveAction = {
    type: 'PLAY_MOVE' as const,
    move: { from: 'e1', to: 'e8' },
  };
  assert.equal(validateBoardAction(illegalMoveAction, START_FEN).valid, false);
});

test('calculateMaterial determines material counts correctly', () => {
  const startMat = calculateMaterial(START_FEN);
  assert.equal(startMat.white, 39); // 8*1 + 2*3 + 2*3 + 2*5 + 9 = 8 + 6 + 6 + 10 + 9 = 39
  assert.equal(startMat.black, 39);
  assert.equal(startMat.balance, 0);

  // Position missing black queen
  const noBlackQueen = 'rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const mat2 = calculateMaterial(noBlackQueen);
  assert.equal(mat2.balance, 9);
});
