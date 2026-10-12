
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import GroupAllocation from "./GroupAllocation";

vi.mock("./Sidebar", () => ({
  default: () => <aside>Sidebar</aside>
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <GroupAllocation />
    </MemoryRouter>
  );
}

describe("GroupAllocation", () => {
  it("displays the page and all eight students", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Group Allocation" })
    ).toBeInTheDocument();

    expect(screen.getByText("Jeffrey Hale")).toBeInTheDocument();
    expect(screen.getByText("Santiago Rice")).toBeInTheDocument();
    expect(screen.getByText("Sondra Esparza")).toBeInTheDocument();
    expect(screen.getByText("Coleen Park")).toBeInTheDocument();

    expect(screen.getAllByText("8")).toHaveLength(2);
  });

  it("searches students by name", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByPlaceholderText("Search students..."),
      "Jeffrey"
    );

    expect(screen.getByText("Jeffrey Hale")).toBeInTheDocument();
    expect(screen.queryByText("Santiago Rice")).not.toBeInTheDocument();
  });

  it("searches students by student ID", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByPlaceholderText("Search students..."),
      "21433273"
    );

    expect(screen.getByText("Jeffrey Hale")).toBeInTheDocument();
    expect(screen.queryByText("Santiago Rice")).not.toBeInTheDocument();
  });

  it("filters students by major", async () => {
    const user = userEvent.setup();
    renderPage();

    const selects = screen.getAllByRole("combobox");

    await user.selectOptions(selects[0], "Computer Science");

    expect(screen.getByText("Jeffrey Hale")).toBeInTheDocument();
    expect(screen.queryByText("Santiago Rice")).not.toBeInTheDocument();
  });

  it("creates a new group", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: /Create First Group/ })
    );

    expect(
      screen.getByRole("heading", { name: "Group 1" })
    ).toBeInTheDocument();

    expect(screen.getByText("No students in this group")).toBeInTheDocument();
  });

  it("selects a student and adds them to a group", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: /Create First Group/ })
    );

    await user.click(screen.getByText("Jeffrey Hale"));

    await user.click(screen.getByRole("button", { name: "+ Add" }));

    const groupCard = screen.getByRole("heading", {
      name: "Group 1"
    }).closest(".group-card");

    expect(within(groupCard).getByText("Jeffrey Hale")).toBeInTheDocument();
    expect(within(groupCard).getByText("1 student")).toBeInTheDocument();
  });

  it("shows allocated students when the allocation filter changes", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: /Create First Group/ })
    );

    await user.click(screen.getByText("Jeffrey Hale"));
    await user.click(screen.getByRole("button", { name: "+ Add" }));

    const selects = screen.getAllByRole("combobox");

    await user.selectOptions(selects[1], "allocated");

    expect(screen.getAllByText("Jeffrey Hale")).toHaveLength(2);
    expect(screen.queryByText("Santiago Rice")).not.toBeInTheDocument();
  });

  it("removes a student from a group", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: /Create First Group/ })
    );

    await user.click(screen.getByText("Jeffrey Hale"));
    await user.click(screen.getByRole("button", { name: "+ Add" }));

    const groupCard = screen.getByRole("heading", {
      name: "Group 1"
    }).closest(".group-card");

await user.click(groupCard.querySelector(".remove-student-button"));
    
    expect(
      within(groupCard).getByText("No students in this group")
    ).toBeInTheDocument();
  });

  it("removes an entire group", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: /Create First Group/ })
    );

    await user.click(
      screen.getByRole("button", { name: "Remove" })
    );

    expect(
      screen.queryByRole("heading", { name: "Group 1" })
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("There are currently no groups created")
    ).toBeInTheDocument();
  });

  it("resets all groups and allocations", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: /Create First Group/ })
    );

    await user.click(screen.getByText("Jeffrey Hale"));
    await user.click(screen.getByRole("button", { name: "+ Add" }));

    await user.click(
      screen.getByRole("button", { name: "Reset Allocation" })
    );

    expect(
      screen.queryByRole("heading", { name: "Group 1" })
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("There are currently no groups created")
    ).toBeInTheDocument();

    expect(screen.getByText("Jeffrey Hale")).toBeInTheDocument();
  });
});
