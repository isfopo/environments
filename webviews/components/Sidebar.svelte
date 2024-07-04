<script lang="ts">
  import { onMount } from "svelte";
  import type { FileData } from "../../globals.d.ts"

  let files: FileData[] = [];
  
  onMount(() => {
    // Listen for messages from the extension
    tsvscode.postMessage({ type: "onSidebarOpen" });

    window.addEventListener("message", (event) => {
      const message = event.data;
      switch (message.type) {
        case "onFiles": {
          files = message.value[0].files;
          break;
        }
      }
    });
  });
</script>

{#if files.length === 0}
  <p>No .env files found.</p>
{/if}

{#each files as file}
  <h2>{file.name}</h2>
  {#each Object.keys(file.content) as key}  
    <strong>{key}</strong>
    <p>{file.content[key].value}</p>
  {/each}
{/each}
