const React = require('react');

export default ({items}) => {

    return (
      <div className="gridBlock">
        {
          items.map((sl, key) =>
            <div className="blockElement fourByGridBlock" key={key}>
              <div className="blockContent">
                {sl}
              </div>
            </div>
          )
        }
      </div>
    )
  }