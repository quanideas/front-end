import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
      <div
        className="bg-primary h-3 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
       
        <p className="text-center m-2">{progress === 100 ? 'Completed! Finalizing ...' : `Loading... ${progress}%`}</p>

    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
};

export default ProgressBar;
