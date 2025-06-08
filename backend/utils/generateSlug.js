const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9ğüöçşəı]+/gi, '-')
        .replace(/^-+|-+$/g, '');
};
export default generateSlug;