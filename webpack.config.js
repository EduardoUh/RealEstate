import path from 'path';


export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        addPicture: './src/js/addPicture.js',
        showMap: './src/js/showMap.js',
        homeMap: './src/js/homeMap.js',
        updateState: './src/js/updateState.js',
        editInfo: './src/js/editInfo.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}