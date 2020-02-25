import { errors } from '../../Pacakges';

export default class Repository {

    constructor(){
        console.log('--- intializting')
    }

    init(){
        console.log(`---- INFO ---- CREATING Repository Instance -- Setting up Mongo Connection`);
    }

    getStateNode(state){
        console.log(`---- INFO --- GEt state node from DB`)
        throw new errors.NotYetImplementedError(`WARNING : Not Yet Implemented`, 'Repository -> getStateNode');
    }
}
