# Jsonify Plugin

_A simple tool to turn text layers into structured JSON files in seconds._

Jsonify is a Figma plugin that converts text layer into structured JSON files, simplifying the design-to-development handoff. By leveraging layer names, groups, and hierarchies, it organizes text and nested structures into key-value pairs and arrays. This automation eliminates repetitive tasks like manual text copying, making workflows more efficient and streamlined.

For more details about the development process, visit the [Portfolio Page](https://creativejourney.dev/projects/figma-plugin-jsonify).


![1](https://github.com/user-attachments/assets/70bd6417-e54b-413f-93fa-120680c55fb6)

## How JSONify Works

- **Layer names = JSON keys:**<br>
Each layer name becomes a key in your exported JSON.

- **Line breaks = list items:**<br>
Text with line breaks (\n) is split into array entries.

- **Auto layout is skipped:**<br>
Auto layout frames are ignored to keep output clean.

- **Prefix “exclude-” to skip:**<br>
Layers with names starting with exclude- won't be included.


## How to use
Prepare your layers by naming or grouping them. Select the ones you need, then run the plugin.

## Tech Stack
- **Figma API**: Retrieves and processes text layers.
- **TypeScript/JavaScript**: Core logic.
- **HTML & CSS**: For the plugin UI.
  
