import '../pages_css/AdminAccount.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
    }, [users]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/users');
            const data = await response.json();
            setUsers(data);
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
            const response = await fetch(`http://localhost:3001/delete-user/${userId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setUsers(users.filter(user => user._id !== userId));
            } else {
                console.error('Error deleting user:', response.statusText);
            }
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
            const response = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: newType }),
            });
            if (response.ok) {
                setUsers(users.map(user => (user._id === userId ? { ...user, type: newType } : user)));
            } else {
                console.error('Error changing user type:', response.statusText);
            }
        } catch (err) {
            console.error('Error changing user type:', err);
        }
    };

    return (
        <div className='userManagement'>
            <div className="pageHeader">
                <h1 className="title">User Management</h1>
                <span className="pageDescription">The table below reflects all the registered users of Farm To Table.</span>
            </div>
            <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Middle Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th id='totalUsers'>Total Users: {users.length}</th>
                        </tr>
                    </thead>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.fname}</td>
                            <td>{user.mname}</td>
                            <td>{user.lname}</td>
                            <td>{user.email}</td>
                            <td>{user.type}</td>
                            <td>
                                <button id='deleteUser' onClick={() => confirmDeleteUser(user._id)}>Delete</button>
                                <button id='changeUser' onClick={() => confirmChangeUserType(user._id, user.type === 'admin' ? 'user' : 'admin')}>
                                    {user.type === 'admin' ? 'Change to User' : 'Change to Admin'}
                                </button>
                            </td>
                        </tr>
                    ))}
            </table>
        </div>
    );
};

export default UserManagement;


