module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: [
        // "https://ryotablog.jp/blogs",
        "https://ryotablog.jp/blogs/customdomain-apprunner-with-terraform-route53"
      ],
      "outputDir": '.lighthouseci/mobile_lhci_reports',
      reportFilenamePattern: 'mobile_lhci_reports.json'
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "offscreen-images": "off",
        "uses-webp-images": "off"
      }
    },
    "upload": {
      "target": 'filesystem',
      "outputDir": '.lighthouseci/mobile_lhci_reports',
    }
  }
}