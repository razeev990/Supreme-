import { START_INDEX, SAFE_INDEXES } from '../constants/gameData';

export const getStrategicMoveIndex = (color, diceVal, validMoves, pawns, activeColors, isTeammate) => {
  if (!validMoves || validMoves.length === 0) return null;
  if (validMoves.length === 1) return validMoves[0];

  const playerPawns = pawns[color];

  // 1. Calculate Enemy Threat
  const getEnemyThreat = (targetTrack, movingColor) => {
    let threatScore = 0;
    for (const enemy of activeColors) {
      if (enemy === movingColor) continue;
      if (isTeammate(movingColor, enemy)) continue;

      for (const enemyStep of pawns[enemy]) {
        if (enemyStep < 0 || enemyStep >= 51) continue;
        const enemyTrack = (START_INDEX[enemy] + enemyStep) % 52;
        const distance = (targetTrack - enemyTrack + 52) % 52;
        if (distance >= 1 && distance <= 6) {
          threatScore += (7 - distance) * 700;
        }
      }
    }
    return threatScore;
  };

  // 2. Check Capture Probability
  const canCaptureEnemy = (targetTrack, movingColor) => {
    let captureScore = 0;
    for (const enemy of activeColors) {
      if (enemy === movingColor) continue;
      if (isTeammate(movingColor, enemy)) continue;

      for (const enemyStep of pawns[enemy]) {
        if (enemyStep < 0 || enemyStep >= 51) continue;
        const enemyTrack = (START_INDEX[enemy] + enemyStep) % 52;
        if (enemyTrack === targetTrack) {
          captureScore += 10000;
        }
      }
    }
    return captureScore;
  };

  let bestMove = validMoves[0];
  let bestScore = -Infinity;

  // 3. Evaluate each valid move
  for (const idx of validMoves) {
    const currentStep = playerPawns[idx];
    const targetStep = currentStep === -1 ? 0 : currentStep + diceVal;
    let score = 0;

    // Highest Priority: Finish Pawn
    if (targetStep === 56) score += 15000;

    // Home Lane Priority
    if (targetStep >= 51 && targetStep < 56) {
      score += 7000;
      score += targetStep * 80;
    }

    // Main Board Position
    if (targetStep >= 0 && targetStep < 51) {
      const targetTrack = (START_INDEX[color] + targetStep) % 52;
      score += canCaptureEnemy(targetTrack, color);

      if (SAFE_INDEXES.includes(targetTrack)) {
        score += 3500;
      } else {
        const danger = getEnemyThreat(targetTrack, color);
        score -= danger;
      }

      // Current Pawn Danger Escape
      if (currentStep >= 0 && currentStep < 51) {
        const currentTrack = (START_INDEX[color] + currentStep) % 52;
        if (!SAFE_INDEXES.includes(currentTrack)) {
          const currentDanger = getEnemyThreat(currentTrack, color);
          const targetDanger = SAFE_INDEXES.includes(targetTrack) ? 0 : getEnemyThreat(targetTrack, color);
          if (currentDanger > targetDanger) {
            score += Math.min(currentDanger - targetDanger, 5000);
          }
        }
      }
      score += targetStep * 35;
    }

    // Spawn new pawn
    if (diceVal === 6 && currentStep === -1) {
      const activePawnCount = playerPawns.filter(step => step >= 0 && step < 56).length;
      if (activePawnCount < 2) score += 2800;
      else if (activePawnCount < 3) score += 1400;
    }

    // Final journey push
    if (currentStep >= 35 && currentStep < 51) score += 1000;

    // Tie-breaker Randomization
    score += Math.random() * 10;

    if (score > bestScore) {
      bestScore = score;
      bestMove = idx;
    }
  }

  return bestMove;
};
