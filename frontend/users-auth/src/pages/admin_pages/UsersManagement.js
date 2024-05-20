import '../pages_css/AdminAccount.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        console.log('Users changed:', users);
    }, [users]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const confirmDeleteUser = async (userId) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            deleteUser(userId);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:3001/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const confirmChangeUserType = async (userId, newType) => {
        const confirmed = window.confirm(`Are you sure you want to change this user's type to ${newType}?`);
        if (confirmed) {
            changeUserType(userId, newType);
        }
    };

    const changeUserType = async (userId, newType) => {
        try {
            await axios.put(`http://localhost:3001/users/${userId}`, { type: newType });
            setUsers(users.map(user => (user._id === userId ? { ...user, type: newType } : user)));
        } catch (err) {
            console.error('Error changing user type:', err);
        }
    };

    return (
        <div>
            <h1>User Management</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Middle Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.fname}</td>
                            <td>{user.mname}</td>
                            <td>{user.lname}</td>
                            <td>{user.email}</td>
                            <td>{user.type}</td>
                            <td>
                                <button onClick={() => confirmDeleteUser(user._id)}>Delete</button>
                                <button onClick={() => confirmChangeUserType(user._id, user.type === 'admin' ? 'user' : 'admin')}>
                                    {user.type === 'admin' ? 'Change to User' : 'Change to Admin'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;


