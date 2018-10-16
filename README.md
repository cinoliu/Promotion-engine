# 新零售诠释 #
- 新零售，即企业以互联网为依托，通过运用大数据、人工智能等先进技术手段，对商品的生产、流通与销售过程进行升级改造，进而重塑业态结构与生态圈，并对线上服务、线下体验以及现代物流进行深度融合的零售新模式。

# 三大特征 #
### 全面
>  客户购物的五大环节：搜寻、比较、下单、体验、分享。
> 新零售终端体验点满足一个消费者从接触一个品牌到最后购买的过程中五个关键环节，与客户全程零距离接触，建立购物信任度。
### 全线
>  全渠道时代消费者可以自由选择线上，线下或者移动方式购买或消费，不再受时间、地点、方式的限制。

### 全程
>  新零售终端体验点可以跟踪客户购物数据、在这个过程中与消费者及时互动、掌握消费者决策变化、给消费者个性化建议。提升购物体验。



# 系统架构 #

![](https://raw.githubusercontent.com/cinoliu/Promotion-engine/master/img/structure.png) 


# 销售模式 #
![](https://raw.githubusercontent.com/cinoliu/Promotion-engine/master/img/Sales.png) 


# 运营模式 #

![](https://raw.githubusercontent.com/cinoliu/Promotion-engine/master/img/Operation.png) 


# 扩展解决方案 #

### 扩展线上线下全渠道销售
> 从单一销售模式转型成全渠道销售模式，从单点布局、多点单独运营布局到全渠道融合，多样化的销售渠道，满足顾客的不同消费心理 

### 线上线下销售渠道相融合
> 让各销售渠道相融合，避免单选运营，实现优势互补，让线下丰富线上的体验、配送，让线上满足线下的展现、购物。 

### 供应链整合,资源共享
> 让新零售体验点终端减少成本投入、不增加或少增加成本，扩展多渠道、全渠道销售，从而降低成本，实现利润最大化。

### 会员统一管理,提升用户体验
> 全渠道销售的会员统一管理，让每一个会员可以在所有渠道享受同样的优惠，从而提高会员体验度、忠实度。




## 项目运行 ##
npm install  (安装依赖)

### 发布测试环境

npm run dev 

### 构建生成环境

npm run build 



## 技术栈

vue2 +  iview2 + vuex + vue-router + webpack + ES6/7 + less + axios +svg + echarts + js-cookie


## 开发前言 ##

- [x] 由于涉及大量的 ES6/7 等新属性，node 需要 8.0 以上版本

- [x] 封装ajax多种提交方式 

		```
			 ajaxGet(get)

			 this.func.ajaxGet(this.api.baseUrl + '/sysUser/getUserPage.do', res => {})
		```

		``` 
			ajaxPostfile(Request Payload)

			this.func.ajaxPost(this.api.baseUrl + '/sysUser/getUserPage.do', reqParams, res => {})

		```

		```
			ajaxPost(Form Data)

			this.func.ajaxPost(this.api.baseUrl + 'sysUser/getUserPage.do', this.qs.stringify(reqParams), res => {})

		```




- [x] 路由写在src/data/menu.json
   
- [x]  打包发布

	  ```
		  修改 build/webpack.prod.config.js的publicPath 路径为发布环境路径

		  执行npm run build 

		  发布包在dist目录下

	  ```














