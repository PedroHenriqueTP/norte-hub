#!/bin/bash

# Criando a estrutura da v20
mkdir -p src/components/layout
mkdir -p src/components/jornada/carousel

# Inicializa o layout imersivo
cat <<EOF > src/components/layout/MainLayout.tsx
// v20: MainLayout com Testeira Flutuante e Mosaico Assimétrico
export const MainLayout = ({ children }) => (
  <div className="bg-black min-h-screen overflow-hidden">
    <header className="fixed top-0 w-full z-50 glass-header" />
    <main className="mosaic-grid">{children}</main>
  </div>
);
EOF

echo "Estrutura v20 inicializada."
