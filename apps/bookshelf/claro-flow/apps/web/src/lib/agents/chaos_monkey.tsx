import React, { useEffect, useState } from 'react';

/**
 * Agente de Chaos Engineering (Chaos Monkey)
 * Injeta instabilidade aleatória em componentes para testar a resiliência (Global Error Boundary).
 */
export function withChaos<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  failureRate: number = 0.2 // 20% de chance de falhar
) {
  return function ChaosMonkeyWrapper(props: P) {
    const [shouldFail, setShouldFail] = useState(false);

    useEffect(() => {
      // Determina na montagem se o componente irá falhar
      if (Math.random() < failureRate) {
        setShouldFail(true);
      }
    }, []);

    if (shouldFail) {
      throw new Error('Chaos Monkey Strike! Componente forçado a falhar para validação do Error Boundary.');
    }

    return <WrappedComponent {...props} />;
  };
}
