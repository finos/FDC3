const React = require('react');

export default (props) => {
    return (<div  className="featureShowcaseSection  paddingBottom" style={{textAlign: 'center'}}>
        {props.children}
    </div>)
}