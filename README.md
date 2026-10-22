# Ex. No. 10: WildGuard Wildlife Conservation Website

WildGuard is a responsive wildlife conservation website served by a small Node.js HTTP server using only built-in modules.

**Live demo:** Run the project locally at http://localhost:3000. No external images, packages, or services are needed.

## Objective

To develop a server-side application using Node.js that creates an HTTP server, handles browser requests through routes, and responds with HTML pages.

## Description

WildGuard presents wildlife conservation information through a shared page layout and six pages: a welcome page, home, about, species, conservation, and get involved. Unknown routes return a styled 404 response. The server is implemented with Node.js's built-in `http` module and has no runtime dependencies.

## Procedure

1. Install Node.js and open a terminal in the `NodeServerApp` folder.
2. Start the server with `node server.js` or `npm start`.
3. Open `http://localhost:3000` in a browser.
4. Use the navigation links to visit each page. Visit an unknown route, such as `/xyz`, to see the 404 page.
5. Stop the server with `Ctrl+C`.

## Sample Code

The server creates one shared layout and selects page content from the request URL:

```js
const http = require('http');

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  const page = pages[pathname];
  const statusCode = page ? 200 : 404;
  const content = page
    ? page.content(req)
    : '<h1>404 - Page Not Found</h1><a href="/">Return home</a>';

  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(buildPage(content, page ? pathname : ''));
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

The complete implementation, including the page content and inline CSS, is in `server.js`.

## Execution

From this project folder, run:

```text
node server.js
```

Alternatively, run `npm start`. The terminal prints `Server running at http://localhost:3000`. The default port is `3000`; change the `PORT` constant near the top of `server.js` to use another available port.

## Expected Output

- The terminal displays `Server running at http://localhost:3000`.
- The browser shows the WildGuard welcome page at `/` and the relevant page content at each supported route.
- Valid routes respond with HTTP status `200`.
- An unsupported path such as `/xyz` displays `404 - Page Not Found` and responds with status `404`.
- The welcome page displays the request URL and method.

## Complete Website Explanation

### What WildGuard is

WildGuard is a sample wildlife conservation website. Its purpose is to introduce threatened species, explain conservation work, and encourage visitors to support wildlife and habitat protection.

### Pages and routes

| URL | Page name | What it shows |
| --- | --- | --- |
| `/` | Welcome | Welcome heading, server-side application line, mission statement, and request URL and method |
| `/home` | Home | Featured highlights about habitats, wildlife safety, and community partnerships |
| `/about` | About Us | WildGuard's mission, vision, and team |
| `/species` | Species We Protect | Cards for Bengal Tiger, African Elephant, Giant Panda, Snow Leopard, Orangutan, and Blue Whale, each with a conservation status and fact |
| `/conservation` | Conservation in Action | Habitat restoration, anti-poaching patrols, community education, and research and monitoring |
| `/get-involved` | Get Involved | Ways to donate, volunteer, spread awareness, and adopt a species |
| Any other URL, such as `/xyz` | Not Found | A 404 heading and a link back to the welcome page |

### Shared layout and routing

The `buildPage(content, activePath)` helper wraps route-specific content in a complete HTML document. It supplies the common header, navigation, hero banner, inline CSS, main region, and footer. It also highlights the active navigation link. Route definitions provide only their page-specific content, so shared structure stays consistent.

The server parses the URL path from `req.url` with the built-in `URL` class and uses that path to look up an entry in the `pages` object. Query strings do not prevent a matching route. The welcome page separately displays the original request URL and HTTP method; those values are HTML-escaped before insertion.

### How a request and response work

1. A browser or other client sends an HTTP request to the server.
2. The callback passed to `http.createServer()` runs with the request (`req`) and response (`res`) objects.
3. The server reads the URL path, selects the matching page, and chooses status `200` or `404`.
4. `res.writeHead()` sets that response's status code and `Content-Type` header once.
5. `res.end()` sends the completed HTML and finishes the response.

If the URL cannot be parsed, the server returns a `400 Bad Request` HTML response.

### Why the 404 route exists

The 404 route gives visitors a clear result when they request a path that the site does not provide. It sets the correct HTTP status and includes a direct link back to the welcome page instead of leaving the request without a useful response.

### Design and responsiveness

The site uses forest greens, earthy brown accents, a light neutral background, readable system fonts, a prominent hero banner, and white content cards. All styling is inline in a `<style>` tag. Responsive grid sizing, flexible navigation, and a small-screen media query adapt the layout to phones and larger screens. No external images or assets are required.

### Project folder structure

```text
NodeServerApp/
|-- .gitignore
|-- package.json
|-- README.md
`-- server.js
```

### Running the server and changing the port

Run `node server.js` or `npm start` from `NodeServerApp`. The server listens on port `3000`. To use a different port, edit `const PORT = 3000;` in `server.js`, then restart the server and use the corresponding port in the browser URL.

## Sample Questions

### a) What is Node.js and why is it used for server-side development?

Node.js is a JavaScript runtime built on the V8 engine. It lets developers run JavaScript outside a browser, including on servers, where it can handle network requests and return application responses.

### b) What is the purpose of the built-in http module?

The `http` module provides built-in tools for creating HTTP servers and handling HTTP requests and responses. This project uses it without installing any third-party server framework.

### c) Explain `http.createServer()` and `server.listen()`.

`http.createServer()` creates an HTTP server and registers a callback that receives each request and its response object. `server.listen()` starts the server on a port so clients can connect.

### d) What is the purpose of `res.writeHead()` and `res.end()`?

`res.writeHead()` sets the HTTP status code and response headers, such as the content type. `res.end()` sends the response body and signals that the response is complete.

### e) How were the `/home` and `/about` routes implemented?

The `/home` and `/about` entries are properties of the `pages` object, keyed by their URL paths. Each supplies a content function. The request handler looks up the parsed path, passes the resulting content to the shared `buildPage()` layout helper, and sends it with status `200`.

## Result

A basic server-side application was developed and executed successfully using Node.js. The application creates an HTTP server, handles client requests, and returns an HTML response through a web browser.
