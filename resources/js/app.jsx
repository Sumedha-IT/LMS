// resources/js/app.js
import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import ExamModule from './components/ExamModule'; // Ensure the path is correct

function App() {
    return (
        <React.StrictMode>
            <ExamModule />
        </React.StrictMode>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
