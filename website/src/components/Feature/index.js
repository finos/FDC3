const React = require('react');

export default (props) => {
    return (<div  className="featureShowcaseSection padding-top--lg padding-bottom--lg" style={{textAlign: 'center'}}>
        {props.children}
    </div>)
}