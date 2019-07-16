/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

/*
* Intent schema
*/

interface Intent {
    /*
    * The name of the intent, default nameing convention is UpperCamelCase
    */
    name:string;  
    /*
    * An optional display name for the intent, "name" will be used if left empty
    */
    displayName? : string;
    /*
    * A list of the contexts the intent accepts. This will typically be a set of namespaced context types, e.g. "org.symphony.contact"
    */
    contexts?: string[]
    /*
    * Custom configuration for the intent that may be required for a particular desktop agent.
    */
    customConfig?: Object; 
}

/*
* Application schema, to be used in the AppDirectory for apps declaring supported intents
* The full application definiton will be extended with properties defined in the AppDirectory WG
*/
interface Application {
    /* 
    * List of the intents the application supports
    */
    intents:Intent[]; 
}