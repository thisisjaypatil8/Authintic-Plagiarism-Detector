import React from 'react';

const techRows = [
    [
        { name: 'React', logo: '/tech/react.png' },
        { name: 'Tailwind CSS', logo: '/tech/tailwind.png' },
    ],
    [
        { name: 'Node.js', logo: '/tech/nodejs.png' },
        { name: 'Express.js', logo: '/tech/express.png' },
        { name: 'Flask', logo: '/tech/flask.png' },
    ],
    [
        { name: 'MongoDB', logo: '/tech/mongodb.png' },
        { name: 'Chart.js', logo: '/tech/chartjs.png' },
    ],
    [
        { name: 'PyTorch', logo: '/tech/pytorch.png' },
        { name: 'Scikit-learn', logo: '/tech/scikit.png' },
    ],
    [
        { name: 'Transformers', logo: '/tech/huggingface.png' },
        { name: 'Gemini AI', logo: '/tech/gemini.png' },
    ],
];

// Each row: marginLeft offset, vertical nudge, gap between pills
const rowStyles = [
    { ml: 50,  mt: 0,   gap: 20 },
    { ml: -20, mt: -4,  gap: 14 },
    { ml: 70,  mt: 6,   gap: 24 },
    { ml: -10, mt: -2,  gap: 18 },
    { ml: 60,  mt: 8,   gap: 28 },
];

const TechStackSection = () => {
    return (
        <div className="rounded-3xl relative" style={{ background: '#0f303aff', overflow: 'visible' }}>
            <div className="grid lg:grid-cols-2 gap-8 p-10 md:p-16 items-center" style={{ overflow: 'visible' }}>
                
                {/* Left Side: Typography */}
                <div className="relative z-10">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">Engineering Insights</p>
                    <h2 className="font-black leading-none tracking-tighter mb-10" style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}>
                        <span className="block text-white">OUR</span>
                        <span className="block" style={{ color: '#0ABAB5' }}>TECH</span>
                        <span className="block text-white">STACK</span>
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Authintic" className="w-7 h-7 object-contain brightness-0 invert opacity-50" />
                        <span className="text-white/40 text-sm font-bold tracking-widest uppercase">Authintic</span>
                    </div>
                </div>

                {/* Right Side: Organically Scattered Logo Pills */}
                <div className="relative z-10 flex flex-col" style={{ overflow: 'visible' }}>
                    {techRows.map((row, rowIdx) => {
                        const style = rowStyles[rowIdx];
                        return (
                            <div 
                                key={rowIdx} 
                                className="flex flex-wrap items-center"
                                style={{ 
                                    marginLeft: `${style.ml}px`, 
                                    marginTop: `${style.mt}px`,
                                    marginBottom: '13px',
                                    gap: `${style.gap}px`,
                                }}
                            >
                                {row.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="bg-white flex items-center gap-3 px-7 py-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-default"
                                    >
                                        <img 
                                            src={item.logo} 
                                            alt={item.name} 
                                            className="w-8 h-8 object-contain"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        <span className="font-bold text-gray-800 text-base whitespace-nowrap">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Subtle decorative glow */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[100px] pointer-events-none" style={{ background: '#0ABAB5' }}></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[80px] pointer-events-none" style={{ background: '#0ABAB5' }}></div>
        </div>
    );
};

export default TechStackSection;
