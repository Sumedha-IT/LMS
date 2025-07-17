import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

console.log(App); // Add this line to check what is being imported

// Check if the target element exists before creating the root
const helloReactElement = document.getElementById('hello-react');
if (helloReactElement) {
  const root = ReactDOM.createRoot(helloReactElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

// Check for student-placement element
const studentPlacementElement = document.getElementById('student-placement');
if (studentPlacementElement) {
  const studentPlacementRoot = ReactDOM.createRoot(studentPlacementElement);
  studentPlacementRoot.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

// Check for admin-placement element
const adminPlacementElement = document.getElementById('admin-placement');
if (adminPlacementElement) {
  const adminPlacementRoot = ReactDOM.createRoot(adminPlacementElement);
  adminPlacementRoot.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();