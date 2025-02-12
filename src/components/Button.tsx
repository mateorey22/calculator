import React from 'react';

interface ButtonProps {
  value: string;
  onClick: (value: string) => void;
}

const Button: React.FC<ButtonProps> = ({ value, onClick }) => {
  return (
    <button
      className="button bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};

export default Button;
