export const THEME = {
    colors: {
        primary: '#735235',
        secondary: '#BD9A6C',
        background: '#F9F5F1',
    },
    text: {
        heroTitle: "O sabor que abraça seu dia.",
        heroSubtitle: "Pães artesanais e cafés especiais feitos para criar momentos inesquecíveis.",
        heroCta: "Ver Menu",
    },
    images: {
        // High quality coffee shop interior blurred
        heroBackground: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1920&auto=format&fit=crop",
        about1: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop", // Baker or Bread
        about2: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=600&auto=format&fit=crop", // Interior
    },
    links: [
        { name: "Início", href: "#hero" },
        { name: "Sobre", href: "#about" },
        { name: "Produtos", href: "#products" },
        { name: "Contato", href: "#contact" },
    ],
    products: [
        {
            id: 1,
            name: "Sourdough Clássico",
            description: "Fermentação natural de 48h, casca crocante e miolo aerado.",
            price: "R$ 22,00",
            category: "Pães Artesanais",
            image: "https://images.unsplash.com/photo-1585476644321-b97656642867?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Croissant de Amêndoas",
            description: "Manteiga francesa, recheio de creme de amêndoas e lâminas tostadas.",
            price: "R$ 18,00",
            category: "Doces Finos",
            image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Café Cold Brew",
            description: "Extraído a frio por 18h, notas de chocolate e caramelo.",
            price: "R$ 14,00",
            category: "Cafés Especiais",
            image: "https://images.unsplash.com/photo-1517701604599-bb29b5c7faaf?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 4,
            name: "Bolo Red Velvet",
            description: "Massa aveludada com um toque de cacau e frosting de cream cheese.",
            price: "R$ 16,00",
            category: "Bolos",
            image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=600&auto=format&fit=crop"
        }
    ]
};
