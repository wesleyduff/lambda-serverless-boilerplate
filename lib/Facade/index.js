import { SearchService } from '../Services'

class Facade {

    constructor(){

    }

    init(){
        console.log("--- Init from facade")
    }
}

export default new Facade(); //Only need one