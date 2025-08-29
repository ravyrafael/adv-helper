const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

// Função para converter PDF em imagens PNG
async function convertPdfToImages(pdfPath, outputDir) {
  try {
    // Dynamic import do módulo ES6
    const { pdf } = await import("pdf-to-img");

    let counter = 1;
    const images = [];

    // Configurar conversão com alta qualidade
    const document = await pdf(pdfPath, {
      scale: 3, // Escala 3x para alta qualidade (equivalente a ~300 DPI)
    });

    // Converter cada página
    for await (const image of document) {
      const filename = `page.${counter}.png`;
      const imagePath = path.join(outputDir, filename);

      // Salvar imagem
      await fs.writeFile(imagePath, image);

      images.push({
        page: counter,
        filename: filename,
        path: imagePath,
        size: image.length,
      });

      counter++;
    }

    return images;
  } catch (error) {
    throw new Error(`Erro na conversão: ${error.message}`);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos PDF são permitidos"), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Endpoint de teste
app.get("/", (req, res) => {
  res.json({
    message: "API de Auxílio de Advocacia - Conversão de PDF para Imagem",
    version: "1.0.0",
    endpoints: {
      upload: "POST /api/convert-pdf",
      conversions: "GET /api/conversions",
      health: "GET /health",
    },
    features: [
      "Conversão de PDF para imagens PNG",
      "Alta qualidade (escala 3x)",
      "Processamento página por página",
      "Armazenamento organizado no disco",
    ],
  });
});

// Endpoint de saúde
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Endpoint principal para conversão de PDF
app.post("/api/convert-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo PDF foi enviado" });
    }

    const inputPath = req.file.path;
    const outputDir = path.join("output", path.parse(req.file.filename).name);

    // Criar diretório de saída se não existir
    await fs.ensureDir(outputDir);

    // Converter PDF em imagens PNG
    const imageFiles = await convertPdfToImages(inputPath, outputDir);

    // Limpar arquivo PDF temporário
    await fs.remove(inputPath);

    res.json({
      success: true,
      message: "PDF convertido em imagens com sucesso",
      originalFile: req.file.originalname,
      totalPages: imageFiles.length,
      outputDirectory: outputDir,
      images: imageFiles,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro na conversão:", error);

    // Limpar arquivo em caso de erro
    if (req.file && req.file.path) {
      try {
        await fs.remove(req.file.path);
      } catch (cleanupError) {
        console.error("Erro ao limpar arquivo:", cleanupError);
      }
    }

    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Endpoint para listar conversões
app.get("/api/conversions", async (req, res) => {
  try {
    const outputPath = path.join(__dirname, "..", "output");
    const directories = await fs.readdir(outputPath);

    const conversions = await Promise.all(
      directories.map(async (dir) => {
        const dirPath = path.join(outputPath, dir);
        const stat = await fs.stat(dirPath);

        if (stat.isDirectory()) {
          const files = await fs.readdir(dirPath);
          const imageFiles = files.filter((file) => file.endsWith(".png"));

          return {
            id: dir,
            createdAt: stat.birthtime,
            totalPages: imageFiles.length,
            imageFiles: imageFiles.length,
            path: dirPath,
          };
        }
        return null;
      })
    );

    res.json({
      conversions: conversions
        .filter(Boolean)
        .sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (error) {
    console.error("Erro ao listar conversões:", error);
    res.status(500).json({ error: "Erro ao listar conversões" });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Arquivo muito grande. Máximo permitido: 50MB" });
    }
  }

  console.error("Erro não tratado:", error);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Diretório de uploads: ${path.resolve("uploads")}`);
  console.log(`📁 Diretório de saída: ${path.resolve("output")}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

module.exports = app;
