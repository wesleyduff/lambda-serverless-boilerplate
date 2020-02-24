import aws from 'aws-sdk';
import { errors } from '../../../Pacakges';


export default new class {
    constructor(){

    }

    invoke(lambdaName){
        const lambda = new aws.Lambda(),
                opts = {
                    FunctionName: lambdaName
                };

        console.log('--- Lambda name called OPTS', opts)
        return new Promise((resolve, reject) => {
            lambda.invoke(opts, (error, data) => {
                if (error)
                    return reject(`ERROR : ALERT : Could not invoke lambda : name = ${opts.FunctionName}`)
                return resolve(data)
            });
        });
    }

    async chain(lambdaName){
        try{
            console.log('--- Lambda name called', lambdaName)
            return await this.invoke(lambdaName)
        }catch(exception){
            throw new errors.LambdaInvokeError(`ERROR : ALERT : Could not invoke lambda : name = ${lambdaName}`, `LambdaChainService -> chain`);
        }
    }
}