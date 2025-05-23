<script lang="ts">
  import { writable } from 'svelte/store';

  export let enchantments = [];
  export let slotType: string = '';
  export let selected = null;
  export let allSelected = [];
  export let onSelect: (e: any | null) => void;

  const search = writable('');

  function isEligible(item) {
    const eligible = item["Eligible Items"]?.split(" ") ?? [];
    return eligible.includes(slotType) || eligible.includes("ALL");
  }

  function isCompatible(item) {
    const newLabels = (item["Enchantment Labels"] ?? '').split(" ");
    const incompatibleFromOthers = new Set(
      allSelected.flatMap(e => (e?.["Incompatible Labels"] ?? '').split(" "))
    );
    return !newLabels.some(label => incompatibleFromOthers.has(label));
  }

  $: filtered = enchantments.filter(e =>
    isEligible(e) &&
    isCompatible(e) &&
    e["Enchantment Name"]?.toLowerCase().includes($search.toLowerCase())
  );
</script>

<div
  class="absolute left-0 top-full w-64 mt-2 z-10 bg-gray-800 border border-gray-600 rounded p-2 max-h-96 overflow-y-auto space-y-2"
>
  <input
    type="text"
    class="w-full p-2 rounded bg-gray-700 text-white border border-gray-500 mb-2"
    placeholder="Search enchantments..."
    on:input={(e) => search.set(e.target.value)}
  />

  <button
    class="w-full text-sm text-red-400 border border-red-500 rounded p-2 hover:bg-red-500 hover:text-white transition"
    on:click={() => onSelect(null)}
  >
    ❌ Remove Enchantment
  </button>

  {#each filtered as e (e["Enchantment Name"])}
    <button
      class="w-full flex items-center space-x-2 p-2 hover:bg-gray-700 rounded transition"
      on:click={() => onSelect(e)}
    >
      <img src={e["Image link"]} alt={e["Enchantment Name"]} class="w-8 h-8 object-contain" />
      <div class="flex-1 text-left">
        <div class="text-white text-sm font-bold">{e["Enchantment Name"]}</div>
        <div class="text-gray-400 text-xs">{e["Effect(s) I / II / III / IV"]}</div>
      </div>
    </button>
  {/each}
</div>
