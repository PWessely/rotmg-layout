<script lang="ts">
  import { parseStatBonuses, statMap, parseEffect } from '$lib/utils/statUtils';

  export let slot: string;
  export let selectedItems: Record<string, any>;
  export let selectedEnchants: Record<string, (any | null)[]>;
  export let selectedTiers: Record<string, number | string> = {};

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
        .filter((b): b is { stat: string; value: string } => b !== null);
    } else if (slot === 'ability' || slot === 'ring') {
      return parseStatBonuses(item['Stat Bonus']);
    } else if (slot === 'weapon') {
      return parseStatBonuses(item['Damage (Average)']);
    }

    return [];
  })();

  $: tier = item ? getTierDisplay(item.Tier) : null;

  // Process enchantment effects
  $: activeEnchants = selectedEnchants?.[slot]?.filter(Boolean) ?? [];

  $: enchantEffects = activeEnchants.map((enchant) => {
    const name = enchant?.['Enchantment Name'];
    const labels = enchant?.['Enchantment Labels'] ?? '';
    const isUnique = labels.includes('UNIQUE');
    const tier = isUnique ? 'Unique' : Number(selectedTiers?.[name] ?? 1);

    const rawEffect = enchant['Effect(s) I / II / III / IV'];
    const effect = parseEffect(rawEffect, tier);

    return {
      name,
      tier,
      effect
    };
  });
</script>



{#if item}
  <div class="bg-gray-800 text-white rounded p-3 text-sm w-full md:w-64 space-y-3 border border-gray-600">
  {#if tier}
    <div class="flex justify-between items-center">
      <div class="font-bold text-base">{item.Name}</div>
      <div class={`font-semibold ${tier.color}`}>{tier.label}</div>
    </div>
  {:else}
    <div class="font-bold text-base">{item.Name}</div>
  {/if}
     

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

    {#if enchantEffects.length > 0}
      <div>
        <div class="font-semibold">Enchant Effects:</div>
        <ul class="ml-4 list-disc">
          {#each enchantEffects as effect}
            <li>
              <span class="text-fuchsia-400 font-semibold">{effect.name}</span>
              {#if typeof effect.tier === 'number'}
                (Tier {effect.tier})
              {:else}
                ({effect.tier})
              {/if}
              : {effect.effect}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{:else}
  <div class="bg-gray-800 text-white rounded p-3 text-sm w-full md:w-64">
    <div class="font-bold text-base">No {slot} selected</div>
  </div>
{/if}
