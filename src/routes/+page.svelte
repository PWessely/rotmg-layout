<script lang="ts">
  export let data;
  let classes = data.classes;
  let selectedClass = classes[0];
  type StatKey = 'HP' | 'MP' | 'Attack' | 'Defense' | 'Speed' | 'Dexterity' | 'Vitality' | 'Wisdom';

  function handleChange(event) {
    selectedClass = classes.find(c => c.Class === event.target.value);
  }
  function setExaltation(value: number) {
    for (const stat in bonus) {
        bonus[stat as StatKey] = value;
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

  const getTotal = (stat: StatKey) => {
    const base = parseInt(selectedClass[stat]);
    const extra = bonus[stat] * (stat === 'HP' || stat === 'MP' ? 5 : 1);
    return base + extra;
};
</script>

<div class="flex flex-grow p-4 gap-4">
  <!-- Left Sidebar -->
  <div class="w-1/3 bg-gray-800 text-white rounded-xl shadow p-4 flex flex-col justify-between">
    <!-- Class Name -->
    <h2 class="text-xl font-bold mb-2">{selectedClass.Class}</h2>

    <!-- Class Image -->
    <img src="{selectedClass['Image URL']}" alt="{selectedClass.Class}" class="object-contain h-1/4 mb-4" />

    <!-- Dropdown -->
    <select class="mb-4 p-2 border rounded" on:change="{handleChange}">
      {#each classes as c}
        <option value="{c.Class}">{c.Class}</option>
      {/each}
    </select>

    <!-- Exaltation Buttons -->
    <div class="flex items-center gap-4 mt-4">
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
    <!-- HP Bar -->
        <div class="flex items-center gap-2">
            <span class="w-12">HP</span>
            <div class="relative w-full h-6 bg-green-200 rounded">
            <div class="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-900">
                {getTotal('HP')}
            </div>
            <div
                class="h-full bg-green-500 rounded"
                style="width: 100}%;"
            ></div>
            </div>
            <select bind:value={bonus.HP} class="ml-2 p-1 rounded bg-gray-700 text-white w-12">
            {#each Array(6) as _, i}
                <option value={i}>{i}</option>
            {/each}
            </select>
        </div>

        <!-- MP Bar -->
        <div class="flex items-center gap-2">
            <span class="w-12">MP</span>
            <div class="relative w-full h-6 bg-blue-200 rounded">
            <div class="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-900">
                {getTotal('MP')}
            </div>
            <div
                class="h-full bg-blue-500 rounded"
                style="width: 100%;"
            ></div>
            </div>
            <select bind:value={bonus.MP} class="ml-2 p-1 rounded bg-gray-700 text-white w-12">
            {#each Array(6) as _, i}
                <option value={i}>{i}</option>
            {/each}
            </select>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
            <!-- Left Column -->
            <div class="space-y-2">
            {#each ['Attack', 'Speed', 'Vitality'] as stat}
                <div class="flex items-center justify-between">
                <span class="w-20">{stat}:</span>
                <span class="w-10 text-center">{getTotal(stat)}</span>
                <select bind:value={bonus[stat]} class="p-1 rounded bg-gray-700 text-white w-12">
                    {#each Array(6) as _, i}
                    <option value={i}>{i}</option>
                    {/each}
                </select>
                </div>
            {/each}
            </div>

            <!-- Right Column -->
            <div class="space-y-2">
            {#each ['Defense', 'Dexterity', 'Wisdom'] as stat}
                <div class="flex items-center justify-between">
                <span class="w-20">{stat}:</span>
                <span class="w-10 text-center">{getTotal(stat)}</span>
                <select bind:value={bonus[stat]} class="p-1 rounded bg-gray-700 text-white w-12">
                    {#each Array(6) as _, i}
                    <option value={i}>{i}</option>
                    {/each}
                </select>
                </div>
            {/each}
            </div>
        </div>
    </div>
  </div>
  <!-- Right Grid -->
  <div class="w-2/3 grid grid-rows-4 gap-4">
    {#each Array(4) as _, rowIdx}
      <div class="flex gap-4">
        <!-- Main Box with smooth edges -->
        <div class="w-1/5 h-24 bg-gray-300 rounded-2xl cursor-pointer flex items-center justify-center text-black font-bold">
          Box {rowIdx + 1}
        </div>
      </div>
    {/each}
  </div>
</div>
