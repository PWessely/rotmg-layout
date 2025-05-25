<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import StatBar from '$lib/components/StatBar.svelte';
  import StatBox from '$lib/components/StatBox.svelte';
  import ItemWindow from '$lib/components/ItemWindow.svelte';
  import ItemInfo from '$lib/components/ItemInfo.svelte';
  import { loadCSV } from '$lib/utils/loadCsv';
  import EnchantmentWindow from '$lib/components/EnchantmentWindow.svelte';
  import { parseStatBonuses, statMap, parseEffect } from '$lib/utils/statUtils';
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

  type ItemSlot = 'weapon' | 'armor' | 'ring' | 'ability';
  const itemSlots: ItemSlot[] = ['weapon', 'armor', 'ring', 'ability'];
  
  
  let selectedItems: Record<ItemSlot, any> = {
    weapon: null,
    armor: null,
    ring: null,
    ability: null
  };

  let selectedEnchants = {
    weapon : [null, null, null, null],
    armor: [null, null, null, null], 
    ring: [null, null, null, null],
    ability: [null, null, null, null]
  };

  let selectedTiers: Record<string, number | string> = {};

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

  let enchantDerivedBonus: Record<StatKey, number> = {
    HP: 0,
    MP: 0,
    Attack: 0,
    Defense: 0,
    Speed: 0,
    Dexterity: 0,
    Vitality: 0,
    Wisdom: 0,
  };


  onMount(() => {
    if (armorClass) loadCSV('armors', armorClass, fetch).then(data => armorData.set(data));
    if (ability) loadCSV('abilitys', ability, fetch).then(data => abilityData.set(data));
    if (weaponClass) loadCSV('weapons', weaponClass, fetch).then(data => weaponData.set(data));
    selectedClass = classes[0];
  });

  function handleChange(event: Event) {
    const select = event.currentTarget as HTMLSelectElement;
    selectedClass = classes.find((c: { Class: any; }) => c.Class === select.value);
    armorClass = selectedClass.Armor_ID;
    weaponClass = selectedClass.Weapon_ID;
    ability = selectedClass.Ability;
    loadCSV('armors', armorClass, fetch).then(data => armorData.set(data));
    loadCSV('abilitys', ability, fetch).then(data => abilityData.set(data));
    loadCSV('weapons', weaponClass, fetch).then(data => weaponData.set(data));
    for (const slot of itemSlots) {
      selectItem(null, slot)
      selectedEnchants[slot] = [null, null, null, null];
    }
  }

  function setExaltation(value: number) {
    for (const stat in exaltStats) {
        exaltStats[stat as StatKey] = value;
    }
  }

  function parseBonusValue(raw: string) {
    if (!raw) return 0;
    const cleaned = raw.replace('+', '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  function selectItem(item: null, slot: ItemSlot) {
    const previousItem = selectedItems[slot];

    const applyBonuses = (sourceItem: { [x: string]: string } | null, modifier: number) => {
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
        const bonuses = parseStatBonuses(sourceItem['Stat Bonus']);
        bonuses.forEach(({ stat, value }) => {
          if ((bonus as Record<string, number>)[stat] !== undefined) {
            bonus[stat as StatKey] += modifier * parseInt(value);
          }
        });
      }

      if (slot === 'weapon') {
        const bonuses = parseStatBonuses(sourceItem['Damage (Average)']);
        bonuses.forEach(({ stat, value }) => {
          if ((bonus as Record<string, number>)[stat] !== undefined) {
            bonus[stat as StatKey] += modifier * parseInt(value);
          }
        });
      }
    };

    applyBonuses(previousItem, -1);
    applyBonuses(item, 1);

    selectedItems[slot] = item;
    selectedItems = { ...selectedItems }; // Trigger reactivity
    bonus = { ...bonus }; // Trigger reactivity
  }

  function selectEnchant(
    enchant: any | null,
    tier: number | string,
    slot: keyof typeof selectedEnchants,
    index: number
  ) {
    const previousEnchant = selectedEnchants[slot][index];

    // Subtract previous enchant bonuses
    if (previousEnchant) {
      applyEnchantBonus(previousEnchant, selectedTiers[previousEnchant["Enchantment Name"]] ?? 1, -1);
    }

    // Set the new enchant
    selectedEnchants[slot][index] = enchant;

    // Set tier if not unique
    if (enchant && !enchant["Enchantment Labels"]?.includes("UNIQUE")) {
      selectedTiers[enchant["Enchantment Name"]] = tier ?? 1;
    }

    // Apply new bonuses
    if (enchant) {
      applyEnchantBonus(enchant, tier, 1);
    }

    // Trigger reactivity
    selectedEnchants = { ...selectedEnchants };
    selectedTiers = { ...selectedTiers };
    bonus = { ...bonus };
  }

  function applyEnchantBonus(
    enchant: any,
    tier: number | string,
    modifier: 1 | -1
  ) {
    const labels = enchant["Enchantment Labels"] ?? "";
    const effectText = enchant["Effect(s) I / II / III / IV"] ?? "";
    const parsedEffect = parseEffect(effectText, tier);

    // Handle FLATBONUS and TRADEOFF (SINGLESTAT/DUALSTAT)
    if (
      (labels.includes("SINGLESTAT") || labels.includes("DUALSTAT")) &&
      (labels.includes("FLATBONUS") || labels.includes("TRADEOFF"))
    ) {
      const bonuses = parseStatBonuses(parsedEffect);
      bonuses.forEach(({ stat, value }) => {
        const numericValue = parseBonusValue(value);
        if (stat in bonus) {
          bonus[stat as StatKey] += modifier * numericValue;
        }
      });
    }

    // Handle CONVERSIONBONUS / RELATIVEBONUS — modify enchantDerivedBonus
    if (labels.includes("CONVERSIONBONUS") || labels.includes("RELATIVEBONUS")) {
      const parsed = parseConversionEffect(parsedEffect);
      if (parsed) {
        const { baseStat, targetStat, multiplier } = parsed;
        const baseValue = bonus[baseStat as StatKey] ?? 0;
        enchantDerivedBonus[targetStat as StatKey] += modifier * (baseValue * multiplier);
      }
    }
  }


  function parseConversionEffect(effect: string) {
    const match = effect.match(/([+-]?\d+(?:\.\d+)?)%\s*([A-Z]+)\s+of\s+Bonus\s+([A-Z]+)/i);
    if (!match) return null;

    const [, rawMultiplier, targetStatKey, baseStatKey] = match;
    const multiplier = parseFloat(rawMultiplier) / 100;
    const targetStat = statMap[targetStatKey];
    const baseStat = statMap[baseStatKey];

    if (!targetStat || !baseStat) return null;

    return { targetStat, baseStat, multiplier };
  }

  $: {
    // Recompute all CONVERSIONBONUS and RELATIVEBONUS from scratch
    enchantDerivedBonus = {
      HP: 0, MP: 0, Attack: 0, Defense: 0, Speed: 0, Dexterity: 0, Vitality: 0, Wisdom: 0
    };

    for (const slot of Object.keys(selectedEnchants) as (keyof typeof selectedEnchants)[]) {
      selectedEnchants[slot].forEach((enchant) => {
        if (!enchant) return;

        const labels: string = (enchant["Enchantment Labels"] ?? "") as string;
        if (!labels.includes("CONVERSIONBONUS") && !labels.includes("RELATIVEBONUS")) return;

        const tier = labels.includes("UNIQUE") ? "Unique" : selectedTiers[enchant["Enchantment Name"]] ?? 1;
        const effect = parseEffect(enchant["Effect(s) I / II / III / IV"], tier);
        const result = parseConversionEffect(effect);
        if (!result) return;

        const baseValue = bonus[result.baseStat as StatKey] ?? 0;
        enchantDerivedBonus[result.targetStat as StatKey] += baseValue * result.multiplier;
      });
    }

    enchantDerivedBonus = { ...enchantDerivedBonus };
  }




</script>

<div class="flex flex-grow bg-gray-800 p-4 gap-4">
  <!-- Left Sidebar -->
  <div class="w-1/3 bg-gray-800 text-white p-4 flex flex-col justify-between">
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
      <StatBar stat="HP" {bonus} {exaltStats} {selectedClass} bind:bindValue={exaltStats.HP} {enchantDerivedBonus}/>
      <StatBar stat="MP" {bonus} {exaltStats} {selectedClass} bind:bindValue={exaltStats.MP} {enchantDerivedBonus}/>

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
              {enchantDerivedBonus}
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
              {enchantDerivedBonus}
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
    <!-- Top row: Item + Info -->
    <div class="flex items-start gap-4">
      <ItemWindow
        slot="weapon"
        {selectedItems}
        {selectedEnchants}
        items={$weaponData}
        onSelect={(item) => selectItem(item, 'weapon')}
      />
      <ItemInfo
        slot="weapon"
        {selectedItems}
        {selectedEnchants}
        {selectedTiers}
      />
    </div>

    <!-- Bottom row: 2x2 Grid of Enchantments -->
    <div class="grid grid-cols-2 gap-4">
      {#each [0, 1, 2, 3] as i}
        <EnchantmentWindow
          selected={selectedEnchants.weapon[i]}
          enchantments={enchantmentData}
          slotType="WEAPON"
          allSelected={selectedEnchants.weapon.filter((_, idx) => idx !== i)}
          onSelect={(e, tier) => selectEnchant(e, tier, 'weapon', i)}
          {selectedTiers}
        />
      {/each}
    </div>
  </div>


  <!-- Armor -->
  <div class="relative flex flex-col gap-2">
    <div class="flex items-start gap-4">
      <ItemWindow
        slot="armor"
        {selectedItems}
        {selectedEnchants}
        items={$armorData}
        onSelect={(item) => selectItem(item,'armor')}
      />
      <ItemInfo
        slot="armor"
        {selectedItems}
        {selectedEnchants}
        {selectedTiers}
      />
    </div>
    <!-- Bottom row: 2x2 Grid of Enchantments -->
    <div class="grid grid-cols-2 gap-4">
      {#each [0, 1, 2, 3] as i}
        <EnchantmentWindow
          selected={selectedEnchants.armor[i]}
          enchantments={enchantmentData}
          slotType="ARMOR"
          allSelected={selectedEnchants.armor.filter((_, idx) => idx !== i)}
          onSelect={(e, tier) => selectEnchant(e, tier, 'armor', i)}
          {selectedTiers}
        />
      {/each}
    </div>
  </div>

  <!-- Ability -->
  <div class="relative flex flex-col gap-2">
    <div class="flex items-start gap-4">
      <ItemWindow
        slot="ability"
        {selectedItems}
        {selectedEnchants}
        items={$abilityData}
        onSelect={(item) => selectItem(item,'ability')}
      />
      <ItemInfo
        slot="ability"
        {selectedItems}
        {selectedEnchants}
        {selectedTiers}
      />
    </div>
    <!-- Bottom row: 2x2 Grid of Enchantments -->
    <div class="grid grid-cols-2 gap-4">
      {#each [0, 1, 2, 3] as i}
        <EnchantmentWindow
          selected={selectedEnchants.ability[i]}
          enchantments={enchantmentData}
          slotType="ABILITY"
          allSelected={selectedEnchants.ability.filter((_, idx) => idx !== i)}
          onSelect={(e, tier) => selectEnchant(e, tier, 'ability', i)}
          {selectedTiers}
        />
      {/each}
    </div>
  </div>

  <!-- Ring -->
  <div class="relative flex flex-col gap-2">
    <div class="flex items-start gap-4">
      <ItemWindow
        slot="ring"
        {selectedItems}
        {selectedEnchants}
        items={ringData}
        onSelect={(item) => selectItem(item,'ring')}
      />
      <ItemInfo
        slot="ring"
        {selectedItems}
        {selectedEnchants}
        {selectedTiers}
      />
    </div>
    <!-- Bottom row: 2x2 Grid of Enchantments -->
    <div class="grid grid-cols-2 gap-4">
      {#each [0, 1, 2, 3] as i}
        <EnchantmentWindow
          selected={selectedEnchants.ring[i]}
          enchantments={enchantmentData}
          slotType="RING"
          allSelected={selectedEnchants.ring.filter((_, idx) => idx !== i)}
          onSelect={(e, tier) => selectEnchant(e, tier, 'ring', i)}
          {selectedTiers}
        />
      {/each}
    </div>
  </div>
</div>

</div>
