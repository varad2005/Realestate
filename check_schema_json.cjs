const fs = require('fs');

const schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
const tables = [
  'properties',
  'locations',
  'property_images',
  'property_videos',
  'property_amenities',
  'project_details',
  'location_advantages',
  'saved_properties'
];

for (const table of tables) {
  if (schema.definitions[table]) {
    console.log(`\n=== ${table} ===`);
    console.log(Object.keys(schema.definitions[table].properties).join(', '));
  } else {
    console.log(`\n=== ${table} (MISSING) ===`);
  }
}
