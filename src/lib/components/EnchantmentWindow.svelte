<script lang="ts">
  import EnchantmentDropdown from './EnchantmentDropdown.svelte';

  export let selected: any = null;
  export let enchantments: any[] = [];
  export let slotType: string = ''; // e.g., 'RING', 'ABILITY'
  export let allSelected: any[] = [];
  export let onSelect: (e: any | null, tier: number | string) => void;
  export let selectedTiers: Record<string, number | string> = {};

  let showDropdown = false;
  function toggle() {
    showDropdown = !showDropdown;
  }
</script>

<div class="relative">
  <button
    on:click={toggle}
    class="w-16 h-16 bg-gray-800 border border-gray-600 rounded overflow-hidden"
  >
    {#if selected}
      <img src={selected["Image link"]} alt={selected["Enchantment Name"]} class="object-contain w-full h-full" />
    {:else}
      <span class="text-white text-xs">+ Enchant</span>
    {/if}
  </button>

  {#if showDropdown}
    <EnchantmentDropdown
      enchantments={enchantments}
      slotType={slotType}
      allSelected={allSelected}
      onSelect={(e, tier) => {
        onSelect(e, tier);
        showDropdown = false;
      }}
      selectedTiers={selectedTiers}
    />
  {/if}
</div>
