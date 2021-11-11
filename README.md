# URL Shortener Microservice

Challenge for the "Backend development and APIs" module of [FreeCodeCamp.org](https://www.freecodecamp.org/).

---

## User stories

- You should provide your own project, not the example URL.

- You can POST a URL to `/api/shorturl` and get a JSON response with `original_url` and `short_url` properties.
  Example: `{ original_url : 'https://freeCodeCamp.org', short_url : 1}`

- When you visit `/api/shorturl/<short_url>`, you will be redirected to the original URL.

- If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain `{ error: 'invalid url' }`.

## Usage examples:

### GET:

- **/api/shorturl/3**

  Will redirect to: https://forum.freecodecamp.org

### POST:

- **/api/shorturl**

  - URL: `https://www.google.es`

  - Output: `{"original_url":"https://www.google.com","short_url":1}`

- **/api/shorturl**

  - URL: `this_is_not_a_valid_url`

  - Output: `{"error": "invalid url"}`
