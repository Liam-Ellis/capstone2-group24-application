
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentList from "./StudentList";

const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn()
}));



vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate
}));

vi.mock("./Dropdown", () => ({
    default: () => null
}));

const mockStudents = [
    {
        id: "1",
        name: "Alex Smith",
        email: "alex@example.com",
        course: "Software Engineering",
        cwa: 75
    },
    {
        id: "2",
        name: "Jamie Lee",
        email: "jamie@example.com",
        course: "Cyber Security",
        cwa: 82
    }
];

function renderStudentList() {
    return render(
        <StudentList
            unitName="ISAD3000"
            unitTitle="Capstone Project 1"
            students={mockStudents}
        />
    );
}

beforeEach(() => {
    mockNavigate.mockClear();
});

describe("StudentList", () => {
    it("displays the unit title and student details", () => {
        renderStudentList();

        expect(
            screen.getByRole("heading", {
                name: "Capstone Project 1 | ISAD3000"
            })
        ).toBeInTheDocument();

        expect(screen.getByText("Alex Smith")).toBeInTheDocument();
        expect(screen.getByText("alex@example.com")).toBeInTheDocument();
        expect(screen.getByText("Software Engineering")).toBeInTheDocument();
        expect(screen.getByText("CWA: 75")).toBeInTheDocument();
        expect(screen.getByText("Jamie Lee")).toBeInTheDocument();
    });

    it("navigates to the manual student form", async () => {
        const user = userEvent.setup();
        renderStudentList();

        await user.click(
            screen.getByRole("button", {
                name: "+ Add Student (Manual)"
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            "/ucdashboard/isad3000/addstudent"
        );
    });

    it("navigates to the CSV student form", async () => {
        const user = userEvent.setup();
        renderStudentList();

        await user.click(
            screen.getByRole("button", {
                name: "+ Add Students (CSV)"
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            "/ucdashboard/isad3000/addstudents"
        );
    });

    it("allows a student to be edited and saved", async () => {
        const user = userEvent.setup();
        renderStudentList();

        const student = screen.getByText("Alex Smith").closest(".student");
        await user.click(
            within(student).getByRole("button", {
                name: "Edit"
            })
        );

        const nameInput = screen.getByDisplayValue("Alex Smith");

        await user.clear(nameInput);
        await user.type(nameInput, "Alex Johnson");
        await user.click(
            within(student).getByRole("button", { name: "Save" })
        );

        expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
        expect(screen.queryByText("Alex Smith")).not.toBeInTheDocument();
    });

    it("cancels editing without saving changes", async () => {
        const user = userEvent.setup();
        renderStudentList();

        const student = screen.getByText("Alex Smith").closest(".student");
        await user.click(
            within(student).getByRole("button", {
                name: "Edit"
            })
        );

        const nameInput = screen.getByDisplayValue("Alex Smith");
        await user.clear(nameInput);
        await user.type(nameInput, "Changed Name");

        await user.click(
            within(student).getByRole("button", {
                name: "Cancel"
            })
        );

        expect(screen.getByText("Alex Smith")).toBeInTheDocument();
        expect(screen.queryByText("Changed Name")).not.toBeInTheDocument();
    });

    it("asks for confirmation before removing a student", async () => {
        const user = userEvent.setup();
        renderStudentList();

        const student = screen.getByText("Alex Smith").closest(".student");
        await user.click(
            within(student).getByRole("button", {
                name: "Remove"
            })
        );

        expect(
            screen.getByText(/are you sure you want to remove/i)
        ).toBeInTheDocument();

        expect(screen.getByText("Alex Smith")).toBeInTheDocument();
    });

    it("removes a student after confirmation", async () => {
        const user = userEvent.setup();
        renderStudentList();

        const student = screen.getByText("Alex Smith").closest(".student");
        await user.click(
            within(student).getByRole("button", {
                name: "Remove"
            })
        );

        await user.click(
            within(student).getByRole("button", { name: "Remove" })
        );

        expect(screen.queryByText("Alex Smith")).not.toBeInTheDocument();
        expect(screen.getByText("Jamie Lee")).toBeInTheDocument();
    });
});
