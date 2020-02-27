import "@babel/polyfill"
import Facade from '../../lib/Facade';
import { LambdaChainService } from "../../lib/Services";

describe('Testing lambda chain service ---> ', () => {
    it('should parse JSON data and return', function () {

        LambdaChainService.chain('fakeLambda');


    });
})