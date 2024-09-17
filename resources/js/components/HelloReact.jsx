import React from 'react';
import ReactDOM from 'react-dom/client';

export default function HelloReact() {
    return(
        <div>
        <h1>Exam Module</h1>
        </div>
    );
}


const container = document.getElementById("hello-react");
const root = ReactDOM.createRoot(container);
root.render(<HelloReact/>);