<script>
  import '../app.css';
</script>

<main class="flex flex-col min-h-screen bg-gray-100 text-white">
  <!-- Header -->
  <header class="bg-black p-4 flex items-center gap-4">
    <img src="/favicon.png" alt="Icon" class="h-8 w-8" />
    <h1 class="text-xl font-bold">RotMG - Layout - 0.1</h1>
  </header>

  <!-- Page Content -->
  <slot class="flex-grow" />

  <!-- Footer -->
  <footer class="bg-black p-4 text-sm flex flex-col sm:flex-row justify-between items-center">
    <div>RotMG - Layout</div>
    <a
      href="https://www.realmeye.com/wiki/realm-of-the-mad-god"
      target="_blank"
      class="underline hover:text-gray-300"
    >
      RealmEye Wiki
    </a>
    <div>© Exopwne 2025</div>
  </footer>
</main>
