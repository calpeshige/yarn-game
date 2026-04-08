/**
 * Fisher-Yates シャッフル
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 1-100の数字からexcludeを除いた中からcount枚をランダムに選ぶ
 */
export function dealCards(count: number, exclude: number[] = []): number[] {
  const available = Array.from({ length: 100 }, (_, i) => i + 1).filter(
    (n) => !exclude.includes(n)
  );

  if (count > available.length) {
    throw new Error(`カードが足りません: ${count}枚必要、${available.length}枚しかありません`);
  }

  const shuffled = shuffle(available);
  return shuffled.slice(0, count);
}
