import { Builder, By, until } from "selenium-webdriver";

async function testTherapistAccepting() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate to the login page
    await driver.get("http://localhost:3000/login");

    // Log in as a therapist
    const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
    await emailInput.sendKeys("clarkkent@gmail.com");
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys("password");
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await driver.sleep(2000);
    await loginButton.click();
    
    // Wait for the therapist dashboard to load
    await driver.wait(until.urlContains("/therapist-dashboard"), 15000);

    // Locate the toggle switch for accepting patients
    const toggleSwitch = await driver.wait(
      until.elementLocated(By.css('input[type="checkbox"]')),
      10000
    );

    // Toggle the state
    await driver.sleep(2000);
    await toggleSwitch.click();

    // Toggle back to the original state
    await driver.sleep(2000);
    await toggleSwitch.click();

    await driver.sleep(2000);
  } catch (error) {
    console.error("Test Failed:", error);

    // Log current page source
    console.log("Page Source:", await driver.getPageSource());
  } finally {
    await driver.sleep(5000);
    await driver.quit();
  }
}

testTherapistAccepting();
