import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Rounds from "./Rounds";

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn()
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

vi.mock("./Projects", () => ({
  default: () => <div>Projects section</div>
}));

vi.mock("./AddRound", () => ({
  default: ({ existingRound, onAddRound, onEditRound, onCancel }) => (
    <div>
      <h2>{existingRound ? "Edit Round" : "Add New Round"}</h2>
      <button
        onClick={() =>
          existingRound
            ? onEditRound({ ...existingRound, name: "Updated Round" })
            : onAddRound({
                name: "Test Round",
                semester: "Semester 1, 2026",
                status: "Open",
                startDate: "2026-10-15",
                endDate: "2026-10-30",
                applications: 0,
                maxApplications: 50
              })
        }
      >
        Confirm Round
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

describe("Rounds", () => {
  it("displays the Rounds page and sidebar navigation", () => {
    render(<Rounds />);

    expect(
      screen.getByRole("heading", { name: "Rounds setup" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Current available Round" })
    ).toBeInTheDocument();

    expect(screen.getByText("Units")).toBeInTheDocument();
    expect(screen.getByText("Rounds")).toBeInTheDocument();
    expect(screen.getByText("Group Allocation")).toBeInTheDocument();
    expect(screen.getByText("Download Applications")).toBeInTheDocument();
  });

  it("navigates to Group Allocation", async () => {
    const user = userEvent.setup();
    render(<Rounds />);

    await user.click(screen.getByText("Group Allocation"));

    expect(mockNavigate).toHaveBeenCalledWith("/ucdashboard/groups");
  });

  it("opens and cancels the Add Round form", async () => {
    const user = userEvent.setup();
    render(<Rounds />);

    await user.click(
      screen.getByRole("button", { name: "+ Add Round" })
    );

    expect(
      screen.getByRole("heading", { name: "Add New Round" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("heading", { name: "Add New Round" })
    ).not.toBeInTheDocument();
  });

  it("adds and displays a new round", async () => {
    const user = userEvent.setup();
    render(<Rounds />);

    await user.click(
      screen.getByRole("button", { name: "+ Add Round" })
    );

    await user.click(
      screen.getByRole("button", { name: "Confirm Round" })
    );

    expect(
      screen.getByRole("heading", { name: "Test Round" })
    ).toBeInTheDocument();

    expect(screen.getByText("Semester: Semester 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("Status: Open")).toBeInTheDocument();
    expect(screen.getByText("Projects section")).toBeInTheDocument();
  });

  it("edits an existing round", async () => {
    const user = userEvent.setup();
    render(<Rounds />);

    await user.click(
      screen.getByRole("button", { name: "+ Add Round" })
    );

    await user.click(
      screen.getByRole("button", { name: "Confirm Round" })
    );

    const roundCard = screen.getByRole("heading", {
      name: "Test Round"
    }).closest(".round-card");

    await user.click(
      within(roundCard).getByRole("button", { name: "Edit Round" })
    );

    expect(
      screen.getByRole("heading", { name: "Edit Round" })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Confirm Round" })
    );

    expect(
      screen.getByRole("heading", { name: "Updated Round" })
    ).toBeInTheDocument();
  });

  it("closes an open round", async () => {
    const user = userEvent.setup();
    render(<Rounds />);

    await user.click(
      screen.getByRole("button", { name: "+ Add Round" })
    );

    await user.click(
      screen.getByRole("button", { name: "Confirm Round" })
    );

    const roundCard = screen.getByRole("heading", {
      name: "Test Round"
    }).closest(".round-card");

    await user.click(
      within(roundCard).getByRole("button", { name: "Close Round" })
    );

    expect(screen.getByText("Status: Closed")).toBeInTheDocument();

    expect(
      within(roundCard).queryByRole("button", { name: "Close Round" })
    ).not.toBeInTheDocument();

    expect(
      within(roundCard).queryByRole("button", { name: "Edit Round" })
    ).not.toBeInTheDocument();
  });
});