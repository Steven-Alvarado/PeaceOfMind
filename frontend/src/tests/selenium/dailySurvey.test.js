import { Builder, By, until } from 'selenium-webdriver';

async function testWeeklySurvey() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to login page
    await driver.get('http://localhost:3000/login');

    // Log in
    const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
    await emailInput.sendKeys('test8@gmail.com');
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys('password');
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await driver.sleep(2000);
    await loginButton.click();

    // Wait for the student dashboard to load
    await driver.wait(until.urlContains('/student-dashboard'), 30000);

    // Click the "Surveys" button
    const surveysButton = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Surveys']/parent::button")),
      15000
    );
    await surveysButton.click();

    // Wait for the survey modal to appear
    await driver.wait(until.elementLocated(By.css('.p-6')), 15000);

    // Answer survey questions
    for (let i = 0; i < 5; i++) {
      const answerButtons = await driver.findElements(By.css('button.bg-gray-100'));
      if (answerButtons.length > 0) {
        await answerButtons[i].click(); // Select the first available answer
        await driver.sleep(2000); // Delay after selecting an answer
      } else {
        break; // Exit if no answer buttons are found
      }

      if (i < 4) { // Click "Next" for the first 4 questions
        const nextButton = await driver.findElement(By.xpath("//button[contains(text(),'Next')]"));
        await nextButton.click();
        await driver.sleep(2000); // Delay after clicking "Next"
      }
    }

    // Click the "Submit" button
    const submitButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Submit')]")),
      10000
    );
    await submitButton.click();
    await driver.sleep(2000); // Delay after clicking "Submit"

    // Click the "Survey History" tab
    const surveyHistoryTab = await driver.findElement(By.xpath("//button[contains(text(),'Survey History')]"));
    await surveyHistoryTab.click();
    await driver.sleep(2000); // Delay to allow survey history to load

    // Find the newest survey entry (assuming it's sorted by date and the most recent is the first)
    const surveyEntries = await driver.findElements(By.css('.relative.flex.gap-4.mb-4'));
    if (surveyEntries.length > 0) {
      await surveyEntries[0].click(); // Click the most recent survey
      await driver.sleep(2000); // Delay to allow details to load

      // Scroll down to ensure the survey details are fully visible
      const surveyDetails = await driver.findElement(By.css('.overflow-hidden.bg-gray-50'));
      await driver.executeScript('arguments[0].scrollIntoView({ behavior: "smooth", block: "center" });', surveyDetails);
      await driver.sleep(2000); // Additional delay for the scroll to take effect
    } else {
      console.error('No survey entries found in history.');
    }
  } finally {
    await driver.sleep(5000);
    await driver.quit();
  }
}

testWeeklySurvey();
