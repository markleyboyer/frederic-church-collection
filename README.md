# Frederic Edwin Church Collection

A digital art research and visualization tool for exploring Frederic Edwin Church's artworks from the Cooper Hewitt Smithsonian Design Museum collection.

## Features

- **Church Collection Browser**: Browse 2,644+ artworks by Frederic Edwin Church with comprehensive metadata
- **Visual Image Sorter**: Interactive canvas for organizing and analyzing artworks by themes, geography, and medium
- **Cooper Hewitt Integration**: Direct access to high-resolution images and detailed museum metadata
- **Dark Theme Interface**: Professional dark theme optimized for art research

## Components

### 1. Church Collection Browser (`church.html`)
- Comprehensive collection browser with spreadsheet and card views
- Dark theme interface with collapsible descriptions
- Clickable image modals for detailed viewing
- Complete metadata including provenance, geography, and measurements

### 2. Visual Image Sorter (`ClaudeImageSorter.html`)
- Interactive canvas for visual art organization
- Drag-and-drop functionality for image arrangement
- Metadata editing and enhancement tools
- Cooper Hewitt import integration
- Intelligent sorting by medium, geography, and themes

### 3. GraphQL API Server (`server.js`)
- Node.js/Express server with Cooper Hewitt GraphQL integration
- Comprehensive data transformation and null safety
- Static file serving with CORS support
- 20+ metadata fields mapping

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express, GraphQL
- **API**: Cooper Hewitt Smithsonian Design Museum GraphQL API
- **Hosting**: Firebase (planned)
- **Version Control**: Git, GitHub

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/[username]/frederic-church-collection.git
   cd frederic-church-collection
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser to:
   - Collection Browser: `http://localhost:3000/church.html`
   - Image Sorter: `http://localhost:3000/ClaudeImageSorter.html`

## Usage

### Browsing the Collection
1. Visit `church.html` to browse the complete collection
2. Use the search functionality to filter artworks
3. Switch between spreadsheet and card views
4. Click on images for detailed modal views

### Visual Research with Image Sorter
1. Visit `ClaudeImageSorter.html` for visual organization
2. Click "Import Cooper Hewitt" to load artworks
3. Drag and arrange images on the canvas
4. Edit metadata and add research notes
5. Export your organized collections

## Cooper Hewitt Collection

This project provides access to Frederic Edwin Church's complete works in the Cooper Hewitt collection, including:
- **Drawings and Sketches**: Field studies from his travels
- **Oil Paintings**: Finished works and studies
- **Architectural Plans**: Designs for his home, Olana
- **Travel Documentation**: South American and Middle Eastern journeys

## Development

The project uses modern web technologies with a focus on art historical research workflows:
- Responsive design for various screen sizes
- Accessibility considerations for academic use
- Performance optimizations for large image collections
- Comprehensive error handling and user feedback

## Contributing

This is a research tool developed for art historical study. Contributions welcome for:
- Additional museum API integrations
- Enhanced visualization features
- Metadata enhancement tools
- Export and citation functionality

## License

This project is for educational and research purposes. Images and metadata are courtesy of the Cooper Hewitt Smithsonian Design Museum.

## Acknowledgments

- Cooper Hewitt Smithsonian Design Museum for providing comprehensive API access
- Frederic Edwin Church for creating these remarkable works of art
- The digital humanities community for inspiration and best practices