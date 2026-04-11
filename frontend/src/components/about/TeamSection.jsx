import React, { useState } from 'react';
import teamMembers from '../../data/teamData';
import AnimatedName from '../AnimatedName';

const TeamSection = () => {
    const [anyNameHovered, setAnyNameHovered] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: '#0ABAB5' }}>Our Team</p>
                    <h2 className="text-2xl font-extrabold text-gray-900">Meet the Innovators</h2>
                </div>
                <p className="text-gray-400 text-sm hidden md:block">A passionate team dedicated to academic excellence</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => {
                    const isJay = member.name === 'Jay Patil';
                    return (
                        <div 
                            key={index} 
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
                        >
                            {/* Photo with fade on all edges */}
                            <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div 
                                    className="w-full h-full items-center justify-center text-4xl font-bold text-gray-300"
                                    style={{ display: member.image ? 'none' : 'flex' }}
                                >
                                    {member.name.charAt(0)}
                                </div>

                                <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none" style={{ background: 'linear-gradient(to bottom, white 0%, transparent 100%)' }}></div>
                                <div className="absolute top-0 bottom-0 left-0 w-2 pointer-events-none" style={{ background: 'linear-gradient(to right, white 0%, transparent 100%)' }}></div>
                                <div className="absolute top-0 bottom-0 right-0 w-2 pointer-events-none" style={{ background: 'linear-gradient(to left, white 0%, transparent 100%)' }}></div>
                                <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ background: 'linear-gradient(to top, white 0%, transparent 100%)' }}></div>
                            </div>
                            
                            {/* Name & Role — hovering triggers Jay animation */}
                            <div 
                                className="px-5 pb-5 -mt-2 relative z-10"
                                onMouseEnter={() => setAnyNameHovered(true)}
                                onMouseLeave={() => setAnyNameHovered(false)}
                            >
                                <h3 className="font-bold text-gray-900 text-base">
                                    {isJay ? (
                                        <AnimatedName tag="span" triggered={anyNameHovered} />
                                    ) : member.name}
                                </h3>
                                <p className="text-xs font-medium mt-0.5" style={{ color: '#0ABAB5' }}>{member.role}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamSection;
