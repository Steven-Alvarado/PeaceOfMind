import { Builder, By, until } from "selenium-webdriver";

async function testTherapistDashboard() {
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

    // Wait for the patient list
    const patientListContainer = await driver.wait(
      until.elementLocated(By.css(".therapist-dashboard .flex-col.w-full")),
      10000
    );
    await driver.sleep(2000);

    // Find patient entries in the list
    const patientEntries = await patientListContainer.findElements(
      By.css(".flex.items-center.justify-between.p-4")
    );

    if (patientEntries.length > 0) {
      console.log(`Successfully found ${patientEntries.length} patients listed.`);

      const firstPatientText = await patientEntries[0].getText();
      console.log(`First patient details: ${firstPatientText}`);
    } else {
      console.error("No patients found in the list.");
    }
  } catch (error) {
    console.error("Test Failed:", error);

    // Log current page source for inspection
    const pageSource = await driver.getPageSource();
    require("fs").writeFileSync("debug-patient-list.html", pageSource, "utf-8");
  } finally {
    // Cleanup
    await driver.sleep(5000);
    await driver.quit();
  }
}

testTherapistDashboard();
