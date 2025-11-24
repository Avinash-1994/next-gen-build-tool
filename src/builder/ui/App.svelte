<script lang="ts">
  let count = 0;
  const increment = () => count += 1;
</script>

<main>
  <h1>NextGen Builder</h1>
  <div class="card">
    <button on:click={increment}>
      count is {count}
    </button>
    <p>
      Edit <code>src/builder/ui/App.svelte</code> and save to test HMR
    </p>
  </div>
</main>

<style>
  main {
    font-family: 'Inter', sans-serif;
    text-align: center;
    padding: 2rem;
  }
  h1 {
    color: #646cff;
  }
  .card {
    padding: 2em;
  }
</style>
