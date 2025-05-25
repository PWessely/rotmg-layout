<script>
  import '../app.css';
  import { injectAnalytics } from '@vercel/analytics/sveltekit'
  injectAnalytics();
</script>

<main class="flex flex-col min-h-screen bg-gray-100 text-white">
  <!-- Header -->
  <header class="bg-black p-4 text-sm flex flex-col sm:flex-row justify-between items-center">
    <div class="flex items-center space-x-2">
      <a href="/" class="text-white hover:text-gray-300">
        <img src="/pageIcon.png" alt="Logo" class="h-8 w-8" />
      </a>
      <span class="text-lg font-bold">RotMG - Layout</span>
    </div>
    <div>
      <a href="https://www.realmeye.com/wiki/current-release" title="Current Release" class="underline hover:text-gray-300">Exalt Version 5.11.0.0</a>
    </div>
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
