import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
}

const Display: React.FC<DisplayProps> = ({ expression, result }) => {
  return (
    <div className="display bg-gray-100 dark:bg-gray-700 text-right p-4 rounded-md mb-2">
      <div className="expression text-gray-600 dark:text-gray-400 text-sm">{expression}</div>
      <div className="result text-2xl font-bold text-gray-800 dark:text-gray-200">{result}</div>
    </div>
  );
};

export default Display;
