const fetch = require('node-fetch');
const fs = require('fs');

// アクセストークンを設定

// 最新のLighthouseレポートファイルを取得する関数
function getLatestLighthouseReport() {
  const files = '.lighthouseci/mobile_lhci_reports/mobile_lhci_reports.json'

  return files
}

// Lighthouseのスコアを取得
function getLighthouseScores() {
  const reportPath = getLatestLighthouseReport();
  const report = JSON.parse(fs.readFileSync(reportPath));
  console.log(report)
  console.log(
    {
      performance: report.categories.performance.score * 100,
      accessibility: report.categories.accessibility.score * 100,
      bestPractices: report.categories['best-practices'].score * 100,
      seo: report.categories.seo.score * 100,
      pwa: report.categories.pwa.score * 100,
    }
  )
  return {
    performance: report.categories.performance.score * 100,
    accessibility: report.categories.accessibility.score * 100,
    bestPractices: report.categories['best-practices'].score * 100,
    seo: report.categories.seo.score * 100,
    pwa: report.categories.pwa.score * 100,
  };
}

// 最終行を取得する関数
async function getLastRow(spreadsheetId, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=ROWS`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    console.log(ACCESS_TOKEN)
    console.error('Error fetching last row:', response.statusText);
    return 0;
  }

  const data = await response.json();
  return data.values ? data.values.length : 0;
}

// スプレッドシートにデータを追加する関数
async function appendDataToSheet() {
  const scores = getLighthouseScores();
  const spreadsheetId = '15EV-UU0Vc3BXQRk9ku-MeUAcTH8TEoC76IHjuOQ4tBQ';  // スプレッドシートIDを設定
  const sheetName = 'シート1';
  const range = `1!A:E`;  // 書き込み対象の範囲を設定
  const values = [
    [scores.performance, scores.accessibility, scores.bestPractices, scores.seo, scores.pwa],
  ];

  // const lastRow = await getLastRow(spreadsheetId, range);
  // const appendRange = `${sheetName}!A${lastRow + 1}:E${lastRow + 1}`;  // 空の行を設定

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    console.error('Error updating scores:', response.statusText);
  } else {
    console.log('Scores updated successfully.');
  }
}

// メイン関数
async function main() {
  console.log('Updating mobile vitals...@@@@@@@@@@@@@@@@');
  await appendDataToSheet();
}

main();
