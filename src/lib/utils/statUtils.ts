export const statMap: Record<string, string> = {
  ATT: 'Attack',
  DEF: 'Defense',
  SPD: 'Speed',
  DEX: 'Dexterity',
  VIT: 'Vitality',
  WIS: 'Wisdom',
  HP: 'HP',
  MP: 'MP',
};

export const parseStatBonuses = (bonusString: string | undefined) => {
  const bonuses: { stat: string; value: string }[] = [];
  const matches = [...(bonusString || '').matchAll(/([+-]?(?:\d*\.\d+|\d+))\s*([A-Z]+)/gi)];
  for (const [_, value, stat] of matches) {
    const name = statMap[stat];
    if (name) bonuses.push({ stat: name, value });
  }
  return bonuses;
};

export function parseEffect(effect: string, tier: number | string): string {
  if (tier === 'Unique') return effect;

  const tierIndex = Number(tier) - 1;
  if (isNaN(tierIndex) || tierIndex < 0 || tierIndex > 3) return effect;

  const regex = /([-+])?(\d*\.?\d+%?)(?:\/(\d*\.?\d+%?))\/(\d*\.?\d+%?)\/(\d*\.?\d+%?)/g;

  return effect.replace(regex, (_, prefix, v1, v2, v3, v4) => {
    const values = [v1, v2, v3, v4];
    const sign = prefix ?? ''; // if no sign, default to ''
    const chosen = values[tierIndex];

    return `${sign}${chosen}`;
  });
}