import React from 'react';

function Control({
  onPlay,
  onPause,
  onReset,
  current,
  setCurrent,
  recoverAutoScrollImmediately,
}: {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  current: number;
  setCurrent: (c: number) => void;
  recoverAutoScrollImmediately: () => void;
}) {
  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-200">
      <button type="button" onClick={onPlay} className="btn">
        play
      </button>
      <button type="button" onClick={onPause} className="btn">
        pause
      </button>
      <button type="button" onClick={onReset} className="btn">
        reset
      </button>
      <input
        type="number"
        value={current}
        onChange={(event) => setCurrent(Number(event.target.value))}
        className="input"
      />
      <button type="button" onClick={recoverAutoScrollImmediately} className="btn">
        recover auto scroll immediately
      </button>
    </div>
  );
}

export default Control;