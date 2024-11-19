figma.showUI(__html__);
figma.ui.resize(650, 580);

async function buildJsonOutput(
  root: SceneNode
): Promise<{ [key: string]: any }> {
  if (!root) return {};

  // Queue for level-order traversal
  let queue: SceneNode[] = [root];
  // Object to store JSON structure
  let jsonOutput: { [key: string]: any } = {};

  while (queue.length > 0) {
    // Remove the first node from the queue
    let node = queue.shift()!;

    if (node.name.startsWith("exclude-")) {
      continue;
    }

    // Process GroupNode as an array if it contains TextNodes
    if (node.type === "GROUP") {
      // Array to store text content for this group
      let textArray: string[] = [];
      // Traverse child nodes within the group and collect TextNode content
      for (let child of node.children) {
        if (child.type === "TEXT") {
          const textContent = (child as TextNode).characters;

          // Split multiline text into an array if it contains "\n"
          if (textContent.includes("\n")) {
            textArray.push(
              ...textContent.split("\n").map((line) => line.trim())
            );
          } else {
            textArray.push(textContent.trim());
          }
        }
      }

      // If there is text content in the group, add it to jsonOutput using the group's name
      if (textArray.length > 0) {
        jsonOutput[node.name] = textArray;
      }
    }

    // Process single TextNodes outside of groups
    else if (node.type === "TEXT") {
      const textContent = (node as TextNode).characters;

      if (textContent.includes("\n")) {
        jsonOutput[node.name] = textContent
          .split("\n")
          .map((line) => line.trim());
      } else {
        jsonOutput[node.name] = textContent.trim();
      }
    }

    // If the node has children (e.g., FrameNode), add children to the queue for further traversal
    else if ("children" in node && node.children) {
      queue.push(...(node.children as SceneNode[]));
    }
  }

  return jsonOutput; // Return the structured JSON output
}

async function checkSelection() {
  const selection = figma.currentPage.selection;

  // Initialize a variable to hold the combined JSON output
  let combinedJsonOutput: { [key: string]: any } = {};

  // Process each selected node
  for (const node of selection) {
    const nodeJson = await buildJsonOutput(node);
    Object.assign(combinedJsonOutput, nodeJson);
  }

  if (Object.keys(combinedJsonOutput).length > 0) {
    const jsonString = JSON.stringify(combinedJsonOutput, null, 2);
    figma.ui.postMessage({
      type: "downloadJSON",
      data: jsonString,
    });
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
