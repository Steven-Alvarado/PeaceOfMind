import { Builder, By, until } from "selenium-webdriver";
import fs from "fs";
//This script is complete

async function testPatientReviewTher() {
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

    await driver.executeScript("window.scrollBy(0, 250);");

    const reviewTherButton = await driver.findElement(
      By.xpath("//button[.//span[contains(text(), 'Review Therapist')]]")
    );
    await reviewTherButton.click();
    console.log("Review therapist button clicked");
    await driver.sleep(2000);

    const starRating = await driver.findElement(
      By.css(".fixed.inset-0.bg-gray-800.bg-opacity-50 svg:nth-child(4)")
    );
    await starRating.click();
    await driver.sleep(2000);

    const textarea = await driver.findElement(
      By.css(".fixed.inset-0.bg-gray-800.bg-opacity-50 textarea")
    );
    await textarea.sendKeys("A sublime experience");
    await driver.sleep(2000);

    const submitButton = await driver.findElement(
      By.css(".fixed.inset-0.bg-gray-800.bg-opacity-50 button > div > div")
    );
    await submitButton.click();
    console.log("Review Succesfully Submitted");
    await driver.executeScript("window.scrollTo(0, 0);");
    await driver.sleep(2000);

    const returnHome = await driver.findElement(
      By.xpath('//h1[text()="Peace of Mind"]')
    );
    await returnHome.click();
    await driver.sleep(2000);
    console.log("Landing Page Accessed");

    const reviewsButton = await driver.findElement(
      By.css("nav > div:nth-child(4) > a")
    );
    await reviewsButton.click();

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

testPatientReviewTher();
