figma.showUI(__html__);
figma.ui.resize(650, 580);

async function buildJsonOutput(
  root: SceneNode
): Promise<{ [key: string]: any }> {
  if (!root) return {};

  let queue: SceneNode[] = [root]; // Queue for level-order traversal
  let jsonOutput: { [key: string]: any } = {}; // Object to store JSON structure

  while (queue.length > 0) {
    let node = queue.shift()!; // Remove the first node from the queue

    if (node.name.startsWith("exclude-")) {
      continue;
    }

    // Process Group or Frame nodes that contain TextNodes
    if ("children" in node && node.children.length > 0) {
      let textArray: string[] = []; // Array to store text content for this group

      // Traverse child nodes within the group
      for (let child of node.children) {
        if (child.type === "TEXT") {
          const textContent = (child as TextNode).characters;

          // Split multiline text into separate lines if it contains "\n"
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
  }

  return jsonOutput;
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
