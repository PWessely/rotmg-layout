<script lang="ts">
  export let stat: 'HP' | 'MP';
  export let bonus: Record<'HP' | 'MP', number>;
  export let exaltStats: Record<'HP' | 'MP', number>;
  export let selectedClass: Record<string, any>;
  export let bindValue: number;
  export let enchantDerivedBonus: Record<string, number>;

  const getTotal = () => {
    const base = parseFloat(selectedClass[stat]);
    const extra = (bonus[stat] ?? 0) + (enchantDerivedBonus?.[stat] ?? 0);
    const exaltation = exaltStats[stat] * (stat === 'HP' || stat === 'MP' ? 5 : 1);
    return parseFloat((base + extra + exaltation).toFixed(1));
  };

  $: showBonus = bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0) !== 0;
  $: showExalt = exaltStats[stat] > 0;
  const bgColor = stat === 'HP' ? 'bg-green-200' : 'bg-blue-300';
</script>

<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
  <span class="w-12">{stat}</span>
  <select
    bind:value={bindValue}
    class="ml-auto appearance-none p-1 rounded bg-gray-700 text-white w-12 text-center"
    style="background-image: none;"
  >
    {#each Array(6) as _, i}
      <option value={i}>{i}</option>
    {/each}
  </select>
  <div class={`relative w-full h-6 rounded ${bgColor}`}>
    <div
      class="absolute inset-0 flex items-center justify-center text-sm font-bold"
      class:text-green-600={(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)) > 0}
      class:text-red-400={(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)) < 0}
      class:text-blue-900={!showBonus}
    >
      {getTotal()}
      {#if showBonus || showExalt}
        <span class="ml-1">
          (
          {#if showBonus}
            <span class={(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)) > 0 ? 'text-green-600' : 'text-red-400'}>
              {(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)) > 0 ? '+' : ''}
              {(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)).toFixed(1)}
            </span>
          {/if}
          {#if showExalt}
            {#if showBonus} <span class="text-white"> </span> {/if}
            <span class="text-blue-900">
                + {exaltStats[stat] * 5}
            </span>
          {/if}
          )
        </span>
      {/if}
    </div>
  </div>
</div>
