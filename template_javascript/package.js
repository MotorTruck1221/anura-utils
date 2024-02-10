const fs = require("fs");
const archiver = require("archiver");

fs.readFile("public/manifest.json", (err, data) => {
  if (err) throw err;
  const manifest = JSON.parse(data);
  const output = fs.createWriteStream(
    `${__dirname}/${manifest.package}.app.zip`
  );
  const archive = archiver("zip", {
    zlib: { level: 0 },
  });
  output.on("close", () => {
    console.log("Finished building anuraOS app package: " + manifest.package);
    console.log(archive.pointer() + " total bytes");
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  archive.directory("public/", false);

  archive.finalize();
});
