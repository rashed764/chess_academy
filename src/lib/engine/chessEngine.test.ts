import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateFen, findBestEngineMove } from './chessEngine';
import { START_FEN } from '../chess/rules';

test('evaluateFen evaluates starting position close to equal', () => {
  const result = evaluateFen(START_FEN);
  assert.equal(typeof result.centipawns, 'number');
  assert.equal(typeof result.formatted, 'string');
  assert.equal(result.centipawns, 0);
});

test('findBestEngineMove finds a legal move for white from start position', () => {
  const move = findBestEngineMove(START_FEN, 2);
  assert.ok(move !== null);
  assert.equal(typeof move?.from, 'string');
  assert.equal(typeof move?.to, 'string');
  assert.ok(['a3', 'a4', 'b3', 'b4', 'c3', 'c4', 'd3', 'd4', 'e3', 'e4', 'f3', 'f4', 'g3', 'g4', 'h3', 'h4', 'Na3', 'Nc3', 'Nf3', 'Nh3'].includes(move?.san || ''));
});
