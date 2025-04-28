import React, { useEffect, useState } from 'react';

const Notification = ({ message, onClose, id, index }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose(id);
        }, 20000);

        return () => clearTimeout(timer);
    }, [onClose, id]);

    if (!visible) return null;

    return (
        <div style={{ ...styles.notification, top: `${20 + index * 80}px`, zIndex: 1000 + index }}>
            <button onClick={() => onClose(id)} style={styles.closeButton}>✖</button>
            <p>{message}</p>
        </div>
    );
};

const styles = {
    notification: {
        position: 'fixed',
        right: '20px',
        backgroundColor: '#333',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        marginBottom: '10px'
    },
    closeButton: {
        marginLeft: '10px',
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer'
    }
};

export default Notification;
