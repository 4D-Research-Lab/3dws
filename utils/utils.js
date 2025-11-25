export function scrapeSvxFilenames(html) {
  const regex = /href="([^"]+\.svx\.json)"/g;
  let filenames = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    filenames.push(match[1]);
  }

  return filenames;
}

export function getArraySlice(data, index, size) {
  const startIndex = index * size;
  const endIndex = startIndex + size;
  return data.slice(startIndex, endIndex);
}

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

// Slugify a string
export function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, '');

  // Make the string lowercase
  str = str.toLowerCase();

  // Remove accents, swap ñ for n, etc
  var from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
  var to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  // Remove invalid chars
  str = str
    .replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');

  return str;
}
