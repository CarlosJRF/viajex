// Ayudantes para declarar el catálogo sin repetir nombres de campos
const actividad = (id, nombre) => ({ id, nombre })
// Fechas y disponibilidad son informativas: no se descuentan al reservar
const vuelo = (id, aerolinea, horarioIda, horarioVuelta, precio, [fechaIda, fechaVuelta], cupos) =>
  ({ id, aerolinea, horarioIda, horarioVuelta, precio, fechaIda, fechaVuelta, cupos })
const hotel = (id, nombre, categoria, precioNoche, [disponibleDesde, disponibleHasta], habitaciones) => ({
  id, nombre, categoria, precioNoche, disponibleDesde, disponibleHasta,
  habitacionesDisponibles: habitaciones,
})
const tour = (id, nombre, actividades, precio) => ({ id, nombre, actividades, precio })
const imagen = (id) => `https://picsum.photos/seed/${id}/600/400`

// Catálogo de solo lectura: 5 destinos de países distintos, precios en CLP
export const catalogo = [
  {
    id: 'd1',
    nombre: 'Cusco',
    imagen: imagen('d1'),
    pais: { id: 'p1', nombre: 'Perú' },
    actividadesPopulares: [
      actividad('a1', 'Visita a Machu Picchu'),
      actividad('a2', 'Recorrido por el Valle Sagrado'),
      actividad('a3', 'Caminata a la Montaña de Colores'),
    ],
    vuelos: [
      vuelo('v1', 'LATAM', '08:15', '17:40', 389000, ['2027-03-10', '2027-03-17'], 18),
      vuelo('v2', 'Sky Airline', '06:30', '14:10', 312000, ['2027-04-05', '2027-04-11'], 6),
    ],
    hoteles: [
      hotel('h1', 'Casa Andina Cusco', 3, 68000, ['2027-03-01', '2027-04-30'], 12),
      hotel('h2', 'Palacio del Inka', 5, 210000, ['2027-03-01', '2027-04-30'], 4),
      hotel('h3', 'Hostal Plaza de Armas', 2, 39000, ['2027-03-01', '2027-04-30'], 25),
    ],
    tours: [
      tour('t1', 'Machu Picchu full day', [
        actividad('a1', 'Visita a Machu Picchu'),
        actividad('a4', 'Tren panorámico'),
      ], 245000),
      tour('t2', 'Valle Sagrado clásico', [
        actividad('a2', 'Recorrido por el Valle Sagrado'),
        actividad('a5', 'Mercado de Pisac'),
        actividad('a6', 'Salineras de Maras'),
      ], 89000),
    ],
  },
  {
    id: 'd2',
    nombre: 'Cancún',
    imagen: imagen('d2'),
    pais: { id: 'p2', nombre: 'México' },
    actividadesPopulares: [
      actividad('a7', 'Snorkel en arrecifes'),
      actividad('a8', 'Ruinas de Tulum'),
    ],
    vuelos: [
      vuelo('v3', 'Aeroméxico', '23:50', '13:20', 720000, ['2027-01-15', '2027-01-22'], 30),
      vuelo('v4', 'LATAM', '10:05', '21:45', 815000, ['2027-02-01', '2027-02-10'], 9),
      vuelo('v5', 'Copa Airlines', '05:40', '18:30', 655000, ['2027-02-20', '2027-02-26'], 3),
    ],
    hoteles: [
      hotel('h4', 'Riu Caribe', 4, 145000, ['2027-01-10', '2027-03-05'], 20),
      hotel('h5', 'Hotel Centro Cancún', 3, 72000, ['2027-01-10', '2027-03-05'], 7),
    ],
    tours: [
      tour('t3', 'Tulum y cenotes', [
        actividad('a8', 'Ruinas de Tulum'),
        actividad('a9', 'Nado en cenote'),
      ], 98000),
      tour('t4', 'Isla Mujeres en catamarán', [
        actividad('a7', 'Snorkel en arrecifes'),
        actividad('a10', 'Paseo en catamarán'),
        actividad('a11', 'Almuerzo en la playa'),
      ], 115000),
    ],
  },
  {
    id: 'd3',
    nombre: 'Buenos Aires',
    imagen: imagen('d3'),
    pais: { id: 'p3', nombre: 'Argentina' },
    actividadesPopulares: [
      actividad('a12', 'Show de tango'),
      actividad('a13', 'Paseo por La Boca'),
      actividad('a14', 'Visita al Teatro Colón'),
    ],
    vuelos: [
      vuelo('v6', 'Aerolíneas Argentinas', '07:00', '19:15', 245000, ['2027-05-03', '2027-05-08'], 22),
      vuelo('v7', 'JetSMART', '12:30', '22:05', 178000, ['2027-05-20', '2027-05-27'], 40),
    ],
    hoteles: [
      hotel('h6', 'Alvear Palace', 5, 260000, ['2027-05-01', '2027-06-15'], 5),
      hotel('h7', 'Hotel Palermo Soho', 3, 64000, ['2027-05-01', '2027-06-15'], 16),
    ],
    tours: [
      tour('t5', 'Noche de tango', [
        actividad('a12', 'Show de tango'),
        actividad('a15', 'Cena típica'),
      ], 75000),
      tour('t6', 'Buenos Aires clásico', [
        actividad('a13', 'Paseo por La Boca'),
        actividad('a14', 'Visita al Teatro Colón'),
        actividad('a16', 'Recorrido por San Telmo'),
      ], 42000),
      tour('t7', 'Delta del Tigre', [
        actividad('a17', 'Paseo en lancha'),
        actividad('a18', 'Puerto de Frutos'),
      ], 58000),
    ],
  },
  {
    id: 'd4',
    nombre: 'Madrid',
    imagen: imagen('d4'),
    pais: { id: 'p4', nombre: 'España' },
    actividadesPopulares: [
      actividad('a19', 'Museo del Prado'),
      actividad('a20', 'Palacio Real'),
    ],
    vuelos: [
      vuelo('v8', 'Iberia', '13:45', '23:55', 1150000, ['2027-06-10', '2027-06-20'], 14),
      vuelo('v9', 'LATAM', '16:20', '11:10', 1290000, ['2027-07-01', '2027-07-09'], 8),
    ],
    hoteles: [
      hotel('h8', 'Hotel Gran Vía', 4, 135000, ['2027-06-01', '2027-07-31'], 10),
      hotel('h9', 'Hostal Sol', 2, 58000, ['2027-06-01', '2027-07-31'], 30),
      hotel('h10', 'Palacio de los Duques', 5, 240000, ['2027-06-01', '2027-07-31'], 3),
    ],
    tours: [
      tour('t8', 'Madrid de los Austrias', [
        actividad('a20', 'Palacio Real'),
        actividad('a21', 'Plaza Mayor'),
      ], 36000),
      tour('t9', 'Arte en el Paseo del Prado', [
        actividad('a19', 'Museo del Prado'),
        actividad('a22', 'Museo Reina Sofía'),
        actividad('a23', 'Parque del Retiro'),
      ], 69000),
    ],
  },
  {
    id: 'd5',
    nombre: 'Río de Janeiro',
    imagen: imagen('d5'),
    pais: { id: 'p5', nombre: 'Brasil' },
    actividadesPopulares: [
      actividad('a24', 'Cristo Redentor'),
      actividad('a25', 'Pan de Azúcar'),
      actividad('a26', 'Playa de Copacabana'),
    ],
    vuelos: [
      vuelo('v10', 'GOL', '09:10', '18:50', 410000, ['2027-02-05', '2027-02-12'], 26),
      vuelo('v11', 'LATAM', '14:35', '08:25', 465000, ['2027-02-25', '2027-03-04'], 11),
    ],
    hoteles: [
      hotel('h11', 'Copacabana Palace', 5, 320000, ['2027-02-01', '2027-03-15'], 6),
      hotel('h12', 'Ipanema Inn', 3, 85000, ['2027-02-01', '2027-03-15'], 18),
    ],
    tours: [
      tour('t10', 'Cristo y Pan de Azúcar', [
        actividad('a24', 'Cristo Redentor'),
        actividad('a25', 'Pan de Azúcar'),
      ], 125000),
      tour('t11', 'Río playero', [
        actividad('a26', 'Playa de Copacabana'),
        actividad('a27', 'Atardecer en Arpoador'),
      ], 48000),
    ],
  },
]
