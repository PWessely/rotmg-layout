<script lang="ts">
  export let stat: 'HP' | 'MP';
  export let bonus: Record<'HP' | 'MP', number>;
  export let exaltStats: Record<'HP' | 'MP', number>;
  export let selectedClass: Record<string, any>;
  export let bindValue: number;

  const getTotal = () => {
    const base = parseInt(selectedClass[stat]);
    const extra = bonus[stat];
    const exaltation = exaltStats[stat] * (stat === 'HP' || stat === 'MP' ? 5 : 1);
    return base + extra + exaltation;
  };

  $: showBonus = bonus[stat] !== 0;
  $: showExalt = exaltStats[stat] > 0;
  const barColor = stat === 'HP' ? 'bg-green-500' : 'bg-blue-500';
  const bgColor = stat === 'HP' ? 'bg-green-200' : 'bg-blue-200';
</script>

<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
  <span class="w-12">{stat}</span>
  <div class={`relative w-full h-6 rounded ${bgColor}`}>
    <div
      class="absolute inset-0 flex items-center justify-center text-sm font-bold"
      class:text-blue-900={!showBonus}
      class:text-green-400={bonus[stat] > 0}
      class:text-red-400={bonus[stat] < 0}
    >
      {getTotal()}
      {#if showBonus || showExalt}
        <span class="ml-1">
          (
          {#if showBonus}
            <span class={bonus[stat] > 0 ? 'text-green-400' : 'text-red-400'}>
              {bonus[stat] > 0 ? '+' : ''}{bonus[stat]}
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
    <div class={`h-full ${barColor} rounded`} style="width: 100%;"></div>
  </div>
  <select
    bind:value={bindValue}
    class="appearance-none ml-2 p-1 rounded bg-gray-700 text-white w-12 text-center"
    style="background-image: none;"
  >
    {#each Array(6) as _, i}
      <option value={i}>{i}</option>
    {/each}
  </select>
</div>
