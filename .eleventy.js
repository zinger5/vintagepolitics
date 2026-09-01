module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy your image folder
  eleventyConfig.addPassthroughCopy("uploads");

  // Create a smart, grouped collection for the episodes
  eleventyConfig.addCollection("episodesBySeason", function(collectionApi) {
    // 1. Get all episodes and sort them newest to oldest
    let episodes = collectionApi.getFilteredByTag("episode").sort((a, b) => b.date - a.date);

    let seasonsMap = new Map();

    // 2. Group them by their 'season_info' tag
    episodes.forEach(ep => {
      let season = (ep.data.season_info || "Other").split(',')[0].trim();
      if (!seasonsMap.has(season)) {
        seasonsMap.set(season, {
          title: season,
          episodes: [],
          newestDate: ep.date // Because we sorted newest first, this grabs the freshest date
        });
      }
      seasonsMap.get(season).episodes.push(ep);
    });

    // 3. Convert to an array and sort the groups themselves so the newest group is at the top
    let seasonsArray = Array.from(seasonsMap.values());
    seasonsArray.sort((a, b) => b.newestDate - a.newestDate);

    return seasonsArray;
  });

  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};