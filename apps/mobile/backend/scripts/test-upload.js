import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const boundary = "----FormBoundary" + Math.random().toString(36).slice(2);
const filePath = path.join(__dirname, "test-image.jpg");
const fileData = fs.readFileSync(filePath);

const body = Buffer.concat([
  Buffer.from("--" + boundary + "\r\nContent-Disposition: form-data; name=\"cover\"; filename=\"test.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n"),
  fileData,
  Buffer.from("\r\n--" + boundary + "--\r\n"),
]);

function doRequest(hostname, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port: 443,
      path,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data; boundary=" + boundary,
        "Content-Length": body.length,
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location;
          console.log(`Redirect ${res.statusCode} -> ${loc}`);
          const url = new URL(loc);
          doRequest(url.hostname, url.pathname + url.search).then(resolve).catch(reject);
        } else {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

doRequest("clintapp-backend.vercel.app", "/api/books/upload-cover")
  .then((r) => {
    console.log("Final Status:", r.status);
    console.log("Response:", r.body);
  })
  .catch((e) => console.log("Error:", e.message));
