import { collection, config, fields } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

const ICON_OPTIONS = [
  { label: 'Sparkles', value: 'Sparkles' },
  { label: 'Flower2', value: 'Flower2' },
  { label: 'Hand', value: 'Hand' },
  { label: 'Brain', value: 'Brain' },
  { label: 'Droplet', value: 'Droplet' },
  { label: 'CircleDot', value: 'CircleDot' },
  { label: 'Sun', value: 'Sun' },
  { label: 'Pill', value: 'Pill' },
  { label: 'Gem', value: 'Gem' },
];

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
        kind: 'cloud',
      },
  cloud: {
    project: 'imhdxein/imhdxein',
  },
  ui: {
    brand: { name: 'IMHDXEIN CMS' },
  },
  collections: {
    therapies: collection({
      label: 'Terapias',
      slugField: 'name',
      path: 'src/content/therapies/*',
      format: { data: 'json' },
      entryLayout: 'form',
      columns: ['name', 'isActive'],
      schema: {
        name: fields.slug({ name: { label: 'Nombre' } }),
        description: fields.text({
          label: 'Descripción',
          multiline: true,
        }),
        durationMinutes: fields.number({
          label: 'Duración (minutos)',
          defaultValue: 60,
          validation: { isRequired: true },
        }),
        price: fields.number({
          label: 'Precio (MXN)',
          description: 'Deja vacío para "Consultar / costo personalizado"',
        }),
        icon: fields.select({
          label: 'Ícono',
          options: ICON_OPTIONS,
          defaultValue: 'Sparkles',
        }),
        image: fields.image({
          label: 'Imagen',
          directory: 'src/assets/images/therapies',
          publicPath: '../../assets/images/therapies/',
        }),
        isActive: fields.checkbox({
          label: 'Activa',
          defaultValue: true,
        }),
        orderIndex: fields.number({
          label: 'Orden',
          defaultValue: 1,
          validation: { min: 1 },
        }),
      },
    }),

    products: collection({
      label: 'Productos',
      slugField: 'name',
      path: 'src/content/products/*',
      format: { data: 'json' },
      entryLayout: 'form',
      columns: ['name', 'category', 'isAvailable'],
      schema: {
        name: fields.slug({ name: { label: 'Nombre' } }),
        description: fields.text({
          label: 'Descripción',
          multiline: true,
        }),
        price: fields.number({
          label: 'Precio (MXN)',
          defaultValue: 0,
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: 'Imagen',
          directory: 'src/assets/images/products',
          publicPath: '../../assets/images/products/',
          validation: { isRequired: false },
        }),
        category: fields.text({
          label: 'Categoría',
          defaultValue: 'General',
        }),
        benefits: fields.array(
          fields.text({ label: 'Beneficio' }),
          {
            label: 'Beneficios',
            description: 'Puntos clave que se mostrarán en la ficha de producto (opcional).',
            itemLabel: (props) => props.value || 'Beneficio',
          }
        ),
        isAvailable: fields.checkbox({
          label: 'Disponible',
          defaultValue: true,
        }),
        orderIndex: fields.number({
          label: 'Orden',
          defaultValue: 1,
          validation: { min: 1 },
        }),
      },
    }),

    therapists: collection({

      label: 'Terapeutas',
      slugField: 'name',
      path: 'src/content/therapists/*',
      format: { data: 'json' },
      entryLayout: 'form',
      columns: ['name', 'title', 'isActive'],
      schema: {
        name: fields.slug({ name: { label: 'Nombre' } }),
        title: fields.text({ label: 'Título / Puesto' }),
        specialty: fields.text({ label: 'Especialidad' }),
        bio: fields.text({ label: 'Biografía', multiline: true }),
        image: fields.image({
          label: 'Foto',
          directory: 'src/assets/images/therapists',
          publicPath: '../../assets/images/therapists/',
          validation: { isRequired: false },
        }),
        isActive: fields.checkbox({
          label: 'Activo',
          defaultValue: true,
        }),
        orderIndex: fields.number({
          label: 'Orden',
          defaultValue: 1,
          validation: { min: 1 },
        }),
      },
    }),

    testimonials: collection({
      label: 'Testimonios',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      format: { data: 'json' },
      entryLayout: 'form',
      columns: ['name', 'therapy', 'isVisible'],
      schema: {
        name: fields.slug({ name: { label: 'Nombre del paciente' } }),
        text: fields.text({ label: 'Testimonio', multiline: true }),
        rating: fields.integer({
          label: 'Calificación (1-5)',
          defaultValue: 5,
          validation: { min: 1, max: 5, isRequired: true },
        }),
        therapy: fields.text({ label: 'Terapia recibida' }),
        isVisible: fields.checkbox({
          label: 'Visible en el sitio',
          defaultValue: true,
        }),
      },
    }),

    blogPosts: collection({
      label: 'Artículos del Blog',
      slugField: 'title',
      path: 'src/content/blogPosts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'isPublished', 'publishedAt'],
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        excerpt: fields.text({
          label: 'Extracto',
          multiline: true,
        }),
        image: fields.image({
          label: 'Imagen de portada',
          directory: 'src/assets/images/blog',
          publicPath: '../../assets/images/blog/',
        }),
        audio: fields.conditional(
          fields.checkbox({
            label: '¿Incluir reproductor de audio para este artículo?',
            defaultValue: false,
          }),
          {
            true: fields.file({
              label: 'Audio del artículo (Podcast / Texto a Voz)',
              description: 'Sube el archivo en formato MP3 optimizado para la web (idealmente a 96 kbps y mono).',
              directory: 'public/audios/blog',
              publicPath: '/audios/blog/',
              validation: { isRequired: true },
            }),
            false: fields.empty(),
          }
        ),
        author: fields.text({
          label: 'Autor',
          defaultValue: 'IMHDXEIN',
        }),
        publishedAt: fields.date({
          label: 'Fecha de publicación',
          defaultValue: { kind: 'today' },
        }),
        isPublished: fields.checkbox({
          label: 'Publicado',
          defaultValue: true,
        }),
        content: fields.markdoc({
          label: 'Contenido del artículo',
          components: {
            youtube: block({
              label: 'Video de YouTube',
              schema: {
                url: fields.url({
                  label: 'URL del video de YouTube',
                  validation: {
                    isRequired: true,
                  },
                }),
              },
            }),
          },
        }),
      },
    }),
  },
});
