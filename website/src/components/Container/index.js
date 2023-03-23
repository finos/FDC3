const React = require('react');

export default (props) => {
    return (
        <main>
            <div className="container padding-top--md padding-bottom--lg">
                <div className="docMainWrapper wrapper">
                    {props.children}
                </div>
            </div>
        </main>)
}