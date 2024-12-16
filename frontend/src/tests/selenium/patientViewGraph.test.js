import { Builder, By, until } from "selenium-webdriver";
import fs from "fs";
//This script is complete

async function testPatientViewGraph() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate to the login page
    await driver.get("http://localhost:3000/login");

    // Log in as a therapist
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );
    await emailInput.sendKeys("test8@gmail.com");
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    await passwordInput.sendKeys("password");
    // Wait for the login button to be clickable
    const loginButton = await driver.wait(
      until.elementLocated(By.css('button[type="submit"]')),
      10000
    );

    // Ensure the login button is enabled and clickable
    await driver.wait(until.elementIsVisible(loginButton), 10000);
    await driver.wait(until.elementIsEnabled(loginButton), 10000);
    await loginButton.click();
    console.log("Pressed login button");

    // Wait for an element specific to the therapist dashboard (e.g., a unique title or container)
    await driver.wait(until.elementLocated(By.css(".w-full.max-w-3xl")), 20000);
    console.log("Reached student dashboard");
    await driver.sleep(2000);

    const analyticsButton = await driver.wait(
      until.elementLocated(
        By.xpath("//span[text()='Analytics']/parent::button")
      ),
      15000
    );
    await analyticsButton.click();

    const surveyAnalyticsButton = await driver.wait(
      until.elementLocated(
        By.xpath(".//button[contains(text(), 'Survey Analytics')]")
      )
    );
    await driver.sleep(3000);

    if (surveyAnalyticsButton) {
      await surveyAnalyticsButton.click();
      console.log("Survey Analytics Found");
    }

    console.log("Test Passed");
  } catch (error) {
    console.error("Test Failed:", error);

    // Log current page source for inspection
    const pageSource = await driver.getPageSource();
    fs.writeFileSync("debug-patient-list.html", pageSource, "utf-8");
  } finally {
    await driver.sleep(5000);
    // Cleanup
    await driver.quit();
  }
}

testPatientViewGraph();
