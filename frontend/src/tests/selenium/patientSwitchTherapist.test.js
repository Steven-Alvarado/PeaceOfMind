import { Builder, By, until } from "selenium-webdriver";
import fs from "fs";
//This script is incomplete

async function testPatientSwitchTherapist() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate to the login page
    await driver.get("http://localhost:3000/login");

    // Log in as a therapist
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );
    await emailInput.sendKeys("exampletwo@gmail.com");
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

    const therDetails = await driver.wait(
      until.elementLocated(By.css(".p-6.mt-5.flex.flex-col.min-h-\\[400px\\]"))
    );

    const switchTherButton = await therDetails.findElement(
      By.xpath("//button[.//span[contains(text(), 'Switch Therapist')]]")
    );
    await switchTherButton.click();
    console.log("Find therapist button clicked");

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

testPatientSwitchTherapist();
