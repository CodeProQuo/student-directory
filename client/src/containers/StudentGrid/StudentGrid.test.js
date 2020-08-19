import React from 'react';
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import {URL} from '../../apiCallUrls';
import {rest} from 'msw'
import {setupServer} from 'msw/node';
import StudentGrid from './StudentGrid';
import {firstStudent, secondStudent} from "../../testData";

const server = setupServer(
    rest.get(URL, (req, res, ctx) => {
        return res(ctx.json({students: [firstStudent, secondStudent]}))
    })
);

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    cleanup();
});
afterAll(() => server.close());


it('should take a snapshot of StudentGrid', async () => {
    const {asFragment, getAllByTestId} = render(<StudentGrid/>);
    await waitFor(() => getAllByTestId('student'));

    expect(asFragment(<StudentGrid/>)).toMatchSnapshot();
});


it('should initialize states for StudentGrid as intended', async () => {
    const {getByPlaceholderText, getAllByTestId} = render(<StudentGrid/>);
    await waitFor(() => getAllByTestId('student'));

    expect(getByPlaceholderText('Search by name')).toHaveTextContent("");
    expect(getByPlaceholderText('Search by tags')).toHaveTextContent("");
});

it('should update on input to name filter', async () => {
    const {getByPlaceholderText, getAllByTestId} = render(<StudentGrid/>);

    await waitFor(() => getAllByTestId('student'));

    const nameFilterInput = getByPlaceholderText('Search by name');

    fireEvent.change(nameFilterInput, { target: { value: 'A' } });

    expect(nameFilterInput).toHaveValue('A');
});

it('should update on input to tag filter', async () => {
    const {getByPlaceholderText, getAllByTestId} = render(<StudentGrid/>);

    await waitFor(() => getAllByTestId('student'));
    const tagsFilterInput = getByPlaceholderText('Search by tags');

    fireEvent.change(tagsFilterInput, { target: { value: 'A' } });

    expect(tagsFilterInput).toHaveValue('A');
});
