import { errors } from '../../Pacakges';
import {MongoConnectService} from "../../lib/Services"
import utils from "util";
import moment from 'moment';

export default class Repository {

    constructor(){
        console.log('--- intializting Repository');
        this.dbService = MongoConnectService;
    }

    /**
     * Add a state node to the regionPath collection
     * @param node
     * @return {Promise<any>}
     */
    getCalendarEvents(calendarEvent, options = { upsert: true, returnOriginal: false}){
        return new Promise((resolve, reject) => {
            resolve({
                date: moment().toISOString(),
                title: 'Demoing the power of serverless',
                body: 'Serverless Framework allows you to deploy microservices based on serverless function technology quick and painless.',
            })
        });
    }




}
