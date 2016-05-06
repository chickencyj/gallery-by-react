require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//只执行一次的函数，利用自执行函数，将图片名信息转成图片路径信息
imageDatas = (function genImageURL(imageDatasArr)
{
	// imageDatasArr.forEach(function(value,index){
	// 	value.imageURL = require('../images'+value.fileName);
	// })
	for (var i = 0; i < imageDatasArr.length; i++) 
	{
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	};
	return imageDatasArr;
})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
      // <div className="index">
      //   <img src={yeomanImage} alt="Yeoman Generator" />
      //   <span>Hello React</span>
      //   <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      // </div>
      <section className="stage">
      	<section className="img-sec">
      	</section>
      	<nav className="controller-nav">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
