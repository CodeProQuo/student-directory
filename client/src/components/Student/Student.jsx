import React, {useState, useEffect} from 'react';
import "./Student.css";

const Student = (props) => {

    const [expanded, setExpanded] = useState(false);
    const [tags, setTags] = useState([]);
    const [passesFilter, setPassesFilter] = useState(true);

    const {nameFilter, tagFilter, student} = props;

    const handleClickExpand = () => {
        setExpanded(!expanded);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value !== "") {
            setTags([...tags, e.target.value]);
            e.target.value = "";
        }
    };

    const handleTagRemove = (e) => {
        setTags(tags.filter((tag) => tag !== e.target.textContent));
    };

    const {grades, pic, firstName, lastName, email, company, skill} = student;
    const average = grades.reduce((gradesSum, grade) => gradesSum + parseInt(grade), 0) / grades.length;

    const testGrades = grades.map((grade, index) => {
        return <p key={index} >Test {index + 1}: {grade}%</p>
    });

    const tagJsx = tags.map((tag, index) => {
        return <div key={index} className="tag" onClick={handleTagRemove}>{tag}</div>
    });

    useEffect(()=> {
        const filterCheck = `${firstName} ${lastName}`.toLowerCase().includes(nameFilter.toLowerCase()) &&
            (tagFilter === "" || tags.filter((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase())).length);

        setPassesFilter(filterCheck);
    }, [nameFilter, tagFilter, firstName, lastName, tags]);

    return (
        <div data-testid="student" className={passesFilter ? "student" : "student collapsed"}>
            <div>
                <img src={pic} alt="Student's picture"/>
            </div>
            <div className="student-info">
                <h1>{firstName.toUpperCase()} {lastName.toUpperCase()}</h1>
                <p>Email: {email}</p>
                <p>Company: {company}</p>
                <p>Skill: {skill}</p>
                <p>Average: {average}%</p>
                <div className={expanded ? "student-details" : "student-details collapsed"}>
                    {testGrades}
                    <div className="tag-container">
                        {tagJsx}
                    </div>
                    <input type="text" onKeyDown={handleKeyDown} id="add-tag-input" placeholder="Add new tag"/>
                </div>
            </div>
            <button onClick={handleClickExpand}
                    className={expanded ? "expand-btn" : "expand-btn closed"}/>
        </div>);
};

export default Student;
