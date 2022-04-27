const React = require('react');
const PropTypes = require('prop-types');

const implementations = require(`${process.cwd()}/data/implementations.json`);
implementations.sort((a, b) => {
  const titleA = a.title.toUpperCase(); // ignore upper and lowercase
  const titleB = b.title.toUpperCase(); // ignore upper and lowercase
  if (titleA < titleB) {
    return -1;
  } else if (titleA > titleB) {
    return 1;
  } else {
    return 0;
  }
});


const Implementation = ({ type, title, publisher, image, infoLink, docsLink, description }) => (
  <div className={"implementation " + type}>
    <div className="title">{title}</div>
    {publisher ? <div className="publisher">{publisher}</div> : null}
    <div className="implementation-details">
      <img src={image} alt={title} title={title} />
      <div className="description">
        <div className="infoLinks">
          {infoLink ? <a href={infoLink} key={infoLink}>More info</a> : null}
          {infoLink && docsLink ? <span> | </span> : null}
          {docsLink ? <a href={docsLink} key={docsLink}>Documentation</a> : null}
        </div>
        {description}
      </div>
    </div>
    
  </div>
);

Implementation.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  infoLink: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const ImplementationsShowcase = () => (
  <div className="Implementations">
    {implementations.map(impl => (
      <Implementation key={impl.infoLink} {...impl} />
    ))}
  </div>
);

// ImplementationsShowcase.propTypes = {
//   users: PropTypes.array.isRequired,
// };

module.exports = ImplementationsShowcase;