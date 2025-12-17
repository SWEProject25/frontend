import React from 'react';
import { FormHeaderProps } from '../types';

export function FormHeader({ title, subtitle }: Readonly<FormHeaderProps>) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      {subtitle && <p className="text-text-inactive">{subtitle}</p>}
    </div>
  );
}
