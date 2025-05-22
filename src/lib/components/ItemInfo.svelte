<script lang="ts">
  import { derived } from 'svelte/store';
  export let slot: string;
  export let selectedItems: Record<string, any>;

  const statMap: Record<string, string> = {
    ATT: 'Attack',
    DEF: 'Defense',
    SPD: 'Speed',
    DEX: 'Dexterity',
    VIT: 'Vitality',
    WIS: 'Wisdom',
    HP: 'HP',
    MP: 'MP'
  };

  const parseStatBonuses = (bonusString: string | undefined) => {
    const bonuses: { stat: string; value: string }[] = [];
    const matches = [...(bonusString || '').matchAll(/([+-]?\d+)\s*([A-Z]+)/gi)];
    for (const [_, value, stat] of matches) {
      const name = statMap[stat];
      if (name) bonuses.push({ stat: name, value });
    }
    return bonuses;
  };

  const getTierDisplay = (tier: string | null | undefined) => {
    if (tier === 'UT') return { label: 'UT', color: 'text-fuchsia-500' };
    if (tier === 'ST') return { label: 'ST', color: 'text-yellow-400' };
    if (!tier || isNaN(Number(tier))) return { label: 'Unknown', color: 'text-gray-400' };
    return { label: `T${tier}`, color: 'text-white' };
    };
  $: item = selectedItems?.[slot];
  $: bonuses = (() => {
    if (!item) return [];

    if (slot === 'armor') {
        return Object.entries(statMap)
        .map(([csvKey, name]) => {
            const raw = item[csvKey];
            return raw ? { stat: name, value: raw } : null;
        })
        .filter(Boolean);
    } else if (slot === 'ability' || slot === 'ring') {
        return parseStatBonuses(item['Stat Bonus']);
    }

    return [];
  })();
  $: tier = item ? getTierDisplay(item.Tier) : null;
</script>

{#if item}
  <div class="bg-gray-800 text-white rounded p-3 text-sm w-full md:w-64 space-y-2 border border-gray-600">
    <div class="font-bold text-base">{item.Name}</div>
    <div class={`font-semibold ${tier.color}`}>{tier.label}</div>

    {#if slot === 'ability' && item.Cost}
      <div>
        <span class="font-semibold">Cost:</span> {item.Cost}
      </div>
    {/if}

    {#if bonuses.length > 0}
      <div>
        <div class="font-semibold">Stat Bonus:</div>
        <ul class="ml-4 list-disc">
          {#each bonuses as bonus}
            <li>{bonus.value} {bonus.stat}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{/if}
{#if !item}
  <div class="bg-gray-800 text-white rounded p-3 text-sm w-full md:w-64">
    <div class="font-bold text-base">No {slot} selected</div>
  </div>
{/if}
