import type { Browser } from "puppeteer";

export async function getKana(browser: Browser, text: string): Promise<string> {
  const page = await browser.newPage();
  try {
    await page.goto("https://www.jcinfo.net/ja/tools/kana");
    await page.type("#input_text", text);
    await page.evaluate(() => {
      const check = document.querySelector("input#is_katakana");
      if (check instanceof HTMLElement) {
        check.click();
      }
      const submit = document.querySelector(".btn-primary");
      if (submit instanceof HTMLElement) {
        submit.click();
      }
    });
    await page.waitForNavigation();
    const result = await page.evaluate(() => {
      const elements = document.querySelectorAll("._result");
      if (elements.length !== 3 || !(elements[2] instanceof HTMLElement)) {
        return null;
      }
      return elements[2].innerText.trim();
    });
    if (!result) {
      throw new Error("Missing title!");
    }
    return result;
  } finally {
    await page.close();
  }
}
