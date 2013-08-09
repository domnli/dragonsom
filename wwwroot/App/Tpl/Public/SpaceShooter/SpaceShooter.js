//SpaceShooter打飞机
function SpaceShooter(am){
	document.oncontextmenu=function(){return false;};document.onselectstart=function(){return false;};
	var Res=[],bgRes=[0,1,2],
		imgSrcs=['http://ftp_dml.hzsx15.badudns.cc/App/Tpl/Public/SpaceShooter/png/Background/starBig.png',
				 'http://ftp_dml.hzsx15.badudns.cc/App/Tpl/Public/SpaceShooter/png/Background/starSmall.png',
				 'http://ftp_dml.hzsx15.badudns.cc/APP/Tpl/Public/SpaceShooter/png/Background/nebula.png',
				 'http://ftp_dml.hzsx15.badudns.cc/APP/Tpl/Public/SpaceShooter/png/laserRed.png'
				],
		playerSrcs=['http://ftp_dml.hzsx15.badudns.cc/App/Tpl/Public/SpaceShooter/png/playerLeft.png',
                  	'http://ftp_dml.hzsx15.badudns.cc/App/Tpl/Public/SpaceShooter/png/player.png',
                  	'http://ftp_dml.hzsx15.badudns.cc/App/Tpl/Public/SpaceShooter/png/playerRight.png'];
	am.setBGColor('#5e3f6b');
	var loadingText=new iio.Text('loading...',am.canvas.center)
								.setFont('50px Consolas')
								.setTextAlign('center')
								.setFillStyle('#721AF5');
								//.enableKinematics()
			                    //.setVel(0,2);
			                   //.setBound('bottom',am.canvas.height+140);
	am.addToGroup('loading',loadingText);
	//检查资源是否加载完成
	checkRes=function(){
		var flg=true;
		for(var i=0;i<Res.length;i++){
			if(undefined == Res[i].loaded || Res[i].error){
				flg=false;
			}
		}
		if(Res.length == 0){
			flg=false;
		}
		loadRes();
		return flg;
	};
	//加载资源
	loadRes=function(){
		for(var i=0;i<imgSrcs.length;i++){
			if(Res[i] == undefined || Res[i].error){
				Res[i]=new Image();
				Res[i].src=imgSrcs[i];
				Res[i].onload=function(){
					this.loaded=true;
				}
				Res[i].onerror=function(){
					this.error=true;
				}
			}
		}
	};
	var bgSpeed = 6;
  	var bgDensity = am.canvas.width/20;
	moveToTop = function(obj){
    	obj.setPos(iio.getRandomInt(10, am.canvas.width-10)
    	        	,iio.getRandomInt(-340, -100));
    	return true;
  	}
	init=function(){
		am.rmvFromGroup(loadingText,'loading');
		am.addGroup('lasers');
		am.addGroup('meteors');
		for(var i=0;i<bgRes.length;i++){
			for(var j=0;j<bgDensity;j++){
				if (iio.getRandomNum() < .4){
	                am.addToGroup('bgnebula'
	                   ,new iio.Rect(iio.getRandomInt(10, am.canvas.width-10)
	                                ,iio.getRandomInt(0, am.canvas.height))
	                                ,-10)
	                   .createWithImage(Res[bgRes[i]])
	                   .enableKinematics()
	                   .setVel(0,bgSpeed+iio.getRandomInt(0,10))
	                   .setBound('bottom'
	                            ,am.canvas.height+140
	                            ,moveToTop);
	            }
			}
		}

		var player = new iio.Rect(am.canvas.center.x,am.canvas.height-100)
                    	.createWithAnim(playerSrcs, 1)
                    	.enableKinematics()
                    	.setBounds();
		am.addToGroup('player',player,1);
		var playerSpeed=7;
		var LEFT = 0,RIGHT = 1,UP = 2,DOWN = 3,SPACE=4,MOUSECLICK=5,input = [];
		updateInput=function(event,bool){
			switch(event.keyCode){
				case 0:
					input[MOUSECLICK]=bool;
				break;
				case 37://left arrow
                case 65://a
                	input[LEFT]=bool;
                break;
                case 38://up arrow
                case 87://w
                	input[UP]=bool;
                break;
                case 39://right arrow
                case 68://d
                	input[RIGHT]=bool;
                break;
                case 40://down arrow
                case 83://s
                	input[DOWN]=bool;
                break;
                case 32:
                	input[SPACE]=bool;
                break
            }
		}
		updatePlayer=function(){
			if (input[LEFT] && !input[RIGHT] && player.pos.x - player.width/2 > 0)
		        player.translate(-playerSpeed,0); 
		 
		    if (input[RIGHT] && !input[LEFT] && player.pos.x + player.width/2 < am.canvas.width)
		        player.translate(playerSpeed,0); 
		 
		    if (input[UP] && !input[DOWN] && player.pos.y - player.height/2 > 0)
		        player.translate(0,-playerSpeed+1); 
		 
		    if (input[DOWN] && !input[UP] && player.pos.y + player.height/2 < am.canvas.height)
		        player.translate(0,playerSpeed-1);

		    if(input[LEFT] && !input[RIGHT])
		    	player.setAnimFrame(0);
		    else if(input[RIGHT] && !input[LEFT])
		    	player.setAnimFrame(2);
		    else
		    	player.setAnimFrame(1);

		    if ((input[SPACE] || input[MOUSECLICK]) && laserTimer < 0){
			    fireLaser(player.left()+10, player.pos.y);
			    fireLaser(player.right()-8, player.pos.y);
			    laserTimer = laserCooldown;
			} 
			if (input[SPACE]) laserTimer--;
			else laserTimer-=3;

			
			kin=function(flg){
				var l;
				if(flg=='x'){
					l=Math.abs(player.pos.x-mousepos.x);
				}else{
					l=Math.abs(player.pos.y-mousepos.y);
				}
				if(l >playerSpeed){
					return playerSpeed;
				}
				if(l<=playerSpeed && l >= playerSpeed/2){
					return playerSpeed/2;
				}
				if(l<=playerSpeed/2){
					return l;
				}
			};
			if(undefined != mousepos && player.pos.x != mousepos.x){
				var speed=kin('x')||0;
				player.translate(player.pos.x>mousepos.x?-speed:speed,0);
			}
			if(undefined != mousepos && player.pos.y != mousepos.y){
				var speed=kin()||0;
				player.translate(0,player.pos.y>mousepos.y?-speed:speed);
			}
		}
		var mousepos;
		updatePlayerMouse=function(event){
			mousepos=am.getEventPosition(event);
		}
		fireLaser = function(x,y){
		    am.addToGroup('lasers', new iio.Rect(x,y,9,33),-1)
		        .createWithImage(Res[3])
		        .enableKinematics()
		        .setBound('top',-40)
		        .setVel(0,-16);
		}
		var laserCooldown = 20;
		var laserTimer = 0;

		am.setFramerate(60,function(){
			updatePlayer();
			   //create new meteors 2% of the time
	        if (iio.getRandomNum() < .02)
	          for (var i=0; i<meteorDensity; i++){
	              var x = iio.getRandomInt(30,am.canvas.width-30);
	              var y = iio.getRandomInt(-800,-50);
	              if (iio.getRandomNum() < smallToBig)
	                  createMeteor(true,x,y);
	              else createMeteor(false,x,y);
	          }
		});
		//Meteors
		 // (function(){
		      var meteorHealth = 5;
		 
		      var bigMeteorImg = new Image();
		      var smallMeteorImg = new Image();
		      bigMeteorImg.src = 'http://ftp_dml.hzsx15.badudns.cc/App/Tpl/Public/SpaceShooter/png/meteorBig.png';
		      smallMeteorImg.src = 'http://ftp_dml.hzsx15.badudns.cc/App/Tpl/Public/SpaceShooter/png/meteorSmall.png';
		 
		      createMeteor = function(small,x,y){    
		          var img = bigMeteorImg;
		          if (small) img = smallMeteorImg
		          var meteor = am.addToGroup('meteors'
		              ,new iio.Rect(x,y))
		                  .enableKinematics()
		                  .setBound('bottom', am.canvas.height+120)
		                  .createWithImage(img)
		                  .setVel(iio.getRandomInt(-2,2)
		                         ,iio.getRandomInt(10,14))
		                  .setTorque(iio.getRandomNum(-.1,.1));
		          //Set big meteor health property
		          if (!small) meteor.health = meteorHealth;
		      }
		 // })();
		 
		 
		  //Collision Callback
		  //make sure these groups are defined
		 
		  //load laser flash image
		  var laserFlashImg = new Image();
		  laserFlashImg.src = 'http://ftp_dml.hzsx15.badudns.cc/App/Tpl/Public/SpaceShooter/png/laserRedShot.png';
		 
		  //set collision callback
		  am.setCollisionCallback('lasers', 'meteors', function(laser, meteor){
		      //add the laser flash
		      am.addToGroup('laser flashes'
		          ,new iio.Rect((laser.pos.x+meteor.pos.x)/2
		                       ,(laser.pos.y+meteor.pos.y)/2),10)
		              .createWithImage(laserFlashImg)
		              .enableKinematics()
		              .setVel(meteor.vel.x, meteor.vel.y)
		              .shrink(.1);
		 
		      //remove the laser object
		      am.rmvFromGroup(laser, 'lasers');
		 
		      //check if the meteor has health
		      if (typeof(meteor.health) != 'undefined'){
		 
		          //if so, damage it
		          meteor.health--;
		 
		          //if health is below 0, create a bunch of 
		          //small meteors in its place
		          if (meteor.health == 0){
		              var numFragments = iio.getRandomInt(3,6);
		              for (var i=0; i<numFragments; i++)
		                  createMeteor(treu,meteor.pos.x+iio.getRandomInt(-20,20)
		                                   ,meteor.pos.y+iio.getRandomInt(-20,20));
		 
		              //remove the large meteor
		              am.rmvFromGroup(meteor, 'meteors');
		          }
		      //Otherwise, its a small meteor, so just remove it
		      } else am.rmvFromGroup(meteor, 'meteors');
		  });
		  
		  //set the number of meteors relative to the screen width
		  var meteorDensity = Math.round(am.canvas.width/150);
		  //set the ratio of small to big meteors
		  var smallToBig = .70;
		window.addEventListener('keydown',function(event){updateInput(event,true);});
		window.addEventListener('keyup',function(event){updateInput(event,false);});
		am.canvas.addEventListener('mousemove',function(event){updatePlayerMouse(event);});
		am.canvas.addEventListener('mousedown',function(event){event.preventDefault();updateInput(event,true);});
		am.canvas.addEventListener('mouseup',function(event){event.preventDefault();updateInput(event,false);});
	};
	resInterval=setInterval('if(checkRes()){clearInterval(resInterval);init();}',1000);
}