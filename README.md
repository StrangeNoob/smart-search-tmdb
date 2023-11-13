# SmartSearchComponent

`SmartSearchComponent` is an advanced client-side search interface for movies, utilizing the TMDb API. It offers a dynamic and user-friendly experience with features like autocomplete, tag-based filtering, fuzzy searching, and smart ranking of search results.

## Features

- **Initial Data Preloading:** Fetches a popular list of movies on component mount.
- **Autocomplete Functionality:** Live search with debounce for efficient API usage.
- **Tag-Based Search:** Filters movies by genres, release years, and actor names.
- **Approximation Search:** Fuzzy searching to handle typos in movie titles.
- **Smart Search with Ranking:** Ranks results based on relevance, popularity, and rating.
- **Search Result Display with Skeleton Loaders:** Shows skeleton loaders during data fetching.
- **Error Handling and User Feedback:** Gracefully handles 'no results' and API errors.
- **Bonus Features:** Advanced filters and a "recently searched" feature.

## Prerequisites

- Node.js (v18 or later)
- npm or Yarn
- A TMDb API key (obtain it from [TMDb API Documentation](https://developers.themoviedb.org/3/getting-started/introduction))

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-repo/SmartSearchComponent.git
cd SmartSearchComponent
```

### Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn
```

### Environment Setup

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Open `.env` and add your TMDb API key:

```env
VITE_TMDB_API_KEY=your-api-key
VITE_TMDB_API_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
```

### Running the Project

To start the development server:

```bash
npm run dev
```

Or with Yarn:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

- Start typing in the search bar to see autocomplete suggestions.
- Click on tags to filter movies based on different criteria.
- Use the sorting options to arrange the search results.
