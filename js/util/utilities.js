/*Utilities
This class is a place where you can put global utility functions that all classes can use
I moved the getFileContents class here and added a nifty caching mechanism (not required)
*/

export default class Utilities{

    constructor()
    {
       this.files={}
    }
    async getFileContents(url){
        if (!(url in this.files)){
            this.files[url]=await $.get(url);
        }
       
        return this.files[url]
        
     }
}