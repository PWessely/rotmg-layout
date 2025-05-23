<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import ItemDropdown from '$lib/components/ItemDropdown.svelte';
  import StatBar from '$lib/components/StatBar.svelte';
  import StatBox from '$lib/components/StatBox.svelte';
  import ItemWindow from '$lib/components/ItemWindow.svelte';
  import ItemInfo from '$lib/components/ItemInfo.svelte';
  import { loadCSV } from '$lib/utils/loadCsv';
  import EnchantmentWindow from '$lib/components/EnchantmentWindow.svelte';
  export let data;
  let classes = data.classes;
  let selectedClass = classes[0];
  type StatKey = 'HP' | 'MP' | 'Attack' | 'Defense' | 'Speed' | 'Dexterity' | 'Vitality' | 'Wisdom';
  let armorClass = 'leather-armors';
  let armorData = writable<any[]>([]);
  let ability = 'cloaks';
  let abilityData = writable<any[]>([]);
  let weaponClass = 'Dagger';
  let weaponData = writable<any[]>([]);
  let ringData = data.rings;
  let enchantmentData = data.enchantments;
  console.log('enchantmentData', enchantmentData);

  let showArmorDropdown = false;
  let showWeaponDropdown = false;
  let showAbilityDropdown = false;
  let showRingDropdown = false;
  type ItemSlot = 'weapon' | 'armor' | 'ring' | 'ability';
  const itemSlots: ItemSlot[] = ['weapon', 'armor', 'ring', 'ability'];
  
  
  let selectedItems: Record<ItemSlot, any> = {
    weapon: null,
    armor: null,
    ring: null,
    ability: null
  };

  let selectedEnchants = {
    ability: null,
    ring: null,
  };

  function update(slot, enchant) {
    selectedEnchants[slot] = enchant;
  }

  function handleChange(event: Event) {
    const select = event.currentTarget as HTMLSelectElement;
    selectedClass = classes.find((c: { Class: any; }) => c.Class === select.value);
    armorClass = selectedClass.Armor_ID;
    weaponClass = selectedClass.Weapon_ID;
    ability = selectedClass.Ability;
    loadCSV('armors', armorClass).then(data => armorData.set(data));
    loadCSV('abilitys', ability).then(data => abilityData.set(data));
    loadCSV('weapons', weaponClass).then(data => weaponData.set(data));
    console.log('ability', ability);

    for (const slot of itemSlots) {
      selectItem(null, slot)
    }
  }
  function setExaltation(value: number) {
    for (const stat in exaltStats) {
        exaltStats[stat as StatKey] = value;
    }
  }
  // enhancement values for each stat (default 0)
  let bonus: Record<StatKey, number> = {
    HP: 0,
    MP: 0,
    Attack: 0,
    Defense: 0,
    Speed: 0,
    Dexterity: 0,
    Vitality: 0,
    Wisdom: 0,
  };

    // enhancement values for each stat (default 0)
  let exaltStats: Record<StatKey, number> = {
    HP: 0,
    MP: 0,
    Attack: 0,
    Defense: 0,
    Speed: 0,
    Dexterity: 0,
    Vitality: 0,
    Wisdom: 0,
  };

  const statMap: Record<string, string> = {
    ATT: 'Attack',
    DEF: 'Defense',
    SPD: 'Speed',
    DEX: 'Dexterity',
    VIT: 'Vitality',
    WIS: 'Wisdom',
    HP: 'HP',
    MP: 'MP',
  };


  onMount(() => {
    if (armorClass) loadCSV('armors', armorClass).then(data => armorData.set(data));
    if (ability) loadCSV('abilitys', ability).then(data => abilityData.set(data));
    if (weaponClass) loadCSV('weapons', weaponClass).then(data => weaponData.set(data));
    selectedClass = classes[0];
  });

  function parseBonusValue(raw: string) {
    if (!raw) return 0;
    const cleaned = raw.replace('+', '').trim();
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  function selectItem(item: null, slot: ItemSlot) {
    const previousItem = selectedItems[slot];

    // Helper to apply or remove bonuses
    const applyBonuses = (sourceItem: { [x: string]: string; } | null, modifier: number) => {
      if (!sourceItem) return;

      if (slot === 'armor') {
        Object.keys(statMap).forEach((csvStat) => {
          const statKey = statMap[csvStat];
          const value = parseBonusValue(sourceItem[csvStat]);
          if (statKey in bonus) {
            bonus[statKey as StatKey] += modifier * value;
          }
        });
      }

      if (slot === 'ability' || slot === 'ring') {
        const bonusString = sourceItem['Stat Bonus'] || '';
        const matches = [...bonusString.matchAll(/([+-]?\d+)\s*([A-Z]+)/gi)];

        matches.forEach(([_, value, stat]) => {
          const statKey = statMap[stat];
          if (statKey && (bonus as Record<string, number>)[statKey] !== undefined) {
            bonus[statKey as StatKey] += modifier * parseInt(value);
          }
        });
      }

      // No bonus for weapons
    };

    // Remove previous bonuses
    applyBonuses(previousItem, -1);

    // Apply new bonuses
    applyBonuses(item, 1);

    selectedItems[slot] = item;
    selectedItems = { ...selectedItems }; // Trigger reactivity
    bonus = { ...bonus }; // Trigger reactivity

    if (slot === 'armor') showArmorDropdown = false;
    if (slot === 'weapon') showWeaponDropdown = false;
    if (slot === 'ability') showAbilityDropdown = false;
    if (slot === 'ring') showRingDropdown = false;
  }



</script>

<div class="flex flex-grow p-4 gap-4">
  <!-- Left Sidebar -->
  <div class="w-1/3 bg-gray-800 text-white rounded-xl shadow p-4 flex flex-col justify-between">
    <!-- Class Name -->
    <h2 class="text-xl font-bold mb-2">{selectedClass.Class}</h2>

    <!-- Class Image -->
    <img src="{selectedClass['Image URL']}" alt="{selectedClass.Class}" class="object-contain h-1/4 mb-4" />

    <!-- Dropdown -->
    <select
    class="mb-4 p-2 px-4 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    on:change="{handleChange}">
    {#each classes as c}
      <option class="bg-gray-800 text-white" value="{c.Class}">{c.Class}</option>
    {/each}
  </select>

    <!-- Exaltation Buttons -->
    <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
    <span class="text-white font-semibold">Set Exaltation:</span>
        <div class="flex gap-2">
            <button
            class="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
            on:click={() => setExaltation(0)}
            >
            0
            </button>
            <button
            class="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
            on:click={() => setExaltation(5)}
            >
            5
            </button>
        </div>
    </div>

    <!-- Stats Box -->
    <div class="p-4 rounded-lg space-y-4">
      <!-- HP/MP Bars -->
      <StatBar stat="HP" {bonus} {exaltStats} {selectedClass} bind:bindValue={exaltStats.HP} />
      <StatBar stat="MP" {bonus} {exaltStats} {selectedClass} bind:bindValue={exaltStats.MP} />

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Left Column -->
        <div class="space-y-2">
          {#each ['Attack', 'Speed', 'Vitality'] as stat}
            <StatBox
              {stat}
              {bonus}
              {exaltStats}
              {selectedClass}
              bind:bindValue={exaltStats[stat as StatKey]}
            />
          {/each}
        </div>

        <!-- Right Column -->
        <div class="space-y-2">
          {#each ['Defense', 'Dexterity', 'Wisdom'] as stat}
            <StatBox
              {stat}
              {bonus}
              {exaltStats}
              {selectedClass}
              bind:bindValue={exaltStats[stat as StatKey]}
            />
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Right Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Weapon -->
    <div class="relative flex flex-col gap-2">
      <div class="flex items-start gap-4">
        <!-- Wrap both the trigger and dropdown in one relative block -->
        <div class="relative flex items-start gap-4 w-full">
          <!-- Item Button -->
          <ItemWindow
            slot="weapon"
            {selectedItems}
            toggleDropdown={() => showWeaponDropdown = !showWeaponDropdown}
          />

          <!-- Item Info -->
          <ItemInfo slot="weapon" {selectedItems} />

          <!-- Dropdown -->
          <div class="absolute top-full mt-2 left-0 z-50 w-full">
            <ItemDropdown
              show={showWeaponDropdown}
              items={$weaponData}
              label="Weapon"
              onSelect={(item) => selectItem(item, 'weapon')}
            />
          </div>
        </div>
        <!-- Enchantments -->
        <div class="grid grid-cols-1 gap-4">
          <EnchantmentWindow
            selected={selectedEnchants.ability}
            enchantments={enchantmentData}
            slotType="WEAPON"
            allSelected={Object.values(selectedEnchants).filter(e => e)}
            onSelect={(e) => update("ability", e)}
          />
          <EnchantmentWindow
            selected={selectedEnchants.ring}
            enchantments={enchantmentData}
            slotType="WEAPON"
            allSelected={Object.values(selectedEnchants).filter(e => e)}
            onSelect={(e) => update("ring", e)}
          />
          <EnchantmentWindow
            selected={selectedEnchants.ability}
            enchantments={enchantmentData}
            slotType="WEAPON"
            allSelected={Object.values(selectedEnchants).filter(e => e)}
            onSelect={(e) => update("ability", e)}
          />
          <EnchantmentWindow
            selected={selectedEnchants.ring}
            enchantments={enchantmentData}
            slotType="WEAPON"
            allSelected={Object.values(selectedEnchants).filter(e => e)}
            onSelect={(e) => update("ring", e)}
          />
        </div>
      </div>
    </div>
    <!-- Armor -->
    <div class="relative flex flex-col gap-2">
      <div class="flex items-start gap-4">
        <!-- Wrap both the trigger and dropdown in one relative block -->
        <div class="relative flex items-start gap-4 w-full">
          <ItemWindow
            slot="armor"
            {selectedItems}
            toggleDropdown={() => showArmorDropdown = !showArmorDropdown}
          />
          <ItemInfo slot="armor" {selectedItems} />
        
          <div class="absolute top-full mt-2 left-0 z-50 w-full">
            <ItemDropdown
              show={showArmorDropdown}
              items={$armorData}
              label="Armor"
              onSelect={(item) => selectItem(item, 'armor')}
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Ability -->
    <div class="relative flex flex-col gap-2">
      <div class="flex items-start gap-4">
        <!-- Wrap both the trigger and dropdown in one relative block -->
        <div class="relative flex items-start gap-4 w-full">
          <ItemWindow
            slot="ability"
            {selectedItems}
            toggleDropdown={() => {showAbilityDropdown = !showAbilityDropdown;
            }}
          />
          <ItemInfo slot="ability" {selectedItems} />
          <div class="absolute top-full mt-2 left-0 z-50 w-full">
            <ItemDropdown
              show={showAbilityDropdown}
              items={$abilityData}
              label="Ability"
              onSelect={(item) => selectItem(item, 'ability')}
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Ring -->
    <div class="relative flex flex-col gap-2">
      <div class="flex items-start gap-4">
        <!-- Wrap both the trigger and dropdown in one relative block -->
        <div class="relative flex items-start gap-4 w-full">
          <ItemWindow
            slot="ring"
            {selectedItems}
            toggleDropdown={() => {
              showRingDropdown = !showRingDropdown;
            }}
          />
          <ItemInfo slot="ring" {selectedItems} />
          <div class="absolute top-full mt-2 left-0 z-50 w-full">
            <ItemDropdown
              show={showRingDropdown}
              items={ringData}
              label="Ring"
              onSelect={(item) => selectItem(item, 'ring')}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
