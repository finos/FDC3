const React = require('react');

export default ({items}) => {

    return (
      <div className="gridBlock">
        {
          items.map(sl =>
            <div className="blockElement fourByGridBlock">
              <div className="blockContent">
                {sl}
              </div>
            </div>
          )
        }
      </div>
    )
  }