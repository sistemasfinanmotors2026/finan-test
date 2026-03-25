import React from 'react';

interface NuevoComponenteProps {
    title?: string;
}

const NuevoComponente: React.FC<NuevoComponenteProps> = ({ title = 'Mi Componente' }) => {
    return (
        <div className="nuevo-componente">
            <h1>{title}</h1>
            <p>Este es un componente básico</p>
        </div>
    );
};

export default NuevoComponente;