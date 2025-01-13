import Color from 'color';

export function selectHighestContrast(bgColorCSS: string, ...candidates: string[]) {
  const bgColor = Color(bgColorCSS);
  const contrasts: number[] = candidates.map(candidate => {
    return bgColor.contrast(Color(candidate));
  });
  let bestCandidate = candidates[0],
    highestContrast = contrasts[0];
  for (let i = 1; i < contrasts.length; i++) {
    if (contrasts[i] > highestContrast) {
      bestCandidate = candidates[i];
      highestContrast = contrasts[i];
    }
  }
  return bestCandidate;
}
