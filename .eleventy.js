const yaml = require('js-yaml');
const fs = require('fs');
const { DateTime } = require('luxon');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

module.exports = function(eleventyConfig) {
  // Load site configuration
  const siteConfig = yaml.load(fs.readFileSync('./site.config.yml', 'utf8'));

  // Add site config as global data
  eleventyConfig.addGlobalData('siteConfig', siteConfig);

  // Configure markdown-it
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'after',
      class: 'header-anchor',
      symbol: '#',
    }),
    level: [1, 2, 3, 4],
  });

  eleventyConfig.setLibrary('md', markdownLibrary);

  // Filters
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
  });

  eleventyConfig.addFilter('readableDateISO', (isoString) => {
    return DateTime.fromISO(isoString, { zone: 'utc' }).toFormat('dd LLL yyyy');
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('isoDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISO();
  });

  // Limit filter
  eleventyConfig.addFilter('limit', (array, limit) => {
    return array.slice(0, limit);
  });

  // Truncate filter
  eleventyConfig.addFilter('truncate', (str, length = 200) => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
  });

  // Strip HTML tags filter
  eleventyConfig.addFilter('striptags', (str) => {
    if (!str) return '';
    // Remove HTML tags
    let text = str.replace(/<[^>]*>/g, '');
    // Decode common HTML entities (decode &amp; last to avoid double-unescaping)
    text = text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');  // Decode &amp; last
    return text;
  });

  // Extract discussion number from GitHub Discussion URL
  eleventyConfig.addFilter('discussionNumber', (url) => {
    if (!url) return null;
    const match = url.match(/\/discussions\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  });

  // Get all posts sorted by date
  eleventyConfig.addCollection('allPosts', function(collectionApi) {
    const posts = [];

    if (siteConfig.postTypes.article.enabled) {
      posts.push(...collectionApi.getFilteredByGlob('./_articles/*.md'));
    }
    if (siteConfig.postTypes.note.enabled) {
      posts.push(...collectionApi.getFilteredByGlob('./_notes/*.md'));
    }
    if (siteConfig.postTypes.response?.enabled) {
      posts.push(...collectionApi.getFilteredByGlob('./_responses/*.md'));
    }
    if (siteConfig.postTypes.bookmark?.enabled) {
      posts.push(...collectionApi.getFilteredByGlob('./_bookmarks/*.md'));
    }
    if (siteConfig.postTypes.media?.enabled) {
      posts.push(...collectionApi.getFilteredByGlob('./_media/*.md'));
    }
    if (siteConfig.postTypes.review?.enabled) {
      posts.push(...collectionApi.getFilteredByGlob('./_reviews/*.md'));
    }

    return posts.sort((a, b) => b.date - a.date);
  });

  // Create collections for each post type
  if (siteConfig.postTypes.article.enabled) {
    eleventyConfig.addCollection('articles', function(collectionApi) {
      return collectionApi.getFilteredByGlob('./_articles/*.md').sort((a, b) => b.date - a.date);
    });
  }

  if (siteConfig.postTypes.note.enabled) {
    eleventyConfig.addCollection('notes', function(collectionApi) {
      return collectionApi.getFilteredByGlob('./_notes/*.md').sort((a, b) => b.date - a.date);
    });
  }

  if (siteConfig.postTypes.response?.enabled) {
    eleventyConfig.addCollection('responses', function(collectionApi) {
      return collectionApi.getFilteredByGlob('./_responses/*.md').sort((a, b) => b.date - a.date);
    });
  }

  if (siteConfig.postTypes.bookmark?.enabled) {
    eleventyConfig.addCollection('bookmarks', function(collectionApi) {
      return collectionApi.getFilteredByGlob('./_bookmarks/*.md').sort((a, b) => b.date - a.date);
    });
  }

  if (siteConfig.postTypes.media?.enabled) {
    eleventyConfig.addCollection('media', function(collectionApi) {
      return collectionApi.getFilteredByGlob('./_media/*.md').sort((a, b) => b.date - a.date);
    });
  }

  if (siteConfig.postTypes.review?.enabled) {
    eleventyConfig.addCollection('reviews', function(collectionApi) {
      return collectionApi.getFilteredByGlob('./_reviews/*.md').sort((a, b) => b.date - a.date);
    });
  }

  // Pass through static assets
  eleventyConfig.addPassthroughCopy('styles');
  eleventyConfig.addPassthroughCopy('assets');

  // Watch for changes
  eleventyConfig.addWatchTarget('./styles/');

  return {
    dir: {
      input: '.',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    },
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    pathPrefix: '/TestGHCMS/'
  };
};
