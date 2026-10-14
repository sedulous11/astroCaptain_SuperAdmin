import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

const TagInput = ({ label, tags = [], setTags, placeholder }) => { // Default empty array if tags is undefined
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            const value = input.trim();
            if (!tags?.includes(value)) { // Optional chaining used here
                setTags([...tags, value]);
            }
            setInput('');
        }
    };

    const removeTag = (index) => {
        const updated = [...tags];
        updated.splice(index, 1);
        setTags(updated);
    };

    return (
        <div>
            <label className="block font-medium">{label}</label>
            <div className="flex flex-wrap items-center gap-2 mt-1 p-2 border border-gray-300 rounded min-h-[42px] bg-yellow-50">
                {tags?.map((tag, idx) => ( // Optional chaining for safe iteration
                    <span
                        key={idx}
                        className="flex items-center bg-[#FFD700] text-black px-2 py-1 rounded-full"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(idx)}
                            className="ml-1 text-black hover:text-red-600"
                        >
                            <MdClose size={16} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    className="flex-1 min-w-[100px] p-1 outline-none"
                    value={input}
                    placeholder={placeholder}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

export default TagInput;
