import React, { createContext, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/db/db.json');
            const data = await response.json();
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    const markAsUnread = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, read: false } : notification
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification => ({ ...notification, read: true })),
        );
    };

     const contextValue = useMemo(
            () => ({
                notifications,markAllAsRead,markAsRead,markAsUnread,fetchNotifications
                
            }),
            [notifications,markAllAsRead,markAsRead,markAsUnread,fetchNotifications]
          );

    return (
        <NotificationsContext.Provider value={contextValue}>
            {children}
        </NotificationsContext.Provider>
    );
};

NotificationsProvider.propTypes = { children: PropTypes.node.isRequired };