const fs = require('fs');

// Read the sorted_artifacts.json file
fs.readFile('release_artifacts.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  const artifacts = JSON.parse(data);

  // Generate HTML content
  let indexContent = `<!DOCTYPE html><html><head><title>Vending Machine Project Releases</title></head><body><h1>Vending Machine Project Releases</h1><div>`;
  artifacts.forEach(artifact => {
    const artifactName = artifact.name;
    const artifactUrl = artifact.archive_download_url;
    indexContent += `<p><a href="${artifactUrl}">${artifactName}</a></p>`;
  });
  indexContent += `</div></body></html>`;

  // Write the HTML content to index.html
  fs.writeFile('index.html', indexContent, err => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('index.html generated successfully');
  });
});