<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>World's Most Essential Codebase</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3 {
      color: #444;
    }
    code {
      background-color: #eaeaea;
      padding: 2px 4px;
      border-radius: 3px;
    }
    pre {
      background-color: #f9f9f9;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
    .container {
      max-width: 800px;
      margin: auto;
      background: white;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to the Ultimate Furniture API</h1>
    <p>Here lies the legendary, life-changing code that <em>finally</em> allows users to browse sofas, shoe racks, and storage benches. Yes, it’s as groundbreaking as it sounds.</p>

    <h2>Setup Instructions</h2>
    <p>If you’re feeling ambitious enough to run this beauty locally, here’s how you can do it:</p>
    <pre><code>// Clone the Repository
git clone https://github.com/yourusername/furniture-api.git

// Navigate to the Directory
cd furniture-api

// Install dependencies, because, well, it needs them
npm install

// Create a .env file with your MongoDB URI, because it's "secure"
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key

// Start the server and let the magic unfold
npm start
    </code></pre>

    <h2>Features (Brace Yourself)</h2>
    <ul>
      <li><strong>Get Sofas:</strong> Retrieve an assortment of sofas you never knew you needed.</li>
      <li><strong>Get Shoe Racks:</strong> Because organizing shoes is a priority in life.</li>
      <li><strong>Storage Bench Locator:</strong> For those times you want a bench that stores things. Revolutionary, right?</li>
    </ul>

    <h2>Usage</h2>
    <p>Here’s how you interact with this API. No promises on life-changing results.</p>

    <h3>GET /test</h3>
    <p>Tests the endpoint, so you can be assured everything is <em>working</em> as intended. (Or so we hope.)</p>

    <h3>GET /getSofas</h3>
    <p>Returns all sofas in our prestigious database. It’s hard to imagine life without knowing which sofas are 3-seaters, isn’t it?</p>

    <h3>POST /getS</h3>
    <p>Retrieve sofa images by SKU, because of course you’re going to want to know what they look like.</p>

    <h2>API Endpoints</h2>
    <p>A few critical routes that you’ll need to worship—err, understand:</p>
    <table border="1" cellpadding="5">
      <tr>
        <th>Endpoint</th>
        <th>Method</th>
        <th>Description</th>
      </tr>
      <tr>
        <td><code>/test</code></td>
        <td>GET</td>
        <td>Simply checks if the backend is alive and kicking. Probably crucial.</td>
      </tr>
      <tr>
        <td><code>/getSofas</code></td>
        <td>GET</td>
        <td>Fetches the essential list of sofas. Game-changer.</td>
      </tr>
      <tr>
        <td><code>/sofaimg</code></td>
        <td>POST</td>
        <td>Grabs all sofa images, because you’ll want to see every angle.</td>
      </tr>
      <tr>
        <td><code>/otherGetData</code></td>
        <td>POST</td>
        <td>Serves additional data for your inevitable furniture binge.</td>
      </tr>
    </table>

    <h2>Folder Structure (You’ll Memorize This)</h2>
    <pre><code>
/public
  /img
    /sofa
      - essential-sofa-pics-here.jpg
    /shoeracks
      - various-shoe-pics.jpg
    ...
/dbModels
  - SofaModel.js
  - ShoeRackModel.js
...
    </code></pre>

    <h2>Contributing</h2>
    <p>If you feel the overwhelming urge to improve this, here’s what to do:</p>
    <ol>
      <li>Fork the repo, you hero.</li>
      <li>Create a new branch: <code>git checkout -b feature/feature-name</code></li>
      <li>Commit your changes, because GitHub wants you to.</li>
      <li>Open a pull request, and maybe—just maybe—it’ll be approved.</li>
    </ol>

    <h2>License</h2>
    <p>This groundbreaking codebase is licensed under the MIT License. Feel free to fork, clone, and marvel at it, but don’t forget to credit the geniuses behind it.</p>

    <footer>
      <p>© 2024 The Ultimate Furniture API, making your furniture browsing dreams come true, one route at a time.</p>
    </footer>
  </div>
</body>
</html>
