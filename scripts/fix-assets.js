const fs = require("fs");
const path = require("path");

const directory = "./assets/models";
const assetFileNames = fs.readdirSync(directory);

// This is a bit of a hack, since generate-assets.js expects file names to be
// in a specific format, we can't have hyphens separating multi-word colors.

const colorNamesToFix = [/light-brown/, /dark-brown/];
const colorRenames = [
  ["light-brown", "light brown"],
  ["dark-brown", "dark brown"],
];

const renames = [
  ["facial-hair_goatee-2.glb", "facial-hair_goatee-2-brown.glb"],
  ["facial-hair_goatee-5.glb", "facial-hair_goatee-5-brown.glb"],
  ["hair_taper-afro-1-blue.glb", "hair_taper-afro-2-blue.glb"],
];

const filesToDelete = [
  "facial-hair_mustache-2.glb",
  "torso_style-1-ketchum.glb",
];

function fixColorNames(filename) {
  colorRenames.forEach(([search, replace]) => {
    filename = filename.replace(search, replace);
  });
  return filename;
}

for (const filename of assetFileNames) {
  if (colorNamesToFix.some((regex) => regex.test(filename))) {
    const newName = fixColorNames(filename);
    console.log(`renaming ${filename} to ${newName}`);
    fs.renameSync(path.join(directory, filename), path.join(directory, newName));
  }
}

for (const [oldName, newName] of renames) {
  const oldPath = path.join(directory, oldName);
  if (fs.existsSync(oldPath)) {
    console.log(`renaming ${oldName} to ${newName}`);
    fs.renameSync(oldPath, path.join(directory, newName));
  }
}

for (const fileToDelete of filesToDelete) {
  const filePath = path.join(directory, fileToDelete);
  if (fs.existsSync(filePath)) {
    console.log(`deleting ${fileToDelete}`);
    fs.unlinkSync(filePath);
  }
}
