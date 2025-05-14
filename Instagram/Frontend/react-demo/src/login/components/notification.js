import React, { useEffect, useState } from 'react';

const Notification = ({ onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
       <div style={styles.overlay}>
            <div style={styles.notification}>
                <p>You're registered! Log in to access your account.</p>
                <button onClick={() => onClose()} style={styles.closeButton}>✖</button>
            </div>
       </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    },
    notification: {
        position: 'relative',
        backgroundColor: '#333',
        color: 'white',
        padding: '30px 30px 20px 30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
    }
};

export default Notification;
