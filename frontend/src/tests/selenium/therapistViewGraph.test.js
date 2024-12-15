import { Builder, By, until } from "selenium-webdriver";
import fs from "fs";
//This script is complete

async function testTherapistViewGraph() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate to the login page
    await driver.get("http://localhost:3000/login");

    // Log in as a therapist
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );
    await emailInput.sendKeys("clarkkent@gmail.com");
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

    await driver.wait(until.elementLocated(By.css(".col-span-2")), 20000);
    console.log("Reached therapist dashboard");
    await driver.sleep(5000);

    let listDiv = await driver.wait(
      until.elementLocated(
        By.css(
          ".space-y-4.mt-10.md\\:h-\\[370px\\].h-\\[380px\\].overflow-y-auto"
        )
      ),
      10000
    );

    // Find the button containing the text "View Analytics" within the parent div
    let analysisButton = await listDiv.findElement(
      By.xpath('.//button[normalize-space(text())="View Analytics"]')
    );

    // Click the button
    await analysisButton.click();
    console.log("Analytics button clicked");
    await driver.sleep(2000);

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
    await driver.sleep(8000);
    // Cleanup
    await driver.quit();
  }
}

testTherapistViewGraph();
