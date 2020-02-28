let config = null;
console.log(`DEBUGGING ---> PROCESS for Config : ENVIRONMENT : ${process.env.ENVIRONMENT} : NODE_EVN : ${process.env.NODE_ENV}`)
switch (process.env.ENVIRONMENT || 'test') {
    case 'local': {
        const local = require('./local.js')
        config = local;
        break;
    }
    case 'start':
    case'test': {
        const start = require('./start.js').default
        config = start;
        break;
    }
    case 'dev': {
        const dev = require('./dev.js').default
        config = dev;
        break;
    }
    case 'engprod': {
        const engprod = require('./engprod.js')
        config = engprod;
        break;
    }
    case 'qa': {
        const qa = require('./qa.js')
        config = qa;
        break;
    }
    case 'uat': {
        const uat = require('./uat.js')
        config = uat;
        break;
    }
    case 'stage': {
        const stage = require('./stage.js')
        config = stage;
        break;
    }
    default: {
        throw new Error(`Environment provided does not match : env = ${process.env.ENVIRONMENT}`);
    }
}

export default config;
