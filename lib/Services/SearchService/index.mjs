import { CONSTANTS, errors } from "../../../Pacakges";

class Node {

    constructor(stateNode){
        this.consumer = stateNode;
        const   tree_enum_keys       = Object.keys(CONSTANTS.TREE_ENUM),
                consumer_enum_keys      = Object.keys(CONSTANTS.CONSUMER_ENUM);

        for(let i = 0; i < consumer_enum_keys.length; i++){
            this[tree_enum_keys[i]] = stateNode[`${consumer_enum_keys[i].toLowerCase()}Collection`]
        }
    }
}

class Checker {
    /**
     * Returns state
     * @param zipCode
     * @returns one of [CO, TX, CA, OH ...]
     */
    static whatStateIsZipCodeIn(zipCode){
        //todo:// find state of zip code
        return 'CO';
    }

    static checkMarketForZip(zipCode){
        //todo:// check array if zipCode is in the market array
    }

    static checkNeighborhoodForZip(zipCode){
        //todo:// check array if zipCode is in the neighborhood array
    }

    static checkForLanguages(node){
        for(let i in CONSTANTS.SUPPORTED_LANGUAGES_ENUM){

        }
    }
}

class Tree {

    constructor(nationalCollection){
        //root of binary search tree
        this.root = null;
        this.currentDirectionItteration = 0;
        this.listOfLanguages = Object.assign({}, CONSTANTS.SUPPORTED_LANGUAGES_ENUM);
        this.builder = {ravenMetaData: {}, paths: []};
        this.nationalCollection = nationalCollection;
    }

    /* Private Methods */
    _pushPathToBuilder(data){
        this.builder.paths.push({
            "language":data.language,
            "consumer":data.consumer,
            "level":data.level,
            "displayName":data.displayName,
            "path": data.path
        });
    }

    _getConsumer(language){
        return language.slice(language.lastIndexOf('_') + 1)
    }


    insert(state_node){

        let newNode = new Node(state_node);

        this.root = newNode;

        //TODO:// get LAT LONG if ZipCode Supplied
        //TODO:// get ZipCode if Lat Long Supplied
        //get state ... this is the root node
        this.builder.ravenMetaData.latitude = 'xx';
        this.builder.ravenMetaData.longitude = 'xx';
        this.builder.ravenMetaData.state = this.root.consumer.state;
    }

    searchTree(zipCode){
        //check NODE for Neighborhood
            //isZipCode in neighborhood node
        this.builder.ravenMetaData.zipCode = zipCode;

        const   currentLevel        = this.root[CONSTANTS.TREE_ENUM[Object.keys(CONSTANTS.TREE_ENUM)[this.currentDirectionItteration]]],
                currentCollection   = currentLevel.collections;


        //If the current collection does not have a property called collections
        if(!currentCollection){
            const keys = Object.keys(this.listOfLanguages);
            if(keys.length){
                //we have left over keys that were not found
                for(let language in this.listOfLanguages){

                    //update the language collection to let the app know what is left
                    delete this.listOfLanguages[language];
                    this._pushPathToBuilder({
                        language: language,
                        consumer:this._getConsumer(language),
                        level:currentLevel.level,
                        displayName:currentLevel.level[0] + currentLevel.level.substr(1).toLowerCase(), //Capitalize first letter rest are lowercase
                        path: currentLevel.paths[language] || null
                    })
                }
            }

            return this.builder;
        }
        //is the zip code inside the current collection?
        let node = currentCollection.find(
            item => {
                return item.zipCodes.includes(zipCode)
            });

        //zip code is not found in current collection
        if(!node) {
            //move onto the next one
            // this.currentDirection = CONSTANTS.TREE_ENUM[Object.keys(CONSTANTS.TREE_ENUM)[this.currentDirection++]];
            // console.log('test');
            this.currentDirectionItteration++;
            this.searchTree(zipCode);

        }
        /**
         * Loop over all supported languages
         * - if the language is found add it to the foundLanguagesCollection
         */
        for(let i in this.listOfLanguages){

            const currentLanguage = CONSTANTS.SUPPORTED_LANGUAGES_ENUM[i];

            if(node.languages.includes(currentLanguage)){
                try{
                    this._pushPathToBuilder({
                        language: currentLanguage,
                        consumer:this._getConsumer(currentLanguage),
                        level:currentLevel.level,
                        displayName:node.displayName,
                        path: node.paths[currentLanguage]
                    })

                    //update the language collection to let the app know what is left
                    delete this.listOfLanguages[currentLanguage]
                } catch(exception){
                    throw new errors.BadDataError(`ERROR : ALERT : The support language ${currentLanguage} with state : ${node.state} : inside collection ${node.name} : does not have a matching path for the language that is set. This cannot happen and is bad data.`, `SearchService -> SearchTree -> search`)
                }

            }
        }

        if(Object.keys(this.listOfLanguages).length){
            //we have more languages to find
            //if there are more languages to get, call the app with the next itteration till all itterations are exhausted.
            this.currentDirectionItteration++;

            this.searchTree(zipCode)
        }



        return this.builder;




/*


        } else {
            if(this.currentDirection === CONSTANTS.TREE_ENUM.LEFT){
                this.searchTree(zipCode, CONSTANTS.TREE_ENUM.MIDDLE);
            } else if(this.currentDirection === CONSTANTS.TREE_ENUM.LEFT) {
                this.searchTree()
            }
        }


        let node = this.root[CONSTANTS.TREE_ENUM.LEFT].find(
                        item => {
                            return item.zipCodes.includes(zipCode)
                        });

            if(node){
                //check for all languages
                const languagesFound = Checker.checkForLanguages()
            } else {
                node = this.root[CONSTANTS.TREE_ENUM.MIDDLE].find(
                    item => {
                        return item.zipCodes.includes(zipCode)
                    })
                if(node){
                    const languagesFound = Checker.checkForLanguages()
                } else {
                    node = this.root[CONSTANTS.TREE_ENUM.RIGHT].find(
                        item => {
                            return item.zipCodes.includes(zipCode)
                        })
                    if(node) {
                        const languagesFound = Checker.checkForLanguages()
                    } else {
                        return null;
                    }
                }
            }
*/
    }

}

export default {
    Tree,
    Checker,
    Node
}