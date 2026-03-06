import type { Product, Review } from './types';

const u = (id: string) => `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

export const MOCK_PRODUCTS: Product[] = [
    { 
        id: '1', 
        name: 'Smartphone Pro Max Ultra', 
        description: 'El smartphone con la mejor cámara del mercado y procesador A18.',
        long_description: 'Experimenta la máxima potencia con el nuevo Smartphone Pro Max Ultra. Su pantalla Super Retina XDR de 6.7 pulgadas ofrece una nitidez sin precedentes con tecnología ProMotion de 120Hz.',
        price: 1199.99, inventory: 10, category: 'Tecnología',
        image_url: u('photo-1616348436168-de43ad0db179'),
        images: [u('photo-1616348436168-de43ad0db179'), u('photo-1511707171634-5f897ff02aa9'), u('photo-1592890288564-76628a30a657')],
        created_at: '2024-01-01T00:00:00Z' 
    },
    { 
        id: '10', 
        name: 'Teclado Mecánico RGB Pro', 
        description: 'Switches ópticos ultra-rápidos y retroiluminación RGB de 16M colores.',
        long_description: 'Domina cada partida con el teclado más avanzado del mercado. Sus switches ópticos ofrecen una latencia cercana a cero.',
        price: 189.99, inventory: 24, category: 'Periféricos',
        image_url: u('photo-1511467687858-23d96c32e4ae'),
        images: [u('photo-1511467687858-23d96c32e4ae'), u('photo-1618384881928-028f96726ec4'), u('photo-1595044426077-d36d4b96df54')],
        created_at: '2024-01-01T01:00:00Z' 
    },
    { 
        id: '2', 
        name: 'Auriculares Wireless Hi-Fi', 
        description: 'Cancelación de ruido activa de grado profesional.',
        long_description: 'Nuestros auriculares de referencia utilizan tecnología activa de vanguardia para silenciar el mundo a tu alrededor.',
        price: 349.99, inventory: 15, category: 'Electrónica',
        image_url: u('photo-1505740420928-5e560c06d30e'),
        images: [u('photo-1505740420928-5e560c06d30e'), u('photo-1546435770-a3e426ff472b'), u('photo-1583394838336-acd977736f90')],
        created_at: '2024-01-02T00:00:00Z'
    },
    { 
        id: '3', 
        name: 'Watch Series X Evolution', 
        description: 'Tu centro de salud y actividad en la muñeca.',
        long_description: 'El Watch Series X Evolution redefine lo que un reloj inteligente puede hacer.',
        price: 499.00, inventory: 20, category: 'Tecnología',
        image_url: u('photo-1523170335258-f5ed11844a49'),
        images: [u('photo-1523170335258-f5ed11844a49'), u('photo-1508685096489-77a46807f62e'), u('photo-1434494878577-86c23bcb06b9')],
        created_at: '2024-01-03T00:00:00Z'
    },
    { 
        id: '4', 
        name: 'Monitor Gaming 4K OLED 144Hz', 
        description: 'La experiencia visual definitiva para gaming profesional.',
        long_description: 'Este monitor 4K OLED de 32 pulgadas ofrece negros puros y un contraste infinito.',
        price: 899.99, inventory: 5, category: 'Electrónica',
        image_url: u('photo-1527443224154-c4a3942d3acf'),
        images: [u('photo-1527443224154-c4a3942d3acf'), u('photo-1547119957-630f9c31ad68'), u('photo-1552831388-6a0b3575b32a')],
        created_at: '2024-01-04T00:00:00Z'
    },
    { 
        id: '5', 
        name: 'Laptop Workstation Pro 16', 
        description: 'Desempeño extremo para creativos y desarrolladores.',
        long_description: 'Pantalla Mini-LED de 16 pulgadas con 1600 nits de brillo pico.',
        price: 2699.00, inventory: 8, category: 'Tecnología',
        image_url: u('photo-1496181133206-80ce9b88a853'),
        images: [u('photo-1496181133206-80ce9b88a853'), u('photo-1517336714731-489689fd1ca8'), u('photo-1531297484001-80022131f5a1')],
        created_at: '2024-01-05T00:00:00Z'
    },
    { 
        id: '6', 
        name: 'Cámara Mirrorless 8K Pro', 
        description: 'Fotografía y cine sin compromisos.',
        long_description: 'Sensor Full-frame de 50MP y grabación 8K interna.',
        price: 3899.00, inventory: 3, category: 'Electrónica',
        image_url: u('photo-1516035069371-29a1b244cc32'),
        images: [u('photo-1516035069371-29a1b244cc32'), u('photo-1510127034890-ba27508e9f1c'), u('photo-1502920917128-1aa500764cbd')],
        created_at: '2024-01-06T00:00:00Z'
    },
    { 
        id: '11', 
        name: 'Altavoz Inteligente SpaceSound', 
        description: 'Audio 360 grados con asistente virtual integrado.',
        long_description: 'Llena cada rincón de tu hogar con un sonido cristalino y graves profundos.',
        price: 129.00, inventory: 18, category: 'Audio',
        image_url: u('photo-1589003077984-894e133dabab'),
        images: [u('photo-1589003077984-894e133dabab'), u('photo-1543512214-318c7553f230'), u('photo-1618366712277-74070a8d79bc')],
        created_at: '2024-01-06T01:00:00Z'
    },
    { 
        id: '12', 
        name: 'Consola Gaming Phantom', 
        description: 'La próxima generación de juegos en 8K.',
        long_description: 'Potencia sin límites para los gamers más exigentes.',
        price: 499.99, inventory: 12, category: 'Gaming',
        image_url: u('photo-1486406146926-c627a92ad1ab'),
        images: [u('photo-1486406146926-c627a92ad1ab'), u('photo-1605898960710-9aa39330960d'), u('photo-1606144042614-b2416e99928a')],
        created_at: '2024-01-07T00:00:00Z'
    },
    { 
        id: '13', 
        name: 'Dron SkyExplorer 4K', 
        description: 'Vuela más lejos, captura más alto.',
        long_description: 'Grabación 4K a 60fps con estabilización de 3 ejes.',
        price: 749.00, inventory: 7, category: 'Drones',
        image_url: u('photo-1473960104372-7a42105560ad'),
        images: [u('photo-1473960104372-7a42105560ad'), u('photo-1507582020474-9a35b7d455d9'), u('photo-1524143909041-895b88991e3e')],
        created_at: '2024-01-08T00:00:00Z'
    },
    { 
        id: '14', 
        name: 'Tableta Pro Creativa', 
        description: 'Tu lienzo digital definitivo de 12.9 pulgadas.',
        long_description: 'Pantalla Liquid Retina XDR para artistas y diseñadores.',
        price: 1099.00, inventory: 15, category: 'Tecnología',
        image_url: u('photo-1544244015-0df4b3ffc6b0'),
        images: [u('photo-1544244015-0df4b3ffc6b0'), u('photo-1561154464-82e9adf32764'), u('photo-1511296265581-c245004440b8')],
        created_at: '2024-01-09T00:00:00Z'
    },
    { 
        id: '15', 
        name: 'Cámara Deportiva ActionGo', 
        description: 'Resistente a todo, graba lo imposible.',
        long_description: 'Grabación 5.3K y estabilización de vídeo nivel Emmy.',
        price: 429.99, inventory: 25, category: 'Cámaras',
        image_url: u('photo-1521405924368-64c5b84bec60'),
        images: [u('photo-1521405924368-64c5b84bec60'), u('photo-1552168324-d612d77949ad'), u('photo-1502920917128-1aa500764cbd')],
        created_at: '2024-01-10T00:00:00Z'
    },
    { 
        id: '16', 
        name: 'Servidor Red Pro', 
        description: 'Infraestructura de alto rendimiento.',
        long_description: 'Optimizado para flujos de datos intensos y seguridad empresarial.',
        price: 549.00, inventory: 10, category: 'Redes',
        image_url: u('photo-1544197150-b99a580bb7a8'),
        images: [u('photo-1544197150-b99a580bb7a8'), u('photo-1558494949-ef010cbdcc48'), u('photo-1563986768609-322da13575f3')],
        created_at: '2024-01-11T00:00:00Z'
    },
    { 
        id: '18', 
        name: 'Silla Ergonómica Tech Pro', 
        description: 'Comodidad total para largas jornadas.',
        long_description: 'Soporte lumbar dinámico y materiales transpirables.',
        price: 349.00, inventory: 20, category: 'Mobiliario Tech',
        image_url: u('photo-1580480055273-228ff5388ef8'),
        images: [u('photo-1580480055273-228ff5388ef8'), u('photo-1592078615290-033ee584e267'), u('photo-1505797149-43b0ad766207')],
        created_at: '2024-01-13T00:00:00Z'
    },
    { 
        id: '19', 
        name: 'SSD Externo Pro Extreme', 
        description: 'Almacenamiento ultra veloz y resistente.',
        long_description: 'Velocidades de hasta 2000MB/s. Resistente a caídas y al agua.',
        price: 399.00, inventory: 30, category: 'Accesorios',
        image_url: u('photo-1591799264318-7e6ef8ddb7ea'),
        images: [u('photo-1591799264318-7e6ef8ddb7ea'), u('photo-1544652478-6653e09f18a2'), u('photo-1597872202164-99899321f855')],
        created_at: '2024-01-14T00:00:00Z'
    },
    { 
        id: '20', 
        name: 'Micrófono de Estudio Pro', 
        description: 'Claridad vocal excepcional para streaming.',
        long_description: 'Patrón polar cardioide y conversor AD de alta gama.',
        price: 249.00, inventory: 14, category: 'Audio',
        image_url: u('photo-1590602847861-f357a9332bbc'),
        images: [u('photo-1590602847861-f357a9332bbc'), u('photo-1589903308904-1010c2294adc'), u('photo-1521116606551-7236dc5f2b3b')],
        created_at: '2024-01-15T00:00:00Z'
    },
    { 
        id: '21', 
        name: 'Gafas VR Quest Elite', 
        description: 'Inmersión total sin cables.',
        long_description: 'Realidad Mixta revolucionaria que integra objetos digitales.',
        price: 649.00, inventory: 9, category: 'Gaming',
        image_url: u('photo-1622979135225-d2ba269cf1ac'),
        images: [u('photo-1622979135225-d2ba269cf1ac'), u('photo-1592477976531-fa4ba6139c0d'), u('photo-1617802690992-15d93263d3a9')],
        created_at: '2024-01-16T00:00:00Z'
    },
    { 
        id: '25', 
        name: 'Altavoz Bluetooth Outdoor', 
        description: 'Sonido potente y resistente al agua.',
        long_description: 'Perfecto para tus viajes. Batería de 24 horas y proteccion IP67.',
        price: 99.00, inventory: 50, category: 'Audio',
        image_url: u('photo-1608156639585-b3a032ef9689'),
        images: [u('photo-1608156639585-b3a032ef9689'), u('photo-1589127151047-b9627680bb01')],
        created_at: '2024-01-20T00:00:00Z'
    },
    { 
        id: '26', 
        name: 'Reloj Inteligente Pro', 
        description: 'Monitoriza tu salud con elegancia.',
        long_description: 'Seguimiento de actividad y notificaciones en tiempo real.',
        price: 159.00, inventory: 100, category: 'Tecnología',
        image_url: u('photo-1510017803434-a899398421b3'),
        images: [u('photo-1510017803434-a899398421b3'), u('photo-1575311373937-040b8e1fd5b6')],
        created_at: '2024-01-21T00:00:00Z'
    },
    { 
        id: '27', 
        name: 'Cámara Streaming 4K', 
        description: 'La mejor imagen para tus directos.',
        long_description: 'Grabación 4K a 60fps con enfoque automático inteligente.',
        price: 199.00, inventory: 15, category: 'Periféricos',
        image_url: u('photo-1583573636246-18cb2246697f'),
        images: [u('photo-1583573636246-18cb2246697f'), u('photo-1626012648898-1033ce5b4e26')],
        created_at: '2024-01-22T00:00:00Z'
    }
];

export const MOCK_REVIEWS: Record<string, Review[]> = {
    '1': [
        { id: 'r1', product_id: '1', user_id: 'm1', rating: 5, comment: 'La velocidad es increíble y las fotos nocturnas no tienen competencia.', created_at: '2024-02-15T10:00:00Z', userName: 'TechEnthusiast' },
        { id: 'r2', product_id: '1', user_id: 'm2', rating: 4, comment: 'Un terminal excelente, aunque el precio es elevado.', created_at: '2024-02-18T14:30:00Z', userName: 'Inma Lopez' }
    ],
    '10': [{ id: 'r10', product_id: '10', user_id: 'u10', rating: 5, comment: 'Tactu increíble y el RGB es muy personalizable.', created_at: '2024-03-01T10:00:00Z', userName: 'GamerPro' }],
    '2': [{ id: 'r2', product_id: '2', user_id: 'u2', rating: 5, comment: 'La cancelación de ruido es magia pura. Muy cómodos.', created_at: '2024-03-02T10:00:00Z', userName: 'MusicLover' }],
    '3': [{ id: 'r3', product_id: '3', user_id: 'u3', rating: 4, comment: 'Muy útil para el día a día, aunque la batería podría durar más.', created_at: '2024-03-03T10:00:00Z', userName: 'FitnessFan' }],
    '4': [{ id: 'r4', product_id: '4', user_id: 'u4', rating: 5, comment: 'Los colores OLED son otro nivel. Para gaming es perfecto.', created_at: '2024-03-04T10:00:00Z', userName: 'DisplayExpert' }],
    '5': [{ id: 'r5', product_id: '5', user_id: 'u5', rating: 5, comment: 'Potencia bruta para programar. La pantalla es una delicia.', created_at: '2024-03-05T10:00:00Z', userName: 'DevLife' }],
    '6': [{ id: 'r6', product_id: '6', user_id: 'u6', rating: 5, comment: 'Calidad de imagen profesional en un cuerpo compacto.', created_at: '2024-03-06T10:00:00Z', userName: 'PhotoGuy' }],
    '11': [{ id: 'r11', product_id: '11', user_id: 'u11', rating: 4, comment: 'Sonido muy nítido y el asistente entiende todo a la primera.', created_at: '2024-03-07T10:00:00Z', userName: 'SmartHome' }],
    '12': [{ id: 'r12', product_id: '12', user_id: 'u12', rating: 5, comment: 'La mejor compra que he hecho. Los juegos cargan al instante.', created_at: '2024-03-08T10:00:00Z', userName: 'ConsoleKing' }],
    '13': [{ id: 'r13', product_id: '13', user_id: 'u13', rating: 5, comment: 'Muy estable incluso con viento. La cámara 4K es espectacular.', created_at: '2024-03-09T10:00:00Z', userName: 'SkyHigh' }],
    '14': [{ id: 'r14', product_id: '14', user_id: 'u14', rating: 5, comment: 'Perfecta para diseño. El lápiz responde al instante.', created_at: '2024-03-10T10:00:00Z', userName: 'CreativeMind' }],
    '15': [{ id: 'r15', product_id: '15', user_id: 'u15', rating: 4, comment: 'Estabilización increíble para bici de montaña.', created_at: '2024-03-11T10:00:00Z', userName: 'ActionHero' }],
    '16': [{ id: 'r16', product_id: '16', user_id: 'u16', rating: 5, comment: 'Rendimiento sólido y fácil de configurar.', created_at: '2024-03-12T10:00:00Z', userName: 'NetworkSys' }],
    '18': [{ id: 'r18', product_id: '18', user_id: 'u18', rating: 5, comment: 'Mi espalda lo agradece. Muy ajustable y cómoda.', created_at: '2024-03-13T10:00:00Z', userName: 'OfficeWorker' }],
    '19': [{ id: 'r19', product_id: '19', user_id: 'u19', rating: 5, comment: 'Velocidad de vértigo para pasar archivos pesados.', created_at: '2024-03-14T10:00:00Z', userName: 'DataPro' }],
    '20': [{ id: 'r20', product_id: '20', user_id: 'u20', rating: 5, comment: 'Voz muy clara para mis directos. El brazo es muy útil.', created_at: '2024-03-15T10:00:00Z', userName: 'StreamerOne' }],
    '21': [{ id: 'r21', product_id: '21', user_id: 'u21', rating: 5, comment: 'Inmersión total. La realidad mixta es el futuro.', created_at: '2024-03-16T10:00:00Z', userName: 'VRTraveler' }],
    '25': [{ id: 'r25', product_id: '25', user_id: 'u25', rating: 4, comment: 'Aguanta bien los golpes y el agua. Muy potente.', created_at: '2024-03-17T10:00:00Z', userName: 'Traveler' }],
    '26': [{ id: 'r26', product_id: '26', user_id: 'u26', rating: 5, comment: 'Elegante y funcional. La batería dura semanas.', created_at: '2024-03-18T10:00:00Z', userName: 'HealthFirst' }],
    '27': [{ id: 'r27', product_id: '27', user_id: 'u27', rating: 5, comment: 'Imagen cristalina incluso con poca luz.', created_at: '2024-03-19T10:00:00Z', userName: 'VideoPro' }]
};
