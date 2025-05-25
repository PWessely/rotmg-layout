<script lang="ts">
  export let stat: string;
  export let bonus: Record<string, number>;
  export let exaltStats: Record<string, number>;
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
</script>

<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
  <!-- Label -->
  <span class="w-20">{stat}:</span>

  <!-- Value + Bonus Display -->
  <span
    class="text-center font-bold"
    class:text-white={!showBonus}
    class:text-green-400={(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)) > 0}
    class:text-red-400={(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)) < 0}
  >
    {getTotal()}
    {#if showBonus || showExalt}
      <span class="ml-1 text-xs font-normal">
        (
        {#if showBonus}
          <span class={(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)) > 0 ? 'text-green-400' : 'text-red-400'}>
            {(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)) > 0 ? '+' : ''}
            {(bonus[stat] + (enchantDerivedBonus?.[stat] ?? 0)).toFixed(1)}
          </span>
        {/if}
        {#if showExalt}
          {#if showBonus} <span class="text-white"> </span> {/if}
          <span class="text-blue-400">
            +{exaltStats[stat]}
          </span>
        {/if}
        )
      </span>
    {/if}
  </span>


  <!-- Stat Selector -->
  <select
    bind:value={bindValue}
    class="ml-auto appearance-none p-1 rounded bg-gray-700 text-white w-12 text-center"
    style="background-image: none;"
  >
    {#each Array(6) as _, i}
      <option value={i}>{i}</option>
    {/each}
  </select>
</div>