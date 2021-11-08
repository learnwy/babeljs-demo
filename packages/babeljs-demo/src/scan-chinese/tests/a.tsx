import React, { FC } from "react";
const a = "1;";

const A: FC = () => {
	return (
		<div about="你好" title={`这是一个${a}`}>
			<a>this is 中文</a>
		</div>
	);
};

export { A };
