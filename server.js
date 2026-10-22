const http = require('http');

const PORT = 3000;

const navigation = [
  { path: '/', label: 'Welcome' },
  { path: '/home', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/species', label: 'Species' },
  { path: '/conservation', label: 'Conservation' },
  { path: '/get-involved', label: 'Get Involved' },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function buildPage(content, activePath) {
  const links = navigation
    .map(({ path, label }) => {
      const active = path === activePath ? ' aria-current="page" class="active"' : '';
      return `<a href="${path}"${active}>${label}</a>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#173d2c">
  <title>WildGuard | Wildlife Conservation</title>
  <style>
    :root {
      color-scheme: light;
      --forest: #173d2c;
      --forest-light: #28583e;
      --leaf: #dce8d6;
      --earth: #8b6240;
      --cream: #f7f5ee;
      --ink: #203329;
      --muted: #5c6a60;
      --white: #fff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--cream);
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.65;
    }
    a { color: inherit; }
    .site-header { background: var(--forest); color: var(--white); }
    .topbar {
      width: min(1120px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .brand { margin: 0; font-size: 1.6rem; letter-spacing: .04em; }
    .brand a { text-decoration: none; }
    nav { display: flex; flex-wrap: wrap; gap: .35rem; }
    nav a {
      padding: .45rem .7rem;
      border-radius: 999px;
      color: #f0f5ed;
      text-decoration: none;
      font-size: .94rem;
    }
    nav a:hover, nav a:focus-visible { background: var(--forest-light); }
    nav a.active { background: #d7e5ce; color: var(--forest); font-weight: 700; }
    .hero {
      min-height: 230px;
      padding: 3rem 1rem;
      display: grid;
      place-items: center;
      text-align: center;
      background: linear-gradient(135deg, #28583e, #173d2c 65%, #624a32);
      color: var(--white);
    }
    .hero-inner { max-width: 760px; }
    .hero h2 { margin: 0 0 .5rem; font-size: clamp(1.8rem, 5vw, 3rem); }
    .hero p { margin: 0; color: #e5eee2; font-size: 1.08rem; }
    main { width: min(1000px, calc(100% - 2rem)); min-height: 42vh; margin: 2.5rem auto 3rem; }
    h1, h2, h3 { color: var(--forest); line-height: 1.2; }
    h1 { font-size: clamp(1.8rem, 4vw, 2.5rem); }
    .lead { max-width: 760px; color: var(--muted); font-size: 1.1rem; }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 245px), 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }
    .card, .info-panel {
      padding: 1.25rem;
      border: 1px solid #e3e5dc;
      border-radius: 14px;
      background: var(--white);
      box-shadow: 0 5px 18px rgb(23 61 44 / 7%);
    }
    .card h2, .card h3 { margin-top: 0; }
    .card p:last-child { margin-bottom: 0; }
    .status {
      display: inline-block;
      margin: .15rem 0 .65rem;
      padding: .2rem .65rem;
      border-radius: 999px;
      background: var(--leaf);
      color: var(--forest);
      font-size: .84rem;
      font-weight: 700;
    }
    .info-panel { margin-top: 1.5rem; border-left: 5px solid var(--earth); }
    .info-panel p { margin: .35rem 0; overflow-wrap: anywhere; }
    .button-link {
      display: inline-block;
      margin-top: .5rem;
      padding: .7rem 1rem;
      border-radius: 8px;
      background: var(--forest);
      color: var(--white);
      text-decoration: none;
      font-weight: 700;
    }
    .button-link:hover, .button-link:focus-visible { background: var(--forest-light); }
    .site-footer { padding: 1.25rem 1rem; background: #e8e5da; color: #46534a; text-align: center; }
    .site-footer p { margin: 0; }
    @media (max-width: 640px) {
      .topbar { justify-content: center; text-align: center; }
      nav { justify-content: center; }
      .hero { min-height: 190px; padding: 2.3rem 1rem; }
      main { margin-top: 1.7rem; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="topbar">
      <p class="brand"><a href="/">WildGuard</a></p>
      <nav aria-label="Main navigation">${links}</nav>
    </div>
    <section class="hero" aria-label="WildGuard mission">
      <div class="hero-inner">
        <h2>Protecting wildlife. Preserving our wild places.</h2>
        <p>Healthy habitats and thriving species make a stronger future for us all.</p>
      </div>
    </section>
  </header>
  <main>${content}</main>
  <footer class="site-footer">
    <p>&copy; 2026 WildGuard Wildlife Conservation. Learn, care, and take action.</p>
  </footer>
</body>
</html>`;
}

function renderCards(items) {
  return `<div class="card-grid">${items
    .map(
      (item) => `<article class="card">
        <h2>${item.title}</h2>
        ${item.status ? `<span class="status">${item.status}</span>` : ''}
        <p>${item.description}</p>
      </article>`,
    )
    .join('')}</div>`;
}

const species = [
  { title: 'Bengal Tiger', status: 'Endangered', description: 'A powerful striped cat whose survival depends on connected forests and healthy prey populations.' },
  { title: 'African Elephant', status: 'Endangered', description: 'The largest land animal helps shape savannas and disperse seeds across long distances.' },
  { title: 'Giant Panda', status: 'Vulnerable', description: 'Pandas spend much of each day eating bamboo and rely on protected mountain forests.' },
  { title: 'Snow Leopard', status: 'Vulnerable', description: 'This elusive big cat is adapted to life among the high, rugged mountains of Central Asia.' },
  { title: 'Orangutan', status: 'Critically Endangered', description: 'An intelligent great ape that spends most of its life in the tropical forest canopy.' },
  { title: 'Blue Whale', status: 'Endangered', description: 'The largest animal on Earth communicates across vast ocean distances with low-frequency calls.' },
];

const pages = {
  '/': {
    title: 'Welcome',
    content: (request) => `<h1>Welcome to WildGuard!</h1>
      <p class="lead">This is a server-side application.</p>
      <p>WildGuard works to protect endangered wildlife, restore habitats, and inspire communities to live in harmony with nature.</p>
      <div class="info-panel" aria-label="Request information">
        <h2>Request Information</h2>
        <p><strong>Request URL:</strong> ${escapeHtml(request.url)}</p>
        <p><strong>Request Method:</strong> ${escapeHtml(request.method)}</p>
      </div>
      <a class="button-link" href="/get-involved">Join the effort</a>`,
  },
  '/home': {
    title: 'Home',
    content: () => `<h1>Welcome to the Home Page</h1>
      <p class="lead">Small, sustained conservation actions can help wildlife and people thrive together.</p>
      ${renderCards([
        { title: 'Living habitats', description: 'Restore forests, grasslands, wetlands, and ocean ecosystems so wildlife has room to recover.' },
        { title: 'Safer wildlife', description: 'Support field teams and community partnerships that reduce threats to vulnerable species.' },
        { title: 'People in partnership', description: 'Share practical conservation knowledge and create locally led paths to a sustainable future.' },
      ])}`,
  },
  '/about': {
    title: 'About',
    content: () => `<h1>About Us</h1>
      <p class="lead">WildGuard brings conservation, research, and community action together for a healthier natural world.</p>
      ${renderCards([
        { title: 'Our mission', description: 'Protect wildlife and restore the ecosystems on which all life depends.' },
        { title: 'Our vision', description: 'A future where nature is valued, habitats are thriving, and people and wildlife coexist.' },
        { title: 'Our team', description: 'Conservationists, educators, researchers, and community partners working toward shared goals.' },
      ])}`,
  },
  '/species': {
    title: 'Species',
    content: () => `<h1>Species We Protect</h1>
      <p class="lead">Meet six remarkable species and learn why protecting their habitats matters.</p>
      ${renderCards(species)}`,
  },
  '/conservation': {
    title: 'Conservation',
    content: () => `<h1>Conservation in Action</h1>
      <p class="lead">Lasting conservation combines healthy habitats, informed communities, and reliable evidence.</p>
      ${renderCards([
        { title: 'Habitat restoration', description: 'Rebuild and reconnect forests, wetlands, grasslands, and other vital habitats.' },
        { title: 'Anti-poaching patrols', description: 'Support trained, locally connected patrols that deter illegal wildlife activity.' },
        { title: 'Community education', description: 'Share conservation learning and support communities as stewards of local nature.' },
        { title: 'Research and monitoring', description: 'Use field research and monitoring to understand wildlife needs and measure progress.' },
      ])}`,
  },
  '/get-involved': {
    title: 'Get Involved',
    content: () => `<h1>Get Involved</h1>
      <p class="lead">Everyone can play a part in making a safer future for wildlife.</p>
      ${renderCards([
        { title: 'Donate', description: 'Contribute to conservation work that protects species and restores habitats.' },
        { title: 'Volunteer', description: 'Offer your time and skills to support local nature and wildlife initiatives.' },
        { title: 'Spread awareness', description: 'Share reliable information and encourage others to make wildlife-friendly choices.' },
        { title: 'Adopt a species', description: 'Choose a species to learn about and champion through everyday conversations and action.' },
      ])}`,
  },
};

function handleRequest(req, res) {
  let pathname;
  try {
    pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  } catch (error) {
    const body = buildPage('<h1>400 - Bad Request</h1><p>The request URL could not be read.</p>', '');
    // res.writeHead() sets the response status code and headers once for this response.
    res.writeHead(400, { 'Content-Type': 'text/html' });
    // res.end() sends the completed HTML response and closes the response stream.
    res.end(body);
    return;
  }

  const page = pages[pathname];
  const statusCode = page ? 200 : 404;
  const content = page
    ? page.content(req)
    : '<h1>404 - Page Not Found</h1><p>Sorry, that page is not part of WildGuard.</p><a class="button-link" href="/">Return to the welcome page</a>';
  const body = buildPage(content, page ? pathname : '');

  // res.writeHead() sets the response status code and headers once for this response.
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  // res.end() sends the completed HTML response and closes the response stream.
  res.end(body);
}

if (require.main === module) {
  // http.createServer() creates the HTTP server and runs this callback for each incoming request.
  const server = http.createServer(handleRequest);

  // server.listen() starts accepting HTTP connections on the selected port.
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = handleRequest;
