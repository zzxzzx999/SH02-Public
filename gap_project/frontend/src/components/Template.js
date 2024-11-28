import React from 'react';
import '../css/Template.css';

function Template({children}){
    return(
        /*background video and overlay*/
        <div className="template-container"> 
            <div className="video-container">
                <video autoPlay muted loop className="background-video" src='/background-video.mp4' type="video/mp4" />
            </div>
        <div className="overlay"></div>
        
        {/* Pass the content from specific pages */}
        {children}
      </div>
    );

}

export default Template;

/*Example page:
import Template from './Template';
return(
    <Template>
        <div classname="xxx">
        </div>
    </Template>
)
*/