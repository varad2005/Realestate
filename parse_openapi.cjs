const fs = require('fs');
const openapi = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));

const definitions = openapi.definitions || openapi.components?.schemas || {};

['property_videos', 'property_highlights', 'project_details'].forEach(table => {
  const schema = definitions[table];
  if (schema && schema.properties) {
    console.log(`\nTable: ${table}`);
    console.log(Object.keys(schema.properties).join(', '));
  } else {
    console.log(`\nTable: ${table} (Not found in schema)`);
  }
});
