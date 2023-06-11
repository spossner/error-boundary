import { useEffect, useState } from 'react';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

const DummyComponent = ({
  fixed,
  count,
  setCount,
}: {
  fixed: boolean;
  count: number;
  setCount: (fn: (current: number) => number) => void;
}) => {
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if (Math.random() > 0.95)
      throw new Error('useEffect: handled by error boundary');
  }, [count]);

  const handleClick = () => {
    try {
      if (Math.random() > 0.95)
        throw new Error('handleClick: this should not have happened');
      setCount((count) => count + 1);
    } catch (error) {
      showBoundary(error);
    }
  };

  if (!fixed) throw new Error('render: error while rendering');
  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white rounded px-3 py-1 mt-4 w-48"
    >
      count is: {count}
    </button>
  );
};

const renderFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: { message: string };
  resetErrorBoundary: () => void;
}) => {
  return (
    <div role="alert" className="flex flex-col items-center">
      <h1 className="text-xl">Something went wrong:</h1>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-500 text-white rounded px-3 py-1 mt-4"
      >
        Try again
      </button>
    </div>
  );
};

function App() {
  const [count, setCount] = useState(0);
  const [isFixed, setIsFixed] = useState(false);

  const logError = (error: Error, info: { componentStack: string }) => {
    console.log({ error, info });
  };

  return (
    <div className="grid justify-center">
      <ErrorBoundary
        fallbackRender={renderFallback}
        onReset={() => {
          setIsFixed(true);
        }}
        onError={logError}
      >
        <DummyComponent fixed={isFixed} count={count} setCount={setCount} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
