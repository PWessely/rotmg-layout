<script lang="ts">
  import ItemDropdown from './ItemDropdown.svelte';

  export let slot: 'weapon' | 'armor' | 'ring' | 'ability';
  export let selectedItems: Record<string, any>;
  export let selectedEnchants: Record<string, (any | null)[]>;
  export let items: any[] = [];
  export let onSelect: (item: any | null) => void;

  let showDropdown = false;

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  // Count active enchantments for this slot
  $: enchantCount = selectedEnchants?.[slot]?.filter(Boolean).length ?? 0;
</script>

<div class="relative">
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

      <!-- Tier Label (Bottom Right) -->
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

      <!-- Enchantment Icons (Bottom Left) -->
      {#if enchantCount > 0}
        <img
          src={{
            1: 'https://i.imgur.com/yLRmif1.png',
            2: 'https://i.imgur.com/0jHR1n2.png',
            3: 'https://i.imgur.com/77nuk4H.png',
            4: 'https://i.imgur.com/mxt6Xsf.png'
          }[enchantCount]}
          alt={`Enchantment Level ${enchantCount}`}
          class="absolute bottom-1 left-1 w-6 h-6 object-contain"
        />
      {/if}
    {:else}
      <span class="text-white text-xs flex items-center justify-center h-full">+</span>
    {/if}
  </button>

  {#if showDropdown}
    <ItemDropdown
      show={showDropdown}
      items={items}
      label={slot}
      onSelect={(item) => {
        onSelect(item);
        showDropdown = false;
      }}
    />
  {/if}
</div>
