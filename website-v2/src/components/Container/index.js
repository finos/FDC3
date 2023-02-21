const React = require('react');

export default (props) => {
    return (
        <main>
            <div class="container padding-top--md padding-bottom--lg">
                <div class="docMainWrapper wrapper">
                    {props.children}
                </div>
            </div>
        </main>)
}