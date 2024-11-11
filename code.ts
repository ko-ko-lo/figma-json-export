figma.showUI(__html__);
figma.ui.resize(650, 580);

// Helper Function - Level Order Traversing Figma Tree
async function levelOrderTextNodes(root: SceneNode): Promise<TextNode[]> {
  if (!root) return [];

  let queue: SceneNode[] = [root];
  let textNodes: TextNode[] = [];

  while (queue.length > 0) {
    let node = queue.shift()!;

    // Check if the node is a TextNode and add it to the array
    if (node.type === "TEXT") {
      textNodes.push(node as TextNode);
    }

    // Add children to the queue if the node has children
    if ("children" in node && node.children) {
      queue.push(...(node.children as SceneNode[]));
    }
  }
  return textNodes;
}

async function checkSelection() {
  const selection = figma.currentPage.selection;

  // Check if any selected node contains TextNode(s)
  let textNodes: TextNode[] = [];
  for (const node of selection) {
    const nodeTextNodes = await levelOrderTextNodes(node);
    textNodes.push(...nodeTextNodes);
  }

  // Determine if there are any text layers in the selection
  if (textNodes.length > 0) {
    console.log("Text layers found:", textNodes);
  } else {
    figma.ui.postMessage({
      type: "showMessage",
      message:
        "Please select at least one (text) layer to generate JSON output.",
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
