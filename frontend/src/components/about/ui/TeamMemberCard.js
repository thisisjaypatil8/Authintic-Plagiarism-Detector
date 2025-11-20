import React from 'react';

/**
 * Team Member Card Component
 * Displays individual team member information with photo
 * 
 * @param {string} name - Team member's name
 * @param {string} role - Team member's role
 * @param {string} image - Path to team member's photo
 */
const TeamMemberCard = ({ name, role, image }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border-2 border-indigo-200 hover:shadow-lg transition-all hover:-translate-y-1 hover:border-indigo-300">
            <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-xs flex-shrink-0 overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-gray-400">Photo</span>';
                            }}
                        />
                    ) : (
                        <span>Photo</span>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{name}</h3>
                    <p className="text-indigo-600 font-medium">{role}</p>
                </div>
            </div>
        </div>
    );
};

export default TeamMemberCard;
