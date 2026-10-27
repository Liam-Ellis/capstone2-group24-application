import { test, expect } from "@playwright/test";

test("Group Allocation page displays correctly", async ({ page }) => {
  await page.goto("/ucdashboard/groups");

  await expect(
    page.getByRole("heading", { level: 1, name: "Group Allocation" })
  ).toBeVisible();

  await expect(page.getByText("Jeffrey Hale")).toBeVisible();
  await expect(page.getByText("Santiago Rice")).toBeVisible();
});

test("User can create a group", async ({ page }) => {
  await page.goto("/ucdashboard/groups");

  await page.getByRole("button", { name: /create first group/i }).click();

  await expect(
    page.getByRole("heading", { name: "Group 1" })
  ).toBeVisible();
});

test("User can select a student and add them to a group", async ({ page }) => {
  await page.goto("/ucdashboard/groups");

  // Select Jeffrey Hale.
  await page.getByText("Jeffrey Hale").click();

  // Create the first group.
  await page.getByRole("button", { name: /create first group/i }).click();

  // Add the selected student to Group 1.
  await page.getByRole("button", { name: "+ Add" }).click();

  // Verify Jeffrey is now in the group.
  const groupCard = page.locator(".group-card").filter({
    has: page.getByRole("heading", { name: "Group 1" })
  });

  await expect(groupCard.getByText("Jeffrey Hale")).toBeVisible();
  await expect(groupCard.getByText("1 student")).toBeVisible();
});

test("User can search for a student", async ({ page }) => {
  await page.goto("/ucdashboard/groups");

  await page.getByPlaceholder("Search students...").fill("Santiago");

  await expect(page.getByText("Santiago Rice")).toBeVisible();
  await expect(page.getByText("Jeffrey Hale")).not.toBeVisible();
});

test("User can reset the allocation", async ({ page }) => {
  await page.goto("/ucdashboard/groups");

  // Create a group first.
  await page.getByRole("button", { name: /create first group/i }).click();

  // Reset the allocation.
  await page.getByRole("button", { name: "Reset Allocation" }).click();

  // Verify the group has been removed.
  await expect(
    page.getByText("There are currently no groups created")
  ).toBeVisible();
});


test("User can save a group allocation and keep it after reload", async ({ page }) => {
  await page.goto("/ucdashboard/groups");

  // Select Jeffrey Hale.
  await page.getByText("Jeffrey Hale").click();

  // Create the first group.
  await page.getByRole("button", { name: /create first group/i }).click();

  // Add Jeffrey to the group.
  await page.getByRole("button", { name: "+ Add" }).click();

  // Save the allocation.
  await page.getByRole("button", { name: "Save Changes" }).click();

  // Verify the success message.
  await expect(
    page.getByRole("status")
  ).toHaveText("Changes saved successfully.");

  // Reload the page.
  await page.reload();

  // Verify the group and student are still present.
  const groupCard = page.locator(".group-card").filter({
    has: page.getByRole("heading", { name: "Group 1" })
  });

  await expect(groupCard).toBeVisible();
  await expect(groupCard.getByText("Jeffrey Hale")).toBeVisible();
});


test("User can remove a student from a group", async ({ page }) => {
  await page.goto("/ucdashboard/groups");

  // Select Jeffrey Hale.
  await page.getByText("Jeffrey Hale").click();

  // Create the first group.
  await page.getByRole("button", { name: /create first group/i }).click();

  // Add Jeffrey to the group.
  await page.getByRole("button", { name: "+ Add" }).click();

  // Find Group 1.
  const groupCard = page.locator(".group-card").filter({
    has: page.getByRole("heading", { name: "Group 1" })
  });

  // Verify Jeffrey is in the group.
  await expect(groupCard.getByText("Jeffrey Hale")).toBeVisible();

  // Remove Jeffrey from the group.
  await groupCard.locator(".remove-student-button").click();

  // Verify Jeffrey is no longer in the group.
  await expect(groupCard.getByText("Jeffrey Hale")).not.toBeVisible();

  // Verify the group is empty.
  await expect(groupCard.getByText("No students in this group")).toBeVisible();
});



test("User can filter students by major", async ({ page }) => {
  await page.goto("/ucdashboard/groups");

  // Select Cyber Security from the major filter.
  await page.locator(".student-filters select").nth(0).selectOption({
    label: "Cyber Security"
  });

  // Verify a Cyber Security student is displayed.
  await expect(page.getByText("Sondra Esparza")).toBeVisible();

  // Verify students from other majors are hidden.
  await expect(page.getByText("Jeffrey Hale")).not.toBeVisible();
  await expect(page.getByText("Santiago Rice")).not.toBeVisible();
});



