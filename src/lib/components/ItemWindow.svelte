<script lang="ts">
  export let slot: 'weapon' | 'armor' | 'ring' | 'ability';
  export let selectedItems: Record<string, any>;
  export let toggleDropdown: () => void;
</script>

<button
  type="button"
  class="relative w-32 h-32 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
  on:click={toggleDropdown}
>
  {#if selectedItems[slot]}
    <img
      src={selectedItems[slot]['Image link']}
      alt="Selected item"
      class="w-full h-full object-contain"
    />

    <!-- Overlay Tier Label -->
    <div
      class="absolute bottom-1 right-1 px-2 py-1 text-sm font-bold rounded bg-black bg-opacity-70 shadow-md"
      class:text-yellow-400={selectedItems[slot]['Tier'] === 'ST'}
      class:text-fuchsia-500={selectedItems[slot]['Tier'] === 'UT'}
      class:text-white={selectedItems[slot]['Tier'] !== 'UT' && selectedItems[slot]['Tier'] !== 'ST'}
    >
      {#if selectedItems[slot]['Tier'] === 'UT' || selectedItems[slot]['Tier'] === 'ST'}
        {selectedItems[slot]['Tier']}
      {:else}
        T{selectedItems[slot]['Tier']}
      {/if}
    </div>

  {:else}
    <span class="text-white text-xs flex items-center justify-center h-full">+</span>
  {/if}
</button>
