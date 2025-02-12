import React, { useState, useCallback } from 'react';
import Display from './Display';
import Button from './Button';
import DarkModeToggle from './DarkModeToggle';
import Graph from './Graph';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const safeEval = (expr: string) => {
    try {
      // Allowed functions and operators
      const allowed = {
        'sqrt': Math.sqrt,
        'sin': Math.sin,
        'cos': Math.cos,
        'tan': Math.tan,
        'log': Math.log,
        'exp': Math.exp,
        '+': (a: number, b: number) => a + b,
        '-': (a: number, b: number) => a - b,
        '*': (a: number, b: number) => a * b,
        '/': (a: number, b: number) => a / b,
        '^': (a: number, b: number) => Math.pow(a, b),
      };

      // Tokenize the expression
      const tokens = expr.replace(/([+\-*/^xyz])/g, ' $1 ').split(' ');

      // Filter out empty tokens
      const filteredTokens = tokens.filter(token => token !== '');

      // Convert tokens to numbers or functions
      const parsedTokens = filteredTokens.map(token => {
        if (!isNaN(Number(token))) {
          return Number(token);
        }
        if (allowed[token]) {
          return allowed[token];
        }
        if (token === 'x' || token === 'y' || token === 'z') {
          return token;
        }
        throw new Error(`Invalid token: ${token}`);
      });

      // Perform calculation
      let result = parsedTokens[0];
      for (let i = 1; i < parsedTokens.length; i += 2) {
        const operator = parsedTokens[i];
        const operand = parsedTokens[i + 1];

        if (typeof operator !== 'function') {
          throw new Error(`Invalid operator: ${operator}`);
        }

        if (typeof result === 'number' && typeof operand === 'number') {
          result = operator(result, operand);
        } else {
          throw new Error('Invalid operands');
        }
      }

      return result;
    } catch (error) {
      console.error('Evaluation error:', error);
      return 'Error';
    }
  };

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        setResult(safeEval(expression).toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'Graph') {
      console.log('Graph button clicked');
    } else {
      setExpression(prevExpression => prevExpression + value);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C', 'Graph',
    'sqrt', '^', 'sin', 'cos', 'tan', 'log', 'exp',
    'x', 'y', 'z'
  ];

  return (
    <div className={`calculator ${isDarkMode ? 'dark' : ''} rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300`}>
      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Display expression={expression} result={result} />
      <div className="buttons grid grid-cols-4 gap-2 mt-4">
        {buttons.map(button => (
          <Button key={button} value={button} onClick={handleButtonClick} />
        ))}
      </div>
      <Graph expression={expression} result={result} />
    </div>
  );
};

export default Calculator;
