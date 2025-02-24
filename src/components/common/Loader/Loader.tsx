'use client';

import React, {FC} from 'react';
import {PulseLoader} from 'react-spinners';

import styled from './Loader.module.css';

export const Loader: FC = () => {
  return (
    <div className={styled.container}>
      <PulseLoader color="gray" size={10} />
    </div>
  );
};

export default Loader;
