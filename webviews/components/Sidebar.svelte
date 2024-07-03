<script>
  import { onMount } from "svelte";

  let text = "";

  function fetchText() {
    // send message to the extension asking for the selected text
  }
  
  onMount(() => {
    // Listen for messages from the extension
    tsvscode.postMessage({ type: "onSidebarOpen" });

    window.addEventListener("message", (event) => {
      const message = event.data;
      switch (message.type) {
        case "onSelectedText": {
          text = message.value;
          break;
        }
      }
    });
  });
</script>

<h1>Hello vs code</h1>

<style>
  h1 {
    color: red;
  }
</style>