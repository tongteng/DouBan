$('.inp-btn input').on('click', function(e) {
	function getdata(nowcount){
		$('#info-wrapper').html('');
		$('#items').html('');
		$.ajax({
			url: 'http://api.douban.com/v2/movie/search',
			type: 'GET',
			data: {
				q: $('.inp input').val(),
				start: nowcount * 10,
				count: 10
			},
			async: false,
			crossDomain: true,
			dataType: 'jsonp',
			success: function(data) {
				function createPage(json) {
					var id = json.id;
					var $Div = $('#' + id);
					var nowNum = json.nowNum;
					var allNum = json.allNum;
					if(allNum > 1){
						//首页
						if(nowNum > 3) {
							$('<a></a>').attr('href', '#' + 1)
										.html('首页')
										.addClass('edgepage')
										.appendTo($Div);
						}

						//上一页
						if(nowNum !== 1) {
							$('<a></a>').attr('href', '#' + (nowNum - 1))
										.html('上一页')
										.addClass('changepage')
										.appendTo($Div);
						}


						if(allNum <= 5) {
							for(var i = 1; i <= allNum; i ++) {
								if(i === nowNum) {
									$('<a></a>').attr('href', '#' + i)
											.html(i)
											.addClass('nowpage')
											.appendTo($Div);
								}else{
									$('<a></a>').attr('href', '#' + i)
											.html(i)
											.appendTo($Div);
								}
							}
						}else {
							if(nowNum < 3) {
								for(var i = 1; i <= 5; i ++) {
									if(i === nowNum) {
										$('<a></a>').attr('href', '#' + i)
												.html(i)
												.addClass('nowpage')
												.appendTo($Div);
									}else {
										$('<a></a>').attr('href', '#' + i)
												.html(i)
												.appendTo($Div);
									}
								}
							}else if(allNum - nowNum < 2) {
								for(var i = 1; i <= 5; i ++) {
									if(allNum - 5 + i === nowNum) {
										$('<a></a>').attr('href', '#' + (allNum - 5 + i))
												.html(allNum - 5 + i)
												.addClass('nowpage')
												.appendTo($Div);
									}else {
										$('<a></a>').attr('href', '#' + (allNum - 5 + i))
												.html(allNum - 5 + i)
												.appendTo($Div);
									}
								}
							}else {
								for(var i = 1; i <= 5; i ++) {
									if(i === 3) {
										$('<a></a>').attr('href', '#' + (nowNum - 3 + i))
												.html(nowNum - 3 + i)
												.addClass('nowpage')
												.appendTo($Div);
									}else{
										$('<a></a>').attr('href', '#' + (nowNum - 3 + i))
												.html(nowNum - 3 + i)
												.appendTo($Div);
									}
								}
							}
						}

						//下一页
						if(nowNum !== allNum) {
							$('<a></a>').attr('href', '#' + (nowNum + 1))
										.html('下一页')
										.addClass('changepage')
										.appendTo($Div);
						}

						//尾页
						if(nowNum <= (allNum - 3)) {
							$('<a></a>').attr('href', '#' + allNum)
										.html('尾页')
										.addClass('changepage')
										.appendTo($Div);
						}
					}

						var len  = $('a').length;
						for(var i = 0; i < len; i ++) {
							$('a').eq(i)
								  .on('click', function() {
								  	var nowNum = parseInt($(this).attr('href').substring(1));
								  	// obj.nowNum = nowNum;
								  	$('#' + id).html('');
								  	getdata( nowNum - 1 );
								  })
						}
						json.callBack(nowNum, allNum);
				}

				var obj = {
					id: 'items',
					nowNum: nowcount + 1,
					allNum: Math.ceil(data['total'] / 10),
					callBack: function(now, all) {
						if($('#info-wrapper').children()){
							$('#info-wrapper').children().remove();
						}
						var num = now * 10 <= data['total'] ? 10 : data['total'] % 10;
						for(var i = 0; i < num; i ++) {
							(function(i){

							//分割线
							$('<p>').css({'line-height':'100%','border-bottom':'1px dashed #dddddd','clear':'both'})
									.appendTo($('#info-wrapper'));

							//外包装
							$('<div>').addClass('info-wrapper-items' + i)
									  .appendTo($('#info-wrapper'));

							//剧照		  
							$('<img>').attr('src',data['subjects'][i]['images']['small'])
									  .css({'float':'left','margin':'20px 20px'})
									  .appendTo($('.info-wrapper-items' + i));

							//源标题
							$('<a>').html(data['subjects'][i]['title'] + '/' + data['subjects'][i]['original_title'])
									.appendTo($('.info-wrapper-items' + i))
									.css({'float':'left','width':'800px','margin-top':'20px','color':'#666699','white-space':'normal'});
							
							//年份+演员
							var castslen = data['subjects'][i]['casts'].length;
							var castsul = "";
							for(var j = 0; j < castslen; j++) {
								castsul += data['subjects'][i]['casts'][j]['name'];
								if(j != castslen - 1){
									castsul += '/';
								}
							}
							$('<div>').html(data['subjects'][i]['year'] + '/' + castsul)
									  .appendTo($('.info-wrapper-items' + i))
									  .css({'float':'left','width':'800px','margin-top':'5px','white-space':'normal','font-size':'12px'});

							//导演
							data['subjects'][i]['directors'][0] && $('<div>').html('导演:  ' + data['subjects'][i]['directors'][0]['name'])
									  .appendTo($('.info-wrapper-items' + i))
									  .css({'float':'left','width':'800px','margin-top':'5px','white-space':'normal','font-size':'12px'});


							//剧情
							var genreslen = data['subjects'][i]['genres'].length;
							var genresul = "";
							for(var q = 0; q < genreslen; q++) {
								genresul += data['subjects'][i]['genres'][q];
								if(q != genreslen - 1) {
									genresul += '/';
								}
							}		  

							$('<div>').html(genresul)
									  .appendTo($('.info-wrapper-items' + i))
									  .css({'float':'left','width':'800px','margin-top':'5px','white-space':'normal','font-size':'12px'})


							//星级
							var starcount = data['subjects'][i]['rating']['stars'];
							var staraverage = data['subjects'][i]['rating']['average'].toFixed(1);
							$('<div>').addClass('star' + i)
									  .css({'float':'left','margin-top':'10px'})
									  .appendTo($('.info-wrapper-items' + i));
							$('<span>').css({'display':'inline-block','width':'60px','height':'11px','background':'url(style/images/star.png) 0 ' + ( -(10 - starcount / 5) ) * 11 + 'px no-repeat'})
									   .appendTo($('.star' + i));
							$('<span>').html(staraverage)
									   .css({'font-size':'11px','color':'#e09015'})
									   .appendTo($('.star' + i));

							}(i))
						}
						$('<p>').css({'line-height':'100%','border-bottom':'1px dashed #dddddd','clear':'both'})
								.appendTo($('#info-wrapper'));

					}
				}
				createPage(obj);
			}
		})
		e.preventDefault();
	}
	getdata(0);
})

