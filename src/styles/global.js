export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #F4F6F8;
    color: #1F2933;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .slide-in  { animation: slideIn 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
  .fade-in   { animation: fadeIn  0.3s ease forwards; }
  .spin      { animation: spin    1s linear infinite; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 2px; }

  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input, select { font-family: inherit; }
`;
