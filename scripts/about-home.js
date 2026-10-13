'use strict';

// Render the About page at the site root from the same Markdown source.
hexo.extend.generator.register('about-home', function(locals) {
  const about = locals.pages.findOne({ source: 'about/index.md' });

  if (!about) {
    throw new Error('The homepage requires source/about/index.md.');
  }

  return {
    path: 'index.html',
    layout: about.layout,
    data: { ...about, path: 'index.html', __page: true }
  };
});
