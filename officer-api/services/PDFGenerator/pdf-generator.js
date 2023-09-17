const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

exports.generatePdf = async (htmlString, pdfName) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || '',
    args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ]
  })

  const page = await browser.newPage()

  await page.setContent(htmlString, {
    waitUntil: 'domcontentloaded'
  })

  await page.pdf({
    format: 'A4',
    path: `${__dirname}/../genDocuments/${pdfName}.pdf`
  })

  await browser.close()

  return {path: path.resolve(`${__dirname}/../genDocuments/${pdfName}.pdf`), status: 'successfull'}
}