figma.showUI(__html__);
figma.ui.resize(650, 580);

figma.ui.onmessage = (msg: { type: string; count: number }) => {
  if (msg.type === "cancel") {
    figma.closePlugin();
  }

  figma.closePlugin();
};
