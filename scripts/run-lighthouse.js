/**
 * Lighthouse 測試腳本
 * 
 * 使用方式：
 *   node scripts/run-lighthouse.js
 * 
 * 需要先安裝 lighthouse：
 *   npm install --save-dev lighthouse
 */

const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = {
    logLevel: "info",
    output: "html",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    port: chrome.port,
  };

  const runnerResult = await lighthouse("http://localhost:3000/login", options);

  // 關閉 Chrome
  await chrome.kill();

  // 輸出結果
  const scores = {
    performance: runnerResult.lhr.categories.performance.score * 100,
    accessibility: runnerResult.lhr.categories.accessibility.score * 100,
    "best-practices": runnerResult.lhr.categories["best-practices"].score * 100,
    seo: runnerResult.lhr.categories.seo.score * 100,
  };

  console.log("\n=== Lighthouse 測試結果 ===");
  console.log(`Performance: ${scores.performance.toFixed(0)}/100`);
  console.log(`Accessibility: ${scores.accessibility.toFixed(0)}/100`);
  console.log(`Best Practices: ${scores["best-practices"].toFixed(0)}/100`);
  console.log(`SEO: ${scores.seo.toFixed(0)}/100`);

  // 檢查是否達到目標（≥ 90）
  const target = 90;
  const allPassed = Object.values(scores).every((score) => score >= target);

  if (allPassed) {
    console.log("\n✅ 所有分數都達到目標（≥ 90）");
  } else {
    console.log("\n❌ 部分分數未達到目標（≥ 90）");
    Object.entries(scores).forEach(([category, score]) => {
      if (score < target) {
        console.log(`  - ${category}: ${score.toFixed(0)} < ${target}`);
      }
    });
  }

  // 儲存報告
  const fs = require("fs");
  const reportHtml = runnerResult.report;
  fs.writeFileSync("lighthouse-report.html", reportHtml);
  console.log("\n報告已儲存至: lighthouse-report.html");

  return scores;
}

// 如果直接執行此腳本
if (require.main === module) {
  runLighthouse()
    .then((scores) => {
      const allPassed = Object.values(scores).every((score) => score >= 90);
      process.exit(allPassed ? 0 : 1);
    })
    .catch((error) => {
      console.error("Lighthouse 測試失敗:", error);
      process.exit(1);
    });
}

module.exports = { runLighthouse };

