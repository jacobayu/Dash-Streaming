

window.dash_clientside = Object.assign({}, window.dash_clientside, {
    clientside: {
        streaming_GPT: async function streamingGPT(n_clicks, prompt) {
            const responseWindow = document.querySelector("#response-window");

            marked.setOptions({
                highlight: function(code) {
                    return hljs.highlightAuto(code).value;
                }
            });

            const response = await fetch("/streaming-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const decoder = new TextDecoder();
            const reader = response.body.getReader();
            let previousChunk = "";

            let currentMessage = ""

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const currentChunk = decoder.decode(value, { stream: true });
                // previousChunk += currentChunk;  // Accumulate the chunks in a local variable
                // const htmlText = marked.parse(currentChunk); // Parse the accumulated markdown content
                currentMessage = currentChunk
                responseWindow.insertAdjacentHTML('beforeend', currentMessage); // Append the parsed HTML to the end of the chat
                previousChunk = ""; // Reset the previousChunk after appending to avoid duplication
            }

            return false;
        }
    }
});