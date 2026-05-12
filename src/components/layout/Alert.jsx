import React from 'react';
import '../styles/Alert.css';

const Alert = ({ alert }) => {
    const capitalize = (word) => {
        if (word === 'danger') word = 'error';
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    return (
        <div className="custom-alert-container">
            {alert && (
                <div className={`custom-alert ${alert.type}`}>
                    <span><strong>{capitalize(alert.type)}:</strong> {alert.msg}</span>
                </div>
            )}
        </div>
    );
};

export default Alert;
