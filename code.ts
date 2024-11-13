figma.showUI(__html__);
figma.ui.resize(650, 580);

async function buildJsonOutput(
  root: SceneNode
): Promise<{ [key: string]: any }> {
  if (!root) return {}; // Return an empty object if root is invalid

  let queue: SceneNode[] = [root]; // Queue for level-order traversal
  let jsonOutput: { [key: string]: any } = {}; // Object to store JSON structure

  while (queue.length > 0) {
    let node = queue.shift()!; // Remove the first node from the queue

    // Skip nodes with "exclude-" prefix
    if (node.name.startsWith("exclude-")) {
      continue;
    }

    // Process TextNodes
    if (node.type === "TEXT") {
      const textContent = (node as TextNode).characters;

      // Check if the content contains newlines, convert to array if true
      if (textContent.includes("\n")) {
        jsonOutput[node.name] = textContent
          .split("\n")
          .map((line) => line.trim());
      } else {
        jsonOutput[node.name] = textContent;
      }
    }

    // Add children to the queue if the node has children
    if ("children" in node && node.children) {
      queue.push(...(node.children as SceneNode[]));
    }
  }

  return jsonOutput; // Return the JSON structure with text layer data
}

async function checkSelection() {
  const selection = figma.currentPage.selection;

  // Initialize a variable to hold the combined JSON output
  let combinedJsonOutput: { [key: string]: any } = {};

  // Process each selected node
  for (const node of selection) {
    const nodeJson = await buildJsonOutput(node); // Generate JSON for each node
    Object.assign(combinedJsonOutput, nodeJson); // Merge into the combined output
  }

  // Determine if the JSON has any keys (indicating text layers were found)
  if (Object.keys(combinedJsonOutput).length > 0) {
    console.log(
      //Generated JSON Output:,
      JSON.stringify(combinedJsonOutput, null, 2)
    );
  } else {
    figma.ui.postMessage({
      type: "showMessage",
      message: "Please select at least one text layer to generate JSON output.",
    });
  }
}

figma.ui.onmessage = (msg: { type: string; count: number }) => {
  if (msg.type === "create") {
    checkSelection();
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
