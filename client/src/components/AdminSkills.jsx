import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSkills = () => {
    const navigate = useNavigate();
    return (
        <div className="p-8" style={{ fontFamily: 'monospace' }}>
            <button onClick={() => navigate('/admin')} className="mb-4 text-xs font-bold">← BACK</button>
            <h1 className="text-2xl font-bold bg-black text-white p-2 inline-block">SKILL MANAGEMENT</h1>
            <div className="mt-8 border-2 border-black p-8 text-center uppercase tracking-widest">
                Skills Module Initialization in Progress...
            </div>
        </div>
    );
};

export default AdminSkills;
