/* ------------------------------------------------------------------
JSONify Plugin by Denise Kolodzey
Created with 🫖 and 🤍
------------------------------------------------------------------ */

figma.showUI(__html__, {
  width: 600,
  height: 610,
  title: "JS Object Exporter - Created by Denise Kolodzey",
});

/* ------------------------------------------------------------------
Recursively builds a JSON object from Figma scene nodes
------------------------------------------------------------------ */

async function buildJsonOutput(
  root: SceneNode
): Promise<{ [key: string]: any }> {
  if (!root) return {};

  let jsonOutput: { [key: string]: any } = {};

  const traverse = (node: SceneNode): void => {
    if (node.name.startsWith("exclude-")) {
      return;
    }

    // --- Handle groups of text layers ---
    if (node.type === "GROUP") {
      let textArray: string[] = [];
      for (let child of node.children) {
        if (child.type === "TEXT") {
          const textContent = (child as TextNode).characters;

          // --- Split multiline text into an array if it contains "\n" (line-break) ---
          if (textContent.includes("\n")) {
            textArray.push(
              ...textContent.split("\n").map((line) => line.trim())
            );
          } else {
            textArray.push(textContent.trim());
          }
        }
      }

      if (textArray.length > 0) {
        jsonOutput[node.name] = textArray;
      }
    }

    // --- Process single TextNodes outside of groups ---
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

    // --- If the node has children (e.g., FrameNode), process them recursively ---
    else if ("children" in node && node.children) {
      for (let child of node.children) {
        traverse(child);
      }
    }
  };

  // --- Start DFS traversal from the root node ---
  traverse(root);

  return jsonOutput;
}

/* ------------------------------------------------------------------
Processes the current selection and sends JSON output to the UI
------------------------------------------------------------------ */

async function handleSelection() {
  const selection = figma.currentPage.selection;

  let combinedJsonOutput: { [key: string]: any } = {};

  // --- Process each selected node ---
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

/* ------------------------------------------------------------------
Handle UI messages
------------------------------------------------------------------ */
figma.ui.onmessage = (msg: { type: string; count: number }) => {
  if (msg.type === "create") {
    handleSelection();
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  } else if (msg.type === "downloadCompleted") {
    figma.closePlugin();
  }
};
