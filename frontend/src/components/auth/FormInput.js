import React from 'react';

/**
 * Form Input Component
 * Reusable input field with icon, label, and validation
 * 
 * @param {string} label - Input label text
 * @param {string} type - Input type (text, email, etc.)
 * @param {string} name - Input name attribute
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {ReactNode} icon - Icon component to display
 * @param {boolean} required - Whether field is required
 * @param {boolean} disabled - Whether field is disabled
 * @param {string} autoComplete - Autocomplete attribute
 */
const FormInput = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    icon,
    required = false,
    disabled = false,
    autoComplete,
    ...props
}) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-semibold text-gray-700 mb-2"
            >
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    {...props}
                />
            </div>
        </div>
    );
};

export default FormInput;
