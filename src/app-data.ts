/*
** This is a configuration file place holder that creates app-data.js after it is
** compiled. The contents of bin/app-data.js will be modified by the CD Deployment Pipeline as
** Release Candidates make their way through the different stages of the CD Deployment
** Pipeline. bin/app-data.js can also be modified in testing environments. However, appData.version
** should NEVER be changed by hand.
*/
export const appData = {
    /*
    ** !!! NEVER !!! modify version by hand in either bin/app-data.js OR src/app-data.ts.
    ** You may and should update the major and minor in the version number in the
    ** project's package.json file. The patch (last number in a version Major.Minor.Patch)
    ** is controlled by the CD Pipeline to indicate build number and other information.
    */
    version: "x.x.x",

    /*
    ** Start Money
    ** 
    ** It is OK to modify these values for testing purposes in bin/app-data.js.
    ** Please DO NOT modify these default values directly in src/app-data.ts
    */
    numberOfQuarters: 10,
    numberOfDimes: 10,
    numberOfNickels: 20
}
