const express = require("express");

const startExpress = async (port, path) => {
  const app = express();
  const options = {
    dotfiles: "ignore",
    etag: false,
    extensions: ["css", "html", "json", "js"],
    index: "index.html",
    maxAge: "1d",
    redirect: false,
    setHeaders: function(response) {
      response.set("Cache-Control", "no-cache");
    }
  };

  app.use(express.static(path, options));
  console.log(`express serving ${path} on port ${port}`);
  return app.listen(port);
};

const port = 3001;
startExpress(port, "build/");

console.log(`Server running on port ${port}, press Ctrl+C to stop`);
