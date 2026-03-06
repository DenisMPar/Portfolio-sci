export function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * 2 * (2 - (1 + Math.sqrt(5)) / 2);
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = goldenAngle * i;
    positions[i * 3]     = radius * Math.sin(inclination) * Math.cos(azimuth);
    positions[i * 3 + 1] = radius * Math.cos(inclination);
    positions[i * 3 + 2] = radius * Math.sin(inclination) * Math.sin(azimuth);
  }
  return positions;
}
