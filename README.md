# The Ultimate Furniture API

Welcome to the API you never knew you needed—an API that lets you retrieve sofas, shoe racks, and storage benches as if your life depends on it. If you've been lying awake at night wondering how to efficiently query for a 3-seater sofa, look no further.

## Setup Instructions

In case you want to run this locally for some reason, here’s how:

```bash
# Clone the Repository
git clone https://github.com/yourusername/furniture-api.git

# Navigate to the Directory
cd furniture-api

# Install dependencies, because it won’t run without them
npm install

# Create a .env file with your MongoDB URI and other sacred details
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key

# Start the server and let the magic unfold
npm start
```

# The Ultimate Furniture API

Welcome to the API you never knew you needed—an API that lets you retrieve sofas, shoe racks, and storage benches as if your life depends on it. If you've been lying awake at night wondering how to efficiently query for a 3-seater sofa, look no further.

## Features (Prepare to be Wowed)

- **Get Sofas**: Retrieve an assortment of sofas that will enrich your life in unspeakable ways.
- **Get Shoe Racks**: Because shoes deserve the best storage.
- **Storage Bench Locator**: Finally, a way to locate that elusive storage bench.

## Usage

Here’s how to make the most of this remarkable API.

### GET /test
Tests the endpoint to reassure you that everything is working as “intended.” (Or so we hope.)

### GET /getSofas
Returns a highly curated list of sofas. Hard to believe we ever lived without it.

### POST /getS
Retrieves sofa images by SKU, because of course you need to know what they look like.

## API Endpoints

In case you haven’t memorized them already, here’s a list of the critical routes:

| Endpoint         | Method | Description                                        |
|------------------|--------|----------------------------------------------------|
| `/test`          | GET    | Checks if the backend is functioning. Groundbreaking. |
| `/getSofas`      | GET    | Fetches all the sofas for your browsing pleasure.     |
| `/sofaimg`       | POST   | Returns all the sofa images in beautiful detail.      |
| `/otherGetData`  | POST   | Supplies additional data for your furniture binge.    |

## Folder Structure (Like You’ll Need It)

In case you wanted to dig deeper (who wouldn’t?), here’s how the project is laid out:

```bash
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

```

## Contributing

Feeling inspired? Here’s how you can “improve” this masterpiece:

1. **Fork the repo** - because you know you want to.
2. **Create a new branch**: `git checkout -b feature/feature-name`
3. **Commit your changes**. Show the world what you’ve got.
4. **Open a pull request**. Go on, you’ve earned it.

## License

This extraordinary codebase is licensed under the MIT License. Feel free to fork, clone, and marvel at it, but remember to give credit to the masterminds behind it.

---

**© 2024 The Ultimate Furniture API** - Bringing you the furniture browsing experience you didn’t know you needed.
