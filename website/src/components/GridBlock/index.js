const React = require('react');

export default ({items}) => {

    return (
      <div class="gridBlock">
        {
          items.map(sl =>
            <div class="blockElement fourByGridBlock">
              <div class="blockContent">
                {sl}
              </div>
            </div>
          )
        }
      </div>
    )
  }