const React = require('react');
import Layout from "@theme/Layout";
import styles from "./community.styles.css"
import Container from "../components/Container"
import implData from "../../data/training.json";


export default ({items}) => {

function Implementation({ type, title, publisher, image, infoLink, docsLink, badges, conformance, description }) {
	return <div key={title + type} className={"implementation " + type}>
		<div className="implementation-metadata">
			<div className="title-and-publisher">
				<div className="title">{infoLink ? <a href={infoLink} key={infoLink}>{title}</a> : { title }}</div>
				{publisher ? <div className="publisher">{publisher}</div> : null}
			</div>
		</div>
		<div className="implementation-details padding-top--sm padding-bottom--md">
			<div className="implementation-image">
				<img src={image} alt={title} title={title} />
			</div>
			<div className="description">
				<div className="infoLinks">
					{infoLink ? <a href={infoLink} className="button">More info</a> : null}
				</div>
				<div className="prose" dangerouslySetInnerHTML={{ __html: description }}></div>
			</div>
		</div>
	</div>
}


    return <Layout>
		<Container>
			<h1>FDC3 Training</h1>
			<div className="prose">
				<p>
					In 2023 FINOS, the FDC3 Community and the Linux Foundation worked to update 
					the training and certification offerings.  The below list contains both free and paid
					trainings and professional certification for FDC3 practition
				</p>
				<p>
					Reach out to <a href="mailto:help@finos.org">FINOS</a> for enquiries around bulk discounts and membership.
				</p>
			</div>
			<div className="implementations">
				{implData.map(impl => (
					<Implementation key={impl.title} {...impl} />
				))}
		</div>
		</Container>
	</Layout>
  }