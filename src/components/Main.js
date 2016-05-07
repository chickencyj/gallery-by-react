require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');
//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

//只执行一次的函数，利用自执行函数，将图片名信息转成图片路径信息
imageDatas = (function genImageURL(imageDatasArr)
{
	// imageDatasArr.forEach(function(value,index){
	// 	value.imageURL = require('../images'+value.fileName);
	// })
	for (var i = 0;i < imageDatasArr.length;i++)
	{
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//获取取值范围的随机值
function getRangeRandom(low,high)
{
	return Math.floor(Math.random()*(high- low) + low);
}
//获取0到30任意正负值
function getRotateRange()
{
	return Math.floor((0.5-Math.random())*60);
}



var ImgFigure = React.createClass({

	//点击旋转函数
	handleClick:function(e)
	{
		if (this.props.arrange.isCenter)
			{
				this.props.inverse();
			}
			else
			{
				this.props.center();
			}
		
		e.stopPropagation();
		e.preventDefault();
	},

	render:function(){
		var styleObj = {};

		if(this.props.arrange.pos)
		{
			styleObj = this.props.arrange.pos;
		}

		if(this.props.arrange.rotate)
		{
			(['-moz-','-ms-','-webkit-','']).forEach(function(value){
				styleObj[value+'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
		
		}
		if (this.props.arrange.isCenter)
			{
				styleObj.zIndex = 11;
			}

		var imgFigureClassName= 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';

		return(
			<figure className={imgFigureClassName} style={styleObj}
				onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
					alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">
						{this.props.data.title}
					</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
});

//管理者模式
var GalleryByReactApp = React.createClass ({
	Constant:{
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{
			x:[0,0],
			topY:[0,0]
		}
	},
	//通过闭包变量来缓存当前被执行inverse操作的图片、在图片信息数组中对应的index值
	inverse:function(index){
		return function()
		{
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
		}.bind(this);
	},

	/*
	 *重新布局所有图片
	 *@param centerIndex  指定居中排布哪些图片
	 *
	*/

	rearrange:function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX =  hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			//生成上侧图片的个数
			topImgNum= Math.floor(Math.random()*2),
			//定义一个变量来标记上层图片在数组中的位置
			topImgSpliceIndex = 0,

			//获取中心图，并从原数组中删除
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

			//居中中心图,居中图不需要旋转
			imgsArrangeCenterArr[0] = {
				pos:centerPos,
				rotate : 0,
				isCenter:true
			};
			

			//取出上侧图片的状态信息
			topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			//布局位于上侧的图
			imgsArrangeTopArr.forEach(function(value,index){
				imgsArrangeTopArr[index] = {
					pos :{
						left:getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
						top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
					},
					rotate:getRotateRange(),
					isCenter:false
				};
			});

			//布局左右两侧的图片
			for (var i = 0; i < imgsArrangeArr.length; i++) {
				var hPosRangeLOR = null;

				//处理图片在左侧还是右侧
				if(i < imgsArrangeArr.length/2)
				{
					hPosRangeLOR = hPosRangeLeftSecX;
					
				}
				else
				{
					hPosRangeLOR = hPosRangeRightSecX;
					
				}
				imgsArrangeArr[i] = {
					pos:{
						left:getRangeRandom(hPosRangeLOR[0],hPosRangeLOR[1]),
						top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
					},
					rotate:getRotateRange(),
					isCenter:false
				};
			}



				//将之前取出来的上侧以及中心图重新插入到原数组
				if (imgsArrangeTopArr.length)
					{
						imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
					}

				imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
				//改变状态值重新渲染
				this.setState(
				{
					imgsArrangeArr:imgsArrangeArr
				});
	},


	center:function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},

	getInitialState:function(){
		return{
			imgsArrangeArr:[
				/*{
					pos:{
						left:"0",
						top:"0"
					},
					rotate:0, 旋转角度
					isInverse:false,
					isCenter:false
				}*/

			]
		}
	},

	//组件加载以后，为每张图片计算位置的范围
	componentDidMount:function()
	{
		//获取stage的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.floor(stageW/2),
			halfStageH = Math.floor(stageH/2);


		//获取imageFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
		imgW = imgFigureDOM.scrollWidth,
		imgH = imgFigureDOM.scrollHeight,
		halfImgW = Math.floor(imgW/2),
		halfImgH = Math.floor(imgH/2);
		//居中图片的位置
		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		}
		//计算左侧和右侧区域取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//计算上侧区域取值范围
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.Constant.vPosRange.topY[0] =  -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;

		this.rearrange(0);
	},


  	render:function(){
	  	var controllerUnits = [],
	  		imgFigures = [];

	  	imageDatas.forEach(function(value,index){
	  		if (!this.state.imgsArrangeArr[index])
	  			{
	  				this.state.imgsArrangeArr[index] = {
	  					pos:{
	  						left:0,
	  						top:0
	  					},
	  					rotate:0,
	  					isInverse:false,  //图片正反面
	  					isCenter:false
	  				};
	  			}

	  		imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index}
	  			arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
	  			center={this.center(index)}/>);
	  	}.bind(this));

	    return (
	      <section className="stage" ref="stage">
	      	<section className="img-sec">
	      		{imgFigures}
	      	</section>
	      	<nav className="controller-nav">
	      		{controllerUnits}
	      	</nav>
	      </section>
	    );
	}
});




module.exports = GalleryByReactApp;
