<script lang="ts">
  export let show = false;
  export let items: any[] = [];
  export let onSelect: (item: any | null) => void;
  export let label = ''; // e.g., 'armor'

  let searchTerm = '';

  $: filteredItems = items.filter(item =>
    item?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>


{#if show}
  <div
    class="absolute left-0 top-full w-90 mt-2 z-10 bg-gray-800 border border-gray-600 rounded p-2 max-h-64 overflow-y-auto grid grid-cols-3 gap-4"
  >
    <!-- Search Bar -->
    <input
      type="text"
      placeholder="Search..."
      class="col-span-3 p-2 mb-2 rounded bg-gray-700 text-white border border-gray-500 w-full"
      bind:value={searchTerm}
    />

    <!-- Remove Option -->
    <button
      class="col-span-3 text-sm text-red-400 border border-red-500 rounded p-2 hover:bg-red-500 hover:text-white transition"
      on:click={() => onSelect(null)}
    >
      ❌ Remove {label}
    </button>

    <!-- Filtered Item Options -->
    {#each filteredItems as item (item.Name)}
      <button
        type="button"
        class="relative w-16 h-16 p-0 border-none bg-transparent cursor-pointer hover:scale-105 transition duration-150 ease-in-out focus:outline-none"
        on:click={() => onSelect(item)}
      >
        <img
          src={item['Image link']}
          alt={item.Name}
          class="w-full h-full object-contain"
          title={item.Name}
        />
        <div
          class="absolute bottom-1 right-1 px-2 py-1 text-sm font-bold rounded bg-black bg-opacity-70 shadow-md"
          class:text-yellow-400={item['Tier'] === 'ST'}
          class:text-fuchsia-500={item['Tier'] === 'UT'}
          class:text-white={item['Tier'] !== 'UT' && item['Tier'] !== 'ST'}>
          {#if item['Tier'] === 'UT' || item['Tier'] === 'ST'}
            {item['Tier']}
          {:else}
            T{item['Tier']}
          {/if}
        </div>
      </button>
    {/each}
  </div>
{/if}
