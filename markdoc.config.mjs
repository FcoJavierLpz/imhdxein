import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    youtube: {
      render: component('./src/components/YouTube.astro'),
      attributes: {
        url: { type: String, required: true },
      },
    },
  },
});
