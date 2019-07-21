import lodash from 'lodash';
import path from 'path';

// let config = {
//     'ViewDir': path.join(__dirname, '../..', 'web', 'views'),
//     'AssetsDir': path.join(__dirname, '../..', 'web', 'assets')
// };
let config = {};

if (process.env.NODE_ENV == "dev") {
    config = {
        'ViewDir': path.join(__dirname, 'web'),
        'AssetsDir': path.join(__dirname, 'web')
    }
    const localconfig = {
        port: 8081
    }
    config = lodash.extend(config, localconfig);
}

if (process.env.NODE_ENV == "prod") {
    config = {
        'ViewDir': path.join(__dirname, 'web'),
        'AssetsDir': path.join(__dirname, 'web')
    };
    const prodConfig = {
        port: 8082
    }
    config = lodash.extend(config, prodConfig);
    console.log('kokoko----------', config);
}

export default config;