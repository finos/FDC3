/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

/**
 * App definition as provided by the application directory
 */
interface AppMetadata {

    /** The unique app name that can be used with the open and raiseIntent calls. */
    name: string;
  
    /** A more user-friendly application title that can be used to render UI elements  */
    title?: string;
  
    /**  A tooltip for the application that can be used to render UI elements */
    tooltip?: string;
  
    /** A longer, multi-paragraph description for the application that could include markup */
    description?: string;
  
    /** A list of icon URLs for the application that can be used to render UI elements */
    icons?: Array<string>;
  
    /** A list of image URLs for the application that can be used to render UI elements */
    images?: Array<string>;
}  