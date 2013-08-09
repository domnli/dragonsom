    tuixiangzi_edit=function(am){
        var currentStep={};//此次点击的CELL中心POS
        am.setBGColor('gray');
        var gridBG=new iio.Grid(0,0,leveldata.column,leveldata.row,50).setStrokeStyle('white');
        am.addObj(gridBG);
        am.canvas.addEventListener('click',selCellListener);

        function selCellListener(event){
            var coor=gridBG.getCellAt(am.getEventPosition(event));
            if('NO' != am.indexOfTag('layerObj')){
                am.canvas.groups.splice([am.indexOfTag('layerObj')],1);    
            }
            currentStep.coor=coor;
            currentStep.pos=gridBG.getCellCenter(coor);
            am.addToGroup('layerObj',new iio.Text('+',currentStep.pos.x,currentStep.pos.y+27).setFont('80px Arial').setTextAlign('center').setFillStyle('#a3da58'),1);
            layerObj.draw(am,coor.x,coor.y);
            am.draw().update();
            am.canvas.removeEventListener('click',selCellListener);
            am.canvas.addEventListener('click',selObjListener);
        }
        function selObjListener(event){
            var coor=layerObj.grid.getCellAt(am.getEventPosition(event));
            if(coor == false){
                return;    
            }
            var list=layerObj.coorObj;
            var map=tuixiangzi.convertRC(leveldata.map);
            for(var i in list){
                if(list[i].x == coor.x && list[i].y == coor.y){
                    switch(list[i].name){
                        case 'wall':
                            map[currentStep.coor.x][currentStep.coor.y]=1;
                            am.addObj(list[i].object.setPos(currentStep.pos));
                        break;
                        case 'box':
                            var boxes=leveldata.boxes;
                            if(map[currentStep.coor.x][currentStep.coor.y] == 1){
                                //判断此位置是否有墙
                                map[currentStep.coor.x][currentStep.coor.y]=2;
                            }
                            if(undefined == boxes)
                                boxes=new Array();
                            boxes[boxes.length]={x:currentStep.coor.x,y:currentStep.coor.y};
                            leveldata.boxes=boxes;
                            am.addObj(list[i].object.setPos(currentStep.pos));
                        break;
                        case 'red':
                            map[currentStep.coor.x][currentStep.coor.y]=3;
                            am.addObj(list[i].object.setPos(currentStep.pos));
                        break;
                        case 'person':
                            if('NO' != am.indexOfTag('person')){
                                am.canvas.groups.splice([am.indexOfTag('person')],1);    
                            }
                            if(map[currentStep.coor.x][currentStep.coor.y] == 1){
                                //判断此位置是否有墙
                                map[currentStep.coor.x][currentStep.coor.y]=2;
                            }
                            leveldata.person={x:currentStep.coor.x,y:currentStep.coor.y};
                            am.addToGroup('person',list[i].object.setPos(currentStep.pos));
                        break;

                    }
                    leveldata.map=tuixiangzi.convertRC(map);
                }
            }
            if('NO' != am.indexOfTag('layerObj')){
                am.canvas.groups.splice([am.indexOfTag('layerObj')],1);    
            }
            am.draw().update();
            am.canvas.removeEventListener('click',selObjListener);
            am.canvas.addEventListener('click',selCellListener);    
            
        }
        
    };
    layerObj={ 
        draw:function(am,coorX,coorY){
            this.args=arguments;
            this.loadRes();
            this.loadResIntvl=setInterval('layerObj.checkRes()',50);

        },
        init:function(){
            var am=this.args[0],coorX=this.args[1],coorY=this.args[2];
            var x=(coorX-1)*50,y=(coorY-1)*50,coorObj=[{x:1,y:0},{x:0,y:1},{x:2,y:1},{x:2,y:0}],column=3,row=2;
            if(coorX == 0){
                //第一列
                x=0;
                y=coorY*50;

                coorObj=[{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:0}];
            }
            if(coorX == leveldata.column-1){
                //最后一列
                x=(coorX-2)*50;
                y=coorY*50;

                coorObj=[{x:1,y:0},{x:1,y:1},{x:2,y:1},{x:0,y:0}];
            }
            if(coorY == 0){
                //第一行
                x=coorX*50;
                y=0;

                coorObj=[{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:0}];
            }
            if(coorY == leveldata.row-1){
                //最后一行
                x=coorX*50;
                y=(coorY-1)*50;

                coorObj=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:0}];
            }
            if(coorY == 0 && coorX == leveldata.column-1){
                //第一行最后一个方格
                x=(coorX-2)*50;
                coorObj=[{x:1,y:0},{x:1,y:1},{x:2,y:1},{x:0,y:0}];
            }
            if(coorX == 0 && coorY == leveldata.row-1){
                //第一列最后一个
                y=(coorY-1)*50;
                coorObj=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:0}];
            }
            if(coorX == leveldata.column-1 && coorY == leveldata.row-1){
                //最后一列最后一个
                x=(coorX-2)*50;
                y=(coorY-1)*50;
                coorObj=[{x:1,y:0},{x:1,y:1},{x:2,y:0},{x:0,y:0}];
            }
            if(coorX == leveldata.column-2 && coorY ==0){
                //第一行倒数第二个
                x=(coorX-1)*50;
                y=0;
                coorObj=[{x:2,y:0},{x:1,y:1},{x:2,y:1},{x:0,y:0}]
            }
            if(coorX == leveldata.column-2 && coorY ==leveldata.row-1){
                //最后一行倒数第二个
                x=(coorX-1)*50;
                y=(coorY-1)*50;
                coorObj=[{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:0,y:0}]
            }
            this.coorObj=coorObj;
            var grid=new iio.Grid(x,y,column,row,50).setStrokeStyle('black').setAlpha(0);
            this.grid=grid;
            am.addToGroup('layerObj',grid,1);
            var simrct0=this.wall(grid.getCellCenter(coorObj[0].x,coorObj[0].y));
                this.coorObj[0].name='wall';
                this.coorObj[0].flag=1;
                am.addToGroup('layerObj',simrct0,1);
                this.coorObj[0].object=simrct0.setImgSize(50,50).setAlpha(1);
            var simrct1=this.box(grid.getCellCenter(coorObj[1].x,coorObj[1].y));
                this.coorObj[1].name='box';
                am.addToGroup('layerObj',simrct1,1);
                this.coorObj[1].object=simrct1.setImgSize(50,50).setAlpha(1);
            var simrct2=this.person(grid.getCellCenter(coorObj[2].x,coorObj[2].y));
                this.coorObj[2].name='person';
                am.addToGroup('layerObj',simrct2,1);
                this.coorObj[2].object=simrct2.setImgSize(50,50).setAlpha(1);
            var simrct3=this.red(grid.getCellCenter(coorObj[3].x,coorObj[3].y));
                this.coorObj[3].name='red';
                am.addToGroup('layerObj',simrct3,1);
                this.coorObj[3].object= new iio.SimpleRect(grid.getCellCenter(coorObj[3].x,coorObj[3].y),50).setFillStyle('red').setAlpha(1);

        },
        wall:function(vec){
            return new iio.SimpleRect(vec,50).createWithImage(this.res[0]).setAlpha(.5).setImgSize(30,30);
        },
        person:function(vec){
            return new iio.SimpleRect(vec,50).createWithImage(this.res[2]).setAlpha(.5).setImgSize(30,30);
        },
        box:function(vec){
            return new iio.SimpleRect(vec,50).createWithImage(this.res[1]).setAlpha(.5).setImgSize(30,30);
        },
        red:function(vec){
            //红色目标区域
            return new iio.SimpleRect(vec,30).setFillStyle('red').setAlpha(.5);
        },
        res:[],
        checkRes:function(){
            for(var i in this.res){
                if(typeof this.res[i] != 'function' && undefined == this.res[i].loaded){
                    return false;
                }
            }
            clearInterval(this.loadResIntvl);
            this.init();
            return true;
        },
        loadRes:function(){
            var res=this.res=[];
            var srcs=['http://ftp_dml.hzsx15.badudns.cc/Public/images/wall.png',
                      'http://ftp_dml.hzsx15.badudns.cc/Public/images/box.png',
                      'http://ftp_dml.hzsx15.badudns.cc/Public/images/up.png'
                     ];
            for(var i in srcs){
                if('function' == typeof srcs[i])
                    continue;
                res[i]=new Image();
                res[i].src=srcs[i];
                res[i].onload=function(){
                    this.loaded=true;
                }
            }

        }
    };