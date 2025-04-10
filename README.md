# Jsonify Plugin

_A simple tool to turn text layers into structured JSON files in seconds._

Jsonify is a Figma plugin that converts text layer into structured JSON files, simplifying the design-to-development handoff. By leveraging layer names, groups, and hierarchies, it organizes text and nested structures into key-value pairs and arrays. This automation eliminates repetitive tasks like manual text copying, making workflows more efficient and streamlined.

![jsonify](https://github.com/user-attachments/assets/016e086b-348b-4af4-80fe-2efd2adb6028)

## Key Features

- **Specific Layers with Prefixes are excluded:**
The prefix "exclude-" is used to skip layers that are not wanted in the JSON output. This gives control over what gets exported, keeping the data clean and focused.

- **Auto Layout Layers are Ignored:**
Auto layout layers are automatically excluded to ensure the exported JSON remains straightforward.

- **Layer Names Become Keys:**
Each layer's name is transformed into a key in the JSON object, making the output structured and easy to use. Groups become arrays, and nested groups create hierarchical structures that mirror the design.

- **Line Breaks Create Arrays:**
When a text layer contains line breaks (\n), the text is split into an array. Each line becomes a separate entry in the JSON, making it easy to handle lists or bullet points directly from the design.

- **Grouped Layers as Arrays:**
Groups in Figma are treated as arrays in the generated JSON. Each child layer inside the group becomes an array entry, keeping the structure intuitive and aligned with the design hierarchy. 

## How to use

- Prepare your Figma layers
- Select layers to export
- Run the plugin

## Tech Stack
- **Figma API**: Retrieves and processes text layers.
- **TypeScript/JavaScript**: Core logic.
- **HTML & CSS**: For the plugin UI.
  
