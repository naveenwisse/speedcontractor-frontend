module.exports = {
    options: {
        // PNG
        optimizationLevel: 6,
        // JPG
        progressive: true,
        // GIF
        interlaced: true
    },
    dist: {
        files: [{
            expand: true,
            cwd: 'dist/i/',
            src: ['**/*.{png,jpg,gif,jpeg,svg}'],
            dest: 'dist/i/'
        }]
    }
};
