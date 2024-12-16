import { Builder, By, until } from "selenium-webdriver";
import fs from "fs";

async function testRequestList() {
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
    await driver.sleep(3000);

    await driver.wait(until.elementLocated(By.css(".col-span-2")), 20000);
    console.log("Reached therapist dashboard");

    const requestListButton = await driver.wait(
      until.elementLocated(
        By.xpath("//span[text()='View New Patient Requests']")
      ),
      5000
    );
    await requestListButton.click();

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

testRequestList();
