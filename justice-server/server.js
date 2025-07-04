const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { fromPath } = require("pdf2pic");
const Tesseract = require("tesseract.js");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use("/files", express.static(path.join(__dirname, "public")));

app.post("/api/summarize", upload.single("file"), async (req, res) => {
  const tempPath = req.file.path;
  const originalName = req.file.originalname;
  const sanitized = originalName.replace(/[^a-z0-9.\-]/gi, "_");
  const finalPath = path.join(__dirname, "public", sanitized);

  try {
    fs.renameSync(tempPath, finalPath);
    console.log("📥 File received:", originalName);
    console.log("📂 Saved at:", finalPath);

    const dataBuffer = fs.readFileSync(finalPath);
    console.log("🧪 Attempting to parse PDF...");

    const parsed = await pdfParse(dataBuffer);
    const cleanText = parsed.text.trim();

    const wordCount = (cleanText.match(/[a-zA-Z]{3,}/g) || []).length;
    const isJunk = cleanText.length < 100 || /%PDF|obj|stream|endobj/i.test(cleanText);

    if (wordCount > 5 && !isJunk) {
      console.log("✅ Clean text detected, summary returning.");
      return res.json({
        summary: cleanText.substring(0, 500),
        fileURL: `/files/${sanitized}`,
        fileName: originalName,
      });
    }

    console.log("🧪 Triggering OCR...");
    const convert = fromPath(finalPath, {
      density: 200,
      format: "png",
      width: 1200,
      height: 1600,
      savePath: "./uploads",
    });

    const image = await convert(1, true);
    const ocrResult = await Tesseract.recognize(image.path, "eng");
    const ocrText = ocrResult.data.text;
    console.log("✅ OCR complete. Summary extracted.");

    res.json({
      summary: ocrText.trim().substring(0, 500) || "OCR failed to extract text.",
      fileURL: `/files/${sanitized}`,
      fileName: originalName,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Failed to summarize file." });
  }
});

app.listen(3000, () => {
  console.log("✅ Justice server running at http://localhost:3000");
});
