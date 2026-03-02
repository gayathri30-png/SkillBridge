import db from '../config/db.js';

const populate = async () => {
    const recruiters = [
        { 
            email: 'admin@skillbridge.com', 
            company: 'SkillBridge Global', 
            bio: 'Leading the future of AI-powered talent acquisition and skill bridging for the next generation of developers.'
        },
        { 
            email: 'recruiter@example.com', 
            company: 'TechFlow Solutions', 
            bio: 'A premier software consultancy specializing in cloud-native architectures and digital transformation for Fortune 500 companies.'
        }
    ];

    for (const r of recruiters) {
        db.query(
            "UPDATE users SET company_name = ?, company_bio = ? WHERE email = ?",
            [r.company, r.bio, r.email],
            (err, res) => {
                if (err) console.error(`Error updating ${r.email}:`, err);
                else console.log(`✅ Updated ${r.email} with company info.`);
            }
        );
    }

    // Give it a second to finish
    setTimeout(() => {
        console.log('✨ Data population complete.');
        process.exit(0);
    }, 2000);
};

populate();
