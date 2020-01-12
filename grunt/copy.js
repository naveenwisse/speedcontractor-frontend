module.exports = {
    images: {
        expand: true,
        src: [
            'app/img/**/*'
        ],
        dest: 'dist/i/',
        flatten: true,
        filter: 'isFile'
    },
    ngMaterial: {
        src: 'app/lib/angular-material/angular-material.min.css',
        dest: 'dist/angular-material.min.css'
    }
};
