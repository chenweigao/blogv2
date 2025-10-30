// docs/.vitepress/config.js
import { defineConfig } from "file:///Users/weigao/Documents/_work/99_code/blogv2/node_modules/.pnpm/vitepress@1.6.4_@algolia+client-search@5.40.1_@types+node@24.8.1_markdown-it-mathjax3@4.3.2_p_pmzrihjxswcqlhacqgpemyrpwa/node_modules/vitepress/dist/node/index.js";

// docs/.vitepress/utils/generateTimeline.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// docs/.vitepress/utils/frontmatter.js
import yaml from "file:///Users/weigao/Documents/_work/99_code/blogv2/node_modules/.pnpm/js-yaml@4.1.0/node_modules/js-yaml/dist/js-yaml.mjs";
function parseFrontmatter(content = "") {
  if (typeof content !== "string") return {};
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  try {
    const data = yaml.load(match[1]);
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

// docs/.vitepress/utils/generateTimeline.js
var __vite_injected_original_import_meta_url = "file:///Users/weigao/Documents/_work/99_code/blogv2/docs/.vitepress/utils/generateTimeline.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
function generateTimelineData() {
  const docsDir = path.resolve(__dirname, "../../");
  const timelineData = [];
  function scanDirectory2(dir, relativePath = "") {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (item.startsWith(".") || item === "node_modules" || item === "public") {
        continue;
      }
      if (stat.isDirectory()) {
        scanDirectory2(fullPath, path.join(relativePath, item));
      } else if (item.endsWith(".md") && item !== "index.md") {
        const relativeFilePath = path.join(relativePath, item);
        const fileContent = fs.readFileSync(fullPath, "utf-8");
        const frontmatter = parseFrontmatter(fileContent);
        let title = frontmatter?.title;
        if (!title) {
          const titleMatch = fileContent.match(/^#\s+(.+)$/m);
          title = titleMatch ? titleMatch[1] : item.replace(".md", "");
        }
        let description = frontmatter?.description;
        if (!description) {
          const contentWithoutFrontmatter = frontmatter && Object.keys(frontmatter).length > 0 ? fileContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "") : fileContent;
          const paragraphs = contentWithoutFrontmatter.split("\n").filter(
            (line) => line.trim() && !line.startsWith("#") && !line.startsWith("```")
          );
          description = paragraphs[0] ? paragraphs[0].substring(0, 150) + "..." : "";
        }
        const createTime = frontmatter?.date || stat.birthtime;
        const updateTime = frontmatter?.updated || stat.mtime;
        const category = relativePath.split(path.sep)[0] || "general";
        timelineData.push({
          title,
          description,
          path: "/" + relativeFilePath.replace(/\\/g, "/").replace(".md", ""),
          category,
          createTime: new Date(createTime).toISOString(),
          updateTime: new Date(updateTime).toISOString(),
          tags: Array.isArray(frontmatter?.tags) ? frontmatter.tags : typeof frontmatter?.tags === "string" ? frontmatter.tags.split(",").map((t) => t.trim()).filter(Boolean) : []
        });
      }
    }
  }
  scanDirectory2(docsDir);
  timelineData.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  return timelineData;
}
function writeTimelineData() {
  const timelineData = generateTimelineData();
  const outputPath = path.resolve(__dirname, "../data/timeline.json");
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(timelineData, null, 2));
  console.log(`Timeline data generated: ${timelineData.length} articles`);
  return timelineData;
}
if (__vite_injected_original_import_meta_url === `file://${process.argv[1]}`) {
  writeTimelineData();
}

// docs/.vitepress/utils/generateGitHistoryData.js
import fs2 from "fs";
import path2 from "path";
import { execSync } from "child_process";
import { fileURLToPath as fileURLToPath2 } from "url";
var __vite_injected_original_import_meta_url2 = "file:///Users/weigao/Documents/_work/99_code/blogv2/docs/.vitepress/utils/generateGitHistoryData.js";
var __filename2 = fileURLToPath2(__vite_injected_original_import_meta_url2);
var __dirname2 = path2.dirname(__filename2);
function getFileGitHistory(filePath, maxEntries = 10) {
  try {
    const repoRoot = path2.resolve(__dirname2, "../../../");
    const gitCommand = `git log --follow --format="%h|%an|%ad|%s" --date=short -${maxEntries} -- "${filePath}"`;
    const output = execSync(gitCommand, {
      cwd: repoRoot,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    });
    if (!output.trim()) {
      return [];
    }
    return output.trim().split("\n").map((line) => {
      const [hash, author, date, subject] = line.split("|");
      return {
        hash: hash?.trim(),
        author: author?.trim(),
        date: date?.trim(),
        subject: subject?.trim()
      };
    }).filter((entry) => entry.hash);
  } catch (error) {
    console.warn(`Failed to get git history for ${filePath}:`, error.message);
    return [];
  }
}
function generateAllGitHistoryData() {
  const docsDir = path2.resolve(__dirname2, "../../");
  const historyData = {};
  let processedCount = 0;
  function scanDirectory2(dir, relativePath = "") {
    const items = fs2.readdirSync(dir);
    for (const item of items) {
      const fullPath = path2.join(dir, item);
      const stat = fs2.statSync(fullPath);
      if (item.startsWith(".") || item === "node_modules" || item === "public") {
        continue;
      }
      if (stat.isDirectory()) {
        scanDirectory2(fullPath, path2.join(relativePath, item));
      } else if (item.endsWith(".md") && item !== "timeline.md") {
        const relativeFilePath = path2.join(relativePath, item).replace(/\\/g, "/");
        const repoRelativePath = `docs/${relativeFilePath}`;
        const history = getFileGitHistory(repoRelativePath);
        const docPath = "/" + relativeFilePath.replace(".md", "");
        historyData[docPath] = {
          filePath: relativeFilePath,
          history,
          lastUpdated: history.length > 0 ? history[0].date : null,
          totalCommits: history.length
        };
        processedCount++;
        console.log(`Processed git history for: ${relativeFilePath}`);
      }
    }
  }
  console.log("Starting to generate git history data for all documents...");
  scanDirectory2(docsDir);
  console.log(`Git history data generation completed. Processed ${processedCount} files.`);
  return historyData;
}
function writeGitHistoryData() {
  const historyData = generateAllGitHistoryData();
  const outputPath = path2.resolve(__dirname2, "../data/git-history.json");
  const outputDir = path2.dirname(outputPath);
  if (!fs2.existsSync(outputDir)) {
    fs2.mkdirSync(outputDir, { recursive: true });
  }
  fs2.writeFileSync(outputPath, JSON.stringify(historyData, null, 2));
  console.log(`Git history data written to: ${outputPath}`);
  console.log(`Total documents processed: ${Object.keys(historyData).length}`);
  return historyData;
}
if (__vite_injected_original_import_meta_url2 === `file://${process.argv[1]}`) {
  writeGitHistoryData();
}

// docs/.vitepress/utils/gitHistoryAPI.js
import { spawn } from "child_process";
import path3 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
var __vite_injected_original_import_meta_url3 = "file:///Users/weigao/Documents/_work/99_code/blogv2/docs/.vitepress/utils/gitHistoryAPI.js";
var __filename3 = fileURLToPath3(__vite_injected_original_import_meta_url3);
var __dirname3 = path3.dirname(__filename3);
function isSafeRelativePath(p) {
  if (!p || typeof p !== "string") return false;
  if (p.includes("\0")) return false;
  if (p.startsWith("/") || p.startsWith("\\")) return false;
  if (p.includes("..")) return false;
  return true;
}
async function getRealtimeGitHistory(filePath, maxEntries = 10) {
  return new Promise((resolve, reject) => {
    try {
      const repoRoot = path3.resolve(__dirname3, "../../../");
      if (!isSafeRelativePath(filePath)) {
        return reject(new Error("Invalid file path"));
      }
      const docsDir = path3.resolve(repoRoot, "docs");
      const resolved = path3.resolve(docsDir, filePath);
      if (!resolved.startsWith(docsDir)) {
        return reject(new Error("Path outside docs directory"));
      }
      const limit = Math.max(1, Math.min(Number(maxEntries) || 10, 100));
      const args = [
        "log",
        "--follow",
        "--format=%h|%an|%ad|%s",
        "--date=short",
        `-${limit}`,
        "--",
        path3.relative(repoRoot, resolved)
      ];
      const child = spawn("git", args, { cwd: repoRoot });
      let stdout = "";
      let stderr = "";
      const timeoutMs = 3e3;
      const t = setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {
        }
      }, timeoutMs);
      child.stdout.on("data", (d) => {
        stdout += String(d);
      });
      child.stderr.on("data", (d) => {
        stderr += String(d);
      });
      child.on("error", (err) => {
        clearTimeout(t);
        reject(err);
      });
      child.on("close", (code) => {
        clearTimeout(t);
        if (code !== 0) {
          return reject(new Error(stderr.trim() || `git exited with code ${code}`));
        }
        const out = stdout.trim();
        if (!out) return resolve([]);
        const history = out.split("\n").map((line) => {
          const [hash, author, date, subject] = line.split("|");
          return {
            hash: hash?.trim(),
            author: author?.trim(),
            date: date?.trim(),
            subject: subject?.trim()
          };
        }).filter((e) => e.hash);
        resolve(history);
      });
    } catch (error) {
      reject(error);
    }
  });
}
function createGitHistoryAPI() {
  return {
    name: "git-history-api",
    configureServer(server) {
      server.middlewares.use("/api/git-history", async (req, res, next) => {
        if (req.method !== "GET") {
          return next();
        }
        const url = new URL(req.url, `http://${req.headers.host}`);
        const filePath = url.searchParams.get("file");
        const maxParam = parseInt(url.searchParams.get("max") || "10", 10);
        const maxEntries = Number.isFinite(maxParam) ? Math.max(1, Math.min(maxParam, 100)) : 10;
        if (!filePath) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Missing file parameter" }));
          return;
        }
        try {
          const history = await getRealtimeGitHistory(filePath, maxEntries);
          const origin = req.headers.origin;
          if (origin) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Vary", "Origin");
            res.setHeader("Access-Control-Allow-Methods", "GET");
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            filePath,
            history,
            lastUpdated: history.length > 0 ? history[0].date : null,
            totalCommits: history.length
          }));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}

// docs/.vitepress/utils/generateSidebar.js
import fs3 from "fs";
import path4 from "path";
var __vite_injected_original_import_meta_url4 = "file:///Users/weigao/Documents/_work/99_code/blogv2/docs/.vitepress/utils/generateSidebar.js";
var IGNORE_PATTERNS = [
  ".vitepress",
  "node_modules",
  ".git",
  ".DS_Store",
  "index.md",
  "README.md"
];
function formatTitle(filename) {
  return filename.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()).trim();
}
function getDisplayTitle(filePath, name, isFile = false) {
  if (isFile) {
    const frontmatter = extractFrontmatter(filePath);
    if (frontmatter.title) {
      return frontmatter.title;
    }
    const nameWithoutExt = path4.parse(name).name;
    return formatTitle(nameWithoutExt);
  } else {
    return formatTitle(name);
  }
}
function shouldIgnore(name, isFile = false) {
  if (IGNORE_PATTERNS.some((pattern) => name.includes(pattern))) {
    return true;
  }
  if (name.startsWith(".")) {
    return true;
  }
  if (isFile) {
    const ext = path4.extname(name).toLowerCase();
    if (ext !== ".md") {
      return true;
    }
  }
  return false;
}
function scanDirectory(dirPath, basePath = "", depth = 0) {
  const items = [];
  try {
    const entries = fs3.readdirSync(dirPath, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory() && !shouldIgnore(entry.name));
    const files = entries.filter((entry) => entry.isFile() && !shouldIgnore(entry.name, true));
    directories.forEach((dir) => {
      const dirFullPath = path4.join(dirPath, dir.name);
      const dirLinkPath = path4.posix.join(basePath, dir.name);
      const hasMarkdownFiles = hasMarkdownFilesRecursive(dirFullPath);
      if (hasMarkdownFiles) {
        const subItems = scanDirectory(dirFullPath, dirLinkPath, depth + 1);
        if (subItems.length > 0) {
          items.push({
            text: getDisplayTitle(dirFullPath, dir.name),
            collapsed: depth > 0,
            // 第一级不折叠，其他级别默认折叠
            items: subItems
          });
        }
      }
    });
    files.forEach((file) => {
      const fileFullPath = path4.join(dirPath, file.name);
      const fileName = path4.parse(file.name).name;
      const fileLinkPath = path4.posix.join(basePath, fileName);
      items.push({
        text: getDisplayTitle(fileFullPath, file.name, true),
        link: `/${fileLinkPath}`
      });
    });
  } catch (error) {
    console.warn(`Failed to scan directory ${dirPath}:`, error.message);
  }
  return items;
}
function hasMarkdownFilesRecursive(dirPath) {
  try {
    const entries = fs3.readdirSync(dirPath, { withFileTypes: true });
    const hasMarkdown = entries.some(
      (entry) => entry.isFile() && !shouldIgnore(entry.name, true) && path4.extname(entry.name).toLowerCase() === ".md"
    );
    if (hasMarkdown) {
      return true;
    }
    const directories = entries.filter((entry) => entry.isDirectory() && !shouldIgnore(entry.name));
    return directories.some((dir) => hasMarkdownFilesRecursive(path4.join(dirPath, dir.name)));
  } catch (error) {
    return false;
  }
}
function generateSidebar(docsPath) {
  if (!docsPath) {
    const cwd = process.cwd();
    const possibleDocsPaths = [
      path4.join(cwd, "docs"),
      // 当前目录下的 docs
      path4.join(cwd, "../../../docs"),
      // 从 utils 目录回到根目录的 docs
      path4.join(cwd, "../../docs"),
      // 从 .vitepress 目录回到根目录的 docs
      path4.join(cwd, "../docs")
      // 从 config 目录回到根目录的 docs
    ];
    docsPath = possibleDocsPaths.find((p) => {
      try {
        return fs3.existsSync(p) && fs3.statSync(p).isDirectory();
      } catch {
        return false;
      }
    });
    if (!docsPath) {
      console.error("\u274C Could not find docs directory. Tried paths:", possibleDocsPaths);
      return {};
    }
  }
  console.log(`\u{1F4C1} Using docs path: ${docsPath}`);
  const sidebar2 = {};
  try {
    const entries = fs3.readdirSync(docsPath, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory() && !shouldIgnore(entry.name));
    directories.forEach((dir) => {
      const dirPath = path4.join(docsPath, dir.name);
      const sidebarKey = `/${dir.name}/`;
      const hasMarkdownFiles = hasMarkdownFilesRecursive(dirPath);
      if (hasMarkdownFiles) {
        const items = scanDirectory(dirPath, dir.name);
        if (items.length > 0) {
          sidebar2[sidebarKey] = [{
            text: getDisplayTitle(dirPath, dir.name),
            collapsed: false,
            items
          }];
        }
      }
    });
    const aiKey = "/artificial-intelligence/";
    if (sidebar2[aiKey] && Array.isArray(sidebar2[aiKey])) {
      const aiSection = sidebar2[aiKey][0];
      if (aiSection && Array.isArray(aiSection.items)) {
        const gpuComputingGroup = aiSection.items.find((group) => group && group.text === "Gpu Computing");
        if (gpuComputingGroup && Array.isArray(gpuComputingGroup.items)) {
          const exists = gpuComputingGroup.items.some((item) => item.link === "/ptx.html");
          if (!exists) {
            gpuComputingGroup.items.push({
              text: "NVIDIA PTX \u6280\u672F\u8BE6\u89E3 (HTML)",
              link: "/ptx.html"
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to generate sidebar:", error.message);
  }
  return sidebar2;
}
function writeSidebarConfig(sidebar2, outputPath) {
  if (!outputPath) {
    const cwd = process.cwd();
    const possibleOutputPaths = [
      path4.join(cwd, "docs/.vitepress/config/sidebar/auto-generated.js"),
      path4.join(cwd, "../../../docs/.vitepress/config/sidebar/auto-generated.js"),
      path4.join(cwd, "../../config/sidebar/auto-generated.js"),
      path4.join(cwd, "../sidebar/auto-generated.js")
    ];
    outputPath = possibleOutputPaths.find((p) => {
      try {
        const dir = path4.dirname(p);
        return fs3.existsSync(dir);
      } catch {
        return false;
      }
    });
    if (!outputPath) {
      outputPath = possibleOutputPaths[0];
    }
  }
  try {
    const configContent = `// \u81EA\u52A8\u751F\u6210\u7684\u4FA7\u8FB9\u680F\u914D\u7F6E
// \u6B64\u6587\u4EF6\u7531 generateSidebar.js \u81EA\u52A8\u751F\u6210\uFF0C\u8BF7\u52FF\u624B\u52A8\u4FEE\u6539

export const autoGeneratedSidebar = ${JSON.stringify(sidebar2, null, 2)}
`;
    const outputDir = path4.dirname(outputPath);
    if (!fs3.existsSync(outputDir)) {
      fs3.mkdirSync(outputDir, { recursive: true });
    }
    fs3.writeFileSync(outputPath, configContent, "utf-8");
    console.log(`\u2705 Sidebar configuration written to: ${outputPath}`);
  } catch (error) {
    console.error("Failed to write sidebar configuration:", error.message);
  }
}
function generateAndWriteSidebar() {
  console.log("\u{1F504} Generating sidebar configuration...");
  const sidebar2 = generateSidebar();
  console.log(`\u{1F4CA} Generated ${Object.keys(sidebar2).length} sidebar sections`);
  writeSidebarConfig(sidebar2);
  return sidebar2;
}
if (__vite_injected_original_import_meta_url4 === `file://${process.argv[1]}`) {
  generateAndWriteSidebar();
}

// docs/.vitepress/config/sidebar/algorithms.js
var algorithmsSidebar = {
  "/algorithms/": [
    {
      text: "Algorithms & Data Structures",
      collapsed: false,
      items: [
        { text: "Overview", link: "/algorithms/" },
        { text: "README", link: "/algorithms/README" },
        { text: "Backtrack", link: "/algorithms/backtrack" },
        { text: "Sliding Window", link: "/algorithms/slide_window" },
        { text: "DFS & BFS", link: "/algorithms/dfs_bfs" },
        { text: "Binary Tree", link: "/algorithms/binary_tree" },
        { text: "Binary Search", link: "/algorithms/binary_search" },
        { text: "Dynamic Programming", link: "/algorithms/dp" },
        { text: "Sorting", link: "/algorithms/sort" },
        { text: "LCS", link: "/algorithms/lcs" },
        { text: "Prefix Sum", link: "/algorithms/presum" }
      ]
    },
    {
      text: "Data Structures",
      collapsed: false,
      items: [
        { text: "Data Structures README", link: "/algorithms/data_struct/readme" },
        { text: "Stack", link: "/algorithms/data_struct/stack" },
        { text: "HashMap", link: "/algorithms/data_struct/hashmap" },
        { text: "String", link: "/algorithms/data_struct/string" },
        { text: "Tree", link: "/algorithms/data_struct/tree" },
        { text: "Linked List", link: "/algorithms/data_struct/linkedlist" }
      ]
    }
  ]
};

// docs/.vitepress/config/sidebar/artificial-intelligence.js
var artificialIntelligenceSidebar = {
  "/artificial-intelligence/": [
    {
      text: "AI Infrastructure Overview",
      collapsed: false,
      items: [
        { text: "Overview", link: "/artificial-intelligence/" }
      ]
    },
    {
      text: "Hardware Acceleration",
      collapsed: false,
      items: [
        { text: "GPU Architecture", link: "/artificial-intelligence/gpu-computing/gpu_arch" },
        { text: "GPU Communication", link: "/artificial-intelligence/gpu-computing/gpu_communication" },
        { text: "Intel AMX & OpenVINO", link: "/artificial-intelligence/AMX/openvino" }
      ]
    },
    {
      text: "Infrastructure & Operations",
      collapsed: false,
      items: [
        { text: "Model Optimization", link: "/artificial-intelligence/model-optimization/" },
        { text: "Monitoring & Operations", link: "/artificial-intelligence/monitoring-ops/" },
        { text: "Cloud Platforms", link: "/artificial-intelligence/cloud-platforms/" },
        { text: "Training Frameworks", link: "/artificial-intelligence/training-frameworks/" }
      ]
    },
    {
      text: "Research & Papers",
      collapsed: true,
      items: [
        { text: "SAC - ISCA 23", link: "/artificial-intelligence/gpu-computing/SAC - ISCA 23" }
      ]
    }
  ]
};

// docs/.vitepress/config/sidebar/computer-systems.js
var computerSystemsSidebar = {
  "/computer-systems/cpu-gpu/": [
    {
      text: "CPU \u6982\u8FF0",
      collapsed: false,
      items: [
        { text: "CPU \u67B6\u6784\u6982\u89C8", link: "/computer-systems/cpu-gpu/" },
        { text: "README", link: "/computer-systems/cpu-gpu/README" }
      ]
    },
    {
      text: "CPU \u57FA\u7840\u67B6\u6784",
      collapsed: false,
      items: [
        { text: "\u6D41\u6C34\u7EBF (Pipeline)", link: "/computer-systems/cpu-gpu/cpu-architecture/pipeline-performance/pipline" },
        { text: "\u7F13\u5B58\u7CFB\u7EDF (Cache)", link: "/computer-systems/cpu-gpu/cpu-architecture/memory-systems/cache" },
        { text: "\u5185\u5B58\u7BA1\u7406\u5355\u5143 (MMU)", link: "/computer-systems/cpu-gpu/cpu-architecture/memory-systems/MMU" },
        { text: "\u865A\u62DF\u5185\u5B58\u4E0E\u5206\u9875", link: "/computer-systems/cpu-gpu/cpu-architecture/memory-systems/memory_va_page" }
      ]
    },
    {
      text: "\u6307\u4EE4\u96C6\u67B6\u6784 (ISA)",
      collapsed: false,
      items: [
        { text: "x86 \u6307\u4EE4\u96C6", link: "/computer-systems/cpu-gpu/cpu-architecture/instruction-sets/x86_inst" },
        { text: "AMX \u77E9\u9635\u6269\u5C55", link: "/computer-systems/cpu-gpu/cpu-architecture/instruction-sets/amx" },
        {
          text: "ARM \u67B6\u6784",
          collapsed: true,
          items: [
            { text: "ARM \u6982\u8FF0", link: "/computer-systems/cpu-gpu/arm-architecture/" },
            { text: "ARM \u6307\u4EE4\u96C6", link: "/computer-systems/cpu-gpu/arm-architecture/arm_ins" },
            { text: "ARM \u5185\u8054\u6C47\u7F16", link: "/computer-systems/cpu-gpu/arm-architecture/arm_inline_assembly" }
          ]
        }
      ]
    },
    {
      text: "\u7CFB\u7EDF\u67B6\u6784",
      collapsed: false,
      items: [
        { text: "NUMA \u4E0E Socket", link: "/computer-systems/cpu-gpu/cpu-architecture/memory-systems/numa_socket" },
        { text: "IBS \u6307\u4EE4\u91C7\u6837", link: "/computer-systems/cpu-gpu/cpu-architecture/pipeline-performance/ibs" }
      ]
    }
  ],
  "/computer-systems/linux/": [
    {
      text: "Linux \u6982\u8FF0",
      collapsed: false,
      items: [
        { text: "Overview", link: "/computer-systems/linux/" },
        { text: "README", link: "/computer-systems/linux/README" }
      ]
    },
    {
      text: "Linux \u5DE5\u5177",
      collapsed: false,
      items: [
        { text: "\u547D\u4EE4\u884C\u5DE5\u5177", link: "/computer-systems/linux/commands-tools/command" }
      ]
    },
    {
      text: "Linux \u5185\u6838",
      collapsed: false,
      items: [
        { text: "\u5185\u6838 README", link: "/computer-systems/linux/kernel/README" },
        { text: "RCU", link: "/computer-systems/linux/kernel/process-scheduling/rcu" },
        { text: "Idle Tick", link: "/computer-systems/linux/kernel/process-scheduling/idle_tick" },
        { text: "Idle", link: "/computer-systems/linux/kernel/process-scheduling/idle" },
        { text: "I2C \u9A71\u52A8", link: "/computer-systems/linux/kernel/device-drivers/i2c" },
        { text: "BL31", link: "/computer-systems/linux/kernel/architecture/BL31" },
        { text: "THP", link: "/computer-systems/linux/kernel/memory-management/THP" },
        { text: "Notifier", link: "/computer-systems/linux/kernel/core-concepts/notifier" },
        { text: "Pthread", link: "/computer-systems/linux/kernel/core-concepts/pthread" },
        { text: "Thermal Init", link: "/computer-systems/linux/kernel/thermal-management/thermal_init" },
        { text: "Thermal", link: "/computer-systems/linux/kernel/thermal-management/thermal" }
      ]
    },
    {
      text: "\u7CFB\u7EDF\u7F16\u7A0B",
      collapsed: false,
      items: [
        { text: "\u7CFB\u7EDF\u7F16\u7A0B README", link: "/computer-systems/linux/system-programming/README" },
        { text: "Linkers & Loaders", link: "/computer-systems/linux/system-programming/linkers_loaders" },
        { text: "size_t", link: "/computer-systems/linux/system-programming/size_t" },
        { text: "C Pointer", link: "/computer-systems/linux/system-programming/c-pointer" },
        { text: "CMake", link: "/computer-systems/linux/system-programming/cmake" },
        { text: "CMake Makefile", link: "/computer-systems/linux/system-programming/cmake_makefile" }
      ]
    },
    {
      text: "\u7CFB\u7EDF\u7BA1\u7406",
      collapsed: false,
      items: [
        { text: "APT", link: "/computer-systems/linux/system-administration/apt" }
      ]
    },
    {
      text: "\u6559\u80B2\u8D44\u6E90",
      collapsed: false,
      items: [
        { text: "XV6", link: "/computer-systems/linux/educational/xv6" }
      ]
    }
  ]
};

// docs/.vitepress/config/sidebar/programming-languages.js
var programmingLanguagesSidebar = {
  "/programming-languages/java/": [
    {
      text: "Java \u57FA\u7840",
      collapsed: false,
      items: [
        { text: "Overview", link: "/programming-languages/java/" },
        { text: "Java \u6838\u5FC3\u6982\u5FF5", link: "/programming-languages/java/java/core-concepts" },
        { text: "Java \u7D22\u5F15", link: "/programming-languages/java/java/" }
      ]
    },
    {
      text: "JVM \u865A\u62DF\u673A",
      collapsed: false,
      items: [
        { text: "JVM \u5185\u5B58\u6A21\u578B", link: "/programming-languages/java/jvm/01_jvm_memory" },
        { text: "JVM \u6307\u4EE4\u96C6", link: "/programming-languages/java/jvm/jvm_inst" },
        { text: "G1 \u5783\u573E\u6536\u96C6\u5668", link: "/programming-languages/java/jvm/gc_g1" },
        { text: "Java \u53CD\u5C04\u673A\u5236", link: "/programming-languages/java/jvm/reflection" }
      ]
    },
    {
      text: "ART \u8FD0\u884C\u65F6",
      collapsed: false,
      items: [
        { text: "ART \u521B\u5EFA\u8FC7\u7A0B", link: "/programming-languages/java/art/art_create" },
        { text: "ART DEX2OAT", link: "/programming-languages/java/art/art_dex2oat" },
        { text: "ART JNI", link: "/programming-languages/java/art/art_jni" },
        { text: "ART GC \u539F\u7406", link: "/programming-languages/java/art/gc_art_01" }
      ]
    },
    {
      text: "Android \u7CFB\u7EDF",
      collapsed: false,
      items: [
        { text: "ADB \u8C03\u8BD5\u5DE5\u5177", link: "/programming-languages/java/android/adb" },
        { text: "Binder \u673A\u5236", link: "/programming-languages/java/android/binder" },
        { text: "Binder \u539F\u7406 (1)", link: "/programming-languages/java/android/binder_01" },
        { text: "Binder \u539F\u7406 (2)", link: "/programming-languages/java/android/binder_02" },
        { text: "IPC \u8FDB\u7A0B\u95F4\u901A\u4FE1", link: "/programming-languages/java/android/ipc" },
        { text: "Parcel \u5E8F\u5217\u5316", link: "/programming-languages/java/android/parcel" }
      ]
    }
  ],
  "/programming-languages/python/": [
    {
      text: "Python Programming",
      collapsed: false,
      items: [
        { text: "Hash", link: "/programming-languages/python/language/hash" },
        { text: "Effective Python", link: "/programming-languages/python/language/effective-python" },
        { text: "Pytest", link: "/programming-languages/python/language/pytest" },
        { text: "Python C", link: "/programming-languages/python/language/python_c" },
        { text: "Itertools", link: "/programming-languages/python/language/itertools" },
        { text: "Python Function", link: "/programming-languages/python/language/python-function" },
        { text: "Python Data Structure", link: "/programming-languages/python/language/py-data-struct" },
        { text: "Pip", link: "/programming-languages/python/language/pip" }
      ]
    },
    {
      text: "Python Tools",
      collapsed: false,
      items: [
        { text: "Virtual Environment", link: "/programming-languages/python/tools/virtualenv" },
        { text: "Python Tools", link: "/programming-languages/python/tools/py-tools" }
      ]
    }
  ]
};

// docs/.vitepress/config/sidebar/development-tools.js
var developmentToolsSidebar = {
  "/development-tools/tools/": [
    {
      text: "\u5E38\u7528\u5DE5\u5177",
      collapsed: false,
      items: [
        { text: "Tools Overview", link: "/development-tools/tools/" },
        { text: "Vim", link: "/development-tools/tools/vim" },
        { text: "VPS", link: "/development-tools/tools/vps" },
        { text: "Batch Windows", link: "/development-tools/tools/bat_win" },
        { text: "Git", link: "/development-tools/tools/git" }
      ]
    }
  ],
  "/development-tools/frameworks/": [
    {
      text: "\u5E38\u7528\u6846\u67B6",
      collapsed: false,
      items: [
        { text: "React", link: "/development-tools/frameworks/react" },
        { text: "Vue", link: "/development-tools/frameworks/vue" }
      ]
    }
  ],
  "/development-tools/database/": [
    {
      text: "\u6570\u636E\u5E93",
      collapsed: false,
      items: [
        { text: "Database Overview", link: "/development-tools/database/" },
        { text: "Redis", link: "/development-tools/database/redis" },
        { text: "Peewee", link: "/development-tools/database/peewee" },
        { text: "MySQL", link: "/development-tools/database/mysql" },
        { text: "MongoDB", link: "/development-tools/database/mongodb" }
      ]
    }
  ],
  "/development-tools/frontend/": [
    {
      text: "\u524D\u7AEF\u5F00\u53D1",
      collapsed: false,
      items: [
        { text: "HTML & CSS", link: "/development-tools/frontend/html-css" },
        { text: "JavaScript", link: "/development-tools/frontend/javascript" }
      ]
    }
  ],
  "/development-tools/networks/": [
    {
      text: "\u7F51\u7EDC\u6280\u672F",
      collapsed: false,
      items: [
        { text: "TCP/IP \u534F\u8BAE\u6808", link: "/development-tools/networks/tcp-ip" },
        { text: "HTTP/HTTPS", link: "/development-tools/networks/http-https" }
      ]
    }
  ],
  "/development-tools/cloud-server/": [
    {
      text: "\u4E91\u670D\u52A1\u5668",
      collapsed: false,
      items: [
        { text: "AWS EC2", link: "/development-tools/cloud-server/aws-ec2" },
        { text: "Google Cloud VMs", link: "/development-tools/cloud-server/google-cloud-vms" }
      ]
    }
  ]
};

// docs/.vitepress/config/sidebar/research-projects.js
var researchProjectsSidebar = {
  "/research-projects/papers/": [
    {
      text: "\u5B66\u672F\u8BBA\u6587",
      collapsed: false,
      items: [
        { text: "Overview", link: "/research-projects/papers/" },
        { text: "Paper 1", link: "/research-projects/papers/paper-1" },
        { text: "Paper 2", link: "/research-projects/papers/paper-2" }
      ]
    }
  ],
  "/research-projects/projects/": [
    {
      text: "\u7814\u7A76\u9879\u76EE",
      collapsed: false,
      items: [
        { text: "Overview", link: "/research-projects/projects/" },
        { text: "Project 1", link: "/research-projects/projects/project-1" },
        { text: "Project 2", link: "/research-projects/projects/project-2" }
      ]
    }
  ],
  "/research-projects/research/": [
    {
      text: "\u7814\u7A76\u65B9\u5411",
      collapsed: false,
      items: [
        { text: "RF-Pose", link: "/research-projects/research/RF-Pose" },
        { text: "Information Theory", link: "/research-projects/research/information_theory" },
        { text: "Face Recognition", link: "/research-projects/research/face_recognition" },
        { text: "MNIST", link: "/research-projects/research/mnist" },
        { text: "LaTeX", link: "/research-projects/research/latex" },
        { text: "CSI Tool", link: "/research-projects/research/csitool" },
        { text: "CVPR", link: "/research-projects/research/cvpr" },
        { text: "ArrayTrack", link: "/research-projects/research/ArrayTrack" },
        { text: "TensorFlow", link: "/research-projects/research/tensorflow" },
        { text: "CNN", link: "/research-projects/research/cnn" }
      ]
    }
  ]
};

// docs/.vitepress/config/sidebar/auto-generated.js
var autoGeneratedSidebar = {
  "/algorithms/": [
    {
      "text": "Algorithms",
      "collapsed": false,
      "items": [
        {
          "text": "Data Struct",
          "collapsed": false,
          "items": [
            {
              "text": "HashMap",
              "link": "/algorithms/data_struct/hashmap"
            },
            {
              "text": "Linked List",
              "link": "/algorithms/data_struct/linkedlist"
            },
            {
              "text": "Data Struct",
              "link": "/algorithms/data_struct/readme"
            },
            {
              "text": "Stack",
              "link": "/algorithms/data_struct/stack"
            },
            {
              "text": "String",
              "link": "/algorithms/data_struct/string"
            },
            {
              "text": "Tree",
              "link": "/algorithms/data_struct/tree"
            }
          ]
        },
        {
          "text": "Backtrack",
          "link": "/algorithms/backtrack"
        },
        {
          "text": "Binary Search",
          "link": "/algorithms/binary_search"
        },
        {
          "text": "Binary Tree",
          "link": "/algorithms/binary_tree"
        },
        {
          "text": "Dfs Bfs",
          "link": "/algorithms/dfs_bfs"
        },
        {
          "text": "Dp",
          "link": "/algorithms/dp"
        },
        {
          "text": "LCS",
          "link": "/algorithms/lcs"
        },
        {
          "text": "Knapsack",
          "link": "/algorithms/package"
        },
        {
          "text": "Presum",
          "link": "/algorithms/presum"
        },
        {
          "text": "Slide Window",
          "link": "/algorithms/slide_window"
        },
        {
          "text": "Code Snappet",
          "link": "/algorithms/snappet"
        },
        {
          "text": "Sort",
          "link": "/algorithms/sort"
        }
      ]
    }
  ],
  "/artificial-intelligence/": [
    {
      "text": "Artificial Intelligence",
      "collapsed": false,
      "items": [
        {
          "text": "AMX",
          "collapsed": false,
          "items": [
            {
              "text": "OpenVino",
              "link": "/artificial-intelligence/AMX/openvino"
            }
          ]
        },
        {
          "text": "Distributed Training",
          "collapsed": false,
          "items": [
            {
              "text": "Megatron & Parallel",
              "link": "/artificial-intelligence/distributed-training/megatron_parallel"
            },
            {
              "text": "nccl-test run",
              "link": "/artificial-intelligence/distributed-training/nccl-test"
            }
          ]
        },
        {
          "text": "Gpu Computing",
          "collapsed": false,
          "items": [
            {
              "text": "SAC - ISCA 23",
              "link": "/artificial-intelligence/gpu-computing/SAC - ISCA 23"
            },
            {
              "text": "GPU Architecture - \u6DF1\u5165\u7406\u89E3\u56FE\u5F62\u5904\u7406\u5668\u67B6\u6784",
              "link": "/artificial-intelligence/gpu-computing/gpu_arch"
            },
            {
              "text": "GPU Communication",
              "link": "/artificial-intelligence/gpu-computing/gpu_communication"
            }
          ]
        },
        {
          "text": "Profiling",
          "collapsed": false,
          "items": [
            {
              "text": "Python AI Profiling",
              "link": "/artificial-intelligence/profiling/AI Profiling"
            }
          ]
        }
      ]
    }
  ],
  "/computer-systems/": [
    {
      "text": "Computer Systems",
      "collapsed": false,
      "items": [
        {
          "text": "Cpu Gpu",
          "collapsed": false,
          "items": [
            {
              "text": "Arm Architecture",
              "collapsed": true,
              "items": [
                {
                  "text": "ISA: Arm In-line Assembly",
                  "link": "/computer-systems/cpu-gpu/arm-architecture/arm_inline_assembly"
                },
                {
                  "text": "ISA: ARM Instructions Set",
                  "link": "/computer-systems/cpu-gpu/arm-architecture/arm_ins"
                }
              ]
            },
            {
              "text": "Cpu Architecture",
              "collapsed": true,
              "items": [
                {
                  "text": "Instruction Sets",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "AMX \u6307\u4EE4",
                      "link": "/computer-systems/cpu-gpu/cpu-architecture/instruction-sets/amx"
                    },
                    {
                      "text": "Instructions of x86",
                      "link": "/computer-systems/cpu-gpu/cpu-architecture/instruction-sets/x86_inst"
                    }
                  ]
                },
                {
                  "text": "Memory Systems",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "MMU",
                      "link": "/computer-systems/cpu-gpu/cpu-architecture/memory-systems/MMU"
                    },
                    {
                      "text": "Cache",
                      "link": "/computer-systems/cpu-gpu/cpu-architecture/memory-systems/cache"
                    },
                    {
                      "text": "Virtual Memory and Page",
                      "link": "/computer-systems/cpu-gpu/cpu-architecture/memory-systems/memory_va_page"
                    },
                    {
                      "text": "Numa and Socket",
                      "link": "/computer-systems/cpu-gpu/cpu-architecture/memory-systems/numa_socket"
                    }
                  ]
                },
                {
                  "text": "Pipeline Performance",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "AMD IBS",
                      "link": "/computer-systems/cpu-gpu/cpu-architecture/pipeline-performance/ibs"
                    },
                    {
                      "text": "Pipeline",
                      "link": "/computer-systems/cpu-gpu/cpu-architecture/pipeline-performance/pipline"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "Linux",
          "collapsed": false,
          "items": [
            {
              "text": "Commands Tools",
              "collapsed": true,
              "items": [
                {
                  "text": "Linux Command",
                  "link": "/computer-systems/linux/commands-tools/command"
                }
              ]
            },
            {
              "text": "Educational",
              "collapsed": true,
              "items": [
                {
                  "text": "XV6 (6.828)",
                  "link": "/computer-systems/linux/educational/xv6"
                }
              ]
            },
            {
              "text": "Kernel",
              "collapsed": true,
              "items": [
                {
                  "text": "Architecture",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "BL31",
                      "link": "/computer-systems/linux/kernel/architecture/BL31"
                    }
                  ]
                },
                {
                  "text": "Core Concepts",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Notifier",
                      "link": "/computer-systems/linux/kernel/core-concepts/notifier"
                    },
                    {
                      "text": "Pthread",
                      "link": "/computer-systems/linux/kernel/core-concepts/pthread"
                    }
                  ]
                },
                {
                  "text": "Device Drivers",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "I2c",
                      "link": "/computer-systems/linux/kernel/device-drivers/i2c"
                    }
                  ]
                },
                {
                  "text": "Memory Management",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "THP",
                      "link": "/computer-systems/linux/kernel/memory-management/THP"
                    }
                  ]
                },
                {
                  "text": "Process Scheduling",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Idle",
                      "link": "/computer-systems/linux/kernel/process-scheduling/idle"
                    },
                    {
                      "text": "Tick in Idle",
                      "link": "/computer-systems/linux/kernel/process-scheduling/idle_tick"
                    },
                    {
                      "text": "RCU(todo)",
                      "link": "/computer-systems/linux/kernel/process-scheduling/rcu"
                    }
                  ]
                },
                {
                  "text": "Thermal Management",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Thermal (1) - Thermal Overview",
                      "link": "/computer-systems/linux/kernel/thermal-management/thermal"
                    },
                    {
                      "text": "Thermal (2) - Thermal Init",
                      "link": "/computer-systems/linux/kernel/thermal-management/thermal_init"
                    },
                    {
                      "text": "Thermal (3) - init.h in Thermal",
                      "link": "/computer-systems/linux/kernel/thermal-management/thermal_init_h"
                    }
                  ]
                }
              ]
            },
            {
              "text": "System Administration",
              "collapsed": true,
              "items": [
                {
                  "text": "apt source",
                  "link": "/computer-systems/linux/system-administration/apt"
                }
              ]
            },
            {
              "text": "System Programming",
              "collapsed": true,
              "items": [
                {
                  "text": "C Pointer",
                  "link": "/computer-systems/linux/system-programming/c-pointer"
                },
                {
                  "text": "Cmake",
                  "link": "/computer-systems/linux/system-programming/cmake"
                },
                {
                  "text": "Cmake Makefile",
                  "link": "/computer-systems/linux/system-programming/cmake_makefile"
                },
                {
                  "text": "Linkers & Loaders",
                  "link": "/computer-systems/linux/system-programming/linkers_loaders"
                },
                {
                  "text": "Size T",
                  "link": "/computer-systems/linux/system-programming/size_t"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "/development-tools/": [
    {
      "text": "Development Tools",
      "collapsed": false,
      "items": [
        {
          "text": "Cloud Server",
          "collapsed": false,
          "items": [
            {
              "text": "Docker \u5165\u95E8",
              "link": "/development-tools/cloud-server/Docker"
            },
            {
              "text": "\u8BBE\u8BA1\u6A21\u5F0F",
              "link": "/development-tools/cloud-server/design-pattern"
            },
            {
              "text": "JAVA GC \u7814\u7A76",
              "link": "/development-tools/cloud-server/gc"
            },
            {
              "text": "Huawei Cloud \u5165\u95E8",
              "link": "/development-tools/cloud-server/huawei_cloud"
            },
            {
              "text": "JAVA \u865A\u62DF\u673A ART \u7814\u7A76",
              "link": "/development-tools/cloud-server/jvm"
            },
            {
              "text": "JAVA \u865A\u62DF\u673A ART \u7814\u7A76\uFF08\u6742\u8C08\uFF09",
              "link": "/development-tools/cloud-server/jvm_art"
            },
            {
              "text": "Linux Kernel Build\uFF1ALinux \u5185\u6838\u7F16\u8BD1",
              "link": "/development-tools/cloud-server/kernel"
            },
            {
              "text": "\u6DF1\u5EA6\u5B9E\u8DF5 KVM -- KVM \u6280\u672F\u8BE6\u89E3\u4E0E\u5B9E\u6218",
              "link": "/development-tools/cloud-server/kvm"
            },
            {
              "text": "Linux \u8FDB\u7A0B\u548C\u7EBF\u7A0B",
              "link": "/development-tools/cloud-server/linux_os"
            },
            {
              "text": "Nginx \u57FA\u7840\u603B\u7ED3",
              "link": "/development-tools/cloud-server/nginx"
            },
            {
              "text": "Openresty \u57FA\u7840\u603B\u7ED3",
              "link": "/development-tools/cloud-server/openresty"
            },
            {
              "text": "Linux \u5305\u7BA1\u7406\uFF1ASnap",
              "link": "/development-tools/cloud-server/snap"
            }
          ]
        },
        {
          "text": "Database",
          "collapsed": false,
          "items": [
            {
              "text": "MongoDB Database",
              "link": "/development-tools/database/mongodb"
            },
            {
              "text": "MySql \u57FA\u7840\u603B\u7ED3",
              "link": "/development-tools/database/mysql"
            },
            {
              "text": "Python ORM - peewee",
              "link": "/development-tools/database/peewee"
            },
            {
              "text": "Redis and redis-py",
              "link": "/development-tools/database/redis"
            }
          ]
        },
        {
          "text": "Frameworks",
          "collapsed": false,
          "items": [
            {
              "text": "Celery\uFF1A\u5206\u5E03\u5F0F\u6D88\u606F\u4F20\u8F93\u7684\u5F02\u6B65\u4EFB\u52A1\u961F\u5217",
              "link": "/development-tools/frameworks/celery"
            },
            {
              "text": "Flask",
              "link": "/development-tools/frameworks/flask"
            },
            {
              "text": "Spring",
              "link": "/development-tools/frameworks/spring"
            }
          ]
        },
        {
          "text": "Frontend",
          "collapsed": false,
          "items": [
            {
              "text": "Charts.js",
              "link": "/development-tools/frontend/chartsjs"
            },
            {
              "text": "CSS",
              "link": "/development-tools/frontend/css"
            },
            {
              "text": "JS code - JavaScript \u5E38\u89C1\u8BED\u6CD5",
              "link": "/development-tools/frontend/jsnote"
            },
            {
              "text": "Node.js \u5B89\u88C5\u548C yarn \u5305\u7BA1\u7406",
              "link": "/development-tools/frontend/node_install"
            },
            {
              "text": "Vue.js \u603B\u7ED3",
              "link": "/development-tools/frontend/vue"
            }
          ]
        },
        {
          "text": "Networks",
          "collapsed": false,
          "items": [
            {
              "text": "C \u8BED\u8A00 socket \u5B9E\u73B0\u4EE5\u53CA Epoll, Libevent",
              "link": "/development-tools/networks/epoll"
            },
            {
              "text": "HTTP and HTTP/2",
              "link": "/development-tools/networks/http"
            },
            {
              "text": "TCP/IP \u603B\u7ED3",
              "link": "/development-tools/networks/networks"
            }
          ]
        },
        {
          "text": "Others",
          "collapsed": false,
          "items": [
            {
              "text": "\u7F16\u7A0B\u751F\u6DAF\u603B\u7ED3 - weigaochen",
              "link": "/development-tools/others/code_life"
            },
            {
              "text": "2019 \u65B0\u5E74\u611F\u609F",
              "link": "/development-tools/others/new"
            },
            {
              "text": "Paper Report",
              "link": "/development-tools/others/paper_report"
            },
            {
              "text": "Soft Skills - The Software Developer's Lift Manual",
              "link": "/development-tools/others/soft_skills"
            },
            {
              "text": "\u65E5\u5E38\u611F\u609F",
              "link": "/development-tools/others/thoughts-2018"
            },
            {
              "text": "2018 bug \u65E5\u8BB0",
              "link": "/development-tools/others/worklog"
            },
            {
              "text": "The Zen of Python",
              "link": "/development-tools/others/zen_of_python"
            }
          ]
        },
        {
          "text": "Tools",
          "collapsed": false,
          "items": [
            {
              "text": "Bat Script",
              "link": "/development-tools/tools/bat_win"
            },
            {
              "text": "Git",
              "link": "/development-tools/tools/git"
            },
            {
              "text": "Image Size Guide",
              "link": "/development-tools/tools/image-size-guide"
            },
            {
              "text": "Vim \u4F7F\u7528\u5165\u95E8",
              "link": "/development-tools/tools/vim"
            },
            {
              "text": "Vps",
              "link": "/development-tools/tools/vps"
            }
          ]
        }
      ]
    }
  ],
  "/programming-languages/": [
    {
      "text": "Programming Languages",
      "collapsed": false,
      "items": [
        {
          "text": "Java",
          "collapsed": false,
          "items": [
            {
              "text": "Android",
              "collapsed": true,
              "items": [
                {
                  "text": "Adb Command And Script",
                  "link": "/programming-languages/java/android/adb"
                },
                {
                  "text": "Research on Binder",
                  "link": "/programming-languages/java/android/binder"
                },
                {
                  "text": "Binder Phases",
                  "link": "/programming-languages/java/android/binder_01"
                },
                {
                  "text": "Binder \u5185\u5B58\u7BA1\u7406",
                  "link": "/programming-languages/java/android/binder_02"
                },
                {
                  "text": "IPC Binder \u4E4B\u6742\u8C08",
                  "link": "/programming-languages/java/android/ipc"
                },
                {
                  "text": "Binder Parcel",
                  "link": "/programming-languages/java/android/parcel"
                }
              ]
            },
            {
              "text": "Art",
              "collapsed": true,
              "items": [
                {
                  "text": "ART Create",
                  "link": "/programming-languages/java/art/art_create"
                },
                {
                  "text": "ART dex2oat",
                  "link": "/programming-languages/java/art/art_dex2oat"
                },
                {
                  "text": "ART JNI",
                  "link": "/programming-languages/java/art/art_jni"
                },
                {
                  "text": "Java GC - Concurrent Copying(Art)",
                  "link": "/programming-languages/java/art/gc_art_01"
                }
              ]
            },
            {
              "text": "Jvm",
              "collapsed": true,
              "items": [
                {
                  "text": "JVM Memory",
                  "link": "/programming-languages/java/jvm/01_jvm_memory"
                },
                {
                  "text": "\u6DF1\u5165\u89E3\u6790 G1 GC",
                  "link": "/programming-languages/java/jvm/gc_g1"
                },
                {
                  "text": "JVM Inst",
                  "link": "/programming-languages/java/jvm/jvm_inst"
                },
                {
                  "text": "Java \u53CD\u5C04\uFF1A\u5168\u9762\u89E3\u6790",
                  "link": "/programming-languages/java/jvm/reflection"
                }
              ]
            },
            {
              "text": "JAVA \u865A\u62DF\u673A ART \u7814\u7A76",
              "link": "/programming-languages/java/jvm"
            },
            {
              "text": "JAVA \u865A\u62DF\u673A ART \u7814\u7A76\uFF08\u6742\u8C08\uFF09",
              "link": "/programming-languages/java/jvm_art"
            }
          ]
        },
        {
          "text": "Python",
          "collapsed": false,
          "items": [
            {
              "text": "Language",
              "collapsed": true,
              "items": [
                {
                  "text": "Coroutines",
                  "link": "/programming-languages/python/language/coroutines"
                },
                {
                  "text": "Crontab",
                  "link": "/programming-languages/python/language/crontab"
                },
                {
                  "text": "Effective Python",
                  "link": "/programming-languages/python/language/effective-python"
                },
                {
                  "text": "Hash Map & Dict",
                  "link": "/programming-languages/python/language/hash"
                },
                {
                  "text": "I/O",
                  "link": "/programming-languages/python/language/io"
                },
                {
                  "text": "Itertools",
                  "link": "/programming-languages/python/language/itertools"
                },
                {
                  "text": "Log",
                  "link": "/programming-languages/python/language/log"
                },
                {
                  "text": "Pip",
                  "link": "/programming-languages/python/language/pip"
                },
                {
                  "text": "Py Data Struct",
                  "link": "/programming-languages/python/language/py-data-struct"
                },
                {
                  "text": "Python File",
                  "link": "/programming-languages/python/language/py-file"
                },
                {
                  "text": "Pytest",
                  "link": "/programming-languages/python/language/pytest"
                },
                {
                  "text": "Python Function",
                  "link": "/programming-languages/python/language/python-function"
                },
                {
                  "text": "OO & Class",
                  "link": "/programming-languages/python/language/python-oo"
                },
                {
                  "text": "Python C",
                  "link": "/programming-languages/python/language/python_c"
                }
              ]
            },
            {
              "text": "Tools",
              "collapsed": true,
              "items": [
                {
                  "text": "Py Tools",
                  "link": "/programming-languages/python/tools/py-tools"
                },
                {
                  "text": "virtualenv&Visdom",
                  "link": "/programming-languages/python/tools/virtualenv"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "/research-projects/": [
    {
      "text": "Research Projects",
      "collapsed": false,
      "items": [
        {
          "text": "Papers",
          "collapsed": false,
          "items": [
            {
              "text": "Vp Hpca14",
              "link": "/research-projects/papers/vp_hpca14"
            },
            {
              "text": "JVM_MEMORY",
              "link": "/research-projects/papers/vp_value_prediction"
            }
          ]
        },
        {
          "text": "Projects",
          "collapsed": false,
          "items": [
            {
              "text": "Blog Update Plan",
              "link": "/research-projects/projects/blog_plan"
            },
            {
              "text": "Jekyll GitHub Pages Blog",
              "link": "/research-projects/projects/jekyll"
            },
            {
              "text": "Linux Text Editor\uFF1AKilo, C",
              "link": "/research-projects/projects/kilo"
            },
            {
              "text": "QQ \u81EA\u52A8\u804A\u5929\u673A\u5668\u4EBA",
              "link": "/research-projects/projects/qqbot"
            },
            {
              "text": "Vuepress Blog Guide",
              "link": "/research-projects/projects/vueblog"
            }
          ]
        },
        {
          "text": "Research",
          "collapsed": false,
          "items": [
            {
              "text": "ArrayTrack",
              "link": "/research-projects/research/ArrayTrack"
            },
            {
              "text": "RF-Pose",
              "link": "/research-projects/research/RF-Pose"
            },
            {
              "text": "Cnn",
              "link": "/research-projects/research/cnn"
            },
            {
              "text": "CSI Tool",
              "link": "/research-projects/research/csitool"
            },
            {
              "text": "Cvpr",
              "link": "/research-projects/research/cvpr"
            },
            {
              "text": "YOLO and DarkNet",
              "link": "/research-projects/research/face_recognition"
            },
            {
              "text": "Information and Theory - An improved mOPE coding method",
              "link": "/research-projects/research/information_theory"
            },
            {
              "text": "LaTeX \u7528\u6CD5\u548C\u8BED\u6CD5\u603B\u7ED3",
              "link": "/research-projects/research/latex"
            },
            {
              "text": "MNIST \u624B\u5199\u6570\u5B57\u8BC6\u522B",
              "link": "/research-projects/research/mnist"
            },
            {
              "text": "OpenCV",
              "link": "/research-projects/research/opencv"
            },
            {
              "text": "Splicer",
              "link": "/research-projects/research/splicer"
            },
            {
              "text": "TensorFlow \u5165\u95E8",
              "link": "/research-projects/research/tensorflow"
            },
            {
              "text": "Tensorflow I/O",
              "link": "/research-projects/research/tensorflowio"
            }
          ]
        }
      ]
    }
  ]
};

// docs/.vitepress/config/sidebar/index.js
var sidebar = {
  // 手动配置的侧边栏（保留现有配置作为备份）
  ...algorithmsSidebar,
  ...artificialIntelligenceSidebar,
  ...computerSystemsSidebar,
  ...programmingLanguagesSidebar,
  ...developmentToolsSidebar,
  ...researchProjectsSidebar,
  // 自动生成的侧边栏配置（优先级更高）
  ...autoGeneratedSidebar
};

// docs/.vitepress/config.js
import markdownItMark from "file:///Users/weigao/Documents/_work/99_code/blogv2/node_modules/.pnpm/markdown-it-mark@4.0.0/node_modules/markdown-it-mark/index.mjs";

// docs/.vitepress/theme/utils/markdown-it-image-size.js
import fs4 from "fs";
import path5 from "path";
var imageManifest = null;
try {
  const manifestPath = path5.resolve(process.cwd(), "docs/.vitepress/data/image-manifest.json");
  if (fs4.existsSync(manifestPath)) {
    const raw = fs4.readFileSync(manifestPath, "utf-8");
    imageManifest = JSON.parse(raw);
  }
} catch (e) {
  imageManifest = null;
}
function imageSizePlugin(md) {
  const defaultImageRenderer = md.renderer.rules.image || function(tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };
  const escapeAttrValue = (str) => {
    if (typeof str !== "string") return "";
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  md.renderer.rules.image = function(tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const src = token.attrs[token.attrIndex("src")][1];
    const altText = token.content || "";
    const ensureAttr = (name, value) => {
      const i = token.attrIndex(name);
      if (i < 0) token.attrPush([name, value]);
      else token.attrs[i][1] = value;
    };
    ensureAttr("loading", "lazy");
    ensureAttr("decoding", "async");
    const isHttp = /^https?:\/\//i.test(src);
    const isLocalImages = !isHttp && (src.startsWith("/images/") || src.startsWith("images/") || src.startsWith("./images/"));
    const normalizedKey = src.startsWith("/images/") ? src : "/images/" + src.replace(/^\.?\/?images\//, "");
    const manifestItem = imageManifest && isLocalImages ? imageManifest[normalizedKey] : null;
    const sizeMatch = altText.match(/^(.*?)\|(.+)$/);
    if (sizeMatch) {
      const actualAlt = sizeMatch[1].trim();
      const sizeStr = sizeMatch[2].trim();
      token.content = actualAlt;
      const styles = [];
      const classes = ["responsive-image"];
      let widthAttr = null;
      let heightAttr = null;
      if (sizeStr.match(/^\d+x\d+$/)) {
        const [width, height] = sizeStr.split("x");
        if (width !== "0") {
          styles.push(`width: ${width}px`);
          widthAttr = width;
        }
        if (height !== "0") {
          styles.push(`height: ${height}px`);
          heightAttr = height;
        }
      } else if (sizeStr.match(/^\d+x0$/)) {
        const width = sizeStr.split("x")[0];
        styles.push(`width: ${width}px`);
        styles.push("height: auto");
        widthAttr = width;
      } else if (sizeStr.match(/^0x\d+$/)) {
        const height = sizeStr.split("x")[1];
        styles.push(`height: ${height}px`);
        styles.push("width: auto");
        heightAttr = height;
      } else if (sizeStr.match(/^\d+%$/)) {
        styles.push(`width: ${sizeStr}`);
        styles.push("height: auto");
      } else if (sizeStr.match(/^\d+$/)) {
        styles.push(`width: ${sizeStr}px`);
        styles.push("height: auto");
        widthAttr = sizeStr;
      } else {
        token.content = altText;
      }
      if (styles.length > 0) {
        const styleAttrIndex = token.attrIndex("style");
        const styleValue = styles.join("; ");
        if (styleAttrIndex < 0) {
          token.attrPush(["style", styleValue]);
        } else {
          token.attrs[styleAttrIndex][1] += "; " + styleValue;
        }
        const classAttrIndex = token.attrIndex("class");
        if (classAttrIndex < 0) {
          token.attrPush(["class", classes.join(" ")]);
        } else {
          token.attrs[classAttrIndex][1] += " " + classes.join(" ");
        }
        const altAttrIndex = token.attrIndex("alt");
        const safeAlt = escapeAttrValue(actualAlt);
        if (altAttrIndex < 0) {
          token.attrPush(["alt", safeAlt]);
        } else {
          token.attrs[altAttrIndex][1] = safeAlt;
        }
        if (widthAttr && /^\d+$/.test(String(widthAttr)) && widthAttr !== "0") {
          ensureAttr("width", String(widthAttr));
        }
        if (heightAttr && /^\d+$/.test(String(heightAttr)) && heightAttr !== "0") {
          ensureAttr("height", String(heightAttr));
        }
      }
    }
    if (manifestItem) {
      const altAttrIndex = token.attrIndex("alt");
      const altValRaw = altAttrIndex >= 0 ? token.attrs[altAttrIndex][1] : "";
      const altVal = escapeAttrValue(altValRaw);
      const widthIdx = token.attrIndex("width");
      const heightIdx = token.attrIndex("height");
      const widthVal = widthIdx >= 0 ? token.attrs[widthIdx][1] : manifestItem.original.width || "";
      const heightVal = heightIdx >= 0 ? token.attrs[heightIdx][1] : manifestItem.original.height || "";
      const webpSet = (manifestItem.variants.webp || []).map((v) => `${v.src} ${v.width}w`).join(", ");
      const origSet = (manifestItem.variants.original || []).map((v) => `${v.src} ${v.width}w`).join(", ");
      const sizes = "(max-width: 768px) 90vw, 768px";
      const classIdx = token.attrIndex("class");
      const cls = classIdx >= 0 ? token.attrs[classIdx][1] : "responsive-image";
      const styleIdx = token.attrIndex("style");
      const style = styleIdx >= 0 ? token.attrs[styleIdx][1] : "";
      const loadingIdx = token.attrIndex("loading");
      const decodingIdx = token.attrIndex("decoding");
      const loading = loadingIdx >= 0 ? token.attrs[loadingIdx][1] : "lazy";
      const decoding = decodingIdx >= 0 ? token.attrs[decodingIdx][1] : "async";
      const fallbackSrc = (manifestItem.variants.original || [])[0]?.src || manifestItem.original.src;
      return [
        `<picture class="${cls}">`,
        webpSet ? `  <source type="image/webp" srcset="${webpSet}" sizes="${sizes}">` : "",
        origSet ? `  <source type="${manifestItem.original.type}" srcset="${origSet}" sizes="${sizes}">` : "",
        `  <img src="${fallbackSrc}" alt="${altVal || ""}"${widthVal ? ` width="${widthVal}"` : ""}${heightVal ? ` height="${heightVal}"` : ""} loading="${loading}" decoding="${decoding}"${style ? ` style="${style}"` : ""} />`,
        `</picture>`
      ].filter(Boolean).join("\n");
    }
    return defaultImageRenderer(tokens, idx, options, env, renderer);
  };
}
var markdown_it_image_size_default = imageSizePlugin;

// docs/.vitepress/utils/generateResponsiveImages.js
import fs5 from "fs";
import path6 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
var __vite_injected_original_import_meta_url5 = "file:///Users/weigao/Documents/_work/99_code/blogv2/docs/.vitepress/utils/generateResponsiveImages.js";
var __filename4 = fileURLToPath4(__vite_injected_original_import_meta_url5);
var __dirname4 = path6.dirname(__filename4);
var PUBLIC_DIR = path6.resolve(__dirname4, "../../public");
var SOURCE_DIR = path6.join(PUBLIC_DIR, "images");
var OUTPUT_DIR = path6.join(PUBLIC_DIR, "_optimized");
var MANIFEST_PATH = path6.resolve(__dirname4, "../data/image-manifest.json");
var VALID_EXT = /* @__PURE__ */ new Set([".jpg", ".jpeg", ".png"]);
var WIDTHS = [480, 768, 1024, 1440];
function walk(dir, acc = []) {
  if (!fs5.existsSync(dir)) return acc;
  const ents = fs5.readdirSync(dir, { withFileTypes: true });
  for (const e of ents) {
    const fp = path6.join(dir, e.name);
    if (e.isDirectory()) walk(fp, acc);
    else if (e.isFile()) {
      const ext = path6.extname(e.name).toLowerCase();
      if (VALID_EXT.has(ext)) acc.push(fp);
    }
  }
  return acc;
}
async function ensureDir(p) {
  await fs5.promises.mkdir(p, { recursive: true });
}
async function processImage(absPath, sharp) {
  const relFromPublic = path6.relative(PUBLIC_DIR, absPath).split(path6.sep).join("/");
  const publicPath = "/" + relFromPublic;
  const baseName = path6.basename(absPath, path6.extname(absPath));
  const ext = path6.extname(absPath).toLowerCase();
  const originalFormat = ext === ".png" ? "png" : "jpeg";
  const image = sharp(absPath);
  const meta = await image.metadata();
  const origWidth = meta.width || 0;
  const origHeight = meta.height || 0;
  const mimeOriginal = originalFormat === "png" ? "image/png" : "image/jpeg";
  const outRelDir = path6.join("_optimized", path6.relative("images", path6.dirname(relFromPublic)));
  const outAbsDir = path6.join(PUBLIC_DIR, outRelDir);
  await ensureDir(outAbsDir);
  const variantsOriginal = [];
  const variantsWebp = [];
  for (const w of WIDTHS) {
    if (origWidth && w > origWidth) continue;
    const outName = `${baseName}-${w}w${ext}`;
    const outAbs = path6.join(outAbsDir, outName);
    const outPublic = "/" + path6.join(outRelDir, outName).split(path6.sep).join("/");
    await sharp(absPath).resize({ width: w }).toFormat(originalFormat, { quality: 82 }).toFile(outAbs);
    variantsOriginal.push({ width: w, src: outPublic });
    const outNameWebp = `${baseName}-${w}w.webp`;
    const outAbsWebp = path6.join(outAbsDir, outNameWebp);
    const outPublicWebp = "/" + path6.join(outRelDir, outNameWebp).split(path6.sep).join("/");
    await sharp(absPath).resize({ width: w }).webp({ quality: 82 }).toFile(outAbsWebp);
    variantsWebp.push({ width: w, src: outPublicWebp });
  }
  let lqip = "";
  try {
    const lqipBuffer = await sharp(absPath).resize({ width: 24 }).webp({ quality: 60 }).toBuffer();
    lqip = "data:image/webp;base64," + lqipBuffer.toString("base64");
  } catch (e) {
    console.warn("[images] LQIP failed:", absPath, e?.message || e);
  }
  return {
    key: publicPath,
    value: {
      original: { src: publicPath, width: origWidth, height: origHeight, type: mimeOriginal, lqip },
      variants: {
        original: variantsOriginal.sort((a, b) => a.width - b.width),
        webp: variantsWebp.sort((a, b) => a.width - b.width)
      }
    }
  };
}
async function generateResponsiveImages() {
  if (process.env.SKIP_IMAGE_OPTIMIZE === "1") {
    console.log("[images] SKIP_IMAGE_OPTIMIZE=1, skip responsive images generation");
    return true;
  }
  let sharp;
  try {
    const mod = await import("file:///Users/weigao/Documents/_work/99_code/blogv2/node_modules/.pnpm/sharp@0.33.5/node_modules/sharp/lib/index.js");
    sharp = mod?.default || mod;
  } catch (e) {
    console.warn("[images] sharp not available, skip responsive images generation:", e?.message || e);
    await ensureDir(path6.dirname(MANIFEST_PATH));
    await fs5.promises.writeFile(MANIFEST_PATH, JSON.stringify({}, null, 2));
    return false;
  }
  if (!fs5.existsSync(SOURCE_DIR)) {
    console.log("[images] No source dir:", SOURCE_DIR, "- writing empty manifest and skipping");
    await ensureDir(path6.dirname(MANIFEST_PATH));
    await fs5.promises.writeFile(MANIFEST_PATH, JSON.stringify({}, null, 2));
    return true;
  }
  const files = walk(SOURCE_DIR, []);
  if (files.length === 0) {
    console.log("[images] No images found under", SOURCE_DIR);
    await ensureDir(path6.dirname(MANIFEST_PATH));
    await fs5.promises.writeFile(MANIFEST_PATH, JSON.stringify({}, null, 2));
    return true;
  }
  const manifest = {};
  console.log(`[images] Processing ${files.length} images...`);
  for (const f of files) {
    try {
      const item = await processImage(f, sharp);
      manifest[item.key] = item.value;
    } catch (e) {
      console.warn("[images] Failed:", f, e?.message || e);
    }
  }
  await ensureDir(path6.dirname(MANIFEST_PATH));
  await fs5.promises.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("[images] Manifest written:", MANIFEST_PATH);
  return true;
}
if (__vite_injected_original_import_meta_url5 === `file://${process.argv[1]}`) {
  generateResponsiveImages().then((ok) => {
    process.exit(ok ? 0 : 1);
  });
}

// docs/.vitepress/config.js
import UnoCSS from "file:///Users/weigao/Documents/_work/99_code/blogv2/node_modules/.pnpm/unocss@0.61.9_postcss@8.5.6_vite@5.4.20/node_modules/unocss/dist/vite.mjs";
var config_default = defineConfig({
  title: "Knowledge Wiki",
  description: "Personal Knowledge Base - Work & Study Documentation",
  lang: "zh-CN",
  // GitHub Pages 项目站点子路径
  base: "/blogv2/",
  // 忽略死链接检查，避免构建失败
  ignoreDeadLinks: true,
  // 构建钩子 - 在构建前生成 timeline 数据、git 历史记录和侧边栏配置
  buildStart() {
    console.log("Generating sidebar configuration...");
    generateAndWriteSidebar();
    console.log("Generating timeline data...");
    writeTimelineData();
    console.log("Generating git history data for modal...");
    writeGitHistoryData();
    console.log("Generating responsive images...");
    generateResponsiveImages();
  },
  // SSR 配置 - 解决客户端组件的 SSR 问题
  ssr: {
    noExternal: ["vue", "@vue/shared"]
  },
  // Vite 配置 - 添加实时 git 历史记录 API 插件
  vite: {
    plugins: [
      createGitHistoryAPI(),
      UnoCSS()
    ],
    // 优化构建配置
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "toc-components": [
              "./docs/.vitepress/theme/components/EnhancedTOC.vue",
              "./docs/.vitepress/theme/components/toc/TOCToggleButton.vue",
              "./docs/.vitepress/theme/components/toc/TOCPanel.vue"
            ]
            // 移除对外部依赖的手动分块，避免与 external 冲突
          }
        }
      }
    },
    // 定义全局变量以避免 SSR 问题
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
  },
  // 网站图标
  head: [
    // 使用项目站点子路径，避免 /favicon.ico 在项目站下 404
    ["link", { rel: "icon", href: "/blogv2/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#3c82f6" }],
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
    // 新增：告知浏览器支持亮暗两种配色方案
    ["meta", { name: "color-scheme", content: "light dark" }]
  ],
  // 主题配置
  themeConfig: {
    // 网站logo
    logo: "/blogv2/logo.svg",
    // 导航栏 - 根据实际文档分类更新
    nav: [
      { text: "Home", link: "/" },
      { text: "AI Infra", link: "/artificial-intelligence/" },
      {
        text: "Computer Systems",
        items: [
          { text: "CPU & GPU", link: "/computer-systems/cpu-gpu/" },
          { text: "Linux", link: "/computer-systems/linux/" }
        ]
      },
      {
        text: "Research",
        items: [
          { text: "Papers", link: "/research-projects/papers/" },
          { text: "Projects", link: "/research-projects/projects/" },
          { text: "Research", link: "/research-projects/research/" }
        ]
      },
      { text: "Timeline", link: "/timeline" },
      {
        text: "More",
        items: [
          { text: "Algorithms", link: "/algorithms/" },
          {
            text: "Programming",
            items: [
              { text: "Java", link: "/programming-languages/java/" },
              { text: "Python", link: "/programming-languages/python/" }
            ]
          },
          {
            text: "Development",
            items: [
              { text: "Tools", link: "/development-tools/tools/" },
              { text: "Frameworks", link: "/development-tools/frameworks/" },
              { text: "Database", link: "/development-tools/database/" },
              { text: "Frontend", link: "/development-tools/frontend/" },
              { text: "Networks", link: "/development-tools/networks/" },
              { text: "Cloud Server", link: "/development-tools/cloud-server/" }
            ]
          },
          { text: "About", link: "/about" },
          { text: "Search", link: "/search" }
        ]
      }
    ],
    // 侧边栏配置 - 从外部文件导入
    sidebar,
    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/chenweigao" }
    ],
    // 搜索
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "Search",
            buttonAriaLabel: "Search"
          },
          modal: {
            noResultsText: "No results found",
            resetButtonTitle: "Clear search",
            footer: {
              selectText: "to select",
              navigateText: "to navigate"
            }
          }
        }
      }
    },
    // 页脚
    footer: {
      message: "Personal Knowledge Wiki",
      copyright: "Copyright \xA9 2025"
    },
    // 编辑链接
    editLink: {
      pattern: "https://github.com/chenweigao/blogv2/edit/main/docs/:path",
      text: "Edit this page"
    },
    // 最后更新时间
    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium"
      }
    },
    // 大纲配置 - 启用大纲以支持 TOC 功能
    // outline: {
    //   level: [2, 3]
    // }
    outline: false
  },
  // Markdown 配置
  markdown: {
    lineNumbers: true,
    codeCopyButtonTitle: true,
    theme: {
      light: "github-light",
      dark: "github-dark"
    },
    math: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    },
    config: (md) => {
      md.use(markdownItMark);
      md.use(markdown_it_image_size_default);
    }
  },
  // 站点地图
  sitemap: {
    // GitHub Pages 项目站点的完整主页地址
    hostname: "https://chenweigao.github.io/blogv2/"
  },
  // 支持 front matter 数据处理
  transformPageData(pageData) {
    const frontmatter = pageData.frontmatter;
    if (frontmatter.title) {
      pageData.title = frontmatter.title;
    }
    if (frontmatter.date) {
      const date = new Date(frontmatter.date);
      if (!isNaN(date.getTime())) {
        frontmatter.formattedDate = date.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }
    }
    if (frontmatter.category) {
      if (typeof frontmatter.category === "string") {
        frontmatter.category = [frontmatter.category];
      }
    }
    return pageData;
  },
  // 新增：根据页面与站点信息动态生成 head（canonical/OG/Twitter）
  transformHead: ({ page, site }) => {
    const hostname = site?.sitemap?.hostname || "";
    const pagePath = page?.relativePath ? page.relativePath.replace(/\.md$/, "") : "";
    const canonicalUrl = hostname && pagePath ? `${hostname}/${pagePath}` : "";
    const title = page?.title || site?.title || "Site";
    const description = page?.description || site?.description || "";
    const tags = [
      canonicalUrl ? ["link", { rel: "canonical", href: canonicalUrl }] : null,
      ["meta", { name: "description", content: description }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      canonicalUrl ? ["meta", { property: "og:url", content: canonicalUrl }] : null,
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }]
    ].filter(Boolean);
    const fm = page?.frontmatter || {};
    const articleTitle = fm.title || title;
    const datePublished = fm.date || null;
    const dateModified = fm.updated || fm.lastUpdated || null;
    const authorName = fm.author || (site?.title ? String(site.title) : void 0);
    const keywords = Array.isArray(fm.tags) ? fm.tags : typeof fm.tags === "string" ? fm.tags.split(",").map((s) => s.trim()).filter(Boolean) : [];
    if (articleTitle && (datePublished || dateModified)) {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: articleTitle,
        description,
        ...canonicalUrl ? { url: canonicalUrl } : {},
        ...keywords?.length ? { keywords: keywords.join(", ") } : {},
        ...authorName ? { author: { "@type": "Person", name: authorName } } : {},
        ...datePublished ? { datePublished: new Date(datePublished).toISOString() } : {},
        ...dateModified ? { dateModified: new Date(dateModified).toISOString() } : {}
      };
      tags.push(["script", { type: "application/ld+json" }, JSON.stringify(jsonLd)]);
    }
    const rawAnalyticsUrl = typeof process !== "undefined" && process.env && process.env.VITE_ANALYTICS_URL || "";
    if (rawAnalyticsUrl) {
      try {
        const origin = new URL(rawAnalyticsUrl).origin;
        tags.push(["link", { rel: "preconnect", href: origin }]);
        tags.push(["link", { rel: "dns-prefetch", href: origin }]);
      } catch {
      }
    }
    return tags;
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5qcyIsICJkb2NzLy52aXRlcHJlc3MvdXRpbHMvZ2VuZXJhdGVUaW1lbGluZS5qcyIsICJkb2NzLy52aXRlcHJlc3MvdXRpbHMvZnJvbnRtYXR0ZXIuanMiLCAiZG9jcy8udml0ZXByZXNzL3V0aWxzL2dlbmVyYXRlR2l0SGlzdG9yeURhdGEuanMiLCAiZG9jcy8udml0ZXByZXNzL3V0aWxzL2dpdEhpc3RvcnlBUEkuanMiLCAiZG9jcy8udml0ZXByZXNzL3V0aWxzL2dlbmVyYXRlU2lkZWJhci5qcyIsICJkb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvYWxnb3JpdGhtcy5qcyIsICJkb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UuanMiLCAiZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyL2NvbXB1dGVyLXN5c3RlbXMuanMiLCAiZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyL3Byb2dyYW1taW5nLWxhbmd1YWdlcy5qcyIsICJkb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvZGV2ZWxvcG1lbnQtdG9vbHMuanMiLCAiZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyL3Jlc2VhcmNoLXByb2plY3RzLmpzIiwgImRvY3MvLnZpdGVwcmVzcy9jb25maWcvc2lkZWJhci9hdXRvLWdlbmVyYXRlZC5qcyIsICJkb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvaW5kZXguanMiLCAiZG9jcy8udml0ZXByZXNzL3RoZW1lL3V0aWxzL21hcmtkb3duLWl0LWltYWdlLXNpemUuanMiLCAiZG9jcy8udml0ZXByZXNzL3V0aWxzL2dlbmVyYXRlUmVzcG9uc2l2ZUltYWdlcy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJ1xuaW1wb3J0IHsgd3JpdGVUaW1lbGluZURhdGEgfSBmcm9tICcuL3V0aWxzL2dlbmVyYXRlVGltZWxpbmUuanMnXG5pbXBvcnQgeyB3cml0ZUdpdEhpc3RvcnlEYXRhIH0gZnJvbSAnLi91dGlscy9nZW5lcmF0ZUdpdEhpc3RvcnlEYXRhLmpzJ1xuaW1wb3J0IHsgY3JlYXRlR2l0SGlzdG9yeUFQSSB9IGZyb20gJy4vdXRpbHMvZ2l0SGlzdG9yeUFQSS5qcydcbmltcG9ydCB7IGdlbmVyYXRlQW5kV3JpdGVTaWRlYmFyIH0gZnJvbSAnLi91dGlscy9nZW5lcmF0ZVNpZGViYXIuanMnXG5pbXBvcnQgeyBzaWRlYmFyIH0gZnJvbSAnLi9jb25maWcvc2lkZWJhci9pbmRleC5qcydcbmltcG9ydCBtYXJrZG93bkl0TWFyayBmcm9tICdtYXJrZG93bi1pdC1tYXJrJ1xuaW1wb3J0IGltYWdlU2l6ZVBsdWdpbiBmcm9tICcuL3RoZW1lL3V0aWxzL21hcmtkb3duLWl0LWltYWdlLXNpemUuanMnXG5pbXBvcnQgeyBnZW5lcmF0ZVJlc3BvbnNpdmVJbWFnZXMgfSBmcm9tICcuL3V0aWxzL2dlbmVyYXRlUmVzcG9uc2l2ZUltYWdlcy5qcydcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHRpdGxlOiAnS25vd2xlZGdlIFdpa2knLFxuICBkZXNjcmlwdGlvbjogJ1BlcnNvbmFsIEtub3dsZWRnZSBCYXNlIC0gV29yayAmIFN0dWR5IERvY3VtZW50YXRpb24nLFxuICBsYW5nOiAnemgtQ04nLFxuICAvLyBHaXRIdWIgUGFnZXMgXHU5ODc5XHU3NkVFXHU3QUQ5XHU3MEI5XHU1QjUwXHU4REVGXHU1Rjg0XG4gIGJhc2U6ICcvYmxvZ3YyLycsXG5cbiAgLy8gXHU1RkZEXHU3NTY1XHU2QjdCXHU5NEZFXHU2M0E1XHU2OEMwXHU2N0U1XHVGRjBDXHU5MDdGXHU1MTREXHU2Nzg0XHU1RUZBXHU1OTMxXHU4RDI1XG4gIGlnbm9yZURlYWRMaW5rczogdHJ1ZSxcblxuICAvLyBcdTY3ODRcdTVFRkFcdTk0QTlcdTVCNTAgLSBcdTU3MjhcdTY3ODRcdTVFRkFcdTUyNERcdTc1MUZcdTYyMTAgdGltZWxpbmUgXHU2NTcwXHU2MzZFXHUzMDAxZ2l0IFx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVx1NTQ4Q1x1NEZBN1x1OEZCOVx1NjgwRlx1OTE0RFx1N0Y2RVxuICBidWlsZFN0YXJ0KCkge1xuICAgIGNvbnNvbGUubG9nKCdHZW5lcmF0aW5nIHNpZGViYXIgY29uZmlndXJhdGlvbi4uLicpXG4gICAgZ2VuZXJhdGVBbmRXcml0ZVNpZGViYXIoKVxuXG4gICAgY29uc29sZS5sb2coJ0dlbmVyYXRpbmcgdGltZWxpbmUgZGF0YS4uLicpXG4gICAgd3JpdGVUaW1lbGluZURhdGEoKVxuXG4gICAgY29uc29sZS5sb2coJ0dlbmVyYXRpbmcgZ2l0IGhpc3RvcnkgZGF0YSBmb3IgbW9kYWwuLi4nKVxuICAgIHdyaXRlR2l0SGlzdG9yeURhdGEoKVxuXG4gICAgY29uc29sZS5sb2coJ0dlbmVyYXRpbmcgcmVzcG9uc2l2ZSBpbWFnZXMuLi4nKVxuICAgIGdlbmVyYXRlUmVzcG9uc2l2ZUltYWdlcygpXG4gIH0sXG5cbiAgLy8gU1NSIFx1OTE0RFx1N0Y2RSAtIFx1ODlFM1x1NTFCM1x1NUJBMlx1NjIzN1x1N0FFRlx1N0VDNFx1NEVGNlx1NzY4NCBTU1IgXHU5NUVFXHU5ODk4XG4gIHNzcjoge1xuICAgIG5vRXh0ZXJuYWw6IFsndnVlJywgJ0B2dWUvc2hhcmVkJ11cbiAgfSxcblxuICAvLyBWaXRlIFx1OTE0RFx1N0Y2RSAtIFx1NkRGQlx1NTJBMFx1NUI5RVx1NjVGNiBnaXQgXHU1Mzg2XHU1M0YyXHU4QkIwXHU1RjU1IEFQSSBcdTYzRDJcdTRFRjZcbiAgdml0ZToge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIGNyZWF0ZUdpdEhpc3RvcnlBUEkoKSxcbiAgICAgIFVub0NTUygpXG4gICAgXSxcbiAgICAvLyBcdTRGMThcdTUzMTZcdTY3ODRcdTVFRkFcdTkxNERcdTdGNkVcbiAgICBidWlsZDoge1xuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgICd0b2MtY29tcG9uZW50cyc6IFtcbiAgICAgICAgICAgICAgJy4vZG9jcy8udml0ZXByZXNzL3RoZW1lL2NvbXBvbmVudHMvRW5oYW5jZWRUT0MudnVlJyxcbiAgICAgICAgICAgICAgJy4vZG9jcy8udml0ZXByZXNzL3RoZW1lL2NvbXBvbmVudHMvdG9jL1RPQ1RvZ2dsZUJ1dHRvbi52dWUnLFxuICAgICAgICAgICAgICAnLi9kb2NzLy52aXRlcHJlc3MvdGhlbWUvY29tcG9uZW50cy90b2MvVE9DUGFuZWwudnVlJ1xuICAgICAgICAgICAgXVxuICAgICAgICAgICAgLy8gXHU3OUZCXHU5NjY0XHU1QkY5XHU1OTE2XHU5MEU4XHU0RjlEXHU4RDU2XHU3Njg0XHU2MjRCXHU1MkE4XHU1MjA2XHU1NzU3XHVGRjBDXHU5MDdGXHU1MTREXHU0RTBFIGV4dGVybmFsIFx1NTFCMlx1N0E4MVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gXHU1QjlBXHU0RTQ5XHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHU0RUU1XHU5MDdGXHU1MTREIFNTUiBcdTk1RUVcdTk4OThcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fVlVFX1BST0RfSFlEUkFUSU9OX01JU01BVENIX0RFVEFJTFNfXzogZmFsc2VcbiAgICB9XG4gIH0sXG5cbiAgLy8gXHU3RjUxXHU3QUQ5XHU1NkZFXHU2ODA3XG4gIGhlYWQ6IFtcbiAgICAvLyBcdTRGN0ZcdTc1MjhcdTk4NzlcdTc2RUVcdTdBRDlcdTcwQjlcdTVCNTBcdThERUZcdTVGODRcdUZGMENcdTkwN0ZcdTUxNEQgL2Zhdmljb24uaWNvIFx1NTcyOFx1OTg3OVx1NzZFRVx1N0FEOVx1NEUwQiA0MDRcbiAgICBbJ2xpbmsnLCB7IHJlbDogJ2ljb24nLCBocmVmOiAnL2Jsb2d2Mi9mYXZpY29uLmljbycgfV0sXG4gICAgWydtZXRhJywgeyBuYW1lOiAndGhlbWUtY29sb3InLCBjb250ZW50OiAnIzNjODJmNicgfV0sXG4gICAgWydtZXRhJywgeyBuYW1lOiAndmlld3BvcnQnLCBjb250ZW50OiAnd2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCcgfV0sXG4gICAgLy8gXHU2NUIwXHU1ODlFXHVGRjFBXHU1NDRBXHU3N0U1XHU2RDRGXHU4OUM4XHU1NjY4XHU2NTJGXHU2MzAxXHU0RUFFXHU2Njk3XHU0RTI0XHU3OUNEXHU5MTREXHU4MjcyXHU2NUI5XHU2ODQ4XG4gICAgWydtZXRhJywgeyBuYW1lOiAnY29sb3Itc2NoZW1lJywgY29udGVudDogJ2xpZ2h0IGRhcmsnIH1dXG4gIF0sXG5cbiAgLy8gXHU0RTNCXHU5ODk4XHU5MTREXHU3RjZFXG4gIHRoZW1lQ29uZmlnOiB7XG4gICAgLy8gXHU3RjUxXHU3QUQ5bG9nb1xuICAgIGxvZ286ICcvYmxvZ3YyL2xvZ28uc3ZnJyxcblxuICAgIC8vIFx1NUJGQ1x1ODIyQVx1NjgwRiAtIFx1NjgzOVx1NjM2RVx1NUI5RVx1OTY0NVx1NjU4N1x1Njg2M1x1NTIwNlx1N0M3Qlx1NjZGNFx1NjVCMFxuICAgIG5hdjogW1xuICAgICAgeyB0ZXh0OiAnSG9tZScsIGxpbms6ICcvJyB9LFxuICAgICAgeyB0ZXh0OiAnQUkgSW5mcmEnLCBsaW5rOiAnL2FydGlmaWNpYWwtaW50ZWxsaWdlbmNlLycgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ0NvbXB1dGVyIFN5c3RlbXMnLFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHsgdGV4dDogJ0NQVSAmIEdQVScsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9jcHUtZ3B1LycgfSxcbiAgICAgICAgICB7IHRleHQ6ICdMaW51eCcsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC8nIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ1Jlc2VhcmNoJyxcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7IHRleHQ6ICdQYXBlcnMnLCBsaW5rOiAnL3Jlc2VhcmNoLXByb2plY3RzL3BhcGVycy8nIH0sXG4gICAgICAgICAgeyB0ZXh0OiAnUHJvamVjdHMnLCBsaW5rOiAnL3Jlc2VhcmNoLXByb2plY3RzL3Byb2plY3RzLycgfSxcbiAgICAgICAgICB7IHRleHQ6ICdSZXNlYXJjaCcsIGxpbms6ICcvcmVzZWFyY2gtcHJvamVjdHMvcmVzZWFyY2gvJyB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7IHRleHQ6ICdUaW1lbGluZScsIGxpbms6ICcvdGltZWxpbmUnIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICdNb3JlJyxcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7IHRleHQ6ICdBbGdvcml0aG1zJywgbGluazogJy9hbGdvcml0aG1zLycgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnUHJvZ3JhbW1pbmcnLFxuICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnSmF2YScsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvJyB9LFxuICAgICAgICAgICAgICB7IHRleHQ6ICdQeXRob24nLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vJyB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnRGV2ZWxvcG1lbnQnLFxuICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnVG9vbHMnLCBsaW5rOiAnL2RldmVsb3BtZW50LXRvb2xzL3Rvb2xzLycgfSxcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnRnJhbWV3b3JrcycsIGxpbms6ICcvZGV2ZWxvcG1lbnQtdG9vbHMvZnJhbWV3b3Jrcy8nIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ0RhdGFiYXNlJywgbGluazogJy9kZXZlbG9wbWVudC10b29scy9kYXRhYmFzZS8nIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ0Zyb250ZW5kJywgbGluazogJy9kZXZlbG9wbWVudC10b29scy9mcm9udGVuZC8nIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ05ldHdvcmtzJywgbGluazogJy9kZXZlbG9wbWVudC10b29scy9uZXR3b3Jrcy8nIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ0Nsb3VkIFNlcnZlcicsIGxpbms6ICcvZGV2ZWxvcG1lbnQtdG9vbHMvY2xvdWQtc2VydmVyLycgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0ZXh0OiAnQWJvdXQnLCBsaW5rOiAnL2Fib3V0JyB9LFxuICAgICAgICAgIHsgdGV4dDogJ1NlYXJjaCcsIGxpbms6ICcvc2VhcmNoJyB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuXG4gICAgLy8gXHU0RkE3XHU4RkI5XHU2ODBGXHU5MTREXHU3RjZFIC0gXHU0RUNFXHU1OTE2XHU5MEU4XHU2NTg3XHU0RUY2XHU1QkZDXHU1MTY1XG4gICAgc2lkZWJhcixcblxuICAgIC8vIFx1NzkzRVx1NEVBNFx1OTRGRVx1NjNBNVxuICAgIHNvY2lhbExpbmtzOiBbXG4gICAgICB7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2NoZW53ZWlnYW8nIH1cbiAgICBdLFxuXG4gICAgLy8gXHU2NDFDXHU3RDIyXG4gICAgc2VhcmNoOiB7XG4gICAgICBwcm92aWRlcjogJ2xvY2FsJyxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgdHJhbnNsYXRpb25zOiB7XG4gICAgICAgICAgYnV0dG9uOiB7XG4gICAgICAgICAgICBidXR0b25UZXh0OiAnU2VhcmNoJyxcbiAgICAgICAgICAgIGJ1dHRvbkFyaWFMYWJlbDogJ1NlYXJjaCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vZGFsOiB7XG4gICAgICAgICAgICBub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXG4gICAgICAgICAgICByZXNldEJ1dHRvblRpdGxlOiAnQ2xlYXIgc2VhcmNoJyxcbiAgICAgICAgICAgIGZvb3Rlcjoge1xuICAgICAgICAgICAgICBzZWxlY3RUZXh0OiAndG8gc2VsZWN0JyxcbiAgICAgICAgICAgICAgbmF2aWdhdGVUZXh0OiAndG8gbmF2aWdhdGUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFx1OTg3NVx1ODExQVxuICAgIGZvb3Rlcjoge1xuICAgICAgbWVzc2FnZTogJ1BlcnNvbmFsIEtub3dsZWRnZSBXaWtpJyxcbiAgICAgIGNvcHlyaWdodDogJ0NvcHlyaWdodCBcdTAwQTkgMjAyNSdcbiAgICB9LFxuXG4gICAgLy8gXHU3RjE2XHU4RjkxXHU5NEZFXHU2M0E1XG4gICAgZWRpdExpbms6IHtcbiAgICAgIHBhdHRlcm46ICdodHRwczovL2dpdGh1Yi5jb20vY2hlbndlaWdhby9ibG9ndjIvZWRpdC9tYWluL2RvY3MvOnBhdGgnLFxuICAgICAgdGV4dDogJ0VkaXQgdGhpcyBwYWdlJ1xuICAgIH0sXG5cbiAgICAvLyBcdTY3MDBcdTU0MEVcdTY2RjRcdTY1QjBcdTY1RjZcdTk1RjRcbiAgICBsYXN0VXBkYXRlZDoge1xuICAgICAgdGV4dDogJ0xhc3QgdXBkYXRlZCcsXG4gICAgICBmb3JtYXRPcHRpb25zOiB7XG4gICAgICAgIGRhdGVTdHlsZTogJ3Nob3J0JyxcbiAgICAgICAgdGltZVN0eWxlOiAnbWVkaXVtJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBcdTU5MjdcdTdFQjJcdTkxNERcdTdGNkUgLSBcdTU0MkZcdTc1MjhcdTU5MjdcdTdFQjJcdTRFRTVcdTY1MkZcdTYzMDEgVE9DIFx1NTI5Rlx1ODBGRFxuICAgIC8vIG91dGxpbmU6IHtcbiAgICAvLyAgIGxldmVsOiBbMiwgM11cbiAgICAvLyB9XG4gICAgb3V0bGluZTogZmFsc2VcbiAgfSxcblxuICAvLyBNYXJrZG93biBcdTkxNERcdTdGNkVcbiAgbWFya2Rvd246IHtcbiAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICBjb2RlQ29weUJ1dHRvblRpdGxlOiB0cnVlLFxuICAgIHRoZW1lOiB7XG4gICAgICBsaWdodDogJ2dpdGh1Yi1saWdodCcsXG4gICAgICBkYXJrOiAnZ2l0aHViLWRhcmsnXG4gICAgfSxcbiAgICBtYXRoOiB0cnVlLFxuICAgIGltYWdlOiB7XG4gICAgICAvLyBcdTlFRDhcdThCQTRcdTc5ODFcdTc1MjhcdUZGMUJcdThCQkVcdTdGNkVcdTRFM0EgdHJ1ZSBcdTUzRUZcdTRFM0FcdTYyNDBcdTY3MDlcdTU2RkVcdTcyNDdcdTU0MkZcdTc1MjhcdTYxRDJcdTUyQTBcdThGN0RcdTMwMDJcbiAgICAgIGxhenlMb2FkaW5nOiB0cnVlXG4gICAgfSxcbiAgICBjb25maWc6IChtZCkgPT4ge1xuICAgICAgLy8gXHU0RjdGXHU3NTI4IG1hcmtkb3duLWl0LW1hcmsgXHU2M0QyXHU0RUY2XHU1NDJGXHU3NTI4ID09XHU5QUQ4XHU0RUFFPT0gXHU4QkVEXHU2Q0Q1XG4gICAgICBtZC51c2UobWFya2Rvd25JdE1hcmspXG4gICAgICBcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1ODFFQVx1NUI5QVx1NEU0OVx1NTZGRVx1NzI0N1x1NTkyN1x1NUMwRlx1NjNEMlx1NEVGNlxuICAgICAgbWQudXNlKGltYWdlU2l6ZVBsdWdpbilcbiAgICB9XG4gIH0sXG5cbiAgLy8gXHU3QUQ5XHU3MEI5XHU1NzMwXHU1NkZFXG4gIHNpdGVtYXA6IHtcbiAgICAvLyBHaXRIdWIgUGFnZXMgXHU5ODc5XHU3NkVFXHU3QUQ5XHU3MEI5XHU3Njg0XHU1QjhDXHU2NTc0XHU0RTNCXHU5ODc1XHU1NzMwXHU1NzQwXG4gICAgaG9zdG5hbWU6ICdodHRwczovL2NoZW53ZWlnYW8uZ2l0aHViLmlvL2Jsb2d2Mi8nXG4gIH0sXG5cbiAgLy8gXHU2NTJGXHU2MzAxIGZyb250IG1hdHRlciBcdTY1NzBcdTYzNkVcdTU5MDRcdTc0MDZcbiAgdHJhbnNmb3JtUGFnZURhdGEocGFnZURhdGEpIHtcbiAgICAvLyBcdTU5MDRcdTc0MDZcdTk4NzVcdTk3NjJcdTc2ODQgZnJvbnQgbWF0dGVyIFx1NjU3MFx1NjM2RVxuICAgIGNvbnN0IGZyb250bWF0dGVyID0gcGFnZURhdGEuZnJvbnRtYXR0ZXJcblxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjcwOSB0aXRsZVx1RkYwQ1x1NEY3Rlx1NzUyOCBmcm9udCBtYXR0ZXIgXHU0RTJEXHU3Njg0IHRpdGxlIFx1ODk4Nlx1NzZENlx1OUVEOFx1OEJBNFx1NjgwN1x1OTg5OFxuICAgIGlmIChmcm9udG1hdHRlci50aXRsZSkge1xuICAgICAgcGFnZURhdGEudGl0bGUgPSBmcm9udG1hdHRlci50aXRsZVxuICAgIH1cblxuICAgIC8vIFx1NTkwNFx1NzQwNlx1NjVFNVx1NjcxRlx1NjgzQ1x1NUYwRlxuICAgIGlmIChmcm9udG1hdHRlci5kYXRlKSB7XG4gICAgICAvLyBcdTc4NkVcdTRGRERcdTY1RTVcdTY3MUZcdTY4M0NcdTVGMEZcdTZCNjNcdTc4NkVcbiAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShmcm9udG1hdHRlci5kYXRlKVxuICAgICAgaWYgKCFpc05hTihkYXRlLmdldFRpbWUoKSkpIHtcbiAgICAgICAgZnJvbnRtYXR0ZXIuZm9ybWF0dGVkRGF0ZSA9IGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCd6aC1DTicsIHtcbiAgICAgICAgICB5ZWFyOiAnbnVtZXJpYycsXG4gICAgICAgICAgbW9udGg6ICdsb25nJyxcbiAgICAgICAgICBkYXk6ICdudW1lcmljJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFx1NTkwNFx1NzQwNlx1NTIwNlx1N0M3Qlx1NEZFMVx1NjA2RlxuICAgIGlmIChmcm9udG1hdHRlci5jYXRlZ29yeSkge1xuICAgICAgLy8gXHU3ODZFXHU0RkREIGNhdGVnb3J5IFx1NjYyRlx1NjU3MFx1N0VDNFx1NjgzQ1x1NUYwRlxuICAgICAgaWYgKHR5cGVvZiBmcm9udG1hdHRlci5jYXRlZ29yeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZnJvbnRtYXR0ZXIuY2F0ZWdvcnkgPSBbZnJvbnRtYXR0ZXIuY2F0ZWdvcnldXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VEYXRhXG4gIH0sXG5cbiAgLy8gXHU2NUIwXHU1ODlFXHVGRjFBXHU2ODM5XHU2MzZFXHU5ODc1XHU5NzYyXHU0RTBFXHU3QUQ5XHU3MEI5XHU0RkUxXHU2MDZGXHU1MkE4XHU2MDAxXHU3NTFGXHU2MjEwIGhlYWRcdUZGMDhjYW5vbmljYWwvT0cvVHdpdHRlclx1RkYwOVxuICB0cmFuc2Zvcm1IZWFkOiAoeyBwYWdlLCBzaXRlIH0pID0+IHtcbiAgICBjb25zdCBob3N0bmFtZSA9IHNpdGU/LnNpdGVtYXA/Lmhvc3RuYW1lIHx8ICcnXG4gICAgY29uc3QgcGFnZVBhdGggPSBwYWdlPy5yZWxhdGl2ZVBhdGggPyBwYWdlLnJlbGF0aXZlUGF0aC5yZXBsYWNlKC9cXC5tZCQvLCAnJykgOiAnJ1xuICAgIGNvbnN0IGNhbm9uaWNhbFVybCA9IGhvc3RuYW1lICYmIHBhZ2VQYXRoID8gYCR7aG9zdG5hbWV9LyR7cGFnZVBhdGh9YCA6ICcnXG4gICAgY29uc3QgdGl0bGUgPSBwYWdlPy50aXRsZSB8fCBzaXRlPy50aXRsZSB8fCAnU2l0ZSdcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHBhZ2U/LmRlc2NyaXB0aW9uIHx8IHNpdGU/LmRlc2NyaXB0aW9uIHx8ICcnXG4gICAgY29uc3QgdGFncyA9IFtcbiAgICAgIGNhbm9uaWNhbFVybFxuICAgICAgICA/IFsnbGluaycsIHsgcmVsOiAnY2Fub25pY2FsJywgaHJlZjogY2Fub25pY2FsVXJsIH1dXG4gICAgICAgIDogbnVsbCxcbiAgICAgIFsnbWV0YScsIHsgbmFtZTogJ2Rlc2NyaXB0aW9uJywgY29udGVudDogZGVzY3JpcHRpb24gfV0sXG4gICAgICBbJ21ldGEnLCB7IHByb3BlcnR5OiAnb2c6dGl0bGUnLCBjb250ZW50OiB0aXRsZSB9XSxcbiAgICAgIFsnbWV0YScsIHsgcHJvcGVydHk6ICdvZzpkZXNjcmlwdGlvbicsIGNvbnRlbnQ6IGRlc2NyaXB0aW9uIH1dLFxuICAgICAgY2Fub25pY2FsVXJsID8gWydtZXRhJywgeyBwcm9wZXJ0eTogJ29nOnVybCcsIGNvbnRlbnQ6IGNhbm9uaWNhbFVybCB9XSA6IG51bGwsXG4gICAgICBbJ21ldGEnLCB7IHByb3BlcnR5OiAnb2c6dHlwZScsIGNvbnRlbnQ6ICd3ZWJzaXRlJyB9XSxcbiAgICAgIFsnbWV0YScsIHsgbmFtZTogJ3R3aXR0ZXI6Y2FyZCcsIGNvbnRlbnQ6ICdzdW1tYXJ5X2xhcmdlX2ltYWdlJyB9XSxcbiAgICAgIFsnbWV0YScsIHsgbmFtZTogJ3R3aXR0ZXI6dGl0bGUnLCBjb250ZW50OiB0aXRsZSB9XSxcbiAgICAgIFsnbWV0YScsIHsgbmFtZTogJ3R3aXR0ZXI6ZGVzY3JpcHRpb24nLCBjb250ZW50OiBkZXNjcmlwdGlvbiB9XVxuICAgIF0uZmlsdGVyKEJvb2xlYW4pXG5cbiAgICAvLyBcdTgyRTUgZnJvbnRtYXR0ZXIgXHU1QjU4XHU1NzI4XHU2NTg3XHU3QUUwXHU1MTQzXHU2NTcwXHU2MzZFXHVGRjBDXHU2Q0U4XHU1MTY1IEpTT04tTEQgXHU3RUQzXHU2Nzg0XHU1MzE2XHU2NTcwXHU2MzZFXG4gICAgY29uc3QgZm0gPSBwYWdlPy5mcm9udG1hdHRlciB8fCB7fVxuICAgIGNvbnN0IGFydGljbGVUaXRsZSA9IGZtLnRpdGxlIHx8IHRpdGxlXG4gICAgY29uc3QgZGF0ZVB1Ymxpc2hlZCA9IGZtLmRhdGUgfHwgbnVsbFxuICAgIGNvbnN0IGRhdGVNb2RpZmllZCA9IGZtLnVwZGF0ZWQgfHwgZm0ubGFzdFVwZGF0ZWQgfHwgbnVsbFxuICAgIGNvbnN0IGF1dGhvck5hbWUgPSBmbS5hdXRob3IgfHwgKHNpdGU/LnRpdGxlID8gU3RyaW5nKHNpdGUudGl0bGUpIDogdW5kZWZpbmVkKVxuICAgIGNvbnN0IGtleXdvcmRzID0gQXJyYXkuaXNBcnJheShmbS50YWdzKVxuICAgICAgPyBmbS50YWdzXG4gICAgICA6ICh0eXBlb2YgZm0udGFncyA9PT0gJ3N0cmluZycgPyBmbS50YWdzLnNwbGl0KCcsJykubWFwKHMgPT4gcy50cmltKCkpLmZpbHRlcihCb29sZWFuKSA6IFtdKVxuICAgIGlmIChhcnRpY2xlVGl0bGUgJiYgKGRhdGVQdWJsaXNoZWQgfHwgZGF0ZU1vZGlmaWVkKSkge1xuICAgICAgY29uc3QganNvbkxkID0ge1xuICAgICAgICAnQGNvbnRleHQnOiAnaHR0cHM6Ly9zY2hlbWEub3JnJyxcbiAgICAgICAgJ0B0eXBlJzogJ0FydGljbGUnLFxuICAgICAgICBoZWFkbGluZTogYXJ0aWNsZVRpdGxlLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgLi4uKGNhbm9uaWNhbFVybCA/IHsgdXJsOiBjYW5vbmljYWxVcmwgfSA6IHt9KSxcbiAgICAgICAgLi4uKGtleXdvcmRzPy5sZW5ndGggPyB7IGtleXdvcmRzOiBrZXl3b3Jkcy5qb2luKCcsICcpIH0gOiB7fSksXG4gICAgICAgIC4uLihhdXRob3JOYW1lID8geyBhdXRob3I6IHsgJ0B0eXBlJzogJ1BlcnNvbicsIG5hbWU6IGF1dGhvck5hbWUgfSB9IDoge30pLFxuICAgICAgICAuLi4oZGF0ZVB1Ymxpc2hlZCA/IHsgZGF0ZVB1Ymxpc2hlZDogbmV3IERhdGUoZGF0ZVB1Ymxpc2hlZCkudG9JU09TdHJpbmcoKSB9IDoge30pLFxuICAgICAgICAuLi4oZGF0ZU1vZGlmaWVkID8geyBkYXRlTW9kaWZpZWQ6IG5ldyBEYXRlKGRhdGVNb2RpZmllZCkudG9JU09TdHJpbmcoKSB9IDoge30pXG4gICAgICB9XG4gICAgICB0YWdzLnB1c2goWydzY3JpcHQnLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9sZCtqc29uJyB9LCBKU09OLnN0cmluZ2lmeShqc29uTGQpXSlcbiAgICB9XG5cbiAgICAvLyBcdTY1QjBcdTU4OUVcdUZGMUFcdTY4MzlcdTYzNkVcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTRFM0FcdTUyMDZcdTY3OTBcdTU3REZcdTU0MERcdTZERkJcdTUyQTBcdTk4ODRcdThGREVcdTYzQTVcdTRFMEUgRE5TIFx1OTg4NFx1ODlFM1x1Njc5MFxuICAgIGNvbnN0IHJhd0FuYWx5dGljc1VybCA9ICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuVklURV9BTkFMWVRJQ1NfVVJMKSB8fCAnJ1xuICAgIGlmIChyYXdBbmFseXRpY3NVcmwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IG5ldyBVUkwocmF3QW5hbHl0aWNzVXJsKS5vcmlnaW5cbiAgICAgICAgdGFncy5wdXNoKFsnbGluaycsIHsgcmVsOiAncHJlY29ubmVjdCcsIGhyZWY6IG9yaWdpbiB9XSlcbiAgICAgICAgdGFncy5wdXNoKFsnbGluaycsIHsgcmVsOiAnZG5zLXByZWZldGNoJywgaHJlZjogb3JpZ2luIH1dKVxuICAgICAgfSBjYXRjaCB7fVxuICAgIH1cblxuICAgIHJldHVybiB0YWdzXG4gIH1cbn0pIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy91dGlscy9nZW5lcmF0ZVRpbWVsaW5lLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy91dGlscy9nZW5lcmF0ZVRpbWVsaW5lLmpzXCI7aW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnXG5pbXBvcnQgeyBwYXJzZUZyb250bWF0dGVyIH0gZnJvbSAnLi9mcm9udG1hdHRlci5qcydcblxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKVxuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpXG5cbi8qKlxuICogXHU3NTFGXHU2MjEwXHU2NUY2XHU5NUY0XHU3RUJGXHU2NTcwXHU2MzZFXG4gKiBcdTYyNkJcdTYzQ0YgZG9jcyBcdTc2RUVcdTVGNTVcdTRFMEJcdTc2ODRcdTYyNDBcdTY3MDkgLm1kIFx1NjU4N1x1NEVGNlx1RkYwQ1x1NjNEMFx1NTNENlx1NjU4N1x1NEVGNlx1NEZFMVx1NjA2Rlx1NzUxRlx1NjIxMFx1NjVGNlx1OTVGNFx1N0VCRlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVUaW1lbGluZURhdGEoKSB7XG4gIGNvbnN0IGRvY3NEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vJylcbiAgY29uc3QgdGltZWxpbmVEYXRhID0gW11cblxuICBmdW5jdGlvbiBzY2FuRGlyZWN0b3J5KGRpciwgcmVsYXRpdmVQYXRoID0gJycpIHtcbiAgICBjb25zdCBpdGVtcyA9IGZzLnJlYWRkaXJTeW5jKGRpcilcbiAgICBcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKGRpciwgaXRlbSlcbiAgICAgIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhmdWxsUGF0aClcbiAgICAgIFxuICAgICAgLy8gXHU4REYzXHU4RkM3IC52aXRlcHJlc3MgXHU3NkVFXHU1RjU1XHU1NDhDIG5vZGVfbW9kdWxlc1xuICAgICAgaWYgKGl0ZW0uc3RhcnRzV2l0aCgnLicpIHx8IGl0ZW0gPT09ICdub2RlX21vZHVsZXMnIHx8IGl0ZW0gPT09ICdwdWJsaWMnKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgc2NhbkRpcmVjdG9yeShmdWxsUGF0aCwgcGF0aC5qb2luKHJlbGF0aXZlUGF0aCwgaXRlbSkpXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uZW5kc1dpdGgoJy5tZCcpICYmIGl0ZW0gIT09ICdpbmRleC5tZCcpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVGaWxlUGF0aCA9IHBhdGguam9pbihyZWxhdGl2ZVBhdGgsIGl0ZW0pXG4gICAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZ1bGxQYXRoLCAndXRmLTgnKVxuICAgICAgICBcbiAgICAgICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBwYXJzZUZyb250bWF0dGVyKGZpbGVDb250ZW50KVxuICAgICAgICAgXG4gICAgICAgIC8vIFx1NjNEMFx1NTNENlx1NjgwN1x1OTg5OFxuICAgICAgICBsZXQgdGl0bGUgPSBmcm9udG1hdHRlcj8udGl0bGVcbiAgICAgICAgaWYgKCF0aXRsZSkge1xuICAgICAgICAgIGNvbnN0IHRpdGxlTWF0Y2ggPSBmaWxlQ29udGVudC5tYXRjaCgvXiNcXHMrKC4rKSQvbSlcbiAgICAgICAgICB0aXRsZSA9IHRpdGxlTWF0Y2ggPyB0aXRsZU1hdGNoWzFdIDogaXRlbS5yZXBsYWNlKCcubWQnLCAnJylcbiAgICAgICAgfVxuICAgICAgICAgXG4gICAgICAgIC8vIFx1NjNEMFx1NTNENlx1NjNDRlx1OEZGMFxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSBmcm9udG1hdHRlcj8uZGVzY3JpcHRpb25cbiAgICAgICAgaWYgKCFkZXNjcmlwdGlvbikge1xuICAgICAgICAgIC8vIFx1NjNEMFx1NTNENlx1N0IyQ1x1NEUwMFx1NkJCNVx1OTc1RVx1NjgwN1x1OTg5OFx1NTE4NVx1NUJCOVx1NEY1Q1x1NEUzQVx1NjNDRlx1OEZGMFxuICAgICAgICAgIGNvbnN0IGNvbnRlbnRXaXRob3V0RnJvbnRtYXR0ZXIgPSAoZnJvbnRtYXR0ZXIgJiYgT2JqZWN0LmtleXMoZnJvbnRtYXR0ZXIpLmxlbmd0aCA+IDApXG4gICAgICAgICAgICA/IGZpbGVDb250ZW50LnJlcGxhY2UoL14tLS1cXHMqXFxuW1xcc1xcU10qP1xcbi0tLVxccypcXG4vLCAnJylcbiAgICAgICAgICAgIDogZmlsZUNvbnRlbnRcbiAgICAgICAgICBjb25zdCBwYXJhZ3JhcGhzID0gY29udGVudFdpdGhvdXRGcm9udG1hdHRlci5zcGxpdCgnXFxuJykuZmlsdGVyKGxpbmUgPT4gXG4gICAgICAgICAgICBsaW5lLnRyaW0oKSAmJiAhbGluZS5zdGFydHNXaXRoKCcjJykgJiYgIWxpbmUuc3RhcnRzV2l0aCgnYGBgJylcbiAgICAgICAgICApXG4gICAgICAgICAgZGVzY3JpcHRpb24gPSBwYXJhZ3JhcGhzWzBdID8gcGFyYWdyYXBoc1swXS5zdWJzdHJpbmcoMCwgMTUwKSArICcuLi4nIDogJydcbiAgICAgICAgfVxuICAgICAgICAgXG4gICAgICAgIC8vIFx1ODNCN1x1NTNENlx1NjU4N1x1NEVGNlx1NjVGNlx1OTVGNFx1NEZFMVx1NjA2RlxuICAgICAgICBjb25zdCBjcmVhdGVUaW1lID0gZnJvbnRtYXR0ZXI/LmRhdGUgfHwgc3RhdC5iaXJ0aHRpbWVcbiAgICAgICAgY29uc3QgdXBkYXRlVGltZSA9IGZyb250bWF0dGVyPy51cGRhdGVkIHx8IHN0YXQubXRpbWVcbiAgICAgICAgIFxuICAgICAgICAvLyBcdTc4NkVcdTVCOUFcdTUyMDZcdTdDN0JcbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSByZWxhdGl2ZVBhdGguc3BsaXQocGF0aC5zZXApWzBdIHx8ICdnZW5lcmFsJ1xuICAgICAgICAgXG4gICAgICAgIHRpbWVsaW5lRGF0YS5wdXNoKHtcbiAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICBwYXRoOiAnLycgKyByZWxhdGl2ZUZpbGVQYXRoLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKCcubWQnLCAnJyksXG4gICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoY3JlYXRlVGltZSkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSh1cGRhdGVUaW1lKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIHRhZ3M6IEFycmF5LmlzQXJyYXkoZnJvbnRtYXR0ZXI/LnRhZ3MpXG4gICAgICAgICAgICA/IGZyb250bWF0dGVyLnRhZ3NcbiAgICAgICAgICAgIDogKHR5cGVvZiBmcm9udG1hdHRlcj8udGFncyA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IGZyb250bWF0dGVyLnRhZ3Muc3BsaXQoJywnKS5tYXAodCA9PiB0LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAgICAgOiBbXSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHNjYW5EaXJlY3RvcnkoZG9jc0RpcilcbiAgXG4gIC8vIFx1NjMwOVx1NTIxQlx1NUVGQVx1NjVGNlx1OTVGNFx1NTAxMlx1NUU4Rlx1NjM5Mlx1NTIxN1xuICB0aW1lbGluZURhdGEuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYi5jcmVhdGVUaW1lKSAtIG5ldyBEYXRlKGEuY3JlYXRlVGltZSkpXG4gIFxuICByZXR1cm4gdGltZWxpbmVEYXRhXG59XG5cbi8qKlxuICogXHU1QzA2XHU2NUY2XHU5NUY0XHU3RUJGXHU2NTcwXHU2MzZFXHU1MTk5XHU1MTY1XHU2NTg3XHU0RUY2XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVRpbWVsaW5lRGF0YSgpIHtcbiAgY29uc3QgdGltZWxpbmVEYXRhID0gZ2VuZXJhdGVUaW1lbGluZURhdGEoKVxuICBjb25zdCBvdXRwdXRQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2RhdGEvdGltZWxpbmUuanNvbicpXG4gIFxuICAvLyBcdTc4NkVcdTRGRERcdTc2RUVcdTVGNTVcdTVCNThcdTU3MjhcbiAgY29uc3Qgb3V0cHV0RGlyID0gcGF0aC5kaXJuYW1lKG91dHB1dFBhdGgpXG4gIGlmICghZnMuZXhpc3RzU3luYyhvdXRwdXREaXIpKSB7XG4gICAgZnMubWtkaXJTeW5jKG91dHB1dERpciwgeyByZWN1cnNpdmU6IHRydWUgfSlcbiAgfVxuICBcbiAgZnMud3JpdGVGaWxlU3luYyhvdXRwdXRQYXRoLCBKU09OLnN0cmluZ2lmeSh0aW1lbGluZURhdGEsIG51bGwsIDIpKVxuICBjb25zb2xlLmxvZyhgVGltZWxpbmUgZGF0YSBnZW5lcmF0ZWQ6ICR7dGltZWxpbmVEYXRhLmxlbmd0aH0gYXJ0aWNsZXNgKVxuICByZXR1cm4gdGltZWxpbmVEYXRhXG59XG5cbi8vIFx1NTk4Mlx1Njc5Q1x1NzZGNFx1NjNBNVx1OEZEMFx1ODg0Q1x1NkI2NFx1ODExQVx1NjcyQ1xuaWYgKGltcG9ydC5tZXRhLnVybCA9PT0gYGZpbGU6Ly8ke3Byb2Nlc3MuYXJndlsxXX1gKSB7XG4gIHdyaXRlVGltZWxpbmVEYXRhKClcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL3V0aWxzL2Zyb250bWF0dGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy91dGlscy9mcm9udG1hdHRlci5qc1wiO2ltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnXG5cbi8qKlxuICogXHU4OUUzXHU2NzkwIG1hcmtkb3duIFx1NTE4NVx1NUJCOVx1NEUyRFx1NzY4NCBmcm9udG1hdHRlclxuICogXHU4RkQ0XHU1NkRFXHU1QkY5XHU4QzYxXHVGRjBDXHU0RkREXHU2MzAxXHU2NTcwXHU3RUM0L1x1NUJGOVx1OEM2MVx1N0I0OVx1NTkwRFx1Njc0Mlx1N0VEM1x1Njc4NFx1RkYwQ1x1NEUwRFx1NTA1QVx1NjI0Qlx1NURFNSBzcGxpdCBcdTU5MDRcdTc0MDZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRnJvbnRtYXR0ZXIoY29udGVudCA9ICcnKSB7XG4gIGlmICh0eXBlb2YgY29udGVudCAhPT0gJ3N0cmluZycpIHJldHVybiB7fVxuICBjb25zdCBtYXRjaCA9IGNvbnRlbnQubWF0Y2goL14tLS1cXHMqXFxuKFtcXHNcXFNdKj8pXFxuLS0tLylcbiAgaWYgKCFtYXRjaCkgcmV0dXJuIHt9XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IHlhbWwubG9hZChtYXRjaFsxXSlcbiAgICByZXR1cm4gKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSA/IGRhdGEgOiB7fVxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge31cbiAgfVxufVxuXG4vKipcbiAqIFx1NEVDRVx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NFx1NzZGNFx1NjNBNVx1OEJGQlx1NTNENiBmcm9udG1hdHRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VGcm9udG1hdHRlckZyb21GaWxlKGZpbGVQYXRoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0Zi04JylcbiAgICByZXR1cm4gcGFyc2VGcm9udG1hdHRlcihjb250ZW50KVxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge31cbiAgfVxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvdXRpbHMvZ2VuZXJhdGVHaXRIaXN0b3J5RGF0YS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvdXRpbHMvZ2VuZXJhdGVHaXRIaXN0b3J5RGF0YS5qc1wiO2ltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJ1xuXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSlcblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1ODdcdTRFRjZcdTc2ODQgR2l0IFx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gXHU2NTg3XHU0RUY2XHU3NkY4XHU1QkY5XHU0RThFXHU0RUQzXHU1RTkzXHU2ODM5XHU3NkVFXHU1RjU1XHU3Njg0XHU4REVGXHU1Rjg0XG4gKiBAcGFyYW0ge251bWJlcn0gbWF4RW50cmllcyAtIFx1NjcwMFx1NTkyN1x1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVx1Njc2MVx1NjU3MFxuICogQHJldHVybnMge0FycmF5fSBcdTUzODZcdTUzRjJcdThCQjBcdTVGNTVcdTY1NzBcdTdFQzRcbiAqL1xuZnVuY3Rpb24gZ2V0RmlsZUdpdEhpc3RvcnkoZmlsZVBhdGgsIG1heEVudHJpZXMgPSAxMCkge1xuICB0cnkge1xuICAgIGNvbnN0IHJlcG9Sb290ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uLy4uLycpXG4gICAgLy8gXHU2REZCXHU1MkEwIC0tZm9sbG93IFx1NTNDMlx1NjU3MFx1NEVFNVx1OEZGRFx1OEUyQVx1NjU4N1x1NEVGNlx1NzlGQlx1NTJBOFx1NTM4Nlx1NTNGMlxuICAgIGNvbnN0IGdpdENvbW1hbmQgPSBgZ2l0IGxvZyAtLWZvbGxvdyAtLWZvcm1hdD1cIiVofCVhbnwlYWR8JXNcIiAtLWRhdGU9c2hvcnQgLSR7bWF4RW50cmllc30gLS0gXCIke2ZpbGVQYXRofVwiYFxuICAgIFxuICAgIGNvbnN0IG91dHB1dCA9IGV4ZWNTeW5jKGdpdENvbW1hbmQsIHsgXG4gICAgICBjd2Q6IHJlcG9Sb290LCBcbiAgICAgIGVuY29kaW5nOiAndXRmLTgnLFxuICAgICAgc3RkaW86IFsncGlwZScsICdwaXBlJywgJ3BpcGUnXVxuICAgIH0pXG4gICAgXG4gICAgaWYgKCFvdXRwdXQudHJpbSgpKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG91dHB1dC50cmltKCkuc3BsaXQoJ1xcbicpLm1hcChsaW5lID0+IHtcbiAgICAgIGNvbnN0IFtoYXNoLCBhdXRob3IsIGRhdGUsIHN1YmplY3RdID0gbGluZS5zcGxpdCgnfCcpXG4gICAgICByZXR1cm4ge1xuICAgICAgICBoYXNoOiBoYXNoPy50cmltKCksXG4gICAgICAgIGF1dGhvcjogYXV0aG9yPy50cmltKCksXG4gICAgICAgIGRhdGU6IGRhdGU/LnRyaW0oKSxcbiAgICAgICAgc3ViamVjdDogc3ViamVjdD8udHJpbSgpXG4gICAgICB9XG4gICAgfSkuZmlsdGVyKGVudHJ5ID0+IGVudHJ5Lmhhc2gpIC8vIFx1OEZDN1x1NkVFNFx1NjM4OVx1NjVFMFx1NjU0OFx1NzY4NFx1Njc2MVx1NzZFRVxuICAgIFxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUud2FybihgRmFpbGVkIHRvIGdldCBnaXQgaGlzdG9yeSBmb3IgJHtmaWxlUGF0aH06YCwgZXJyb3IubWVzc2FnZSlcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG4vKipcbiAqIFx1NzUxRlx1NjIxMFx1NjI0MFx1NjcwOVx1NjU4N1x1Njg2M1x1NzY4NFx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVx1NjU3MFx1NjM2RVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVBbGxHaXRIaXN0b3J5RGF0YSgpIHtcbiAgY29uc3QgZG9jc0RpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi8nKVxuICBjb25zdCBoaXN0b3J5RGF0YSA9IHt9XG4gIGxldCBwcm9jZXNzZWRDb3VudCA9IDBcbiAgXG4gIGZ1bmN0aW9uIHNjYW5EaXJlY3RvcnkoZGlyLCByZWxhdGl2ZVBhdGggPSAnJykge1xuICAgIGNvbnN0IGl0ZW1zID0gZnMucmVhZGRpclN5bmMoZGlyKVxuICAgIFxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oZGlyLCBpdGVtKVxuICAgICAgY29uc3Qgc3RhdCA9IGZzLnN0YXRTeW5jKGZ1bGxQYXRoKVxuICAgICAgXG4gICAgICAvLyBcdThERjNcdThGQzcgLnZpdGVwcmVzcyBcdTc2RUVcdTVGNTVcdTU0OENcdTUxNzZcdTRFRDZcdTRFMERcdTk3MDBcdTg5ODFcdTc2ODRcdTc2RUVcdTVGNTVcbiAgICAgIGlmIChpdGVtLnN0YXJ0c1dpdGgoJy4nKSB8fCBpdGVtID09PSAnbm9kZV9tb2R1bGVzJyB8fCBpdGVtID09PSAncHVibGljJykge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHNjYW5EaXJlY3RvcnkoZnVsbFBhdGgsIHBhdGguam9pbihyZWxhdGl2ZVBhdGgsIGl0ZW0pKVxuICAgICAgfSBlbHNlIGlmIChpdGVtLmVuZHNXaXRoKCcubWQnKSAmJiBpdGVtICE9PSAndGltZWxpbmUubWQnKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlRmlsZVBhdGggPSBwYXRoLmpvaW4ocmVsYXRpdmVQYXRoLCBpdGVtKS5yZXBsYWNlKC9cXFxcL2csICcvJylcbiAgICAgICAgY29uc3QgcmVwb1JlbGF0aXZlUGF0aCA9IGBkb2NzLyR7cmVsYXRpdmVGaWxlUGF0aH1gXG4gICAgICAgIFxuICAgICAgICAvLyBcdTgzQjdcdTUzRDZcdTUzODZcdTUzRjJcdThCQjBcdTVGNTVcbiAgICAgICAgY29uc3QgaGlzdG9yeSA9IGdldEZpbGVHaXRIaXN0b3J5KHJlcG9SZWxhdGl2ZVBhdGgpXG4gICAgICAgIFxuICAgICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY1ODdcdTY4NjNcdThERUZcdTVGODRcdTRGNUNcdTRFM0FcdTk1MkVcdUZGMDhcdTUzQkJcdTYzODkgLm1kIFx1NjI2OVx1NUM1NVx1NTQwRFx1RkYwOVxuICAgICAgICBjb25zdCBkb2NQYXRoID0gJy8nICsgcmVsYXRpdmVGaWxlUGF0aC5yZXBsYWNlKCcubWQnLCAnJylcbiAgICAgICAgaGlzdG9yeURhdGFbZG9jUGF0aF0gPSB7XG4gICAgICAgICAgZmlsZVBhdGg6IHJlbGF0aXZlRmlsZVBhdGgsXG4gICAgICAgICAgaGlzdG9yeTogaGlzdG9yeSxcbiAgICAgICAgICBsYXN0VXBkYXRlZDogaGlzdG9yeS5sZW5ndGggPiAwID8gaGlzdG9yeVswXS5kYXRlIDogbnVsbCxcbiAgICAgICAgICB0b3RhbENvbW1pdHM6IGhpc3RvcnkubGVuZ3RoXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHByb2Nlc3NlZENvdW50KytcbiAgICAgICAgY29uc29sZS5sb2coYFByb2Nlc3NlZCBnaXQgaGlzdG9yeSBmb3I6ICR7cmVsYXRpdmVGaWxlUGF0aH1gKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIHRvIGdlbmVyYXRlIGdpdCBoaXN0b3J5IGRhdGEgZm9yIGFsbCBkb2N1bWVudHMuLi4nKVxuICBzY2FuRGlyZWN0b3J5KGRvY3NEaXIpXG4gIGNvbnNvbGUubG9nKGBHaXQgaGlzdG9yeSBkYXRhIGdlbmVyYXRpb24gY29tcGxldGVkLiBQcm9jZXNzZWQgJHtwcm9jZXNzZWRDb3VudH0gZmlsZXMuYClcbiAgXG4gIHJldHVybiBoaXN0b3J5RGF0YVxufVxuXG4vKipcbiAqIFx1NUMwNlx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVx1NjU3MFx1NjM2RVx1NTE5OVx1NTE2NSBKU09OIFx1NjU4N1x1NEVGNlxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVHaXRIaXN0b3J5RGF0YSgpIHtcbiAgY29uc3QgaGlzdG9yeURhdGEgPSBnZW5lcmF0ZUFsbEdpdEhpc3RvcnlEYXRhKClcbiAgY29uc3Qgb3V0cHV0UGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9kYXRhL2dpdC1oaXN0b3J5Lmpzb24nKVxuICBcbiAgLy8gXHU3ODZFXHU0RkREXHU3NkVFXHU1RjU1XHU1QjU4XHU1NzI4XG4gIGNvbnN0IG91dHB1dERpciA9IHBhdGguZGlybmFtZShvdXRwdXRQYXRoKVxuICBpZiAoIWZzLmV4aXN0c1N5bmMob3V0cHV0RGlyKSkge1xuICAgIGZzLm1rZGlyU3luYyhvdXRwdXREaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXG4gIH1cbiAgXG4gIGZzLndyaXRlRmlsZVN5bmMob3V0cHV0UGF0aCwgSlNPTi5zdHJpbmdpZnkoaGlzdG9yeURhdGEsIG51bGwsIDIpKVxuICBjb25zb2xlLmxvZyhgR2l0IGhpc3RvcnkgZGF0YSB3cml0dGVuIHRvOiAke291dHB1dFBhdGh9YClcbiAgY29uc29sZS5sb2coYFRvdGFsIGRvY3VtZW50cyBwcm9jZXNzZWQ6ICR7T2JqZWN0LmtleXMoaGlzdG9yeURhdGEpLmxlbmd0aH1gKVxuICBcbiAgcmV0dXJuIGhpc3RvcnlEYXRhXG59XG5cbi8vIFx1NTk4Mlx1Njc5Q1x1NzZGNFx1NjNBNVx1OEZEMFx1ODg0Q1x1NkI2NFx1ODExQVx1NjcyQ1xuaWYgKGltcG9ydC5tZXRhLnVybCA9PT0gYGZpbGU6Ly8ke3Byb2Nlc3MuYXJndlsxXX1gKSB7XG4gIHdyaXRlR2l0SGlzdG9yeURhdGEoKVxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvdXRpbHMvZ2l0SGlzdG9yeUFQSS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvdXRpbHMvZ2l0SGlzdG9yeUFQSS5qc1wiO2ltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJ1xuXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSlcblxuZnVuY3Rpb24gaXNTYWZlUmVsYXRpdmVQYXRoKHApIHtcbiAgaWYgKCFwIHx8IHR5cGVvZiBwICE9PSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlXG4gIGlmIChwLmluY2x1ZGVzKCdcXDAnKSkgcmV0dXJuIGZhbHNlXG4gIGlmIChwLnN0YXJ0c1dpdGgoJy8nKSB8fCBwLnN0YXJ0c1dpdGgoJ1xcXFwnKSkgcmV0dXJuIGZhbHNlXG4gIGlmIChwLmluY2x1ZGVzKCcuLicpKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBcdTVCOUVcdTY1RjZcdTgzQjdcdTUzRDZcdTY1ODdcdTRFRjZcdTc2ODQgR2l0IFx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gXHU2NTg3XHU0RUY2XHU3NkY4XHU1QkY5XHU0RThFIGRvY3MgXHU3NkVFXHU1RjU1XHU3Njg0XHU4REVGXHU1Rjg0XG4gKiBAcGFyYW0ge251bWJlcn0gbWF4RW50cmllcyAtIFx1NjcwMFx1NTkyN1x1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVx1Njc2MVx1NjU3MFxuICogQHJldHVybnMge1Byb21pc2U8QXJyYXk+fSBcdTUzODZcdTUzRjJcdThCQjBcdTVGNTVcdTY1NzBcdTdFQzRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFJlYWx0aW1lR2l0SGlzdG9yeShmaWxlUGF0aCwgbWF4RW50cmllcyA9IDEwKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcG9Sb290ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uLy4uLycpXG4gICAgICBpZiAoIWlzU2FmZVJlbGF0aXZlUGF0aChmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ0ludmFsaWQgZmlsZSBwYXRoJykpXG4gICAgICB9XG4gICAgICBjb25zdCBkb2NzRGlyID0gcGF0aC5yZXNvbHZlKHJlcG9Sb290LCAnZG9jcycpXG4gICAgICBjb25zdCByZXNvbHZlZCA9IHBhdGgucmVzb2x2ZShkb2NzRGlyLCBmaWxlUGF0aClcbiAgICAgIGlmICghcmVzb2x2ZWQuc3RhcnRzV2l0aChkb2NzRGlyKSkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignUGF0aCBvdXRzaWRlIGRvY3MgZGlyZWN0b3J5JykpXG4gICAgICB9XG4gICAgICBjb25zdCBsaW1pdCA9IE1hdGgubWF4KDEsIE1hdGgubWluKE51bWJlcihtYXhFbnRyaWVzKSB8fCAxMCwgMTAwKSlcbiAgICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAgICdsb2cnLFxuICAgICAgICAnLS1mb2xsb3cnLFxuICAgICAgICAnLS1mb3JtYXQ9JWh8JWFufCVhZHwlcycsXG4gICAgICAgICctLWRhdGU9c2hvcnQnLFxuICAgICAgICBgLSR7bGltaXR9YCxcbiAgICAgICAgJy0tJyxcbiAgICAgICAgcGF0aC5yZWxhdGl2ZShyZXBvUm9vdCwgcmVzb2x2ZWQpXG4gICAgICBdXG4gICAgICBjb25zdCBjaGlsZCA9IHNwYXduKCdnaXQnLCBhcmdzLCB7IGN3ZDogcmVwb1Jvb3QgfSlcbiAgICAgIGxldCBzdGRvdXQgPSAnJ1xuICAgICAgbGV0IHN0ZGVyciA9ICcnXG4gICAgICBjb25zdCB0aW1lb3V0TXMgPSAzMDAwXG4gICAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRyeSB7IGNoaWxkLmtpbGwoJ1NJR0tJTEwnKSB9IGNhdGNoIHt9XG4gICAgICB9LCB0aW1lb3V0TXMpXG4gICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZCkgPT4geyBzdGRvdXQgKz0gU3RyaW5nKGQpIH0pXG4gICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoZCkgPT4geyBzdGRlcnIgKz0gU3RyaW5nKGQpIH0pXG4gICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0KVxuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgfSlcbiAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0KVxuICAgICAgICBpZiAoY29kZSAhPT0gMCkge1xuICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKHN0ZGVyci50cmltKCkgfHwgYGdpdCBleGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvdXQgPSBzdGRvdXQudHJpbSgpXG4gICAgICAgIGlmICghb3V0KSByZXR1cm4gcmVzb2x2ZShbXSlcbiAgICAgICAgY29uc3QgaGlzdG9yeSA9IG91dC5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xuICAgICAgICAgIGNvbnN0IFtoYXNoLCBhdXRob3IsIGRhdGUsIHN1YmplY3RdID0gbGluZS5zcGxpdCgnfCcpXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhhc2g6IGhhc2g/LnRyaW0oKSxcbiAgICAgICAgICAgIGF1dGhvcjogYXV0aG9yPy50cmltKCksXG4gICAgICAgICAgICBkYXRlOiBkYXRlPy50cmltKCksXG4gICAgICAgICAgICBzdWJqZWN0OiBzdWJqZWN0Py50cmltKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZpbHRlcihlID0+IGUuaGFzaClcbiAgICAgICAgcmVzb2x2ZShoaXN0b3J5KVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBWaXRlUHJlc3MgXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4IEFQSSBcdTU5MDRcdTc0MDZcdTUxRkRcdTY1NzBcbiAqIFx1NzUyOFx1NEU4RVx1NTcyOFx1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1NEUwQlx1NjNEMFx1NEY5Qlx1NUI5RVx1NjVGNiBnaXQgXHU1Mzg2XHU1M0YyXHU4QkIwXHU1RjU1IEFQSVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlR2l0SGlzdG9yeUFQSSgpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnZ2l0LWhpc3RvcnktYXBpJyxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvYXBpL2dpdC1oaXN0b3J5JywgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIGlmIChyZXEubWV0aG9kICE9PSAnR0VUJykge1xuICAgICAgICAgIHJldHVybiBuZXh0KClcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXEudXJsLCBgaHR0cDovLyR7cmVxLmhlYWRlcnMuaG9zdH1gKVxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KCdmaWxlJylcbiAgICAgICAgY29uc3QgbWF4UGFyYW0gPSBwYXJzZUludCh1cmwuc2VhcmNoUGFyYW1zLmdldCgnbWF4JykgfHwgJzEwJywgMTApXG4gICAgICAgIGNvbnN0IG1heEVudHJpZXMgPSBOdW1iZXIuaXNGaW5pdGUobWF4UGFyYW0pID8gTWF0aC5tYXgoMSwgTWF0aC5taW4obWF4UGFyYW0sIDEwMCkpIDogMTBcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMFxuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ01pc3NpbmcgZmlsZSBwYXJhbWV0ZXInIH0pKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGhpc3RvcnkgPSBhd2FpdCBnZXRSZWFsdGltZUdpdEhpc3RvcnkoZmlsZVBhdGgsIG1heEVudHJpZXMpXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gXHU2NTM2XHU3RDI3IENPUlNcdUZGMUFcdTRFQzVcdTU2REVcdTY2M0VcdThCRjdcdTZDNDJcdTY3NjVcdTZFOTBcdUZGMENcdTVFNzZcdTk2NTBcdTVCOUFcdTY1QjlcdTZDRDVcbiAgICAgICAgICBjb25zdCBvcmlnaW4gPSByZXEuaGVhZGVycy5vcmlnaW5cbiAgICAgICAgICBpZiAob3JpZ2luKSB7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCBvcmlnaW4pXG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdWYXJ5JywgJ09yaWdpbicpXG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCcpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJylcbiAgICAgICAgICBcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgICAgaGlzdG9yeSxcbiAgICAgICAgICAgIGxhc3RVcGRhdGVkOiBoaXN0b3J5Lmxlbmd0aCA+IDAgPyBoaXN0b3J5WzBdLmRhdGUgOiBudWxsLFxuICAgICAgICAgICAgdG90YWxDb21taXRzOiBoaXN0b3J5Lmxlbmd0aFxuICAgICAgICAgIH0pKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwXG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBlcnJvci5tZXNzYWdlIH0pKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvdXRpbHMvZ2VuZXJhdGVTaWRlYmFyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy91dGlscy9nZW5lcmF0ZVNpZGViYXIuanNcIjtpbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgcGFyc2VGcm9udG1hdHRlckZyb21GaWxlIH0gZnJvbSAnLi9mcm9udG1hdHRlci5qcydcblxuLyoqXG4gKiBcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTRGQTdcdThGQjlcdTY4MEZcdTkxNERcdTdGNkVcbiAqIFx1NjgzOVx1NjM2RSBkb2NzIFx1NjU4N1x1NEVGNlx1NTkzOVx1N0VEM1x1Njc4NFx1NjI2Qlx1NjNDRlx1NUU3Nlx1NzUxRlx1NjIxMCBWaXRlUHJlc3MgXHU0RkE3XHU4RkI5XHU2ODBGXHU5MTREXHU3RjZFXG4gKi9cblxuLy8gXHU5NzAwXHU4OTgxXHU1RkZEXHU3NTY1XHU3Njg0XHU2NTg3XHU0RUY2XHU1NDhDXHU2NTg3XHU0RUY2XHU1OTM5XG5jb25zdCBJR05PUkVfUEFUVEVSTlMgPSBbXG4gICcudml0ZXByZXNzJyxcbiAgJ25vZGVfbW9kdWxlcycsXG4gICcuZ2l0JyxcbiAgJy5EU19TdG9yZScsXG4gICdpbmRleC5tZCcsXG4gICdSRUFETUUubWQnXG5dXG5cbi8vIFx1OTcwMFx1ODk4MVx1NUZGRFx1NzU2NVx1NzY4NFx1NjU4N1x1NEVGNlx1NjI2OVx1NUM1NVx1NTQwRFxuY29uc3QgSUdOT1JFX0VYVEVOU0lPTlMgPSBbJy5qc29uJywgJy5qcycsICcudHMnLCAnLnZ1ZScsICcuY3NzJywgJy5zY3NzJywgJy5sZXNzJ11cblxuLyoqXG4gKiBcdTY4M0NcdTVGMEZcdTUzMTZcdTY1ODdcdTRFRjZcdTU0MERcdTRFM0FcdTY2M0VcdTc5M0FcdTY4MDdcdTk4OThcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlbmFtZSBcdTY1ODdcdTRFRjZcdTU0MERcdUZGMDhcdTRFMERcdTU0MkJcdTYyNjlcdTVDNTVcdTU0MERcdUZGMDlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFx1NjgzQ1x1NUYwRlx1NTMxNlx1NTQwRVx1NzY4NFx1NjgwN1x1OTg5OFxuICovXG5mdW5jdGlvbiBmb3JtYXRUaXRsZShmaWxlbmFtZSkge1xuICByZXR1cm4gZmlsZW5hbWVcbiAgICAucmVwbGFjZSgvWy1fXS9nLCAnICcpIC8vIFx1NUMwNlx1OEZERVx1NUI1N1x1N0IyNlx1NTQ4Q1x1NEUwQlx1NTIxMlx1N0VCRlx1NjZGRlx1NjM2Mlx1NEUzQVx1N0E3QVx1NjgzQ1xuICAgIC5yZXBsYWNlKC9cXGJcXHcvZywgbCA9PiBsLnRvVXBwZXJDYXNlKCkpIC8vIFx1OTk5Nlx1NUI1N1x1NkJDRFx1NTkyN1x1NTE5OVxuICAgIC50cmltKClcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1ODdcdTRFRjZcdTYyMTZcdTY1ODdcdTRFRjZcdTU5MzlcdTc2ODRcdTY2M0VcdTc5M0FcdTY4MDdcdTk4OThcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCBcdTY1ODdcdTRFRjZcdThERUZcdTVGODRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFx1NjU4N1x1NEVGNlx1NjIxNlx1NjU4N1x1NEVGNlx1NTkzOVx1NTQwRFx1NzlGMFxuICogQHBhcmFtIHtib29sZWFufSBpc0ZpbGUgXHU2NjJGXHU1NDI2XHU0RTNBXHU2NTg3XHU0RUY2XG4gKiBAcmV0dXJucyB7c3RyaW5nfSBcdTY2M0VcdTc5M0FcdTY4MDdcdTk4OThcbiAqL1xuZnVuY3Rpb24gZ2V0RGlzcGxheVRpdGxlKGZpbGVQYXRoLCBuYW1lLCBpc0ZpbGUgPSBmYWxzZSkge1xuICBpZiAoaXNGaWxlKSB7XG4gICAgLy8gXHU1QkY5XHU0RThFXHU2NTg3XHU0RUY2XHVGRjBDXHU1QzFEXHU4QkQ1XHU0RUNFIGZyb250bWF0dGVyIFx1NEUyRFx1ODNCN1x1NTNENiB0aXRsZVxuICAgIGNvbnN0IGZyb250bWF0dGVyID0gZXh0cmFjdEZyb250bWF0dGVyKGZpbGVQYXRoKVxuICAgIGlmIChmcm9udG1hdHRlci50aXRsZSkge1xuICAgICAgcmV0dXJuIGZyb250bWF0dGVyLnRpdGxlXG4gICAgfVxuICAgIFxuICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NkNBMVx1NjcwOSBmcm9udG1hdHRlciB0aXRsZVx1RkYwQ1x1NEY3Rlx1NzUyOFx1NjgzQ1x1NUYwRlx1NTMxNlx1NzY4NFx1NjU4N1x1NEVGNlx1NTQwRFxuICAgIGNvbnN0IG5hbWVXaXRob3V0RXh0ID0gcGF0aC5wYXJzZShuYW1lKS5uYW1lXG4gICAgcmV0dXJuIGZvcm1hdFRpdGxlKG5hbWVXaXRob3V0RXh0KVxuICB9IGVsc2Uge1xuICAgIC8vIFx1NUJGOVx1NEU4RVx1NjU4N1x1NEVGNlx1NTkzOVx1RkYwQ1x1NEY3Rlx1NzUyOFx1NjgzQ1x1NUYwRlx1NTMxNlx1NzY4NFx1NjU4N1x1NEVGNlx1NTkzOVx1NTQwRFxuICAgIHJldHVybiBmb3JtYXRUaXRsZShuYW1lKVxuICB9XG59XG5cbi8qKlxuICogXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1RTk0XHU4QkU1XHU1RkZEXHU3NTY1XHU2NTg3XHU0RUY2XHU2MjE2XHU2NTg3XHU0RUY2XHU1OTM5XG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBcdTY1ODdcdTRFRjZcdTYyMTZcdTY1ODdcdTRFRjZcdTU5MzlcdTU0MERcdTc5RjBcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNGaWxlIFx1NjYyRlx1NTQyNlx1NEUzQVx1NjU4N1x1NEVGNlxuICogQHJldHVybnMge2Jvb2xlYW59IFx1NjYyRlx1NTQyNlx1NUU5NFx1OEJFNVx1NUZGRFx1NzU2NVxuICovXG5mdW5jdGlvbiBzaG91bGRJZ25vcmUobmFtZSwgaXNGaWxlID0gZmFsc2UpIHtcbiAgLy8gXHU2OEMwXHU2N0U1XHU1RkZEXHU3NTY1XHU2QTIxXHU1RjBGXG4gIGlmIChJR05PUkVfUEFUVEVSTlMuc29tZShwYXR0ZXJuID0+IG5hbWUuaW5jbHVkZXMocGF0dGVybikpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBcbiAgLy8gXHU2OEMwXHU2N0U1XHU5NjkwXHU4NUNGXHU2NTg3XHU0RUY2XG4gIGlmIChuYW1lLnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgXG4gIC8vIFx1NUJGOVx1NEU4RVx1NjU4N1x1NEVGNlx1RkYwQ1x1NjhDMFx1NjdFNVx1NjI2OVx1NUM1NVx1NTQwRFxuICBpZiAoaXNGaWxlKSB7XG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKG5hbWUpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZXh0ICE9PSAnLm1kJykge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFx1OTAxMlx1NUY1Mlx1NjI2Qlx1NjNDRlx1NzZFRVx1NUY1NVx1NzUxRlx1NjIxMFx1NEZBN1x1OEZCOVx1NjgwRlx1OTg3OVxuICogQHBhcmFtIHtzdHJpbmd9IGRpclBhdGggXHU3NkVFXHU1RjU1XHU4REVGXHU1Rjg0XG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVBhdGggXHU1N0ZBXHU3ODQwXHU4REVGXHU1Rjg0XHVGRjA4XHU3NTI4XHU0RThFXHU3NTFGXHU2MjEwXHU5NEZFXHU2M0E1XHVGRjA5XG4gKiBAcGFyYW0ge251bWJlcn0gZGVwdGggXHU1RjUzXHU1MjREXHU2REYxXHU1RUE2XG4gKiBAcmV0dXJucyB7QXJyYXl9IFx1NEZBN1x1OEZCOVx1NjgwRlx1OTg3OVx1NjU3MFx1N0VDNFxuICovXG5mdW5jdGlvbiBzY2FuRGlyZWN0b3J5KGRpclBhdGgsIGJhc2VQYXRoID0gJycsIGRlcHRoID0gMCkge1xuICBjb25zdCBpdGVtcyA9IFtdXG4gIFxuICB0cnkge1xuICAgIGNvbnN0IGVudHJpZXMgPSBmcy5yZWFkZGlyU3luYyhkaXJQYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSlcbiAgICBcbiAgICAvLyBcdTUyMDZcdTUyMkJcdTU5MDRcdTc0MDZcdTY1ODdcdTRFRjZcdTU5MzlcdTU0OENcdTY1ODdcdTRFRjZcbiAgICBjb25zdCBkaXJlY3RvcmllcyA9IGVudHJpZXMuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmlzRGlyZWN0b3J5KCkgJiYgIXNob3VsZElnbm9yZShlbnRyeS5uYW1lKSlcbiAgICBjb25zdCBmaWxlcyA9IGVudHJpZXMuZmlsdGVyKGVudHJ5ID0+IGVudHJ5LmlzRmlsZSgpICYmICFzaG91bGRJZ25vcmUoZW50cnkubmFtZSwgdHJ1ZSkpXG4gICAgXG4gICAgLy8gXHU1MTQ4XHU1OTA0XHU3NDA2XHU2NTg3XHU0RUY2XHU1OTM5XG4gICAgZGlyZWN0b3JpZXMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgY29uc3QgZGlyRnVsbFBhdGggPSBwYXRoLmpvaW4oZGlyUGF0aCwgZGlyLm5hbWUpXG4gICAgICBjb25zdCBkaXJMaW5rUGF0aCA9IHBhdGgucG9zaXguam9pbihiYXNlUGF0aCwgZGlyLm5hbWUpXG4gICAgICBcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjU4N1x1NEVGNlx1NTkzOVx1NjYyRlx1NTQyNlx1NTMwNVx1NTQyQiBtYXJrZG93biBcdTY1ODdcdTRFRjZcbiAgICAgIGNvbnN0IGhhc01hcmtkb3duRmlsZXMgPSBoYXNNYXJrZG93bkZpbGVzUmVjdXJzaXZlKGRpckZ1bGxQYXRoKVxuICAgICAgXG4gICAgICBpZiAoaGFzTWFya2Rvd25GaWxlcykge1xuICAgICAgICBjb25zdCBzdWJJdGVtcyA9IHNjYW5EaXJlY3RvcnkoZGlyRnVsbFBhdGgsIGRpckxpbmtQYXRoLCBkZXB0aCArIDEpXG4gICAgICAgIFxuICAgICAgICBpZiAoc3ViSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgdGV4dDogZ2V0RGlzcGxheVRpdGxlKGRpckZ1bGxQYXRoLCBkaXIubmFtZSksXG4gICAgICAgICAgICBjb2xsYXBzZWQ6IGRlcHRoID4gMCwgLy8gXHU3QjJDXHU0RTAwXHU3RUE3XHU0RTBEXHU2Mjk4XHU1M0UwXHVGRjBDXHU1MTc2XHU0RUQ2XHU3RUE3XHU1MjJCXHU5RUQ4XHU4QkE0XHU2Mjk4XHU1M0UwXG4gICAgICAgICAgICBpdGVtczogc3ViSXRlbXNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBcbiAgICAvLyBcdTUxOERcdTU5MDRcdTc0MDZcdTY1ODdcdTRFRjZcbiAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgY29uc3QgZmlsZUZ1bGxQYXRoID0gcGF0aC5qb2luKGRpclBhdGgsIGZpbGUubmFtZSlcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gcGF0aC5wYXJzZShmaWxlLm5hbWUpLm5hbWVcbiAgICAgIGNvbnN0IGZpbGVMaW5rUGF0aCA9IHBhdGgucG9zaXguam9pbihiYXNlUGF0aCwgZmlsZU5hbWUpXG4gICAgICBcbiAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICB0ZXh0OiBnZXREaXNwbGF5VGl0bGUoZmlsZUZ1bGxQYXRoLCBmaWxlLm5hbWUsIHRydWUpLFxuICAgICAgICBsaW5rOiBgLyR7ZmlsZUxpbmtQYXRofWBcbiAgICAgIH0pXG4gICAgfSlcbiAgICBcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLndhcm4oYEZhaWxlZCB0byBzY2FuIGRpcmVjdG9yeSAke2RpclBhdGh9OmAsIGVycm9yLm1lc3NhZ2UpXG4gIH1cbiAgXG4gIHJldHVybiBpdGVtc1xufVxuXG4vKipcbiAqIFx1OTAxMlx1NUY1Mlx1NjhDMFx1NjdFNVx1NzZFRVx1NUY1NVx1NjYyRlx1NTQyNlx1NTMwNVx1NTQyQiBtYXJrZG93biBcdTY1ODdcdTRFRjZcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXJQYXRoIFx1NzZFRVx1NUY1NVx1OERFRlx1NUY4NFxuICogQHJldHVybnMge2Jvb2xlYW59IFx1NjYyRlx1NTQyNlx1NTMwNVx1NTQyQiBtYXJrZG93biBcdTY1ODdcdTRFRjZcbiAqL1xuZnVuY3Rpb24gaGFzTWFya2Rvd25GaWxlc1JlY3Vyc2l2ZShkaXJQYXRoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZW50cmllcyA9IGZzLnJlYWRkaXJTeW5jKGRpclBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KVxuICAgIFxuICAgIC8vIFx1NjhDMFx1NjdFNVx1NUY1M1x1NTI0RFx1NzZFRVx1NUY1NVx1NjYyRlx1NTQyNlx1NjcwOSBtYXJrZG93biBcdTY1ODdcdTRFRjZcbiAgICBjb25zdCBoYXNNYXJrZG93biA9IGVudHJpZXMuc29tZShlbnRyeSA9PiBcbiAgICAgIGVudHJ5LmlzRmlsZSgpICYmIFxuICAgICAgIXNob3VsZElnbm9yZShlbnRyeS5uYW1lLCB0cnVlKSAmJiBcbiAgICAgIHBhdGguZXh0bmFtZShlbnRyeS5uYW1lKS50b0xvd2VyQ2FzZSgpID09PSAnLm1kJ1xuICAgIClcbiAgICBcbiAgICBpZiAoaGFzTWFya2Rvd24pIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIFxuICAgIC8vIFx1OTAxMlx1NUY1Mlx1NjhDMFx1NjdFNVx1NUI1MFx1NzZFRVx1NUY1NVxuICAgIGNvbnN0IGRpcmVjdG9yaWVzID0gZW50cmllcy5maWx0ZXIoZW50cnkgPT4gZW50cnkuaXNEaXJlY3RvcnkoKSAmJiAhc2hvdWxkSWdub3JlKGVudHJ5Lm5hbWUpKVxuICAgIHJldHVybiBkaXJlY3Rvcmllcy5zb21lKGRpciA9PiBoYXNNYXJrZG93bkZpbGVzUmVjdXJzaXZlKHBhdGguam9pbihkaXJQYXRoLCBkaXIubmFtZSkpKVxuICAgIFxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbi8qKlxuICogXHU3NTFGXHU2MjEwXHU1QjhDXHU2NTc0XHU3Njg0XHU0RkE3XHU4RkI5XHU2ODBGXHU5MTREXHU3RjZFXG4gKiBAcGFyYW0ge3N0cmluZ30gZG9jc1BhdGggZG9jcyBcdTc2RUVcdTVGNTVcdThERUZcdTVGODRcbiAqIEByZXR1cm5zIHtvYmplY3R9IFx1NEZBN1x1OEZCOVx1NjgwRlx1OTE0RFx1N0Y2RVx1NUJGOVx1OEM2MVxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZVNpZGViYXIoZG9jc1BhdGgpIHtcbiAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU2M0QwXHU0RjlCXHU4REVGXHU1Rjg0XHVGRjBDXHU4MUVBXHU1MkE4XHU4QkExXHU3Qjk3IGRvY3MgXHU3NkVFXHU1RjU1XHU4REVGXHU1Rjg0XG4gIGlmICghZG9jc1BhdGgpIHtcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTVERTVcdTRGNUNcdTc2RUVcdTVGNTVcbiAgICBjb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpXG4gICAgLy8gXHU1OTgyXHU2NzlDXHU1RjUzXHU1MjREXHU1NzI4XHU5ODc5XHU3NkVFXHU2ODM5XHU3NkVFXHU1RjU1XHVGRjBDZG9jcyBcdThERUZcdTVGODRcdTRFM0EgJy4vZG9jcydcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTVGNTNcdTUyNERcdTU3MjggdXRpbHMgXHU3NkVFXHU1RjU1XHVGRjBDXHU5NzAwXHU4OTgxXHU1NkRFXHU1MjMwXHU5ODc5XHU3NkVFXHU2ODM5XHU3NkVFXHU1RjU1XG4gICAgY29uc3QgcG9zc2libGVEb2NzUGF0aHMgPSBbXG4gICAgICBwYXRoLmpvaW4oY3dkLCAnZG9jcycpLCAgICAgICAgICAgLy8gXHU1RjUzXHU1MjREXHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0IGRvY3NcbiAgICAgIHBhdGguam9pbihjd2QsICcuLi8uLi8uLi9kb2NzJyksICAvLyBcdTRFQ0UgdXRpbHMgXHU3NkVFXHU1RjU1XHU1NkRFXHU1MjMwXHU2ODM5XHU3NkVFXHU1RjU1XHU3Njg0IGRvY3NcbiAgICAgIHBhdGguam9pbihjd2QsICcuLi8uLi9kb2NzJyksICAgICAvLyBcdTRFQ0UgLnZpdGVwcmVzcyBcdTc2RUVcdTVGNTVcdTU2REVcdTUyMzBcdTY4MzlcdTc2RUVcdTVGNTVcdTc2ODQgZG9jc1xuICAgICAgcGF0aC5qb2luKGN3ZCwgJy4uL2RvY3MnKSAgICAgICAgIC8vIFx1NEVDRSBjb25maWcgXHU3NkVFXHU1RjU1XHU1NkRFXHU1MjMwXHU2ODM5XHU3NkVFXHU1RjU1XHU3Njg0IGRvY3NcbiAgICBdXG4gICAgXG4gICAgLy8gXHU2MjdFXHU1MjMwXHU3QjJDXHU0RTAwXHU0RTJBXHU1QjU4XHU1NzI4XHU3Njg0IGRvY3MgXHU3NkVFXHU1RjU1XG4gICAgZG9jc1BhdGggPSBwb3NzaWJsZURvY3NQYXRocy5maW5kKHAgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMocCkgJiYgZnMuc3RhdFN5bmMocCkuaXNEaXJlY3RvcnkoKVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gICAgXG4gICAgaWYgKCFkb2NzUGF0aCkge1xuICAgICAgY29uc29sZS5lcnJvcignXHUyNzRDIENvdWxkIG5vdCBmaW5kIGRvY3MgZGlyZWN0b3J5LiBUcmllZCBwYXRoczonLCBwb3NzaWJsZURvY3NQYXRocylcbiAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgfVxuICBcbiAgY29uc29sZS5sb2coYFx1RDgzRFx1RENDMSBVc2luZyBkb2NzIHBhdGg6ICR7ZG9jc1BhdGh9YClcbiAgXG4gIGNvbnN0IHNpZGViYXIgPSB7fVxuICBcbiAgdHJ5IHtcbiAgICBjb25zdCBlbnRyaWVzID0gZnMucmVhZGRpclN5bmMoZG9jc1BhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KVxuICAgIGNvbnN0IGRpcmVjdG9yaWVzID0gZW50cmllcy5maWx0ZXIoZW50cnkgPT4gZW50cnkuaXNEaXJlY3RvcnkoKSAmJiAhc2hvdWxkSWdub3JlKGVudHJ5Lm5hbWUpKVxuICAgIFxuICAgIGRpcmVjdG9yaWVzLmZvckVhY2goZGlyID0+IHtcbiAgICAgIGNvbnN0IGRpclBhdGggPSBwYXRoLmpvaW4oZG9jc1BhdGgsIGRpci5uYW1lKVxuICAgICAgY29uc3Qgc2lkZWJhcktleSA9IGAvJHtkaXIubmFtZX0vYFxuICAgICAgXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTc2RUVcdTVGNTVcdTY2MkZcdTU0MjZcdTUzMDVcdTU0MkIgbWFya2Rvd24gXHU2NTg3XHU0RUY2XG4gICAgICBjb25zdCBoYXNNYXJrZG93bkZpbGVzID0gaGFzTWFya2Rvd25GaWxlc1JlY3Vyc2l2ZShkaXJQYXRoKVxuICAgICAgXG4gICAgICBpZiAoaGFzTWFya2Rvd25GaWxlcykge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHNjYW5EaXJlY3RvcnkoZGlyUGF0aCwgZGlyLm5hbWUpXG4gICAgICAgIFxuICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNpZGViYXJbc2lkZWJhcktleV0gPSBbe1xuICAgICAgICAgICAgdGV4dDogZ2V0RGlzcGxheVRpdGxlKGRpclBhdGgsIGRpci5uYW1lKSxcbiAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgICAgICBpdGVtczogaXRlbXNcbiAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIFx1NTcyOFx1NEVCQVx1NURFNVx1NjY3QVx1ODBGRFx1NTIwNlx1N0VDNFx1NzY4NCBcdTIwMUNHcHUgQ29tcHV0aW5nXHUyMDFEIFx1NEUwQlx1OEZGRFx1NTJBMFx1ODFFQVx1NUI5QVx1NEU0OSBIVE1MIFx1OTRGRVx1NjNBNVxuICAgIGNvbnN0IGFpS2V5ID0gJy9hcnRpZmljaWFsLWludGVsbGlnZW5jZS8nXG4gICAgaWYgKHNpZGViYXJbYWlLZXldICYmIEFycmF5LmlzQXJyYXkoc2lkZWJhclthaUtleV0pKSB7XG4gICAgICBjb25zdCBhaVNlY3Rpb24gPSBzaWRlYmFyW2FpS2V5XVswXVxuICAgICAgaWYgKGFpU2VjdGlvbiAmJiBBcnJheS5pc0FycmF5KGFpU2VjdGlvbi5pdGVtcykpIHtcbiAgICAgICAgY29uc3QgZ3B1Q29tcHV0aW5nR3JvdXAgPSBhaVNlY3Rpb24uaXRlbXMuZmluZChncm91cCA9PiBncm91cCAmJiBncm91cC50ZXh0ID09PSAnR3B1IENvbXB1dGluZycpXG4gICAgICAgIGlmIChncHVDb21wdXRpbmdHcm91cCAmJiBBcnJheS5pc0FycmF5KGdwdUNvbXB1dGluZ0dyb3VwLml0ZW1zKSkge1xuICAgICAgICAgIC8vIFx1OTA3Rlx1NTE0RFx1OTFDRFx1NTkwRFx1NjNEMlx1NTE2NVxuICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGdwdUNvbXB1dGluZ0dyb3VwLml0ZW1zLnNvbWUoaXRlbSA9PiBpdGVtLmxpbmsgPT09ICcvcHR4Lmh0bWwnKVxuICAgICAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgICAgICBncHVDb21wdXRpbmdHcm91cC5pdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgdGV4dDogJ05WSURJQSBQVFggXHU2MjgwXHU2NzJGXHU4QkU2XHU4OUUzIChIVE1MKScsXG4gICAgICAgICAgICAgIGxpbms6ICcvcHR4Lmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZ2VuZXJhdGUgc2lkZWJhcjonLCBlcnJvci5tZXNzYWdlKVxuICB9XG4gIFxuICByZXR1cm4gc2lkZWJhclxufVxuXG4vKipcbiAqIFx1NTE5OVx1NTE2NVx1NEZBN1x1OEZCOVx1NjgwRlx1OTE0RFx1N0Y2RVx1NTIzMFx1NjU4N1x1NEVGNlxuICogQHBhcmFtIHtvYmplY3R9IHNpZGViYXIgXHU0RkE3XHU4RkI5XHU2ODBGXHU5MTREXHU3RjZFXG4gKiBAcGFyYW0ge3N0cmluZ30gb3V0cHV0UGF0aCBcdThGOTNcdTUxRkFcdTY1ODdcdTRFRjZcdThERUZcdTVGODRcbiAqL1xuZnVuY3Rpb24gd3JpdGVTaWRlYmFyQ29uZmlnKHNpZGViYXIsIG91dHB1dFBhdGgpIHtcbiAgLy8gXHU1OTgyXHU2NzlDXHU2Q0ExXHU2NzA5XHU2M0QwXHU0RjlCXHU4RjkzXHU1MUZBXHU4REVGXHU1Rjg0XHVGRjBDXHU4MUVBXHU1MkE4XHU4QkExXHU3Qjk3XG4gIGlmICghb3V0cHV0UGF0aCkge1xuICAgIGNvbnN0IGN3ZCA9IHByb2Nlc3MuY3dkKClcbiAgICBjb25zdCBwb3NzaWJsZU91dHB1dFBhdGhzID0gW1xuICAgICAgcGF0aC5qb2luKGN3ZCwgJ2RvY3MvLnZpdGVwcmVzcy9jb25maWcvc2lkZWJhci9hdXRvLWdlbmVyYXRlZC5qcycpLFxuICAgICAgcGF0aC5qb2luKGN3ZCwgJy4uLy4uLy4uL2RvY3MvLnZpdGVwcmVzcy9jb25maWcvc2lkZWJhci9hdXRvLWdlbmVyYXRlZC5qcycpLFxuICAgICAgcGF0aC5qb2luKGN3ZCwgJy4uLy4uL2NvbmZpZy9zaWRlYmFyL2F1dG8tZ2VuZXJhdGVkLmpzJyksXG4gICAgICBwYXRoLmpvaW4oY3dkLCAnLi4vc2lkZWJhci9hdXRvLWdlbmVyYXRlZC5qcycpXG4gICAgXVxuICAgIFxuICAgIC8vIFx1NjI3RVx1NTIzMFx1N0IyQ1x1NEUwMFx1NEUyQVx1NzZFRVx1NUY1NVx1NUI1OFx1NTcyOFx1NzY4NFx1OEY5M1x1NTFGQVx1OERFRlx1NUY4NFxuICAgIG91dHB1dFBhdGggPSBwb3NzaWJsZU91dHB1dFBhdGhzLmZpbmQocCA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUocClcbiAgICAgICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoZGlyKVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gICAgXG4gICAgaWYgKCFvdXRwdXRQYXRoKSB7XG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTkwRkRcdTRFMERcdTVCNThcdTU3MjhcdUZGMENcdTRGN0ZcdTc1MjhcdTdCMkNcdTRFMDBcdTRFMkFcdTVFNzZcdTUyMUJcdTVFRkFcdTc2RUVcdTVGNTVcbiAgICAgIG91dHB1dFBhdGggPSBwb3NzaWJsZU91dHB1dFBhdGhzWzBdXG4gICAgfVxuICB9XG4gIFxuICB0cnkge1xuICAgIGNvbnN0IGNvbmZpZ0NvbnRlbnQgPSBgLy8gXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0XHU0RkE3XHU4RkI5XHU2ODBGXHU5MTREXHU3RjZFXG4vLyBcdTZCNjRcdTY1ODdcdTRFRjZcdTc1MzEgZ2VuZXJhdGVTaWRlYmFyLmpzIFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1RkYwQ1x1OEJGN1x1NTJGRlx1NjI0Qlx1NTJBOFx1NEZFRVx1NjUzOVxuXG5leHBvcnQgY29uc3QgYXV0b0dlbmVyYXRlZFNpZGViYXIgPSAke0pTT04uc3RyaW5naWZ5KHNpZGViYXIsIG51bGwsIDIpfVxuYFxuICAgIFxuICAgIC8vIFx1Nzg2RVx1NEZERFx1OEY5M1x1NTFGQVx1NzZFRVx1NUY1NVx1NUI1OFx1NTcyOFxuICAgIGNvbnN0IG91dHB1dERpciA9IHBhdGguZGlybmFtZShvdXRwdXRQYXRoKVxuICAgIGlmICghZnMuZXhpc3RzU3luYyhvdXRwdXREaXIpKSB7XG4gICAgICBmcy5ta2RpclN5bmMob3V0cHV0RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICAgIH1cbiAgICBcbiAgICBmcy53cml0ZUZpbGVTeW5jKG91dHB1dFBhdGgsIGNvbmZpZ0NvbnRlbnQsICd1dGYtOCcpXG4gICAgY29uc29sZS5sb2coYFx1MjcwNSBTaWRlYmFyIGNvbmZpZ3VyYXRpb24gd3JpdHRlbiB0bzogJHtvdXRwdXRQYXRofWApXG4gICAgXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHdyaXRlIHNpZGViYXIgY29uZmlndXJhdGlvbjonLCBlcnJvci5tZXNzYWdlKVxuICB9XG59XG5cbi8qKlxuICogXHU0RTNCXHU1MUZEXHU2NTcwXHVGRjFBXHU3NTFGXHU2MjEwXHU1RTc2XHU1MTk5XHU1MTY1XHU0RkE3XHU4RkI5XHU2ODBGXHU5MTREXHU3RjZFXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUFuZFdyaXRlU2lkZWJhcigpIHtcbiAgY29uc29sZS5sb2coJ1x1RDgzRFx1REQwNCBHZW5lcmF0aW5nIHNpZGViYXIgY29uZmlndXJhdGlvbi4uLicpXG4gIFxuICBjb25zdCBzaWRlYmFyID0gZ2VuZXJhdGVTaWRlYmFyKClcbiAgXG4gIGNvbnNvbGUubG9nKGBcdUQ4M0RcdURDQ0EgR2VuZXJhdGVkICR7T2JqZWN0LmtleXMoc2lkZWJhcikubGVuZ3RofSBzaWRlYmFyIHNlY3Rpb25zYClcbiAgXG4gIC8vIFx1NTE5OVx1NTE2NVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuICB3cml0ZVNpZGViYXJDb25maWcoc2lkZWJhcilcbiAgXG4gIHJldHVybiBzaWRlYmFyXG59XG5cbi8vIFx1NTk4Mlx1Njc5Q1x1NzZGNFx1NjNBNVx1OEZEMFx1ODg0Q1x1NkI2NFx1ODExQVx1NjcyQ1xuaWYgKGltcG9ydC5tZXRhLnVybCA9PT0gYGZpbGU6Ly8ke3Byb2Nlc3MuYXJndlsxXX1gKSB7XG4gIGdlbmVyYXRlQW5kV3JpdGVTaWRlYmFyKClcbn1cblxuZXhwb3J0IHsgZ2VuZXJhdGVTaWRlYmFyLCB3cml0ZVNpZGViYXJDb25maWcgfSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvYWxnb3JpdGhtcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvYWxnb3JpdGhtcy5qc1wiO2V4cG9ydCBjb25zdCBhbGdvcml0aG1zU2lkZWJhciA9IHtcbiAgJy9hbGdvcml0aG1zLyc6IFtcbiAgICB7XG4gICAgICB0ZXh0OiAnQWxnb3JpdGhtcyAmIERhdGEgU3RydWN0dXJlcycsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnT3ZlcnZpZXcnLCBsaW5rOiAnL2FsZ29yaXRobXMvJyB9LFxuICAgICAgICB7IHRleHQ6ICdSRUFETUUnLCBsaW5rOiAnL2FsZ29yaXRobXMvUkVBRE1FJyB9LFxuICAgICAgICB7IHRleHQ6ICdCYWNrdHJhY2snLCBsaW5rOiAnL2FsZ29yaXRobXMvYmFja3RyYWNrJyB9LFxuICAgICAgICB7IHRleHQ6ICdTbGlkaW5nIFdpbmRvdycsIGxpbms6ICcvYWxnb3JpdGhtcy9zbGlkZV93aW5kb3cnIH0sXG4gICAgICAgIHsgdGV4dDogJ0RGUyAmIEJGUycsIGxpbms6ICcvYWxnb3JpdGhtcy9kZnNfYmZzJyB9LFxuICAgICAgICB7IHRleHQ6ICdCaW5hcnkgVHJlZScsIGxpbms6ICcvYWxnb3JpdGhtcy9iaW5hcnlfdHJlZScgfSxcbiAgICAgICAgeyB0ZXh0OiAnQmluYXJ5IFNlYXJjaCcsIGxpbms6ICcvYWxnb3JpdGhtcy9iaW5hcnlfc2VhcmNoJyB9LFxuICAgICAgICB7IHRleHQ6ICdEeW5hbWljIFByb2dyYW1taW5nJywgbGluazogJy9hbGdvcml0aG1zL2RwJyB9LFxuICAgICAgICB7IHRleHQ6ICdTb3J0aW5nJywgbGluazogJy9hbGdvcml0aG1zL3NvcnQnIH0sXG4gICAgICAgIHsgdGV4dDogJ0xDUycsIGxpbms6ICcvYWxnb3JpdGhtcy9sY3MnIH0sXG4gICAgICAgIHsgdGV4dDogJ1ByZWZpeCBTdW0nLCBsaW5rOiAnL2FsZ29yaXRobXMvcHJlc3VtJyB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnRGF0YSBTdHJ1Y3R1cmVzJyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6ICdEYXRhIFN0cnVjdHVyZXMgUkVBRE1FJywgbGluazogJy9hbGdvcml0aG1zL2RhdGFfc3RydWN0L3JlYWRtZScgfSxcbiAgICAgICAgeyB0ZXh0OiAnU3RhY2snLCBsaW5rOiAnL2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3Qvc3RhY2snIH0sXG4gICAgICAgIHsgdGV4dDogJ0hhc2hNYXAnLCBsaW5rOiAnL2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3QvaGFzaG1hcCcgfSxcbiAgICAgICAgeyB0ZXh0OiAnU3RyaW5nJywgbGluazogJy9hbGdvcml0aG1zL2RhdGFfc3RydWN0L3N0cmluZycgfSxcbiAgICAgICAgeyB0ZXh0OiAnVHJlZScsIGxpbms6ICcvYWxnb3JpdGhtcy9kYXRhX3N0cnVjdC90cmVlJyB9LFxuICAgICAgICB7IHRleHQ6ICdMaW5rZWQgTGlzdCcsIGxpbms6ICcvYWxnb3JpdGhtcy9kYXRhX3N0cnVjdC9saW5rZWRsaXN0JyB9XG4gICAgICBdXG4gICAgfVxuICBdXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy9jb25maWcvc2lkZWJhci9hcnRpZmljaWFsLWludGVsbGlnZW5jZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UuanNcIjtleHBvcnQgY29uc3QgYXJ0aWZpY2lhbEludGVsbGlnZW5jZVNpZGViYXIgPSB7XG4gICcvYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UvJzogW1xuICAgIHtcbiAgICAgIHRleHQ6ICdBSSBJbmZyYXN0cnVjdHVyZSBPdmVydmlldycsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnT3ZlcnZpZXcnLCBsaW5rOiAnL2FydGlmaWNpYWwtaW50ZWxsaWdlbmNlLycgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0hhcmR3YXJlIEFjY2VsZXJhdGlvbicsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnR1BVIEFyY2hpdGVjdHVyZScsIGxpbms6ICcvYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UvZ3B1LWNvbXB1dGluZy9ncHVfYXJjaCcgfSxcbiAgICAgICAgeyB0ZXh0OiAnR1BVIENvbW11bmljYXRpb24nLCBsaW5rOiAnL2FydGlmaWNpYWwtaW50ZWxsaWdlbmNlL2dwdS1jb21wdXRpbmcvZ3B1X2NvbW11bmljYXRpb24nIH0sXG4gICAgICAgIHsgdGV4dDogJ0ludGVsIEFNWCAmIE9wZW5WSU5PJywgbGluazogJy9hcnRpZmljaWFsLWludGVsbGlnZW5jZS9BTVgvb3BlbnZpbm8nIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdJbmZyYXN0cnVjdHVyZSAmIE9wZXJhdGlvbnMnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ01vZGVsIE9wdGltaXphdGlvbicsIGxpbms6ICcvYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UvbW9kZWwtb3B0aW1pemF0aW9uLycgfSxcbiAgICAgICAgeyB0ZXh0OiAnTW9uaXRvcmluZyAmIE9wZXJhdGlvbnMnLCBsaW5rOiAnL2FydGlmaWNpYWwtaW50ZWxsaWdlbmNlL21vbml0b3Jpbmctb3BzLycgfSxcbiAgICAgICAgeyB0ZXh0OiAnQ2xvdWQgUGxhdGZvcm1zJywgbGluazogJy9hcnRpZmljaWFsLWludGVsbGlnZW5jZS9jbG91ZC1wbGF0Zm9ybXMvJyB9LFxuICAgICAgICB7IHRleHQ6ICdUcmFpbmluZyBGcmFtZXdvcmtzJywgbGluazogJy9hcnRpZmljaWFsLWludGVsbGlnZW5jZS90cmFpbmluZy1mcmFtZXdvcmtzLycgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ1Jlc2VhcmNoICYgUGFwZXJzJyxcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ1NBQyAtIElTQ0EgMjMnLCBsaW5rOiAnL2FydGlmaWNpYWwtaW50ZWxsaWdlbmNlL2dwdS1jb21wdXRpbmcvU0FDIC0gSVNDQSAyMycgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvY29tcHV0ZXItc3lzdGVtcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvY29tcHV0ZXItc3lzdGVtcy5qc1wiO2V4cG9ydCBjb25zdCBjb21wdXRlclN5c3RlbXNTaWRlYmFyID0ge1xuICAnL2NvbXB1dGVyLXN5c3RlbXMvY3B1LWdwdS8nOiBbXG4gICAge1xuICAgICAgdGV4dDogJ0NQVSBcdTY5ODJcdThGRjAnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ0NQVSBcdTY3QjZcdTY3ODRcdTY5ODJcdTg5QzgnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvY3B1LWdwdS8nIH0sXG4gICAgICAgIHsgdGV4dDogJ1JFQURNRScsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9jcHUtZ3B1L1JFQURNRScgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0NQVSBcdTU3RkFcdTc4NDBcdTY3QjZcdTY3ODQnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ1x1NkQ0MVx1NkMzNFx1N0VCRiAoUGlwZWxpbmUpJywgbGluazogJy9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvY3B1LWFyY2hpdGVjdHVyZS9waXBlbGluZS1wZXJmb3JtYW5jZS9waXBsaW5lJyB9LFxuICAgICAgICB7IHRleHQ6ICdcdTdGMTNcdTVCNThcdTdDRkJcdTdFREYgKENhY2hlKScsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9jcHUtZ3B1L2NwdS1hcmNoaXRlY3R1cmUvbWVtb3J5LXN5c3RlbXMvY2FjaGUnIH0sXG4gICAgICAgIHsgdGV4dDogJ1x1NTE4NVx1NUI1OFx1N0JBMVx1NzQwNlx1NTM1NVx1NTE0MyAoTU1VKScsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9jcHUtZ3B1L2NwdS1hcmNoaXRlY3R1cmUvbWVtb3J5LXN5c3RlbXMvTU1VJyB9LFxuICAgICAgICB7IHRleHQ6ICdcdTg2NUFcdTYyREZcdTUxODVcdTVCNThcdTRFMEVcdTUyMDZcdTk4NzUnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvY3B1LWdwdS9jcHUtYXJjaGl0ZWN0dXJlL21lbW9yeS1zeXN0ZW1zL21lbW9yeV92YV9wYWdlJyB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU2MzA3XHU0RUU0XHU5NkM2XHU2N0I2XHU2Nzg0IChJU0EpJyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6ICd4ODYgXHU2MzA3XHU0RUU0XHU5NkM2JywgbGluazogJy9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvY3B1LWFyY2hpdGVjdHVyZS9pbnN0cnVjdGlvbi1zZXRzL3g4Nl9pbnN0JyB9LFxuICAgICAgICB7IHRleHQ6ICdBTVggXHU3N0U5XHU5NjM1XHU2MjY5XHU1QzU1JywgbGluazogJy9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvY3B1LWFyY2hpdGVjdHVyZS9pbnN0cnVjdGlvbi1zZXRzL2FteCcgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdBUk0gXHU2N0I2XHU2Nzg0JyxcbiAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHsgdGV4dDogJ0FSTSBcdTY5ODJcdThGRjAnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvY3B1LWdwdS9hcm0tYXJjaGl0ZWN0dXJlLycgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ0FSTSBcdTYzMDdcdTRFRTRcdTk2QzYnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvY3B1LWdwdS9hcm0tYXJjaGl0ZWN0dXJlL2FybV9pbnMnIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdBUk0gXHU1MTg1XHU4MDU0XHU2QzQ3XHU3RjE2JywgbGluazogJy9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvYXJtLWFyY2hpdGVjdHVyZS9hcm1faW5saW5lX2Fzc2VtYmx5JyB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU3Q0ZCXHU3RURGXHU2N0I2XHU2Nzg0JyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6ICdOVU1BIFx1NEUwRSBTb2NrZXQnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvY3B1LWdwdS9jcHUtYXJjaGl0ZWN0dXJlL21lbW9yeS1zeXN0ZW1zL251bWFfc29ja2V0JyB9LFxuICAgICAgICB7IHRleHQ6ICdJQlMgXHU2MzA3XHU0RUU0XHU5MUM3XHU2ODM3JywgbGluazogJy9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvY3B1LWFyY2hpdGVjdHVyZS9waXBlbGluZS1wZXJmb3JtYW5jZS9pYnMnIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC8nOiBbXG4gICAge1xuICAgICAgdGV4dDogJ0xpbnV4IFx1Njk4Mlx1OEZGMCcsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnT3ZlcnZpZXcnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgvJyB9LFxuICAgICAgICB7IHRleHQ6ICdSRUFETUUnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgvUkVBRE1FJyB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnTGludXggXHU1REU1XHU1MTc3JyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6ICdcdTU0N0RcdTRFRTRcdTg4NENcdTVERTVcdTUxNzcnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgvY29tbWFuZHMtdG9vbHMvY29tbWFuZCcgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0xpbnV4IFx1NTE4NVx1NjgzOCcsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnXHU1MTg1XHU2ODM4IFJFQURNRScsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvUkVBRE1FJyB9LFxuICAgICAgICB7IHRleHQ6ICdSQ1UnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgva2VybmVsL3Byb2Nlc3Mtc2NoZWR1bGluZy9yY3UnIH0sXG4gICAgICAgIHsgdGV4dDogJ0lkbGUgVGljaycsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvcHJvY2Vzcy1zY2hlZHVsaW5nL2lkbGVfdGljaycgfSxcbiAgICAgICAgeyB0ZXh0OiAnSWRsZScsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvcHJvY2Vzcy1zY2hlZHVsaW5nL2lkbGUnIH0sXG4gICAgICAgIHsgdGV4dDogJ0kyQyBcdTlBNzFcdTUyQTgnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgva2VybmVsL2RldmljZS1kcml2ZXJzL2kyYycgfSxcbiAgICAgICAgeyB0ZXh0OiAnQkwzMScsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvYXJjaGl0ZWN0dXJlL0JMMzEnIH0sXG4gICAgICAgIHsgdGV4dDogJ1RIUCcsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvbWVtb3J5LW1hbmFnZW1lbnQvVEhQJyB9LFxuICAgICAgICB7IHRleHQ6ICdOb3RpZmllcicsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvY29yZS1jb25jZXB0cy9ub3RpZmllcicgfSxcbiAgICAgICAgeyB0ZXh0OiAnUHRocmVhZCcsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvY29yZS1jb25jZXB0cy9wdGhyZWFkJyB9LFxuICAgICAgICB7IHRleHQ6ICdUaGVybWFsIEluaXQnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgva2VybmVsL3RoZXJtYWwtbWFuYWdlbWVudC90aGVybWFsX2luaXQnIH0sXG4gICAgICAgIHsgdGV4dDogJ1RoZXJtYWwnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgva2VybmVsL3RoZXJtYWwtbWFuYWdlbWVudC90aGVybWFsJyB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU3Q0ZCXHU3RURGXHU3RjE2XHU3QTBCJyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6ICdcdTdDRkJcdTdFREZcdTdGMTZcdTdBMEIgUkVBRE1FJywgbGluazogJy9jb21wdXRlci1zeXN0ZW1zL2xpbnV4L3N5c3RlbS1wcm9ncmFtbWluZy9SRUFETUUnIH0sXG4gICAgICAgIHsgdGV4dDogJ0xpbmtlcnMgJiBMb2FkZXJzJywgbGluazogJy9jb21wdXRlci1zeXN0ZW1zL2xpbnV4L3N5c3RlbS1wcm9ncmFtbWluZy9saW5rZXJzX2xvYWRlcnMnIH0sXG4gICAgICAgIHsgdGV4dDogJ3NpemVfdCcsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9zeXN0ZW0tcHJvZ3JhbW1pbmcvc2l6ZV90JyB9LFxuICAgICAgICB7IHRleHQ6ICdDIFBvaW50ZXInLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgvc3lzdGVtLXByb2dyYW1taW5nL2MtcG9pbnRlcicgfSxcbiAgICAgICAgeyB0ZXh0OiAnQ01ha2UnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgvc3lzdGVtLXByb2dyYW1taW5nL2NtYWtlJyB9LFxuICAgICAgICB7IHRleHQ6ICdDTWFrZSBNYWtlZmlsZScsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9zeXN0ZW0tcHJvZ3JhbW1pbmcvY21ha2VfbWFrZWZpbGUnIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdcdTdDRkJcdTdFREZcdTdCQTFcdTc0MDYnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ0FQVCcsIGxpbms6ICcvY29tcHV0ZXItc3lzdGVtcy9saW51eC9zeXN0ZW0tYWRtaW5pc3RyYXRpb24vYXB0JyB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU2NTU5XHU4MEIyXHU4RDQ0XHU2RTkwJyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6ICdYVjYnLCBsaW5rOiAnL2NvbXB1dGVyLXN5c3RlbXMvbGludXgvZWR1Y2F0aW9uYWwveHY2JyB9XG4gICAgICBdXG4gICAgfVxuICBdXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy9jb25maWcvc2lkZWJhci9wcm9ncmFtbWluZy1sYW5ndWFnZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyL3Byb2dyYW1taW5nLWxhbmd1YWdlcy5qc1wiO2V4cG9ydCBjb25zdCBwcm9ncmFtbWluZ0xhbmd1YWdlc1NpZGViYXIgPSB7XG4gICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvJzogW1xuICAgIHtcbiAgICAgIHRleHQ6ICdKYXZhIFx1NTdGQVx1Nzg0MCcsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnT3ZlcnZpZXcnLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhLycgfSxcbiAgICAgICAgeyB0ZXh0OiAnSmF2YSBcdTY4MzhcdTVGQzNcdTY5ODJcdTVGRjUnLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2phdmEvY29yZS1jb25jZXB0cycgfSxcbiAgICAgICAgeyB0ZXh0OiAnSmF2YSBcdTdEMjJcdTVGMTUnLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2phdmEvJyB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnSlZNIFx1ODY1QVx1NjJERlx1NjczQScsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnSlZNIFx1NTE4NVx1NUI1OFx1NkEyMVx1NTc4QicsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvanZtLzAxX2p2bV9tZW1vcnknIH0sXG4gICAgICAgIHsgdGV4dDogJ0pWTSBcdTYzMDdcdTRFRTRcdTk2QzYnLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2p2bS9qdm1faW5zdCcgfSxcbiAgICAgICAgeyB0ZXh0OiAnRzEgXHU1NzgzXHU1NzNFXHU2NTM2XHU5NkM2XHU1NjY4JywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9qdm0vZ2NfZzEnIH0sXG4gICAgICAgIHsgdGV4dDogJ0phdmEgXHU1M0NEXHU1QzA0XHU2NzNBXHU1MjM2JywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9qdm0vcmVmbGVjdGlvbicgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0FSVCBcdThGRDBcdTg4NENcdTY1RjYnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ0FSVCBcdTUyMUJcdTVFRkFcdThGQzdcdTdBMEInLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2FydC9hcnRfY3JlYXRlJyB9LFxuICAgICAgICB7IHRleHQ6ICdBUlQgREVYMk9BVCcsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvYXJ0L2FydF9kZXgyb2F0JyB9LFxuICAgICAgICB7IHRleHQ6ICdBUlQgSk5JJywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9hcnQvYXJ0X2puaScgfSxcbiAgICAgICAgeyB0ZXh0OiAnQVJUIEdDIFx1NTM5Rlx1NzQwNicsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvYXJ0L2djX2FydF8wMScgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0FuZHJvaWQgXHU3Q0ZCXHU3RURGJyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6ICdBREIgXHU4QzAzXHU4QkQ1XHU1REU1XHU1MTc3JywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9hbmRyb2lkL2FkYicgfSxcbiAgICAgICAgeyB0ZXh0OiAnQmluZGVyIFx1NjczQVx1NTIzNicsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvYW5kcm9pZC9iaW5kZXInIH0sXG4gICAgICAgIHsgdGV4dDogJ0JpbmRlciBcdTUzOUZcdTc0MDYgKDEpJywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9hbmRyb2lkL2JpbmRlcl8wMScgfSxcbiAgICAgICAgeyB0ZXh0OiAnQmluZGVyIFx1NTM5Rlx1NzQwNiAoMiknLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2FuZHJvaWQvYmluZGVyXzAyJyB9LFxuICAgICAgICB7IHRleHQ6ICdJUEMgXHU4RkRCXHU3QTBCXHU5NUY0XHU5MDFBXHU0RkUxJywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9hbmRyb2lkL2lwYycgfSxcbiAgICAgICAgeyB0ZXh0OiAnUGFyY2VsIFx1NUU4Rlx1NTIxN1x1NTMxNicsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvYW5kcm9pZC9wYXJjZWwnIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi8nOiBbXG4gICAge1xuICAgICAgdGV4dDogJ1B5dGhvbiBQcm9ncmFtbWluZycsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnSGFzaCcsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi9sYW5ndWFnZS9oYXNoJyB9LFxuICAgICAgICB7IHRleHQ6ICdFZmZlY3RpdmUgUHl0aG9uJywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL2xhbmd1YWdlL2VmZmVjdGl2ZS1weXRob24nIH0sXG4gICAgICAgIHsgdGV4dDogJ1B5dGVzdCcsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi9sYW5ndWFnZS9weXRlc3QnIH0sXG4gICAgICAgIHsgdGV4dDogJ1B5dGhvbiBDJywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL2xhbmd1YWdlL3B5dGhvbl9jJyB9LFxuICAgICAgICB7IHRleHQ6ICdJdGVydG9vbHMnLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vbGFuZ3VhZ2UvaXRlcnRvb2xzJyB9LFxuICAgICAgICB7IHRleHQ6ICdQeXRob24gRnVuY3Rpb24nLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vbGFuZ3VhZ2UvcHl0aG9uLWZ1bmN0aW9uJyB9LFxuICAgICAgICB7IHRleHQ6ICdQeXRob24gRGF0YSBTdHJ1Y3R1cmUnLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vbGFuZ3VhZ2UvcHktZGF0YS1zdHJ1Y3QnIH0sXG4gICAgICAgIHsgdGV4dDogJ1BpcCcsIGxpbms6ICcvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi9sYW5ndWFnZS9waXAnIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdQeXRob24gVG9vbHMnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ1ZpcnR1YWwgRW52aXJvbm1lbnQnLCBsaW5rOiAnL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vdG9vbHMvdmlydHVhbGVudicgfSxcbiAgICAgICAgeyB0ZXh0OiAnUHl0aG9uIFRvb2xzJywgbGluazogJy9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL3Rvb2xzL3B5LXRvb2xzJyB9XG4gICAgICBdXG4gICAgfVxuICBdXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy9jb25maWcvc2lkZWJhci9kZXZlbG9wbWVudC10b29scy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvZGV2ZWxvcG1lbnQtdG9vbHMuanNcIjtleHBvcnQgY29uc3QgZGV2ZWxvcG1lbnRUb29sc1NpZGViYXIgPSB7XG4gICcvZGV2ZWxvcG1lbnQtdG9vbHMvdG9vbHMvJzogW1xuICAgIHtcbiAgICAgIHRleHQ6ICdcdTVFMzhcdTc1MjhcdTVERTVcdTUxNzcnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ1Rvb2xzIE92ZXJ2aWV3JywgbGluazogJy9kZXZlbG9wbWVudC10b29scy90b29scy8nIH0sXG4gICAgICAgIHsgdGV4dDogJ1ZpbScsIGxpbms6ICcvZGV2ZWxvcG1lbnQtdG9vbHMvdG9vbHMvdmltJyB9LFxuICAgICAgICB7IHRleHQ6ICdWUFMnLCBsaW5rOiAnL2RldmVsb3BtZW50LXRvb2xzL3Rvb2xzL3ZwcycgfSxcbiAgICAgICAgeyB0ZXh0OiAnQmF0Y2ggV2luZG93cycsIGxpbms6ICcvZGV2ZWxvcG1lbnQtdG9vbHMvdG9vbHMvYmF0X3dpbicgfSxcbiAgICAgICAgeyB0ZXh0OiAnR2l0JywgbGluazogJy9kZXZlbG9wbWVudC10b29scy90b29scy9naXQnIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gICcvZGV2ZWxvcG1lbnQtdG9vbHMvZnJhbWV3b3Jrcy8nOiBbXG4gICAge1xuICAgICAgdGV4dDogJ1x1NUUzOFx1NzUyOFx1Njg0Nlx1NjdCNicsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnUmVhY3QnLCBsaW5rOiAnL2RldmVsb3BtZW50LXRvb2xzL2ZyYW1ld29ya3MvcmVhY3QnIH0sXG4gICAgICAgIHsgdGV4dDogJ1Z1ZScsIGxpbms6ICcvZGV2ZWxvcG1lbnQtdG9vbHMvZnJhbWV3b3Jrcy92dWUnIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gICcvZGV2ZWxvcG1lbnQtdG9vbHMvZGF0YWJhc2UvJzogW1xuICAgIHtcbiAgICAgIHRleHQ6ICdcdTY1NzBcdTYzNkVcdTVFOTMnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ0RhdGFiYXNlIE92ZXJ2aWV3JywgbGluazogJy9kZXZlbG9wbWVudC10b29scy9kYXRhYmFzZS8nIH0sXG4gICAgICAgIHsgdGV4dDogJ1JlZGlzJywgbGluazogJy9kZXZlbG9wbWVudC10b29scy9kYXRhYmFzZS9yZWRpcycgfSxcbiAgICAgICAgeyB0ZXh0OiAnUGVld2VlJywgbGluazogJy9kZXZlbG9wbWVudC10b29scy9kYXRhYmFzZS9wZWV3ZWUnIH0sXG4gICAgICAgIHsgdGV4dDogJ015U1FMJywgbGluazogJy9kZXZlbG9wbWVudC10b29scy9kYXRhYmFzZS9teXNxbCcgfSxcbiAgICAgICAgeyB0ZXh0OiAnTW9uZ29EQicsIGxpbms6ICcvZGV2ZWxvcG1lbnQtdG9vbHMvZGF0YWJhc2UvbW9uZ29kYicgfVxuICAgICAgXVxuICAgIH1cbiAgXSxcbiAgJy9kZXZlbG9wbWVudC10b29scy9mcm9udGVuZC8nOiBbXG4gICAge1xuICAgICAgdGV4dDogJ1x1NTI0RFx1N0FFRlx1NUYwMFx1NTNEMScsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnSFRNTCAmIENTUycsIGxpbms6ICcvZGV2ZWxvcG1lbnQtdG9vbHMvZnJvbnRlbmQvaHRtbC1jc3MnIH0sXG4gICAgICAgIHsgdGV4dDogJ0phdmFTY3JpcHQnLCBsaW5rOiAnL2RldmVsb3BtZW50LXRvb2xzL2Zyb250ZW5kL2phdmFzY3JpcHQnIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gICcvZGV2ZWxvcG1lbnQtdG9vbHMvbmV0d29ya3MvJzogW1xuICAgIHtcbiAgICAgIHRleHQ6ICdcdTdGNTFcdTdFRENcdTYyODBcdTY3MkYnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ1RDUC9JUCBcdTUzNEZcdThCQUVcdTY4MDgnLCBsaW5rOiAnL2RldmVsb3BtZW50LXRvb2xzL25ldHdvcmtzL3RjcC1pcCcgfSxcbiAgICAgICAgeyB0ZXh0OiAnSFRUUC9IVFRQUycsIGxpbms6ICcvZGV2ZWxvcG1lbnQtdG9vbHMvbmV0d29ya3MvaHR0cC1odHRwcycgfVxuICAgICAgXVxuICAgIH1cbiAgXSxcbiAgJy9kZXZlbG9wbWVudC10b29scy9jbG91ZC1zZXJ2ZXIvJzogW1xuICAgIHtcbiAgICAgIHRleHQ6ICdcdTRFOTFcdTY3MERcdTUyQTFcdTU2NjgnLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ0FXUyBFQzInLCBsaW5rOiAnL2RldmVsb3BtZW50LXRvb2xzL2Nsb3VkLXNlcnZlci9hd3MtZWMyJyB9LFxuICAgICAgICB7IHRleHQ6ICdHb29nbGUgQ2xvdWQgVk1zJywgbGluazogJy9kZXZlbG9wbWVudC10b29scy9jbG91ZC1zZXJ2ZXIvZ29vZ2xlLWNsb3VkLXZtcycgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvcmVzZWFyY2gtcHJvamVjdHMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyL3Jlc2VhcmNoLXByb2plY3RzLmpzXCI7ZXhwb3J0IGNvbnN0IHJlc2VhcmNoUHJvamVjdHNTaWRlYmFyID0ge1xuICAnL3Jlc2VhcmNoLXByb2plY3RzL3BhcGVycy8nOiBbXG4gICAge1xuICAgICAgdGV4dDogJ1x1NUI2Nlx1NjcyRlx1OEJCQVx1NjU4NycsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnT3ZlcnZpZXcnLCBsaW5rOiAnL3Jlc2VhcmNoLXByb2plY3RzL3BhcGVycy8nIH0sXG4gICAgICAgIHsgdGV4dDogJ1BhcGVyIDEnLCBsaW5rOiAnL3Jlc2VhcmNoLXByb2plY3RzL3BhcGVycy9wYXBlci0xJyB9LFxuICAgICAgICB7IHRleHQ6ICdQYXBlciAyJywgbGluazogJy9yZXNlYXJjaC1wcm9qZWN0cy9wYXBlcnMvcGFwZXItMicgfVxuICAgICAgXVxuICAgIH1cbiAgXSxcbiAgJy9yZXNlYXJjaC1wcm9qZWN0cy9wcm9qZWN0cy8nOiBbXG4gICAge1xuICAgICAgdGV4dDogJ1x1NzgxNFx1N0E3Nlx1OTg3OVx1NzZFRScsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiAnT3ZlcnZpZXcnLCBsaW5rOiAnL3Jlc2VhcmNoLXByb2plY3RzL3Byb2plY3RzLycgfSxcbiAgICAgICAgeyB0ZXh0OiAnUHJvamVjdCAxJywgbGluazogJy9yZXNlYXJjaC1wcm9qZWN0cy9wcm9qZWN0cy9wcm9qZWN0LTEnIH0sXG4gICAgICAgIHsgdGV4dDogJ1Byb2plY3QgMicsIGxpbms6ICcvcmVzZWFyY2gtcHJvamVjdHMvcHJvamVjdHMvcHJvamVjdC0yJyB9XG4gICAgICBdXG4gICAgfVxuICBdLFxuICAnL3Jlc2VhcmNoLXByb2plY3RzL3Jlc2VhcmNoLyc6IFtcbiAgICB7XG4gICAgICB0ZXh0OiAnXHU3ODE0XHU3QTc2XHU2NUI5XHU1NDExJyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6ICdSRi1Qb3NlJywgbGluazogJy9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC9SRi1Qb3NlJyB9LFxuICAgICAgICB7IHRleHQ6ICdJbmZvcm1hdGlvbiBUaGVvcnknLCBsaW5rOiAnL3Jlc2VhcmNoLXByb2plY3RzL3Jlc2VhcmNoL2luZm9ybWF0aW9uX3RoZW9yeScgfSxcbiAgICAgICAgeyB0ZXh0OiAnRmFjZSBSZWNvZ25pdGlvbicsIGxpbms6ICcvcmVzZWFyY2gtcHJvamVjdHMvcmVzZWFyY2gvZmFjZV9yZWNvZ25pdGlvbicgfSxcbiAgICAgICAgeyB0ZXh0OiAnTU5JU1QnLCBsaW5rOiAnL3Jlc2VhcmNoLXByb2plY3RzL3Jlc2VhcmNoL21uaXN0JyB9LFxuICAgICAgICB7IHRleHQ6ICdMYVRlWCcsIGxpbms6ICcvcmVzZWFyY2gtcHJvamVjdHMvcmVzZWFyY2gvbGF0ZXgnIH0sXG4gICAgICAgIHsgdGV4dDogJ0NTSSBUb29sJywgbGluazogJy9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC9jc2l0b29sJyB9LFxuICAgICAgICB7IHRleHQ6ICdDVlBSJywgbGluazogJy9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC9jdnByJyB9LFxuICAgICAgICB7IHRleHQ6ICdBcnJheVRyYWNrJywgbGluazogJy9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC9BcnJheVRyYWNrJyB9LFxuICAgICAgICB7IHRleHQ6ICdUZW5zb3JGbG93JywgbGluazogJy9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC90ZW5zb3JmbG93JyB9LFxuICAgICAgICB7IHRleHQ6ICdDTk4nLCBsaW5rOiAnL3Jlc2VhcmNoLXByb2plY3RzL3Jlc2VhcmNoL2NubicgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvYXV0by1nZW5lcmF0ZWQuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyL2F1dG8tZ2VuZXJhdGVkLmpzXCI7Ly8gXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0XHU0RkE3XHU4RkI5XHU2ODBGXHU5MTREXHU3RjZFXG4vLyBcdTZCNjRcdTY1ODdcdTRFRjZcdTc1MzEgZ2VuZXJhdGVTaWRlYmFyLmpzIFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1RkYwQ1x1OEJGN1x1NTJGRlx1NjI0Qlx1NTJBOFx1NEZFRVx1NjUzOVxuXG5leHBvcnQgY29uc3QgYXV0b0dlbmVyYXRlZFNpZGViYXIgPSB7XG4gIFwiL2FsZ29yaXRobXMvXCI6IFtcbiAgICB7XG4gICAgICBcInRleHRcIjogXCJBbGdvcml0aG1zXCIsXG4gICAgICBcImNvbGxhcHNlZFwiOiBmYWxzZSxcbiAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiRGF0YSBTdHJ1Y3RcIixcbiAgICAgICAgICBcImNvbGxhcHNlZFwiOiBmYWxzZSxcbiAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSGFzaE1hcFwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvYWxnb3JpdGhtcy9kYXRhX3N0cnVjdC9oYXNobWFwXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkxpbmtlZCBMaXN0XCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9hbGdvcml0aG1zL2RhdGFfc3RydWN0L2xpbmtlZGxpc3RcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRGF0YSBTdHJ1Y3RcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3QvcmVhZG1lXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlN0YWNrXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9hbGdvcml0aG1zL2RhdGFfc3RydWN0L3N0YWNrXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlN0cmluZ1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvYWxnb3JpdGhtcy9kYXRhX3N0cnVjdC9zdHJpbmdcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVHJlZVwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvYWxnb3JpdGhtcy9kYXRhX3N0cnVjdC90cmVlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJCYWNrdHJhY2tcIixcbiAgICAgICAgICBcImxpbmtcIjogXCIvYWxnb3JpdGhtcy9iYWNrdHJhY2tcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiQmluYXJ5IFNlYXJjaFwiLFxuICAgICAgICAgIFwibGlua1wiOiBcIi9hbGdvcml0aG1zL2JpbmFyeV9zZWFyY2hcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiQmluYXJ5IFRyZWVcIixcbiAgICAgICAgICBcImxpbmtcIjogXCIvYWxnb3JpdGhtcy9iaW5hcnlfdHJlZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJEZnMgQmZzXCIsXG4gICAgICAgICAgXCJsaW5rXCI6IFwiL2FsZ29yaXRobXMvZGZzX2Jmc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJEcFwiLFxuICAgICAgICAgIFwibGlua1wiOiBcIi9hbGdvcml0aG1zL2RwXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIkxDU1wiLFxuICAgICAgICAgIFwibGlua1wiOiBcIi9hbGdvcml0aG1zL2xjc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJLbmFwc2Fja1wiLFxuICAgICAgICAgIFwibGlua1wiOiBcIi9hbGdvcml0aG1zL3BhY2thZ2VcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiUHJlc3VtXCIsXG4gICAgICAgICAgXCJsaW5rXCI6IFwiL2FsZ29yaXRobXMvcHJlc3VtXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIlNsaWRlIFdpbmRvd1wiLFxuICAgICAgICAgIFwibGlua1wiOiBcIi9hbGdvcml0aG1zL3NsaWRlX3dpbmRvd1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJDb2RlIFNuYXBwZXRcIixcbiAgICAgICAgICBcImxpbmtcIjogXCIvYWxnb3JpdGhtcy9zbmFwcGV0XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIlNvcnRcIixcbiAgICAgICAgICBcImxpbmtcIjogXCIvYWxnb3JpdGhtcy9zb3J0XCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXSxcbiAgXCIvYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UvXCI6IFtcbiAgICB7XG4gICAgICBcInRleHRcIjogXCJBcnRpZmljaWFsIEludGVsbGlnZW5jZVwiLFxuICAgICAgXCJjb2xsYXBzZWRcIjogZmFsc2UsXG4gICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIkFNWFwiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJPcGVuVmlub1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UvQU1YL29wZW52aW5vXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJEaXN0cmlidXRlZCBUcmFpbmluZ1wiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJNZWdhdHJvbiAmIFBhcmFsbGVsXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9hcnRpZmljaWFsLWludGVsbGlnZW5jZS9kaXN0cmlidXRlZC10cmFpbmluZy9tZWdhdHJvbl9wYXJhbGxlbFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJuY2NsLXRlc3QgcnVuXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9hcnRpZmljaWFsLWludGVsbGlnZW5jZS9kaXN0cmlidXRlZC10cmFpbmluZy9uY2NsLXRlc3RcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIkdwdSBDb21wdXRpbmdcIixcbiAgICAgICAgICBcImNvbGxhcHNlZFwiOiBmYWxzZSxcbiAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU0FDIC0gSVNDQSAyM1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UvZ3B1LWNvbXB1dGluZy9TQUMgLSBJU0NBIDIzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkdQVSBBcmNoaXRlY3R1cmUgLSBcdTZERjFcdTUxNjVcdTc0MDZcdTg5RTNcdTU2RkVcdTVGNjJcdTU5MDRcdTc0MDZcdTU2NjhcdTY3QjZcdTY3ODRcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2FydGlmaWNpYWwtaW50ZWxsaWdlbmNlL2dwdS1jb21wdXRpbmcvZ3B1X2FyY2hcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiR1BVIENvbW11bmljYXRpb25cIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2FydGlmaWNpYWwtaW50ZWxsaWdlbmNlL2dwdS1jb21wdXRpbmcvZ3B1X2NvbW11bmljYXRpb25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIlByb2ZpbGluZ1wiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJQeXRob24gQUkgUHJvZmlsaW5nXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9hcnRpZmljaWFsLWludGVsbGlnZW5jZS9wcm9maWxpbmcvQUkgUHJvZmlsaW5nXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gIFwiL2NvbXB1dGVyLXN5c3RlbXMvXCI6IFtcbiAgICB7XG4gICAgICBcInRleHRcIjogXCJDb21wdXRlciBTeXN0ZW1zXCIsXG4gICAgICBcImNvbGxhcHNlZFwiOiBmYWxzZSxcbiAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiQ3B1IEdwdVwiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJBcm0gQXJjaGl0ZWN0dXJlXCIsXG4gICAgICAgICAgICAgIFwiY29sbGFwc2VkXCI6IHRydWUsXG4gICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIklTQTogQXJtIEluLWxpbmUgQXNzZW1ibHlcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvYXJtLWFyY2hpdGVjdHVyZS9hcm1faW5saW5lX2Fzc2VtYmx5XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIklTQTogQVJNIEluc3RydWN0aW9ucyBTZXRcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvYXJtLWFyY2hpdGVjdHVyZS9hcm1faW5zXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNwdSBBcmNoaXRlY3R1cmVcIixcbiAgICAgICAgICAgICAgXCJjb2xsYXBzZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSW5zdHJ1Y3Rpb24gU2V0c1wiLFxuICAgICAgICAgICAgICAgICAgXCJjb2xsYXBzZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQU1YIFx1NjMwN1x1NEVFNFwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvY3B1LWFyY2hpdGVjdHVyZS9pbnN0cnVjdGlvbi1zZXRzL2FteFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJbnN0cnVjdGlvbnMgb2YgeDg2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2NvbXB1dGVyLXN5c3RlbXMvY3B1LWdwdS9jcHUtYXJjaGl0ZWN0dXJlL2luc3RydWN0aW9uLXNldHMveDg2X2luc3RcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJNZW1vcnkgU3lzdGVtc1wiLFxuICAgICAgICAgICAgICAgICAgXCJjb2xsYXBzZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTU1VXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2NvbXB1dGVyLXN5c3RlbXMvY3B1LWdwdS9jcHUtYXJjaGl0ZWN0dXJlL21lbW9yeS1zeXN0ZW1zL01NVVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDYWNoZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvY3B1LWFyY2hpdGVjdHVyZS9tZW1vcnktc3lzdGVtcy9jYWNoZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJWaXJ0dWFsIE1lbW9yeSBhbmQgUGFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvY3B1LWFyY2hpdGVjdHVyZS9tZW1vcnktc3lzdGVtcy9tZW1vcnlfdmFfcGFnZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJOdW1hIGFuZCBTb2NrZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9jcHUtZ3B1L2NwdS1hcmNoaXRlY3R1cmUvbWVtb3J5LXN5c3RlbXMvbnVtYV9zb2NrZXRcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQaXBlbGluZSBQZXJmb3JtYW5jZVwiLFxuICAgICAgICAgICAgICAgICAgXCJjb2xsYXBzZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQU1EIElCU1wiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2NwdS1ncHUvY3B1LWFyY2hpdGVjdHVyZS9waXBlbGluZS1wZXJmb3JtYW5jZS9pYnNcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUGlwZWxpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9jcHUtZ3B1L2NwdS1hcmNoaXRlY3R1cmUvcGlwZWxpbmUtcGVyZm9ybWFuY2UvcGlwbGluZVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJMaW51eFwiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJDb21tYW5kcyBUb29sc1wiLFxuICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJMaW51eCBDb21tYW5kXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9saW51eC9jb21tYW5kcy10b29scy9jb21tYW5kXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkVkdWNhdGlvbmFsXCIsXG4gICAgICAgICAgICAgIFwiY29sbGFwc2VkXCI6IHRydWUsXG4gICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlhWNiAoNi44MjgpXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9saW51eC9lZHVjYXRpb25hbC94djZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiS2VybmVsXCIsXG4gICAgICAgICAgICAgIFwiY29sbGFwc2VkXCI6IHRydWUsXG4gICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkFyY2hpdGVjdHVyZVwiLFxuICAgICAgICAgICAgICAgICAgXCJjb2xsYXBzZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQkwzMVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2xpbnV4L2tlcm5lbC9hcmNoaXRlY3R1cmUvQkwzMVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNvcmUgQ29uY2VwdHNcIixcbiAgICAgICAgICAgICAgICAgIFwiY29sbGFwc2VkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk5vdGlmaWVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2NvbXB1dGVyLXN5c3RlbXMvbGludXgva2VybmVsL2NvcmUtY29uY2VwdHMvbm90aWZpZXJcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHRocmVhZFwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2xpbnV4L2tlcm5lbC9jb3JlLWNvbmNlcHRzL3B0aHJlYWRcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJEZXZpY2UgRHJpdmVyc1wiLFxuICAgICAgICAgICAgICAgICAgXCJjb2xsYXBzZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSTJjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2NvbXB1dGVyLXN5c3RlbXMvbGludXgva2VybmVsL2RldmljZS1kcml2ZXJzL2kyY1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIk1lbW9yeSBNYW5hZ2VtZW50XCIsXG4gICAgICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJUSFBcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvbWVtb3J5LW1hbmFnZW1lbnQvVEhQXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHJvY2VzcyBTY2hlZHVsaW5nXCIsXG4gICAgICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJZGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2NvbXB1dGVyLXN5c3RlbXMvbGludXgva2VybmVsL3Byb2Nlc3Mtc2NoZWR1bGluZy9pZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlRpY2sgaW4gSWRsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2xpbnV4L2tlcm5lbC9wcm9jZXNzLXNjaGVkdWxpbmcvaWRsZV90aWNrXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJDVSh0b2RvKVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2xpbnV4L2tlcm5lbC9wcm9jZXNzLXNjaGVkdWxpbmcvcmN1XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVGhlcm1hbCBNYW5hZ2VtZW50XCIsXG4gICAgICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJUaGVybWFsICgxKSAtIFRoZXJtYWwgT3ZlcnZpZXdcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvdGhlcm1hbC1tYW5hZ2VtZW50L3RoZXJtYWxcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVGhlcm1hbCAoMikgLSBUaGVybWFsIEluaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9saW51eC9rZXJuZWwvdGhlcm1hbC1tYW5hZ2VtZW50L3RoZXJtYWxfaW5pdFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJUaGVybWFsICgzKSAtIGluaXQuaCBpbiBUaGVybWFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2NvbXB1dGVyLXN5c3RlbXMvbGludXgva2VybmVsL3RoZXJtYWwtbWFuYWdlbWVudC90aGVybWFsX2luaXRfaFwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlN5c3RlbSBBZG1pbmlzdHJhdGlvblwiLFxuICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJhcHQgc291cmNlXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9saW51eC9zeXN0ZW0tYWRtaW5pc3RyYXRpb24vYXB0XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlN5c3RlbSBQcm9ncmFtbWluZ1wiLFxuICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDIFBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2xpbnV4L3N5c3RlbS1wcm9ncmFtbWluZy9jLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ21ha2VcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9jb21wdXRlci1zeXN0ZW1zL2xpbnV4L3N5c3RlbS1wcm9ncmFtbWluZy9jbWFrZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDbWFrZSBNYWtlZmlsZVwiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2NvbXB1dGVyLXN5c3RlbXMvbGludXgvc3lzdGVtLXByb2dyYW1taW5nL2NtYWtlX21ha2VmaWxlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkxpbmtlcnMgJiBMb2FkZXJzXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvY29tcHV0ZXItc3lzdGVtcy9saW51eC9zeXN0ZW0tcHJvZ3JhbW1pbmcvbGlua2Vyc19sb2FkZXJzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlNpemUgVFwiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2NvbXB1dGVyLXN5c3RlbXMvbGludXgvc3lzdGVtLXByb2dyYW1taW5nL3NpemVfdFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdLFxuICBcIi9kZXZlbG9wbWVudC10b29scy9cIjogW1xuICAgIHtcbiAgICAgIFwidGV4dFwiOiBcIkRldmVsb3BtZW50IFRvb2xzXCIsXG4gICAgICBcImNvbGxhcHNlZFwiOiBmYWxzZSxcbiAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2xvdWQgU2VydmVyXCIsXG4gICAgICAgICAgXCJjb2xsYXBzZWRcIjogZmFsc2UsXG4gICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkRvY2tlciBcdTUxNjVcdTk1RThcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL2Nsb3VkLXNlcnZlci9Eb2NrZXJcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU4QkJFXHU4QkExXHU2QTIxXHU1RjBGXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy9jbG91ZC1zZXJ2ZXIvZGVzaWduLXBhdHRlcm5cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSkFWQSBHQyBcdTc4MTRcdTdBNzZcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL2Nsb3VkLXNlcnZlci9nY1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJIdWF3ZWkgQ2xvdWQgXHU1MTY1XHU5NUU4XCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy9jbG91ZC1zZXJ2ZXIvaHVhd2VpX2Nsb3VkXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkpBVkEgXHU4NjVBXHU2MkRGXHU2NzNBIEFSVCBcdTc4MTRcdTdBNzZcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL2Nsb3VkLXNlcnZlci9qdm1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSkFWQSBcdTg2NUFcdTYyREZcdTY3M0EgQVJUIFx1NzgxNFx1N0E3Nlx1RkYwOFx1Njc0Mlx1OEMwOFx1RkYwOVwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvY2xvdWQtc2VydmVyL2p2bV9hcnRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiTGludXggS2VybmVsIEJ1aWxkXHVGRjFBTGludXggXHU1MTg1XHU2ODM4XHU3RjE2XHU4QkQxXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy9jbG91ZC1zZXJ2ZXIva2VybmVsXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlx1NkRGMVx1NUVBNlx1NUI5RVx1OERGNSBLVk0gLS0gS1ZNIFx1NjI4MFx1NjcyRlx1OEJFNlx1ODlFM1x1NEUwRVx1NUI5RVx1NjIxOFwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvY2xvdWQtc2VydmVyL2t2bVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJMaW51eCBcdThGREJcdTdBMEJcdTU0OENcdTdFQkZcdTdBMEJcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL2Nsb3VkLXNlcnZlci9saW51eF9vc1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJOZ2lueCBcdTU3RkFcdTc4NDBcdTYwM0JcdTdFRDNcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL2Nsb3VkLXNlcnZlci9uZ2lueFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJPcGVucmVzdHkgXHU1N0ZBXHU3ODQwXHU2MDNCXHU3RUQzXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy9jbG91ZC1zZXJ2ZXIvb3BlbnJlc3R5XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkxpbnV4IFx1NTMwNVx1N0JBMVx1NzQwNlx1RkYxQVNuYXBcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL2Nsb3VkLXNlcnZlci9zbmFwXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJEYXRhYmFzZVwiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJNb25nb0RCIERhdGFiYXNlXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy9kYXRhYmFzZS9tb25nb2RiXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIk15U3FsIFx1NTdGQVx1Nzg0MFx1NjAzQlx1N0VEM1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvZGF0YWJhc2UvbXlzcWxcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHl0aG9uIE9STSAtIHBlZXdlZVwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvZGF0YWJhc2UvcGVld2VlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJlZGlzIGFuZCByZWRpcy1weVwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvZGF0YWJhc2UvcmVkaXNcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIkZyYW1ld29ya3NcIixcbiAgICAgICAgICBcImNvbGxhcHNlZFwiOiBmYWxzZSxcbiAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ2VsZXJ5XHVGRjFBXHU1MjA2XHU1RTAzXHU1RjBGXHU2RDg4XHU2MDZGXHU0RjIwXHU4RjkzXHU3Njg0XHU1RjAyXHU2QjY1XHU0RUZCXHU1MkExXHU5NjFGXHU1MjE3XCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy9mcmFtZXdvcmtzL2NlbGVyeVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJGbGFza1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvZnJhbWV3b3Jrcy9mbGFza1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJTcHJpbmdcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL2ZyYW1ld29ya3Mvc3ByaW5nXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJGcm9udGVuZFwiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJDaGFydHMuanNcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL2Zyb250ZW5kL2NoYXJ0c2pzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNTU1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvZnJvbnRlbmQvY3NzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkpTIGNvZGUgLSBKYXZhU2NyaXB0IFx1NUUzOFx1ODlDMVx1OEJFRFx1NkNENVwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvZnJvbnRlbmQvanNub3RlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIk5vZGUuanMgXHU1Qjg5XHU4OEM1XHU1NDhDIHlhcm4gXHU1MzA1XHU3QkExXHU3NDA2XCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy9mcm9udGVuZC9ub2RlX2luc3RhbGxcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLmpzIFx1NjAzQlx1N0VEM1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvZnJvbnRlbmQvdnVlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJOZXR3b3Jrc1wiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJDIFx1OEJFRFx1OEEwMCBzb2NrZXQgXHU1QjlFXHU3M0IwXHU0RUU1XHU1M0NBIEVwb2xsLCBMaWJldmVudFwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvbmV0d29ya3MvZXBvbGxcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSFRUUCBhbmQgSFRUUC8yXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy9uZXR3b3Jrcy9odHRwXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlRDUC9JUCBcdTYwM0JcdTdFRDNcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL25ldHdvcmtzL25ldHdvcmtzXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJPdGhlcnNcIixcbiAgICAgICAgICBcImNvbGxhcHNlZFwiOiBmYWxzZSxcbiAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU3RjE2XHU3QTBCXHU3NTFGXHU2REFGXHU2MDNCXHU3RUQzIC0gd2VpZ2FvY2hlblwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvb3RoZXJzL2NvZGVfbGlmZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCIyMDE5IFx1NjVCMFx1NUU3NFx1NjExRlx1NjA5RlwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvb3RoZXJzL25ld1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJQYXBlciBSZXBvcnRcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL290aGVycy9wYXBlcl9yZXBvcnRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU29mdCBTa2lsbHMgLSBUaGUgU29mdHdhcmUgRGV2ZWxvcGVyJ3MgTGlmdCBNYW51YWxcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL290aGVycy9zb2Z0X3NraWxsc1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJcdTY1RTVcdTVFMzhcdTYxMUZcdTYwOUZcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL290aGVycy90aG91Z2h0cy0yMDE4XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIjIwMTggYnVnIFx1NjVFNVx1OEJCMFwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvb3RoZXJzL3dvcmtsb2dcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVGhlIFplbiBvZiBQeXRob25cIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL290aGVycy96ZW5fb2ZfcHl0aG9uXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJUb29sc1wiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJCYXQgU2NyaXB0XCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9kZXZlbG9wbWVudC10b29scy90b29scy9iYXRfd2luXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkdpdFwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvdG9vbHMvZ2l0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkltYWdlIFNpemUgR3VpZGVcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL2RldmVsb3BtZW50LXRvb2xzL3Rvb2xzL2ltYWdlLXNpemUtZ3VpZGVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVmltIFx1NEY3Rlx1NzUyOFx1NTE2NVx1OTVFOFwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvdG9vbHMvdmltXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlZwc1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvZGV2ZWxvcG1lbnQtdG9vbHMvdG9vbHMvdnBzXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gIFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9cIjogW1xuICAgIHtcbiAgICAgIFwidGV4dFwiOiBcIlByb2dyYW1taW5nIExhbmd1YWdlc1wiLFxuICAgICAgXCJjb2xsYXBzZWRcIjogZmFsc2UsXG4gICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIkphdmFcIixcbiAgICAgICAgICBcImNvbGxhcHNlZFwiOiBmYWxzZSxcbiAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQW5kcm9pZFwiLFxuICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJBZGIgQ29tbWFuZCBBbmQgU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvYW5kcm9pZC9hZGJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmVzZWFyY2ggb24gQmluZGVyXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvYW5kcm9pZC9iaW5kZXJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQmluZGVyIFBoYXNlc1wiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2FuZHJvaWQvYmluZGVyXzAxXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJpbmRlciBcdTUxODVcdTVCNThcdTdCQTFcdTc0MDZcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9hbmRyb2lkL2JpbmRlcl8wMlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJUEMgQmluZGVyIFx1NEU0Qlx1Njc0Mlx1OEMwOFwiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2FuZHJvaWQvaXBjXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJpbmRlciBQYXJjZWxcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9hbmRyb2lkL3BhcmNlbFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJBcnRcIixcbiAgICAgICAgICAgICAgXCJjb2xsYXBzZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQVJUIENyZWF0ZVwiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2FydC9hcnRfY3JlYXRlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkFSVCBkZXgyb2F0XCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvYXJ0L2FydF9kZXgyb2F0XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkFSVCBKTklcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9hcnQvYXJ0X2puaVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJKYXZhIEdDIC0gQ29uY3VycmVudCBDb3B5aW5nKEFydClcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvamF2YS9hcnQvZ2NfYXJ0XzAxXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkp2bVwiLFxuICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJKVk0gTWVtb3J5XCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvanZtLzAxX2p2bV9tZW1vcnlcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU2REYxXHU1MTY1XHU4OUUzXHU2NzkwIEcxIEdDXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvanZtL2djX2cxXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkpWTSBJbnN0XCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvanZtL2p2bV9pbnN0XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkphdmEgXHU1M0NEXHU1QzA0XHVGRjFBXHU1MTY4XHU5NzYyXHU4OUUzXHU2NzkwXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvanZtL3JlZmxlY3Rpb25cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSkFWQSBcdTg2NUFcdTYyREZcdTY3M0EgQVJUIFx1NzgxNFx1N0E3NlwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL2phdmEvanZtXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkpBVkEgXHU4NjVBXHU2MkRGXHU2NzNBIEFSVCBcdTc4MTRcdTdBNzZcdUZGMDhcdTY3NDJcdThDMDhcdUZGMDlcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9qYXZhL2p2bV9hcnRcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIlB5dGhvblwiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJMYW5ndWFnZVwiLFxuICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJDb3JvdXRpbmVzXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi9sYW5ndWFnZS9jb3JvdXRpbmVzXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkNyb250YWJcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL2xhbmd1YWdlL2Nyb250YWJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiRWZmZWN0aXZlIFB5dGhvblwiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vbGFuZ3VhZ2UvZWZmZWN0aXZlLXB5dGhvblwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJIYXNoIE1hcCAmIERpY3RcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL2xhbmd1YWdlL2hhc2hcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSS9PXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi9sYW5ndWFnZS9pb1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJJdGVydG9vbHNcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL2xhbmd1YWdlL2l0ZXJ0b29sc1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJMb2dcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL2xhbmd1YWdlL2xvZ1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQaXBcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL2xhbmd1YWdlL3BpcFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQeSBEYXRhIFN0cnVjdFwiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vbGFuZ3VhZ2UvcHktZGF0YS1zdHJ1Y3RcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHl0aG9uIEZpbGVcIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL2xhbmd1YWdlL3B5LWZpbGVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHl0ZXN0XCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi9sYW5ndWFnZS9weXRlc3RcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUHl0aG9uIEZ1bmN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi9sYW5ndWFnZS9weXRob24tZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiT08gJiBDbGFzc1wiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vbGFuZ3VhZ2UvcHl0aG9uLW9vXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIlB5dGhvbiBDXCIsXG4gICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcHJvZ3JhbW1pbmctbGFuZ3VhZ2VzL3B5dGhvbi9sYW5ndWFnZS9weXRob25fY1wiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJUb29sc1wiLFxuICAgICAgICAgICAgICBcImNvbGxhcHNlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjogXCJQeSBUb29sc1wiLFxuICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Byb2dyYW1taW5nLWxhbmd1YWdlcy9weXRob24vdG9vbHMvcHktdG9vbHNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwidmlydHVhbGVudiZWaXNkb21cIixcbiAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi9wcm9ncmFtbWluZy1sYW5ndWFnZXMvcHl0aG9uL3Rvb2xzL3ZpcnR1YWxlbnZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXSxcbiAgXCIvcmVzZWFyY2gtcHJvamVjdHMvXCI6IFtcbiAgICB7XG4gICAgICBcInRleHRcIjogXCJSZXNlYXJjaCBQcm9qZWN0c1wiLFxuICAgICAgXCJjb2xsYXBzZWRcIjogZmFsc2UsXG4gICAgICBcIml0ZW1zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIlBhcGVyc1wiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJWcCBIcGNhMTRcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Jlc2VhcmNoLXByb2plY3RzL3BhcGVycy92cF9ocGNhMTRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSlZNX01FTU9SWVwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcmVzZWFyY2gtcHJvamVjdHMvcGFwZXJzL3ZwX3ZhbHVlX3ByZWRpY3Rpb25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwidGV4dFwiOiBcIlByb2plY3RzXCIsXG4gICAgICAgICAgXCJjb2xsYXBzZWRcIjogZmFsc2UsXG4gICAgICAgICAgXCJpdGVtc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkJsb2cgVXBkYXRlIFBsYW5cIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Jlc2VhcmNoLXByb2plY3RzL3Byb2plY3RzL2Jsb2dfcGxhblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJKZWt5bGwgR2l0SHViIFBhZ2VzIEJsb2dcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Jlc2VhcmNoLXByb2plY3RzL3Byb2plY3RzL2pla3lsbFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJMaW51eCBUZXh0IEVkaXRvclx1RkYxQUtpbG8sIENcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Jlc2VhcmNoLXByb2plY3RzL3Byb2plY3RzL2tpbG9cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUVEgXHU4MUVBXHU1MkE4XHU4MDRBXHU1OTI5XHU2NzNBXHU1NjY4XHU0RUJBXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9yZXNlYXJjaC1wcm9qZWN0cy9wcm9qZWN0cy9xcWJvdFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJWdWVwcmVzcyBCbG9nIEd1aWRlXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9yZXNlYXJjaC1wcm9qZWN0cy9wcm9qZWN0cy92dWVibG9nXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcInRleHRcIjogXCJSZXNlYXJjaFwiLFxuICAgICAgICAgIFwiY29sbGFwc2VkXCI6IGZhbHNlLFxuICAgICAgICAgIFwiaXRlbXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJBcnJheVRyYWNrXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC9BcnJheVRyYWNrXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIlJGLVBvc2VcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Jlc2VhcmNoLXByb2plY3RzL3Jlc2VhcmNoL1JGLVBvc2VcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ25uXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC9jbm5cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ1NJIFRvb2xcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Jlc2VhcmNoLXByb2plY3RzL3Jlc2VhcmNoL2NzaXRvb2xcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ3ZwclwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcmVzZWFyY2gtcHJvamVjdHMvcmVzZWFyY2gvY3ZwclwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJZT0xPIGFuZCBEYXJrTmV0XCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC9mYWNlX3JlY29nbml0aW9uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIkluZm9ybWF0aW9uIGFuZCBUaGVvcnkgLSBBbiBpbXByb3ZlZCBtT1BFIGNvZGluZyBtZXRob2RcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Jlc2VhcmNoLXByb2plY3RzL3Jlc2VhcmNoL2luZm9ybWF0aW9uX3RoZW9yeVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJMYVRlWCBcdTc1MjhcdTZDRDVcdTU0OENcdThCRURcdTZDRDVcdTYwM0JcdTdFRDNcIixcbiAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiL3Jlc2VhcmNoLXByb2plY3RzL3Jlc2VhcmNoL2xhdGV4XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwidGV4dFwiOiBcIk1OSVNUIFx1NjI0Qlx1NTE5OVx1NjU3MFx1NUI1N1x1OEJDNlx1NTIyQlwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcmVzZWFyY2gtcHJvamVjdHMvcmVzZWFyY2gvbW5pc3RcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiT3BlbkNWXCIsXG4gICAgICAgICAgICAgIFwibGlua1wiOiBcIi9yZXNlYXJjaC1wcm9qZWN0cy9yZXNlYXJjaC9vcGVuY3ZcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiU3BsaWNlclwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcmVzZWFyY2gtcHJvamVjdHMvcmVzZWFyY2gvc3BsaWNlclwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJUZW5zb3JGbG93IFx1NTE2NVx1OTVFOFwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcmVzZWFyY2gtcHJvamVjdHMvcmVzZWFyY2gvdGVuc29yZmxvd1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcInRleHRcIjogXCJUZW5zb3JmbG93IEkvT1wiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCIvcmVzZWFyY2gtcHJvamVjdHMvcmVzZWFyY2gvdGVuc29yZmxvd2lvXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvY29uZmlnL3NpZGViYXIvaW5kZXguanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL2NvbmZpZy9zaWRlYmFyL2luZGV4LmpzXCI7aW1wb3J0IHsgYWxnb3JpdGhtc1NpZGViYXIgfSBmcm9tICcuL2FsZ29yaXRobXMuanMnXG5pbXBvcnQgeyBhcnRpZmljaWFsSW50ZWxsaWdlbmNlU2lkZWJhciB9IGZyb20gJy4vYXJ0aWZpY2lhbC1pbnRlbGxpZ2VuY2UuanMnXG5pbXBvcnQgeyBjb21wdXRlclN5c3RlbXNTaWRlYmFyIH0gZnJvbSAnLi9jb21wdXRlci1zeXN0ZW1zLmpzJ1xuaW1wb3J0IHsgcHJvZ3JhbW1pbmdMYW5ndWFnZXNTaWRlYmFyIH0gZnJvbSAnLi9wcm9ncmFtbWluZy1sYW5ndWFnZXMuanMnXG5pbXBvcnQgeyBkZXZlbG9wbWVudFRvb2xzU2lkZWJhciB9IGZyb20gJy4vZGV2ZWxvcG1lbnQtdG9vbHMuanMnXG5pbXBvcnQgeyByZXNlYXJjaFByb2plY3RzU2lkZWJhciB9IGZyb20gJy4vcmVzZWFyY2gtcHJvamVjdHMuanMnXG5pbXBvcnQgeyBhdXRvR2VuZXJhdGVkU2lkZWJhciB9IGZyb20gJy4vYXV0by1nZW5lcmF0ZWQuanMnXG5cbi8vIFx1NTQwOFx1NUU3Nlx1NjI0Qlx1NTJBOFx1OTE0RFx1N0Y2RVx1NTQ4Q1x1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NzY4NFx1NEZBN1x1OEZCOVx1NjgwRlx1OTE0RFx1N0Y2RVxuLy8gXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU3Njg0XHU5MTREXHU3RjZFXHU0RjFBXHU4OTg2XHU3NkQ2XHU2MjRCXHU1MkE4XHU5MTREXHU3RjZFXHU3Njg0XHU1NDBDXHU1NDBEXHU4REVGXHU1Rjg0XG5leHBvcnQgY29uc3Qgc2lkZWJhciA9IHtcbiAgLy8gXHU2MjRCXHU1MkE4XHU5MTREXHU3RjZFXHU3Njg0XHU0RkE3XHU4RkI5XHU2ODBGXHVGRjA4XHU0RkREXHU3NTU5XHU3M0IwXHU2NzA5XHU5MTREXHU3RjZFXHU0RjVDXHU0RTNBXHU1OTA3XHU0RUZEXHVGRjA5XG4gIC4uLmFsZ29yaXRobXNTaWRlYmFyLFxuICAuLi5hcnRpZmljaWFsSW50ZWxsaWdlbmNlU2lkZWJhcixcbiAgLi4uY29tcHV0ZXJTeXN0ZW1zU2lkZWJhcixcbiAgLi4ucHJvZ3JhbW1pbmdMYW5ndWFnZXNTaWRlYmFyLFxuICAuLi5kZXZlbG9wbWVudFRvb2xzU2lkZWJhcixcbiAgLi4ucmVzZWFyY2hQcm9qZWN0c1NpZGViYXIsXG4gIFxuICAvLyBcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTc2ODRcdTRGQTdcdThGQjlcdTY4MEZcdTkxNERcdTdGNkVcdUZGMDhcdTRGMThcdTUxNDhcdTdFQTdcdTY2RjRcdTlBRDhcdUZGMDlcbiAgLi4uYXV0b0dlbmVyYXRlZFNpZGViYXJcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy90aGVtZS91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL3RoZW1lL3V0aWxzL21hcmtkb3duLWl0LWltYWdlLXNpemUuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL3RoZW1lL3V0aWxzL21hcmtkb3duLWl0LWltYWdlLXNpemUuanNcIjsvKipcbiAqIE1hcmtkb3duLWl0IFx1NjNEMlx1NEVGNlx1RkYxQVx1NjUyRlx1NjMwMVx1NTZGRVx1NzI0N1x1NTkyN1x1NUMwRlx1OEJFRFx1NkNENVxuICogXHU4QkVEXHU2Q0Q1XHVGRjFBIVthbHQgdGV4dHx3aWR0aHhoZWlnaHRdKGltYWdlLnBuZykgXHU2MjE2ICFbYWx0IHRleHR8d2lkdGhdKGltYWdlLnBuZylcbiAqIFxuICogXHU3OTNBXHU0RjhCXHVGRjFBXG4gKiAhW1x1NTZGRVx1NzI0N1x1NjNDRlx1OEZGMHwzMDB4MjAwXSguL2ltYWdlLnBuZykgIC0gXHU4QkJFXHU3RjZFXHU1QkJEXHU5QUQ4XG4gKiAhW1x1NTZGRVx1NzI0N1x1NjNDRlx1OEZGMHw0MDB4MF0oLi9pbWFnZS5wbmcpICAgLSBcdThCQkVcdTdGNkVcdTVCQkRcdTVFQTZcdUZGMENcdTlBRDhcdTVFQTZcdTgxRUFcdTkwMDJcdTVFOTQgIFxuICogIVtcdTU2RkVcdTcyNDdcdTYzQ0ZcdThGRjB8MHgzMDBdKC4vaW1hZ2UucG5nKSAgIC0gXHU4QkJFXHU3RjZFXHU5QUQ4XHU1RUE2XHVGRjBDXHU1QkJEXHU1RUE2XHU4MUVBXHU5MDAyXHU1RTk0XG4gKiAhW1x1NTZGRVx1NzI0N1x1NjNDRlx1OEZGMHw1MCVdKC4vaW1hZ2UucG5nKSAgICAgLSBcdThCQkVcdTdGNkVcdTVCQkRcdTVFQTZcdTc2N0VcdTUyMDZcdTZCRDRcbiAqICFbXHU1NkZFXHU3MjQ3XHU2M0NGXHU4RkYwfDMwMF0oLi9pbWFnZS5wbmcpICAgICAtIFx1NEVDNVx1OEJCRVx1N0Y2RVx1NUJCRFx1NUVBNlxuICovXG5cbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmxldCBpbWFnZU1hbmlmZXN0ID0gbnVsbFxudHJ5IHtcbiAgY29uc3QgbWFuaWZlc3RQYXRoID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdkb2NzLy52aXRlcHJlc3MvZGF0YS9pbWFnZS1tYW5pZmVzdC5qc29uJylcbiAgaWYgKGZzLmV4aXN0c1N5bmMobWFuaWZlc3RQYXRoKSkge1xuICAgIGNvbnN0IHJhdyA9IGZzLnJlYWRGaWxlU3luYyhtYW5pZmVzdFBhdGgsICd1dGYtOCcpXG4gICAgaW1hZ2VNYW5pZmVzdCA9IEpTT04ucGFyc2UocmF3KVxuICB9XG59IGNhdGNoIChlKSB7XG4gIGltYWdlTWFuaWZlc3QgPSBudWxsXG59XG5cbmZ1bmN0aW9uIGltYWdlU2l6ZVBsdWdpbihtZCkge1xuICAvLyBcdTRGRERcdTVCNThcdTUzOUZcdTU5Q0JcdTc2ODRcdTU2RkVcdTcyNDdyZW5kZXJcdTg5QzRcdTUyMTlcbiAgY29uc3QgZGVmYXVsdEltYWdlUmVuZGVyZXIgPSBtZC5yZW5kZXJlci5ydWxlcy5pbWFnZSB8fCBmdW5jdGlvbih0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52LCByZW5kZXJlcikge1xuICAgIHJldHVybiByZW5kZXJlci5yZW5kZXJUb2tlbih0b2tlbnMsIGlkeCwgb3B0aW9ucylcbiAgfVxuXG4gIC8vIFx1NjVCMFx1NTg5RVx1RkYxQUhUTUwgXHU1QzVFXHU2MDI3XHU1MDNDXHU4RjZDXHU0RTQ5XHU1MUZEXHU2NTcwXHVGRjBDXHU5MDdGXHU1MTREIFhTUyBcdTZDRThcdTUxNjVcbiAgY29uc3QgZXNjYXBlQXR0clZhbHVlID0gKHN0cikgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuICcnXG4gICAgcmV0dXJuIHN0clxuICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcbiAgICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpXG4gICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gIH1cblxuICBtZC5yZW5kZXJlci5ydWxlcy5pbWFnZSA9IGZ1bmN0aW9uKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHJlbmRlcmVyKSB7XG4gICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxuICAgIGNvbnN0IHNyYyA9IHRva2VuLmF0dHJzW3Rva2VuLmF0dHJJbmRleCgnc3JjJyldWzFdXG4gICAgY29uc3QgYWx0VGV4dCA9IHRva2VuLmNvbnRlbnQgfHwgJydcblxuICAgIC8vIFx1NjVCMFx1NTg5RVx1RkYxQVx1NjI0MFx1NjcwOVx1NTZGRVx1NzI0N1x1OUVEOFx1OEJBNFx1NjFEMlx1NTJBMFx1OEY3RFx1NEUwRVx1NUYwMlx1NkI2NVx1ODlFM1x1NzgwMVxuICAgIGNvbnN0IGVuc3VyZUF0dHIgPSAobmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IGkgPSB0b2tlbi5hdHRySW5kZXgobmFtZSlcbiAgICAgIGlmIChpIDwgMCkgdG9rZW4uYXR0clB1c2goW25hbWUsIHZhbHVlXSlcbiAgICAgIGVsc2UgdG9rZW4uYXR0cnNbaV1bMV0gPSB2YWx1ZVxuICAgIH1cbiAgICBlbnN1cmVBdHRyKCdsb2FkaW5nJywgJ2xhenknKVxuICAgIGVuc3VyZUF0dHIoJ2RlY29kaW5nJywgJ2FzeW5jJylcblxuICAgIC8vIFx1ODJFNVx1NEUzQVx1NjcyQ1x1NTczMFx1NTZGRVx1NTBDRlx1NEUxNFx1NkUwNVx1NTM1NVx1NUI1OFx1NTcyOFx1RkYwQ1x1NUMxRFx1OEJENVx1NzUxRlx1NjIxMCA8cGljdHVyZT5cbiAgICBjb25zdCBpc0h0dHAgPSAvXmh0dHBzPzpcXC9cXC8vaS50ZXN0KHNyYylcbiAgICBjb25zdCBpc0xvY2FsSW1hZ2VzID0gIWlzSHR0cCAmJiAoc3JjLnN0YXJ0c1dpdGgoJy9pbWFnZXMvJykgfHwgc3JjLnN0YXJ0c1dpdGgoJ2ltYWdlcy8nKSB8fCBzcmMuc3RhcnRzV2l0aCgnLi9pbWFnZXMvJykpXG4gICAgY29uc3Qgbm9ybWFsaXplZEtleSA9IHNyYy5zdGFydHNXaXRoKCcvaW1hZ2VzLycpID8gc3JjIDogKCcvaW1hZ2VzLycgKyBzcmMucmVwbGFjZSgvXlxcLj9cXC8/aW1hZ2VzXFwvLywgJycpKVxuICAgIGNvbnN0IG1hbmlmZXN0SXRlbSA9IGltYWdlTWFuaWZlc3QgJiYgaXNMb2NhbEltYWdlcyA/IGltYWdlTWFuaWZlc3Rbbm9ybWFsaXplZEtleV0gOiBudWxsXG5cbiAgICAvLyBcdTY4QzBcdTY3RTVhbHQgdGV4dFx1NEUyRFx1NjYyRlx1NTQyNlx1NTMwNVx1NTQyQlx1NUMzQVx1NUJGOFx1NEZFMVx1NjA2RlxuICAgIGNvbnN0IHNpemVNYXRjaCA9IGFsdFRleHQubWF0Y2goL14oLio/KVxcfCguKykkLylcbiAgICBpZiAoc2l6ZU1hdGNoKSB7XG4gICAgICBjb25zdCBhY3R1YWxBbHQgPSBzaXplTWF0Y2hbMV0udHJpbSgpXG4gICAgICBjb25zdCBzaXplU3RyID0gc2l6ZU1hdGNoWzJdLnRyaW0oKVxuICAgICAgXG4gICAgICAvLyBcdTY2RjRcdTY1QjB0b2tlblx1NzY4NGNvbnRlbnRcdTRFM0FcdTVCOUVcdTk2NDVcdTc2ODRhbHQgdGV4dFxuICAgICAgdG9rZW4uY29udGVudCA9IGFjdHVhbEFsdFxuICAgICAgXG4gICAgICAvLyBcdTg5RTNcdTY3OTBcdTVDM0FcdTVCRjhcdTVCNTdcdTdCMjZcdTRFMzJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IFtdXG4gICAgICBjb25zdCBjbGFzc2VzID0gWydyZXNwb25zaXZlLWltYWdlJ11cbiAgICAgIGxldCB3aWR0aEF0dHIgPSBudWxsXG4gICAgICBsZXQgaGVpZ2h0QXR0ciA9IG51bGxcbiAgICAgIFxuICAgICAgLy8gXHU1MzM5XHU5MTREXHU0RTBEXHU1NDBDXHU3Njg0XHU1QzNBXHU1QkY4XHU2ODNDXHU1RjBGXG4gICAgICBpZiAoc2l6ZVN0ci5tYXRjaCgvXlxcZCt4XFxkKyQvKSkge1xuICAgICAgICAvLyBcdTY4M0NcdTVGMEZcdUZGMUEzMDB4MjAwXG4gICAgICAgIGNvbnN0IFt3aWR0aCwgaGVpZ2h0XSA9IHNpemVTdHIuc3BsaXQoJ3gnKVxuICAgICAgICBpZiAod2lkdGggIT09ICcwJykge1xuICAgICAgICAgIHN0eWxlcy5wdXNoKGB3aWR0aDogJHt3aWR0aH1weGApXG4gICAgICAgICAgd2lkdGhBdHRyID0gd2lkdGhcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGVpZ2h0ICE9PSAnMCcpIHtcbiAgICAgICAgICBzdHlsZXMucHVzaChgaGVpZ2h0OiAke2hlaWdodH1weGApXG4gICAgICAgICAgaGVpZ2h0QXR0ciA9IGhlaWdodFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNpemVTdHIubWF0Y2goL15cXGQreDAkLykpIHtcbiAgICAgICAgLy8gXHU2ODNDXHU1RjBGXHVGRjFBMzAweDAgKFx1NUJCRFx1NUVBNlx1NTZGQVx1NUI5QVx1RkYwQ1x1OUFEOFx1NUVBNlx1ODFFQVx1OTAwMlx1NUU5NClcbiAgICAgICAgY29uc3Qgd2lkdGggPSBzaXplU3RyLnNwbGl0KCd4JylbMF1cbiAgICAgICAgc3R5bGVzLnB1c2goYHdpZHRoOiAke3dpZHRofXB4YClcbiAgICAgICAgc3R5bGVzLnB1c2goJ2hlaWdodDogYXV0bycpXG4gICAgICAgIHdpZHRoQXR0ciA9IHdpZHRoXG4gICAgICB9IGVsc2UgaWYgKHNpemVTdHIubWF0Y2goL14weFxcZCskLykpIHtcbiAgICAgICAgLy8gXHU2ODNDXHU1RjBGXHVGRjFBMHgzMDAgKFx1OUFEOFx1NUVBNlx1NTZGQVx1NUI5QVx1RkYwQ1x1NUJCRFx1NUVBNlx1ODFFQVx1OTAwMlx1NUU5NClcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gc2l6ZVN0ci5zcGxpdCgneCcpWzFdXG4gICAgICAgIHN0eWxlcy5wdXNoKGBoZWlnaHQ6ICR7aGVpZ2h0fXB4YClcbiAgICAgICAgc3R5bGVzLnB1c2goJ3dpZHRoOiBhdXRvJylcbiAgICAgICAgaGVpZ2h0QXR0ciA9IGhlaWdodFxuICAgICAgfSBlbHNlIGlmIChzaXplU3RyLm1hdGNoKC9eXFxkKyUkLykpIHtcbiAgICAgICAgLy8gXHU2ODNDXHU1RjBGXHVGRjFBNTAlIChcdTc2N0VcdTUyMDZcdTZCRDRcdTVCQkRcdTVFQTYpXG4gICAgICAgIHN0eWxlcy5wdXNoKGB3aWR0aDogJHtzaXplU3RyfWApXG4gICAgICAgIHN0eWxlcy5wdXNoKCdoZWlnaHQ6IGF1dG8nKVxuICAgICAgfSBlbHNlIGlmIChzaXplU3RyLm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgICAvLyBcdTY4M0NcdTVGMEZcdUZGMUEzMDAgKFx1NEVDNVx1NUJCRFx1NUVBNilcbiAgICAgICAgc3R5bGVzLnB1c2goYHdpZHRoOiAke3NpemVTdHJ9cHhgKVxuICAgICAgICBzdHlsZXMucHVzaCgnaGVpZ2h0OiBhdXRvJylcbiAgICAgICAgd2lkdGhBdHRyID0gc2l6ZVN0clxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gXHU2NUUwXHU2NTQ4XHU2ODNDXHU1RjBGXHVGRjBDXHU0RkREXHU2MzAxXHU1MzlGXHU2ODM3XG4gICAgICAgIHRva2VuLmNvbnRlbnQgPSBhbHRUZXh0XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChzdHlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBcdTZERkJcdTUyQTBcdTYyMTZcdTY2RjRcdTY1QjBzdHlsZVx1NUM1RVx1NjAyN1xuICAgICAgICBjb25zdCBzdHlsZUF0dHJJbmRleCA9IHRva2VuLmF0dHJJbmRleCgnc3R5bGUnKVxuICAgICAgICBjb25zdCBzdHlsZVZhbHVlID0gc3R5bGVzLmpvaW4oJzsgJylcbiAgICAgICAgXG4gICAgICAgIGlmIChzdHlsZUF0dHJJbmRleCA8IDApIHtcbiAgICAgICAgICB0b2tlbi5hdHRyUHVzaChbJ3N0eWxlJywgc3R5bGVWYWx1ZV0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9rZW4uYXR0cnNbc3R5bGVBdHRySW5kZXhdWzFdICs9ICc7ICcgKyBzdHlsZVZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NTRDRFx1NUU5NFx1NUYwRlx1N0M3QlxuICAgICAgICBjb25zdCBjbGFzc0F0dHJJbmRleCA9IHRva2VuLmF0dHJJbmRleCgnY2xhc3MnKVxuICAgICAgICBpZiAoY2xhc3NBdHRySW5kZXggPCAwKSB7XG4gICAgICAgICAgdG9rZW4uYXR0clB1c2goWydjbGFzcycsIGNsYXNzZXMuam9pbignICcpXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2tlbi5hdHRyc1tjbGFzc0F0dHJJbmRleF1bMV0gKz0gJyAnICsgY2xhc3Nlcy5qb2luKCcgJylcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gXHU2REZCXHU1MkEwYWx0XHU1QzVFXHU2MDI3XHVGRjA4XHU0RjdGXHU3NTI4XHU1QzVFXHU2MDI3XHU4RjZDXHU0RTQ5XHVGRjA5XG4gICAgICAgIGNvbnN0IGFsdEF0dHJJbmRleCA9IHRva2VuLmF0dHJJbmRleCgnYWx0JylcbiAgICAgICAgY29uc3Qgc2FmZUFsdCA9IGVzY2FwZUF0dHJWYWx1ZShhY3R1YWxBbHQpXG4gICAgICAgIGlmIChhbHRBdHRySW5kZXggPCAwKSB7XG4gICAgICAgICAgdG9rZW4uYXR0clB1c2goWydhbHQnLCBzYWZlQWx0XSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2tlbi5hdHRyc1thbHRBdHRySW5kZXhdWzFdID0gc2FmZUFsdFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gXHU2NUIwXHU1ODlFXHVGRjFBXHU1RjUzXHU0RTNBXHU1MENGXHU3RDIwXHU1QzNBXHU1QkY4XHU0RTE0XHU5NzVFIDAgXHU2NUY2XHVGRjBDXHU4ODY1XHU1MTQ1IHdpZHRoL2hlaWdodCBcdTVDNUVcdTYwMjdcdUZGMENcdTk2NERcdTRGNEUgQ0xTXG4gICAgICAgIGlmICh3aWR0aEF0dHIgJiYgL15cXGQrJC8udGVzdChTdHJpbmcod2lkdGhBdHRyKSkgJiYgd2lkdGhBdHRyICE9PSAnMCcpIHtcbiAgICAgICAgICBlbnN1cmVBdHRyKCd3aWR0aCcsIFN0cmluZyh3aWR0aEF0dHIpKVxuICAgICAgICB9XG4gICAgICAgIGlmIChoZWlnaHRBdHRyICYmIC9eXFxkKyQvLnRlc3QoU3RyaW5nKGhlaWdodEF0dHIpKSAmJiBoZWlnaHRBdHRyICE9PSAnMCcpIHtcbiAgICAgICAgICBlbnN1cmVBdHRyKCdoZWlnaHQnLCBTdHJpbmcoaGVpZ2h0QXR0cikpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBcdTU5ODJcdTY3OUNcdTY3MDlcdTZFMDVcdTUzNTVcdTk4NzlcdUZGMENcdTc1MUZcdTYyMTAgPHBpY3R1cmU+XHVGRjBDXHU1MzA1XHU1NDJCIHdlYnAgXHU0RTBFXHU1MzlGXHU2ODNDXHU1RjBGIHNyY3NldFxuICAgIGlmIChtYW5pZmVzdEl0ZW0pIHtcbiAgICAgIGNvbnN0IGFsdEF0dHJJbmRleCA9IHRva2VuLmF0dHJJbmRleCgnYWx0JylcbiAgICAgIGNvbnN0IGFsdFZhbFJhdyA9IGFsdEF0dHJJbmRleCA+PSAwID8gdG9rZW4uYXR0cnNbYWx0QXR0ckluZGV4XVsxXSA6ICcnXG4gICAgICBjb25zdCBhbHRWYWwgPSBlc2NhcGVBdHRyVmFsdWUoYWx0VmFsUmF3KVxuICAgICAgY29uc3Qgd2lkdGhJZHggPSB0b2tlbi5hdHRySW5kZXgoJ3dpZHRoJylcbiAgICAgIGNvbnN0IGhlaWdodElkeCA9IHRva2VuLmF0dHJJbmRleCgnaGVpZ2h0JylcbiAgICAgIGNvbnN0IHdpZHRoVmFsID0gd2lkdGhJZHggPj0gMCA/IHRva2VuLmF0dHJzW3dpZHRoSWR4XVsxXSA6IChtYW5pZmVzdEl0ZW0ub3JpZ2luYWwud2lkdGggfHwgJycpXG4gICAgICBjb25zdCBoZWlnaHRWYWwgPSBoZWlnaHRJZHggPj0gMCA/IHRva2VuLmF0dHJzW2hlaWdodElkeF1bMV0gOiAobWFuaWZlc3RJdGVtLm9yaWdpbmFsLmhlaWdodCB8fCAnJylcblxuICAgICAgY29uc3Qgd2VicFNldCA9IChtYW5pZmVzdEl0ZW0udmFyaWFudHMud2VicCB8fCBbXSlcbiAgICAgICAgLm1hcCh2ID0+IGAke3Yuc3JjfSAke3Yud2lkdGh9d2ApLmpvaW4oJywgJylcbiAgICAgIGNvbnN0IG9yaWdTZXQgPSAobWFuaWZlc3RJdGVtLnZhcmlhbnRzLm9yaWdpbmFsIHx8IFtdKVxuICAgICAgICAubWFwKHYgPT4gYCR7di5zcmN9ICR7di53aWR0aH13YCkuam9pbignLCAnKVxuICAgICAgY29uc3Qgc2l6ZXMgPSAnKG1heC13aWR0aDogNzY4cHgpIDkwdncsIDc2OHB4J1xuXG4gICAgICAvLyBcdTY3ODRcdTVFRkEgPHBpY3R1cmU+IFx1NjI0Qlx1NTJBOCBIVE1MXG4gICAgICBjb25zdCBjbGFzc0lkeCA9IHRva2VuLmF0dHJJbmRleCgnY2xhc3MnKVxuICAgICAgY29uc3QgY2xzID0gY2xhc3NJZHggPj0gMCA/IHRva2VuLmF0dHJzW2NsYXNzSWR4XVsxXSA6ICdyZXNwb25zaXZlLWltYWdlJ1xuICAgICAgY29uc3Qgc3R5bGVJZHggPSB0b2tlbi5hdHRySW5kZXgoJ3N0eWxlJylcbiAgICAgIGNvbnN0IHN0eWxlID0gc3R5bGVJZHggPj0gMCA/IHRva2VuLmF0dHJzW3N0eWxlSWR4XVsxXSA6ICcnXG4gICAgICBjb25zdCBsb2FkaW5nSWR4ID0gdG9rZW4uYXR0ckluZGV4KCdsb2FkaW5nJylcbiAgICAgIGNvbnN0IGRlY29kaW5nSWR4ID0gdG9rZW4uYXR0ckluZGV4KCdkZWNvZGluZycpXG4gICAgICBjb25zdCBsb2FkaW5nID0gbG9hZGluZ0lkeCA+PSAwID8gdG9rZW4uYXR0cnNbbG9hZGluZ0lkeF1bMV0gOiAnbGF6eSdcbiAgICAgIGNvbnN0IGRlY29kaW5nID0gZGVjb2RpbmdJZHggPj0gMCA/IHRva2VuLmF0dHJzW2RlY29kaW5nSWR4XVsxXSA6ICdhc3luYydcblxuICAgICAgY29uc3QgZmFsbGJhY2tTcmMgPSAobWFuaWZlc3RJdGVtLnZhcmlhbnRzLm9yaWdpbmFsIHx8IFtdKVswXT8uc3JjIHx8IG1hbmlmZXN0SXRlbS5vcmlnaW5hbC5zcmNcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGA8cGljdHVyZSBjbGFzcz1cIiR7Y2xzfVwiPmAsXG4gICAgICAgIHdlYnBTZXQgPyBgICA8c291cmNlIHR5cGU9XCJpbWFnZS93ZWJwXCIgc3Jjc2V0PVwiJHt3ZWJwU2V0fVwiIHNpemVzPVwiJHtzaXplc31cIj5gIDogJycsXG4gICAgICAgIG9yaWdTZXQgPyBgICA8c291cmNlIHR5cGU9XCIke21hbmlmZXN0SXRlbS5vcmlnaW5hbC50eXBlfVwiIHNyY3NldD1cIiR7b3JpZ1NldH1cIiBzaXplcz1cIiR7c2l6ZXN9XCI+YCA6ICcnLFxuICAgICAgICBgICA8aW1nIHNyYz1cIiR7ZmFsbGJhY2tTcmN9XCIgYWx0PVwiJHthbHRWYWwgfHwgJyd9XCJgICtcbiAgICAgICAgICBgJHt3aWR0aFZhbCA/IGAgd2lkdGg9XCIke3dpZHRoVmFsfVwiYCA6ICcnfWAgK1xuICAgICAgICAgIGAke2hlaWdodFZhbCA/IGAgaGVpZ2h0PVwiJHtoZWlnaHRWYWx9XCJgIDogJyd9YCArXG4gICAgICAgICAgYCBsb2FkaW5nPVwiJHtsb2FkaW5nfVwiIGRlY29kaW5nPVwiJHtkZWNvZGluZ31cImAgK1xuICAgICAgICAgIGAke3N0eWxlID8gYCBzdHlsZT1cIiR7c3R5bGV9XCJgIDogJyd9YCArXG4gICAgICAgICAgYCAvPmAsXG4gICAgICAgIGA8L3BpY3R1cmU+YFxuICAgICAgXS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJylcbiAgICB9XG4gICAgIFxuICAgIHJldHVybiBkZWZhdWx0SW1hZ2VSZW5kZXJlcih0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52LCByZW5kZXJlcilcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBpbWFnZVNpemVQbHVnaW4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93ZWlnYW8vRG9jdW1lbnRzL193b3JrLzk5X2NvZGUvYmxvZ3YyL2RvY3MvLnZpdGVwcmVzcy91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dlaWdhby9Eb2N1bWVudHMvX3dvcmsvOTlfY29kZS9ibG9ndjIvZG9jcy8udml0ZXByZXNzL3V0aWxzL2dlbmVyYXRlUmVzcG9uc2l2ZUltYWdlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2VpZ2FvL0RvY3VtZW50cy9fd29yay85OV9jb2RlL2Jsb2d2Mi9kb2NzLy52aXRlcHJlc3MvdXRpbHMvZ2VuZXJhdGVSZXNwb25zaXZlSW1hZ2VzLmpzXCI7aW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnXG5cbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybClcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKVxuXG5jb25zdCBQVUJMSUNfRElSID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3B1YmxpYycpXG5jb25zdCBTT1VSQ0VfRElSID0gcGF0aC5qb2luKFBVQkxJQ19ESVIsICdpbWFnZXMnKVxuY29uc3QgT1VUUFVUX0RJUiA9IHBhdGguam9pbihQVUJMSUNfRElSLCAnX29wdGltaXplZCcpXG5jb25zdCBNQU5JRkVTVF9QQVRIID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2RhdGEvaW1hZ2UtbWFuaWZlc3QuanNvbicpXG5cbmNvbnN0IFZBTElEX0VYVCA9IG5ldyBTZXQoWycuanBnJywgJy5qcGVnJywgJy5wbmcnXSlcbmNvbnN0IFdJRFRIUyA9IFs0ODAsIDc2OCwgMTAyNCwgMTQ0MF1cblxuZnVuY3Rpb24gd2FsayhkaXIsIGFjYyA9IFtdKSB7XG4gIGlmICghZnMuZXhpc3RzU3luYyhkaXIpKSByZXR1cm4gYWNjXG4gIGNvbnN0IGVudHMgPSBmcy5yZWFkZGlyU3luYyhkaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KVxuICBmb3IgKGNvbnN0IGUgb2YgZW50cykge1xuICAgIGNvbnN0IGZwID0gcGF0aC5qb2luKGRpciwgZS5uYW1lKVxuICAgIGlmIChlLmlzRGlyZWN0b3J5KCkpIHdhbGsoZnAsIGFjYylcbiAgICBlbHNlIGlmIChlLmlzRmlsZSgpKSB7XG4gICAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoZS5uYW1lKS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAoVkFMSURfRVhULmhhcyhleHQpKSBhY2MucHVzaChmcClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFjY1xufVxuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVEaXIocCkge1xuICBhd2FpdCBmcy5wcm9taXNlcy5ta2RpcihwLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxufVxuXG5hc3luYyBmdW5jdGlvbiBwcm9jZXNzSW1hZ2UoYWJzUGF0aCwgc2hhcnApIHtcbiAgY29uc3QgcmVsRnJvbVB1YmxpYyA9IHBhdGgucmVsYXRpdmUoUFVCTElDX0RJUiwgYWJzUGF0aCkuc3BsaXQocGF0aC5zZXApLmpvaW4oJy8nKVxuICBjb25zdCBwdWJsaWNQYXRoID0gJy8nICsgcmVsRnJvbVB1YmxpY1xuICBjb25zdCBiYXNlTmFtZSA9IHBhdGguYmFzZW5hbWUoYWJzUGF0aCwgcGF0aC5leHRuYW1lKGFic1BhdGgpKVxuICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoYWJzUGF0aCkudG9Mb3dlckNhc2UoKVxuICBjb25zdCBvcmlnaW5hbEZvcm1hdCA9IGV4dCA9PT0gJy5wbmcnID8gJ3BuZycgOiAnanBlZydcbiAgY29uc3QgaW1hZ2UgPSBzaGFycChhYnNQYXRoKVxuICBjb25zdCBtZXRhID0gYXdhaXQgaW1hZ2UubWV0YWRhdGEoKVxuICBjb25zdCBvcmlnV2lkdGggPSBtZXRhLndpZHRoIHx8IDBcbiAgY29uc3Qgb3JpZ0hlaWdodCA9IG1ldGEuaGVpZ2h0IHx8IDBcbiAgY29uc3QgbWltZU9yaWdpbmFsID0gb3JpZ2luYWxGb3JtYXQgPT09ICdwbmcnID8gJ2ltYWdlL3BuZycgOiAnaW1hZ2UvanBlZydcblxuICBjb25zdCBvdXRSZWxEaXIgPSBwYXRoLmpvaW4oJ19vcHRpbWl6ZWQnLCBwYXRoLnJlbGF0aXZlKCdpbWFnZXMnLCBwYXRoLmRpcm5hbWUocmVsRnJvbVB1YmxpYykpKVxuICBjb25zdCBvdXRBYnNEaXIgPSBwYXRoLmpvaW4oUFVCTElDX0RJUiwgb3V0UmVsRGlyKVxuICBhd2FpdCBlbnN1cmVEaXIob3V0QWJzRGlyKVxuXG4gIGNvbnN0IHZhcmlhbnRzT3JpZ2luYWwgPSBbXVxuICBjb25zdCB2YXJpYW50c1dlYnAgPSBbXVxuXG4gIGZvciAoY29uc3QgdyBvZiBXSURUSFMpIHtcbiAgICBpZiAob3JpZ1dpZHRoICYmIHcgPiBvcmlnV2lkdGgpIGNvbnRpbnVlXG4gICAgY29uc3Qgb3V0TmFtZSA9IGAke2Jhc2VOYW1lfS0ke3d9dyR7ZXh0fWBcbiAgICBjb25zdCBvdXRBYnMgPSBwYXRoLmpvaW4ob3V0QWJzRGlyLCBvdXROYW1lKVxuICAgIGNvbnN0IG91dFB1YmxpYyA9ICcvJyArIHBhdGguam9pbihvdXRSZWxEaXIsIG91dE5hbWUpLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJylcbiAgICBhd2FpdCBzaGFycChhYnNQYXRoKS5yZXNpemUoeyB3aWR0aDogdyB9KS50b0Zvcm1hdChvcmlnaW5hbEZvcm1hdCwgeyBxdWFsaXR5OiA4MiB9KS50b0ZpbGUob3V0QWJzKVxuICAgIHZhcmlhbnRzT3JpZ2luYWwucHVzaCh7IHdpZHRoOiB3LCBzcmM6IG91dFB1YmxpYyB9KVxuICAgIGNvbnN0IG91dE5hbWVXZWJwID0gYCR7YmFzZU5hbWV9LSR7d313LndlYnBgXG4gICAgY29uc3Qgb3V0QWJzV2VicCA9IHBhdGguam9pbihvdXRBYnNEaXIsIG91dE5hbWVXZWJwKVxuICAgIGNvbnN0IG91dFB1YmxpY1dlYnAgPSAnLycgKyBwYXRoLmpvaW4ob3V0UmVsRGlyLCBvdXROYW1lV2VicCkuc3BsaXQocGF0aC5zZXApLmpvaW4oJy8nKVxuICAgIGF3YWl0IHNoYXJwKGFic1BhdGgpLnJlc2l6ZSh7IHdpZHRoOiB3IH0pLndlYnAoeyBxdWFsaXR5OiA4MiB9KS50b0ZpbGUob3V0QWJzV2VicClcbiAgICB2YXJpYW50c1dlYnAucHVzaCh7IHdpZHRoOiB3LCBzcmM6IG91dFB1YmxpY1dlYnAgfSlcbiAgfVxuXG4gIC8vIFx1NjVCMFx1NTg5RVx1RkYxQUxRSVBcdUZGMDhiYXNlNjQgXHU2NzgxXHU1QzBGXHU1NkZFXHVGRjA5XG4gIGxldCBscWlwID0gJydcbiAgdHJ5IHtcbiAgICBjb25zdCBscWlwQnVmZmVyID0gYXdhaXQgc2hhcnAoYWJzUGF0aCkucmVzaXplKHsgd2lkdGg6IDI0IH0pLndlYnAoeyBxdWFsaXR5OiA2MCB9KS50b0J1ZmZlcigpXG4gICAgbHFpcCA9ICdkYXRhOmltYWdlL3dlYnA7YmFzZTY0LCcgKyBscWlwQnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKCdbaW1hZ2VzXSBMUUlQIGZhaWxlZDonLCBhYnNQYXRoLCBlPy5tZXNzYWdlIHx8IGUpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGtleTogcHVibGljUGF0aCxcbiAgICB2YWx1ZToge1xuICAgICAgb3JpZ2luYWw6IHsgc3JjOiBwdWJsaWNQYXRoLCB3aWR0aDogb3JpZ1dpZHRoLCBoZWlnaHQ6IG9yaWdIZWlnaHQsIHR5cGU6IG1pbWVPcmlnaW5hbCwgbHFpcCB9LFxuICAgICAgdmFyaWFudHM6IHtcbiAgICAgICAgb3JpZ2luYWw6IHZhcmlhbnRzT3JpZ2luYWwuc29ydCgoYSwgYikgPT4gYS53aWR0aCAtIGIud2lkdGgpLFxuICAgICAgICB3ZWJwOiB2YXJpYW50c1dlYnAuc29ydCgoYSwgYikgPT4gYS53aWR0aCAtIGIud2lkdGgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVJlc3BvbnNpdmVJbWFnZXMoKSB7XG4gIC8vIFx1NjVCMFx1NTg5RVx1RkYxQVx1NTE0MVx1OEJCOFx1OTAxQVx1OEZDN1x1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1OERGM1x1OEZDN1x1RkYwOFx1NEY4Qlx1NTk4Mlx1NTcyOFx1NjdEMFx1NEU5Qlx1Njc4NFx1NUVGQVx1NzNBRlx1NTg4M1x1NEUyRFx1N0YzQVx1NTkzMSBzaGFycFx1RkYwOVxuICBpZiAocHJvY2Vzcy5lbnYuU0tJUF9JTUFHRV9PUFRJTUlaRSA9PT0gJzEnKSB7XG4gICAgY29uc29sZS5sb2coJ1tpbWFnZXNdIFNLSVBfSU1BR0VfT1BUSU1JWkU9MSwgc2tpcCByZXNwb25zaXZlIGltYWdlcyBnZW5lcmF0aW9uJylcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIC8vIFx1NjVCMFx1NTg5RVx1RkYxQVx1NTcyOFx1NTFGRFx1NjU3MFx1NTE4NVx1OTBFOFx1NUMxRFx1OEJENVx1NTJBOFx1NjAwMVx1NTJBMFx1OEY3RCBzaGFycFx1RkYwQ1x1OTA3Rlx1NTE0RFx1NTcyOFx1OTE0RFx1N0Y2RVx1ODlFM1x1Njc5MFx1OTYzNlx1NkJCNVx1NUMzMVx1NTkzMVx1OEQyNVxuICBsZXQgc2hhcnBcbiAgdHJ5IHtcbiAgICBjb25zdCBtb2QgPSBhd2FpdCBpbXBvcnQoJ3NoYXJwJylcbiAgICBzaGFycCA9IG1vZD8uZGVmYXVsdCB8fCBtb2RcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybignW2ltYWdlc10gc2hhcnAgbm90IGF2YWlsYWJsZSwgc2tpcCByZXNwb25zaXZlIGltYWdlcyBnZW5lcmF0aW9uOicsIGU/Lm1lc3NhZ2UgfHwgZSlcbiAgICAvLyBcdTRFQ0RcdTcxMzZcdTc4NkVcdTRGRERcdTZFMDVcdTUzNTVcdTY1ODdcdTRFRjZcdTVCNThcdTU3MjhcdUZGMENcdTkwN0ZcdTUxNERcdTRFMEJcdTZFMzhcdThCRkJcdTUzRDZcdTU5MzFcdThEMjVcbiAgICBhd2FpdCBlbnN1cmVEaXIocGF0aC5kaXJuYW1lKE1BTklGRVNUX1BBVEgpKVxuICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZShNQU5JRkVTVF9QQVRILCBKU09OLnN0cmluZ2lmeSh7fSwgbnVsbCwgMikpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAoIWZzLmV4aXN0c1N5bmMoU09VUkNFX0RJUikpIHtcbiAgICBjb25zb2xlLmxvZygnW2ltYWdlc10gTm8gc291cmNlIGRpcjonLCBTT1VSQ0VfRElSLCAnLSB3cml0aW5nIGVtcHR5IG1hbmlmZXN0IGFuZCBza2lwcGluZycpXG4gICAgYXdhaXQgZW5zdXJlRGlyKHBhdGguZGlybmFtZShNQU5JRkVTVF9QQVRIKSlcbiAgICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoTUFOSUZFU1RfUEFUSCwgSlNPTi5zdHJpbmdpZnkoe30sIG51bGwsIDIpKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgY29uc3QgZmlsZXMgPSB3YWxrKFNPVVJDRV9ESVIsIFtdKVxuICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc29sZS5sb2coJ1tpbWFnZXNdIE5vIGltYWdlcyBmb3VuZCB1bmRlcicsIFNPVVJDRV9ESVIpXG4gICAgYXdhaXQgZW5zdXJlRGlyKHBhdGguZGlybmFtZShNQU5JRkVTVF9QQVRIKSlcbiAgICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoTUFOSUZFU1RfUEFUSCwgSlNPTi5zdHJpbmdpZnkoe30sIG51bGwsIDIpKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgY29uc3QgbWFuaWZlc3QgPSB7fVxuICBjb25zb2xlLmxvZyhgW2ltYWdlc10gUHJvY2Vzc2luZyAke2ZpbGVzLmxlbmd0aH0gaW1hZ2VzLi4uYClcbiAgZm9yIChjb25zdCBmIG9mIGZpbGVzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCBwcm9jZXNzSW1hZ2UoZiwgc2hhcnApXG4gICAgICBtYW5pZmVzdFtpdGVtLmtleV0gPSBpdGVtLnZhbHVlXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCdbaW1hZ2VzXSBGYWlsZWQ6JywgZiwgZT8ubWVzc2FnZSB8fCBlKVxuICAgIH1cbiAgfVxuICBhd2FpdCBlbnN1cmVEaXIocGF0aC5kaXJuYW1lKE1BTklGRVNUX1BBVEgpKVxuICBhd2FpdCBmcy5wcm9taXNlcy53cml0ZUZpbGUoTUFOSUZFU1RfUEFUSCwgSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QsIG51bGwsIDIpKVxuICBjb25zb2xlLmxvZygnW2ltYWdlc10gTWFuaWZlc3Qgd3JpdHRlbjonLCBNQU5JRkVTVF9QQVRIKVxuICByZXR1cm4gdHJ1ZVxufVxuXG5pZiAoaW1wb3J0Lm1ldGEudXJsID09PSBgZmlsZTovLyR7cHJvY2Vzcy5hcmd2WzFdfWApIHtcbiAgZ2VuZXJhdGVSZXNwb25zaXZlSW1hZ2VzKCkudGhlbigob2spID0+IHtcbiAgICBwcm9jZXNzLmV4aXQob2sgPyAwIDogMSlcbiAgfSlcbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRWLFNBQVMsb0JBQW9COzs7QUNBUyxPQUFPLFFBQVE7QUFDalosT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCOzs7QUNEOUIsT0FBTyxVQUFVO0FBTVYsU0FBUyxpQkFBaUIsVUFBVSxJQUFJO0FBQzdDLE1BQUksT0FBTyxZQUFZLFNBQVUsUUFBTyxDQUFDO0FBQ3pDLFFBQU0sUUFBUSxRQUFRLE1BQU0sMEJBQTBCO0FBQ3RELE1BQUksQ0FBQyxNQUFPLFFBQU8sQ0FBQztBQUNwQixNQUFJO0FBQ0YsVUFBTSxPQUFPLEtBQUss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LGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSw2QkFBNkI7QUFBQSxJQUMzQjtBQUFBLE1BQ0UsUUFBUTtBQUFBLE1BQ1IsYUFBYTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQTtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsYUFBYTtBQUFBLFVBQ2IsU0FBUztBQUFBLFlBQ1A7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxzQkFBc0I7QUFBQSxJQUNwQjtBQUFBLE1BQ0UsUUFBUTtBQUFBLE1BQ1IsYUFBYTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixhQUFhO0FBQUEsY0FD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Q1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsdUJBQXVCO0FBQUEsSUFDckI7QUFBQSxNQUNFLFFBQVE7QUFBQSxNQUNSLGFBQWE7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixhQUFhO0FBQUEsVUFDYixTQUFTO0FBQUEsWUFDUDtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixhQUFhO0FBQUEsVUFDYixTQUFTO0FBQUEsWUFDUDtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixhQUFhO0FBQUEsVUFDYixTQUFTO0FBQUEsWUFDUDtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixhQUFhO0FBQUEsVUFDYixTQUFTO0FBQUEsWUFDUDtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLDJCQUEyQjtBQUFBLElBQ3pCO0FBQUEsTUFDRSxRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsYUFBYTtBQUFBLFVBQ2IsU0FBUztBQUFBLFlBQ1A7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLGFBQWE7QUFBQSxjQUNiLFNBQVM7QUFBQSxnQkFDUDtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLGFBQWE7QUFBQSxjQUNiLFNBQVM7QUFBQSxnQkFDUDtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLGFBQWE7QUFBQSxjQUNiLFNBQVM7QUFBQSxnQkFDUDtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxnQkFDQTtBQUFBLGtCQUNFLFFBQVE7QUFBQSxrQkFDUixRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxjQUNGO0FBQUEsWUFDRjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixhQUFhO0FBQUEsY0FDYixTQUFTO0FBQUEsZ0JBQ1A7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixhQUFhO0FBQUEsY0FDYixTQUFTO0FBQUEsZ0JBQ1A7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsZ0JBQ0E7QUFBQSxrQkFDRSxRQUFRO0FBQUEsa0JBQ1IsUUFBUTtBQUFBLGdCQUNWO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsdUJBQXVCO0FBQUEsSUFDckI7QUFBQSxNQUNFLFFBQVE7QUFBQSxNQUNSLGFBQWE7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixhQUFhO0FBQUEsVUFDYixTQUFTO0FBQUEsWUFDUDtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQTtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsYUFBYTtBQUFBLFVBQ2IsU0FBUztBQUFBLFlBQ1A7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLGFBQWE7QUFBQSxVQUNiLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxRQUFRO0FBQUEsY0FDUixRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFFBQVE7QUFBQSxjQUNSLFFBQVE7QUFBQSxZQUNW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QUMvRTtBQUdBLFVBQU0sa0JBQW1CLE9BQU8sWUFBWSxlQUFlLFFBQVEsT0FBTyxRQUFRLElBQUksc0JBQXVCO0FBQzdHLFFBQUksaUJBQWlCO0FBQ25CLFVBQUk7QUFDRixjQUFNLFNBQVMsSUFBSSxJQUFJLGVBQWUsRUFBRTtBQUN4QyxhQUFLLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxjQUFjLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFDdkQsYUFBSyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssZ0JBQWdCLE1BQU0sT0FBTyxDQUFDLENBQUM7QUFBQSxNQUMzRCxRQUFRO0FBQUEsTUFBQztBQUFBLElBQ1g7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInNjYW5EaXJlY3RvcnkiLCAiZnMiLCAicGF0aCIsICJmaWxlVVJMVG9QYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwiLCAiX19maWxlbmFtZSIsICJmaWxlVVJMVG9QYXRoIiwgIl9fZGlybmFtZSIsICJwYXRoIiwgInNjYW5EaXJlY3RvcnkiLCAiZnMiLCAicGF0aCIsICJmaWxlVVJMVG9QYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwiLCAiX19maWxlbmFtZSIsICJmaWxlVVJMVG9QYXRoIiwgIl9fZGlybmFtZSIsICJwYXRoIiwgImZzIiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCIsICJwYXRoIiwgImZzIiwgInNpZGViYXIiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCIsICJmcyIsICJwYXRoIiwgInBhdGgiLCAiZnMiLCAiZnMiLCAicGF0aCIsICJmaWxlVVJMVG9QYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwiLCAiX19maWxlbmFtZSIsICJmaWxlVVJMVG9QYXRoIiwgIl9fZGlybmFtZSIsICJwYXRoIiwgImZzIl0KfQo=
