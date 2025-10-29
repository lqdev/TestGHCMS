module.exports = {
  layout: 'note',
  eleventyComputed: {
    permalink: data => {
      const date = data.page.date;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `/notes/${year}/${month}/${day}/${data.page.fileSlug}/`;
    }
  }
};
