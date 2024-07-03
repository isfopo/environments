<script>
  import { onMount } from "svelte";

  let files = [];
  
  onMount(() => {
    // Listen for messages from the extension
    tsvscode.postMessage({ type: "onSidebarOpen" });

    window.addEventListener("message", (event) => {
      const message = event.data;
      switch (message.type) {
        case "onFiles": {
          files = message.value;
          break;
        }
      }
    });
  });
</script>

{#each files as file}
  <h2>{file.name}</h2>
  <p>{file.content}</p>
{/each}
