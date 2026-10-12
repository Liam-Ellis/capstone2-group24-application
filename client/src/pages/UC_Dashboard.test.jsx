import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UC_Dashboard from "./UC_Dashboard";

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn()
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

describe("UC_Dashboard", () => {
  it("displays the dashboard heading and sidebar", () => {
    render(<UC_Dashboard />);

    expect(
      screen.getByRole("heading", { name: 'Hi "Username"!' })
    ).toBeInTheDocument();

    expect(screen.getAllByText("Units")).toHaveLength(2);
    expect(screen.getByText("Rounds")).toBeInTheDocument();
    expect(screen.getByText("Group Allocation")).toBeInTheDocument();
  });

  it("displays both unit cards", () => {
    render(<UC_Dashboard />);

    expect(
      screen.getByRole("heading", { name: "ISAD3000 / WORK3008" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Capstone Project 1 / Semester 1 2026")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "ICTE3002" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Human Computer Interface / Semester 1 2026")
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", { name: "Open Unit" })
    ).toHaveLength(2);
  });

  it("navigates to the Rounds page", async () => {
    const user = userEvent.setup();
    render(<UC_Dashboard />);

    await user.click(screen.getByText("Rounds"));

    expect(mockNavigate).toHaveBeenCalledWith("/ucdashboard/rounds");
  });

  it("navigates to Group Allocation", async () => {
    const user = userEvent.setup();
    render(<UC_Dashboard />);

    await user.click(screen.getByText("Group Allocation"));

    expect(mockNavigate).toHaveBeenCalledWith("/ucdashboard/groups");
  });

  it("opens the ISAD3000 / WORK3008 unit", async () => {
    const user = userEvent.setup();
    render(<UC_Dashboard />);

    const openButtons = screen.getAllByRole("button", {
      name: "Open Unit"
    });

    await user.click(openButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/ucdashboard/isad3000/"
    );
  });

  it("opens the ICTE3002 unit", async () => {
    const user = userEvent.setup();
    render(<UC_Dashboard />);

    const openButtons = screen.getAllByRole("button", {
      name: "Open Unit"
    });

    await user.click(openButtons[1]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/ucdashboard/icte3002"
    );
  });

  it("allows the year and semester to be changed", async () => {
    const user = userEvent.setup();
    render(<UC_Dashboard />);

    const yearSelect = screen.getByLabelText("Year:");
    const semesterSelect = screen.getByLabelText("Semester:");

    await user.selectOptions(yearSelect, "2027");
    await user.selectOptions(semesterSelect, "Semester 2");

    expect(yearSelect).toHaveValue("2027");
    expect(semesterSelect).toHaveValue("Semester 2");
  });

  it("allows all semesters to be selected", async () => {
    const user = userEvent.setup();
    render(<UC_Dashboard />);

    const semesterSelect = screen.getByLabelText("Semester:");

    await user.selectOptions(semesterSelect, "Semester 1");
    await user.selectOptions(semesterSelect, "");

    expect(semesterSelect).toHaveValue("");
  });
});