/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
import Layout from "@theme/Layout";

import NewSplashTop from "../components/NewSplashTop";
import UseCases from "../components/UseCases";
import Benefits from "../components/Benefits";
import Parts from "../components/Parts";
import WhatIsIt from "../components/WhatIsIt";

import UserShowcase from "../components/UserShowcase";
import Conformance from "../components/Conformance";
import Training from "../components/Training"
import GetInvolved from "../components/GetInvolved"


export default () => {
	return (<Layout>
		<NewSplashTop />
		<WhatIsIt />
		<Benefits />
		<UseCases />
		<Parts />
		
		
		<UserShowcase />
		<Conformance />
		<Training />
		
		<GetInvolved />

	</Layout>)
}
