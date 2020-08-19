import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Student from "../../components/Student/Student.jsx"
import "./StudentGrid.css";


const StudentGrid = () => {
    const [students, setStudents] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");

    useEffect(() => {
        const queryStudents = () => {
            axios.get(process.env.REACT_APP_URL).then(
                response => {
                    setStudents(response.data);
                });
        };

        queryStudents();
    }, []);

    const studentsJsx = students.map((student, index) => <Student key={index}
                                                                  nameFilter={nameFilter}
                                                                  tagFilter={tagFilter}
                                                                  student={student}/>);

    return (
        <>
            <div className="student-grid">
                <input type="text"
                       id="name-input"
                       onChange={(e) => setNameFilter(e.target.value)}
                       placeholder="Search by name"/>
                <input type="text"
                       id="tag-input"
                       onChange={(e) => setTagFilter(e.target.value)}
                       placeholder="Search by tags"/>
                {studentsJsx}
            </div>
        </>
    );
};

export default StudentGrid;
