import React from 'react';
import fs from 'fs';
import path from 'path';
import {render, cleanup, fireEvent} from '@testing-library/react';
import Student from './Student';
import {firstStudent, secondStudent} from "../../testData";

const cssFile = fs.readFileSync(
    path.resolve(__dirname, './Student.css'),
    'utf8'
);

const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = cssFile;

afterEach(cleanup);

it('should take a snapshot of Student', () => {
    const {asFragment} = render(<Student nameFilter=""
                                         tagFilter=""
                                         student={firstStudent}/>);

    expect(asFragment(<Student/>)).toMatchSnapshot();
});

it('should initialize states for Student as intended', () => {
    const {getByTestId, getByPlaceholderText, container} = render(<Student nameFilter=""
                                                                           tagFilter=""
                                                                           student={firstStudent}/>);

    container.append(style);

    expect(getByTestId("student")).toBeVisible();
    expect(getByPlaceholderText('Add new tag')).not.toBeVisible();
    expect(getByTestId("student")).not.toContainElement(container.querySelector("[class='tag']"));
});

it('should render correctly with all its props', () => {
    const {container} = render(<Student nameFilter=""
                                        tagFilter=""
                                        student={firstStudent}/>);

    expect(container).toHaveTextContent("JOHN DOE");
    expect(container).toHaveTextContent("Email: johndoe@email.com");
    expect(container).toHaveTextContent("Company: ABC");
    expect(container).toHaveTextContent("Skill: Archery");

    expect(container).toHaveTextContent("Test 1: 20%");
    expect(container).toHaveTextContent("Test 2: 30%");
    expect(container).toHaveTextContent("Test 3: 40%");
});

it('should show student details on clicking expand button', async () => {
    const {container, getByPlaceholderText, getByRole, getByText} = render(<Student nameFilter=""
                                                                                    tagFilter=""
                                                                                    student={firstStudent}/>);

    container.append(style);

    expect(getByPlaceholderText('Add new tag')).not.toBeVisible();
    expect(getByText("Test 1: 20%")).not.toBeVisible();

    fireEvent.click(getByRole('button'));

    expect(getByPlaceholderText('Add new tag')).toBeVisible();
    expect(getByText("Test 1: 20%")).toBeVisible();
});


it('should add tag', () => {
    const {getByPlaceholderText, getByRole, getByText, container} = render(<Student nameFilter=""
                                                                                    tagFilter=""
                                                                                    student={firstStudent}/>);
    container.append(style);

    fireEvent.click(getByRole('button'));

    const addTagInput = getByPlaceholderText('Add new tag');
    fireEvent.change(addTagInput, {target: {value: 'Tag1'}});
    fireEvent.keyDown(addTagInput, {key: 'Enter', keyCode: 13});

    expect(getByText("Tag1")).toBeVisible();
});

it('should remove tag', () => {
    const {
        getByPlaceholderText,
        getByRole,
        getByText,
        queryByText,
        container
    } = render(<Student nameFilter="" tagFilter="" student={firstStudent}/>);

    container.append(style);

    fireEvent.click(getByRole('button'));

    const addTagInput = getByPlaceholderText('Add new tag');
    fireEvent.change(addTagInput, {target: {value: 'Tag1'}});
    fireEvent.keyDown(addTagInput, {key: 'Enter', keyCode: 13});
    fireEvent.click(getByText("Tag1"));

    expect(queryByText("Tag1")).not.toBeInTheDocument();

});

it('should calculate the grade average correctly', () => {
    const {container} = render(<Student nameFilter=""
                                        tagFilter=""
                                        student={secondStudent}/>);

    expect(container).toHaveTextContent("Average: 65%");
});

it('should filter by name', () => {
    const nameFilter = "Jane";
    const {getByText, container} = render(<Student nameFilter={nameFilter}
                                                   tagFilter=""
                                                   student={firstStudent}/>);
    render(<Student nameFilter={nameFilter}
                    tagFilter=""
                    student={secondStudent}/>);

    container.append(style);

    expect(getByText("JANE DOE")).toBeVisible();
    expect(getByText("JOHN DOE")).not.toBeVisible();
});

it('should filter by tag', () => {
    const {
        getByText,
        container,
        getAllByRole,
        getAllByPlaceholderText,
        rerender
    } = render(<Student nameFilter="" tagFilter="" student={firstStudent}/>);

    render(<Student nameFilter=""
                    tagFilter=""
                    student={secondStudent}/>);

    container.append(style);

    const expandButton = getAllByRole('button');

    fireEvent.click(expandButton[0]);

    const addTagInputAll = getAllByPlaceholderText('Add new tag');

    fireEvent.change(addTagInputAll[0], {target: {value: 'Tag1'}});
    fireEvent.keyDown(addTagInputAll[0], {key: 'Enter', keyCode: 13});


    fireEvent.click(expandButton[1]);
    fireEvent.change(addTagInputAll[1], {target: {value: 'Tag2'}});
    fireEvent.keyDown(addTagInputAll[1], {key: 'Enter', keyCode: 13});

    rerender(<Student nameFilter=""
                      tagFilter="Tag2"
                      student={firstStudent}/>);
    rerender(<Student nameFilter=""
                      tagFilter="Tag2"
                      student={secondStudent}/>);

    expect(getByText("Tag2")).toBeVisible();
    expect(getByText("Tag1")).not.toBeVisible();
});

it('should filter by name and tag', () => {
    const {
        getAllByTestId,
        container,
        getAllByRole,
        getAllByPlaceholderText,
        rerender: rerenderFirst
    } = render(<Student nameFilter="" tagFilter="" student={firstStudent}/>);

    const {rerender: rerenderSecond} = render(<Student nameFilter=""
                                                       tagFilter=""
                                                       student={secondStudent}/>);

    const {rerender: rerenderThird} = render(<Student nameFilter=""
                                                      tagFilter=""
                                                      student={firstStudent}/>);

    container.append(style);

    const expandButton = getAllByRole('button');

    fireEvent.click(expandButton[0]);

    const addTagInputAll = getAllByPlaceholderText('Add new tag');

    fireEvent.change(addTagInputAll[0], {target: {value: 'Tag1'}});
    fireEvent.keyDown(addTagInputAll[0], {key: 'Enter', keyCode: 13});


    fireEvent.click(expandButton[1]);
    fireEvent.change(addTagInputAll[1], {target: {value: 'Tag1'}});
    fireEvent.keyDown(addTagInputAll[1], {key: 'Enter', keyCode: 13});

    rerenderFirst(<Student nameFilter="John"
                           tagFilter="Tag1"
                           student={firstStudent}/>);
    rerenderSecond(<Student nameFilter="John"
                            tagFilter="Tag1"
                            student={secondStudent}/>);
    rerenderThird(<Student nameFilter="John"
                           tagFilter="Tag1"
                           student={firstStudent}/>);

    const studentComponents = getAllByTestId("student");

    expect(studentComponents[0]).not.toHaveClass("collapsed");
    expect(studentComponents[1]).toHaveClass("collapsed");
    expect(studentComponents[2]).toHaveClass("collapsed");
});