export default function (name, total) {
  // Generator seed, must leave a hex of at least 1000 (so 4096 or above)
  total = total || 4096;

  // Loop every character and multiply with the generator seed
  for (let i = 0; i < name.length; i++) {
    total = total * name.charCodeAt(i);
  }

  // Convert total to hex
  total = total.toString(16);

  // Variables
  const minSaturation = 50;
  const minLightness = 35;
  const maxLightness = 47;

  // Calculate values
  const hue = parseInt(total.substring(0, 3), 16) % 360;
  const saturation = parseInt(total.substring(1, 3), 16) % (99 - minSaturation) + minSaturation;
  const lightness = parseInt(total.substring(2, 4), 16) % (maxLightness - minLightness + 1) + minLightness;

  // Output to the HSL color format
  const color = `hsl(${hue},${saturation}%,${lightness}%)`;
  return color;
}
