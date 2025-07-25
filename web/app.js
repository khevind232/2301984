const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("views"));

function isXSS(input) {
  const xssPattern = /<[^>]+>|(script|onerror|onload|javascript:)/i;
  return xssPattern.test(input);
}

function isSQLInjection(input) {
  const sqlPattern = /('|--|;|\/\*|\*\/|xp_|exec|select|insert|delete|drop|union|update)/i;
  return sqlPattern.test(input);
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/search", (req, res) => {
  const input = req.body.search;

  if (isXSS(input) || isSQLInjection(input)) {
    res.sendFile(path.join(__dirname, "views", "index.html"));
  } else {
    res.send(`
      <html>
        <body>
          <h2>Search Term: ${input}</h2>
          <form action="/" method="get">
            <button type="submit">Go Back</button>
          </form>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`);
});
